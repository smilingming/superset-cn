#!/usr/bin/env python3
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements. See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership. The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License. You may obtain a copy of the License at
# http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied. See the License for the
# specific language governing permissions and limitations
# under the License.
"""Verify the delivered SB source snapshot without installing dependencies."""

import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    manifest = json.loads((root / "docs/SOURCE_MANIFEST.json").read_text(encoding="utf-8"))
    index = {}
    for row in subprocess.check_output(["git", "-C", str(root), "ls-files", "--stage", "-z"]).split(b"\0"):
        if row:
            meta, path = row.split(b"\t", 1)
            index[path.decode("utf-8")] = meta.split()[0].decode()
    failures = []
    for item in manifest:
        relative = Path(item["dest"])
        if relative.is_absolute() or ".." in relative.parts:
            failures.append({"path": item["dest"], "reason": "unsafe manifest path"})
            continue
        path = root / relative
        try:
            link = path.is_symlink()
            if link:
                target = os.readlink(path)
                # Git for Windows materializes POSIX target separators as backslashes.
                # Canonicalize only this OS representation; Git blob checks stay exact.
                if os.name == "nt":
                    target = target.replace("\\", "/")
                data = target.encode("utf-8")
            else:
                data = path.read_bytes()
            valid = (
                hashlib.sha256(data).hexdigest() == item["sha256"]
                and len(data) == item["size"]
                and link == (item["type"] == "symlink")
                and index.get(item["dest"]) == item["mode"]
            )
            if not valid:
                failures.append({"path": item["dest"], "reason": "hash, size, type or Git mode differs"})
            if link and not path.resolve().is_relative_to(root):
                failures.append({"path": item["dest"], "reason": "link escapes repository"})
        except OSError as exc:
            failures.append({"path": item["dest"], "reason": type(exc).__name__})
    gitlinks = [path for path, mode in index.items() if mode == "160000"]
    if gitlinks:
        failures.append({"reason": "unresolved gitlinks", "paths": gitlinks})
    for required in ["superset/__init__.py", "superset-core/pyproject.toml", "superset-frontend/package.json", "superset-frontend/package-lock.json", "pyproject.toml", "requirements/base.txt", "LICENSE.txt", "NOTICE"]:
        if required not in index:
            failures.append({"path": required, "reason": "missing essential tracked file"})
    print(json.dumps({"result": "PASS" if not failures else "FAIL", "source_entries": len(manifest), "gitlinks": len(gitlinks), "failures": failures}, ensure_ascii=True))
    return int(bool(failures))


if __name__ == "__main__":
    sys.exit(main())

# Superset CN Source Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Import a source-complete, Chinese-customized Superset snapshot from SB into the private smilingming/superset-cn repository, then independently verify a fresh clone.

**Architecture:** Treat the core working tree, including local modifications, as the primary source. Stage an immutable copy outside the active deployment, place the core as regular files in the destination repository root, and add independent customization in customization/overlay. Publish only after a content manifest and fresh-clone comparison pass.

**Tech Stack:** Git, SSH/SFTP, GitHub, rsync or equivalent safe copy, SHA256, Apache Superset Python/React sources.

**Spec:** docs/superpowers/specs/2026-11-17-superset-cn-source-handoff-design.md

## Global Constraints
- SB source: /srv/Business Analytics/download/superset_platform/core/superset
- SB customization: /srv/Business Analytics/download/superset_platform/overlay
- GitHub destination: private smilingming/superset-cn
- Core observed HEAD: 21999bb772732d6cabee229b9c3fdb5baf45d1bc; reverify at execution.
- Outer observed HEAD: 3ae0945f3d2a418fdbe80bef51316ca0222e731c; reverify at execution.
- Deliver source only. No Docker image, Linux installer, database export, or production deployment.
- No writes to the original SB source/runtime. No force push, no credential disclosure, no permission escalation.

## Review Focus
1. Source path contains spaces: copy and hash logic must preserve exact filenames and links.
2. Embedded Git index mode 160000: a fresh clone must not have a missing core subtree.
3. Uncommitted tracked/untracked Chinese changes: they must not disappear during Git export.
4. Binary PNG/GIF/MO and symlinks: size and SHA256 must match staged sources.
5. Credential-bearing runtime/.env and backups: they must not be accidentally included in the source-only commit; report any proposed inclusion to Owner.

---

### Task 1: Snapshot inventory and provenance
**Files:** Create docs/SOURCE_PROVENANCE.md, docs/SOURCE_MANIFEST_SHA256.txt in isolated staging.
**Interfaces:** Consumes SB source and overlay paths; produces immutable staging paths, exact inclusion/exclusion set, and hash manifest.
- [ ] Step 1: Verify device identity, effective read/write permissions for staging only, current Git HEAD/status, source directory and Git submodules without mutating origin.
- [ ] Step 2: Inventory tracked/untracked core changes and overlay files; record source SHA, modified file counts and observed time.
- [ ] Step 3: Generate a sorted, NUL-safe SHA256 inventory for the selected source scope; compare expected essentials (pyproject.toml, superset/, superset-frontend/, tests/, LICENSE.txt, NOTICE, overlay PO/MO/JSON).
- [ ] Step 4: Review omitted paths and fail if any material source would be excluded.

### Task 2: Stage a complete source-only tree
**Files:** Destination repository root for core; create customization/overlay/** and docs/README_CN_HANDOFF.md; preserve docs from this plan.
**Interfaces:** Consumes Task 1 manifest; produces clean staging repo tree without a nested core .git.
- [ ] Step 1: Clone the private destination repository into a new isolated temporary directory; do not copy or modify the active SB repo .git.
- [ ] Step 2: Copy the complete material core working tree into the repository root, preserving modified files, metadata-relevant symlinks and binaries while excluding nested .git, node_modules, caches, logs and backups.
- [ ] Step 3: Copy the full approved overlay to customization/overlay; document how Chinese resources are applied at build time. Include existing Chinese customizations already present in the core checkout.
- [ ] Step 4: Ensure no embedded mode 160000 gitlink remains for core. Resolve or explicitly document CI-only action submodules without claiming a complete CI clone.
- [ ] Step 5: Compare the staged file hashes with Task 1; any material mismatch is FAIL and stops publication.

### Task 3: Static source validation
**Files:** Create docs/SOURCE_ACCEPTANCE.md; retain supporting evidence outside the public repository if it includes private details.
**Interfaces:** Consumes staged tree; produces PASS/FAIL for clone completeness and Chinese source consistency.
- [ ] Step 1: Verify Python source, frontend source, lockfiles, tests and license/notice paths exist; check no unexpected symlink targets.
- [ ] Step 2: Validate PO and JSON translation mapping, report exact translated/empty/fuzzy counts, and confirm compiled MO presence without overstating runtime correctness.
- [ ] Step 3: Compare source patches such as superset-frontend/src/pages/Login/index.tsx against current SB source, not just upstream HEAD.
- [ ] Step 4: Confirm no runtime/.env, database dumps, source .git directories, logs or package caches leaked into Git index.
- [ ] Step 5: Write a truthful acceptance report separating static source validation from unexecuted build/deployment tests.

### Task 4: Publish and independently read back
**Files:** Commit staged source and docs/SOURCE_ACCEPTANCE.md to smilingming/superset-cn.
**Interfaces:** Consumes Task 3 PASS; produces exact GitHub commit SHA and private repository URL.
- [ ] Step 1: Commit only the verified staging tree; preserve the repository's existing README and plans as appropriate.
- [ ] Step 2: Publish through a branch/PR if protection requires it; only put complete verified source on main through an allowed, reviewed flow. Never force push or bypass checks.
- [ ] Step 3: Independently clone the published full commit into a second empty directory.
- [ ] Step 4: Compare manifest checksums, repository structure, Chinese files, and Git tracked modes against the staging tree.
- [ ] Step 5: Read GitHub repository metadata and exact full HEAD SHA; return ACCEPT only if private repo, clone coverage, hashes and static source validations pass. Otherwise return PARTIAL with blockers.

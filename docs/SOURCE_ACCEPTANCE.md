# Source handoff acceptance

This report covers static source preservation, not compilation, deployment or functional runtime acceptance.

## Pre-publication observations, 2026-11-17

- SB HEADs were freshly read: core `21999bb772732d6cabee229b9c3fdb5baf45d1bc` (detached, dirty); platform `3ae0945f3d2a418fdbe80bef51316ca0222e731c` (`master`, dirty).
- 10,017 source entries: 10,007 core + 10 overlay; 10,013 regular files and 4 symbolic links; 278,496,011 source bytes. Static screening detected 812 binary entries.
- All 9,934 tracked non-gitlink core entries are present. All 44 tracked modifications and 73 untracked source files (65 enhanced-matrix, 8 advanced-pivot) are preserved.
- Source-to-staging comparison passed for all entries after repairing four Windows-extraction symlink type mismatches. The verification command checks every source entry SHA256, size, symlink type and Git executable mode. Zero core or CI gitlinks are stored in the new index.
- Representative Login/index.tsx, home/Menu.tsx, home/RightMenu.tsx, chart controls, MainPreset.ts, plugin images, all Chinese translation files, Python/React sources, tests and lockfiles are included in the complete comparison. No sample-only hash claim is used.
- Frontend root dependency/devDependency/engine declarations match package-lock.json; both custom plugin workspace entries are present in the lock. Dependency download and build were not attempted.
- PO: 4,926 entries; 4,925 nonempty; 1 empty (`Powered by Apache Superset`); 0 fuzzy; 0 obsolete; 39 plural entries. JSON: 4,926 entries, no extra keys or mismatches. MO: 4,925 effective entries, zero value mismatches including plurals. Exact SHA256 and 14 Babel format warnings are in SOURCE_TRANSLATIONS.json.
- Pattern screening found no unexpected GitHub/OpenAI/AWS tokens or operational private keys. Hits were unchanged upstream test key fixtures, translated generic connection-string examples, and the original overlay development example database URI. Runtime/.env, runtime configuration, actual business databases, logs, backups, node_modules and nested .git were not imported. This screening is not a comprehensive secret-detection guarantee.
- Before/after SB inventories were identical: source file hash/type/mode lists, core and platform Git metadata/status, selected runtime configuration hashes, and Superset container IDs/status. Commands used against original source/runtime were read-only (Git optional locks disabled). No installation, cleanup, restart, database access/write, or deployment was performed. The pre-existing worker unhealthy state remained unchanged; no runtime repair is claimed.

## Deliberate mappings and remaining gaps

- Original upstream README retained as docs/README_UPSTREAM.md; target's initial README retained as docs/README_REPOSITORY_INITIAL.md; original design and implementation plan preserved.
- 45 upstream workflow files retain exact source bytes under customization/upstream-github-workflows so importing source does not initiate upstream CI/release jobs.
- Eight CI-only external action gitlinks were empty on SB. Their pins are retained in SOURCE_EXCLUSIONS.json, URLs in upstream .gitmodules. The application source is complete; upstream CI dependencies are not complete and are not auto-initialized by cloning this repository.
- Existing translation warnings, development version metadata, bare-metal configuration adaptation, dependency availability, full tests, pre-commit, build, browser flows and Linux deployment remain unverified. No installation was allowed in this task.

## Post-publication verification

The final delivery receipt records the actual main commit SHA, a new empty-directory clone, clean Git status, full source/index hash comparison and fresh Private metadata readback. This committed pre-publication report deliberately does not predeclare those future events. Reproduce source verification after cloning with `python3 tools/verify_source_handoff.py`; on Windows use Git checkout with symlink support and `core.autocrlf=false`, `core.eol=lf`.

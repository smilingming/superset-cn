# Source provenance

- Observation UTC: 2026-11-17T04:09:25.384549+00:00
- Source device SSH alias: SB; observed hostname CloudBrainM1; account ubuntu.
- Platform root: `/srv/Business Analytics/download/superset_platform`
- Platform HEAD: `3ae0945f3d2a418fdbe80bef51316ca0222e731c`; branch `master`; dirty (see SOURCE_WORKTREE_STATUS.txt).
- Core HEAD: `21999bb772732d6cabee229b9c3fdb5baf45d1bc`; detached HEAD; 44 modified tracked files, 73 untracked source files.
- Target base: `cdbd03e21894b22bc3157c10b498ef1d88a1454a`; target `smilingming/superset-cn` only.
- Core: 10,007 entries = 9,934 existing tracked non-gitlink files + 73 untracked plugin files.
- Overlay: 10 files. Total: 10,017 entries (10,013 regular files, 4 symbolic links), 278,496,011 bytes.
- Source package metadata reports `0.0.0-dev`; this is a pinned development snapshot, not a claim that it is the MING 6.1.0 vendor tree.
- Original LICENSE.txt and NOTICE are preserved, along with upstream tests, examples, requirements, locks, `superset-core`, frontend workspaces, plugins and images.

## Mapping and preservation

Core files map to repository root; overlay files map to `customization/overlay/`. Two deliberate mappings preserve bytes: source README.md becomes docs/README_UPSTREAM.md; all 45 upstream `.github/workflows/*` become `customization/upstream-github-workflows/*` to prevent automatic builds, installations or releases in this source-only handoff. Initial target README and existing design/plan remain available. SOURCE_MANIFEST.json records every original path, destination, SHA256, type and executable mode. JSON escaping makes paths unambiguous; SHA256.txt is a convenience list, with link entries hashing link-target bytes rather than dereferenced file contents.

The source was enumerated from the physical working tree, reconciled against all Git index entries, independently hashed before streaming a tar archive over SSH, and compared after extraction. This was not `git archive HEAD`. Windows tar initially dereferenced four instruction-file symlinks; the comparison caught exactly these four mismatches; they were restored to original link targets in isolated staging and reverified before publication.

## Exclusions and missing external CI

Only `.git`, node_modules and Python bytecode cache directories were found and excluded inside selected roots; none contained Git-tracked application source. Outer runtime, logs, backups and releases were never copied. The upstream tracked docker/.env is a development fixture, not the SB runtime/.env. An overlay example-database URI contains a literal development default; it is retained as source configuration, must be replaced for a recipient environment, and is not printed in this report.

Eight upstream `.github/actions/*` gitlinks were unpopulated on SB. Their exact paths and pinned SHAs are in SOURCE_EXCLUSIONS.json; original upstream .gitmodules retains their URLs. No nested git repository or gitlink is introduced in the handoff. CI workflows are reference-only, and this is not a complete upstream CI checkout. Do not run `git submodule update` expecting those archived references to initialize automatically; obtain/review the recorded external action revisions separately if re-enabling CI.

## Verification boundary

No dependency installation, build, pre-commit auto-fix, test database, service restart, deployment or database mutation was performed. User source-only/no-install instructions take precedence over generic upstream development instructions. Secret-pattern review is bounded static screening, not a guarantee that every possible credential encoding is recognized.

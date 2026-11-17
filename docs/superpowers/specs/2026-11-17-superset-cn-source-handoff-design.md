# Superset CN source handoff — design (2026-11-17)

## Intent
Hand off the complete Chinese-customized Apache Superset source from SB to a coworker using a private GitHub repository. The coworker deploys on Linux bare metal; this task does not create an installer, build Docker images, migrate databases, or deploy the service.

## Approved destination
- Private repository: https://github.com/smilingming/superset-cn
- Account: smilingming; main is the eventual user-facing complete source branch.
- Current state at design time: private repository initialized; source import pending.

## Observed SB source roots (must be freshly revalidated)
- Core working tree: /srv/Business Analytics/download/superset_platform/core/superset
- Localization and other customization: /srv/Business Analytics/download/superset_platform/overlay
- Platform metadata and scripts (reference only): /srv/Business Analytics/download/superset_platform
- Recorded core HEAD: 21999bb772732d6cabee229b9c3fdb5baf45d1bc
- Recorded platform HEAD: 3ae0945f3d2a418fdbe80bef51316ca0222e731c
- The core working tree has at least one locally customized file differing from the upstream commit. Never export only HEAD.
- The outer platform Git index records core/superset as mode 160000 without an outer .gitmodules mapping; exporting only the outer Git repository is incomplete.

## Chosen approach
Import a faithful snapshot of the full current core source working tree into the root of the private repository and preserve every required customization under customization/overlay. The core must be regular tracked files, not an unresolved gitlink. Capture source provenance, file hashes, and known gaps. Keep the original SB tree unmodified and do all staging in an isolated temporary working directory.

## Alternatives considered
- SFTP directory copy: rejected as the primary delivery channel because version tracking and collaboration are weaker.
- Docker/offline installer package: rejected because the recipient needs source only and the destination prohibits Docker.

## Scope and constraints
- Include Python backend, React frontend, tests, requirements and lockfiles, translation PO/MO/JSON, custom UI changes, assets, LICENSE/NOTICE, and a Chinese handoff README.
- Preserve source customizations actually present on SB, including modified-but-uncommitted files, and independently verify against the source snapshot.
- Do not include node_modules, cache, logs, runtime backups, DB dumps, executable secrets/keys, or Docker images merely for convenience. Owner permits credential transfer if needed, but it is not a source-code requirement; disclose any secret inclusion before publishing.
- Do not mutate SB runtime, services, permissions, live database, or original source. Do not force-push or bypass a protected branch.
- CI-only GitHub Actions submodules must be either source-complete or explicitly labeled as external CI dependencies; absence must never be represented as a complete clone.
- Any unexpected mismatch, denied permission, or missing material source causes PARTIAL/STOP with details, not an invented PASS.

## Acceptance
1. GitHub confirms repository visibility is private.
2. An independent fresh clone contains all material backend/frontend sources, localization files, image assets and source build inputs.
3. The new repository contains zero unresolved embedded core gitlinks; required external submodules are documented and handled honestly.
4. Hash manifest and targeted code diffs prove that all chosen SB source and Chinese customizations survived import.
5. Chinese PO and JSON map consistently; exact reported counts, placeholders and compiled MO status are backed by new observations.
6. New clone is clean and the exact remote full commit SHA is recorded; code-build or Linux deployment passes only if explicitly executed and evidenced.
7. End state is one private repository URL and explicit ACCEPT/PARTIAL decision. No downstream server changes.

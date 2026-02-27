# Release Policy — NullByte Academy Advanced Defensive Systems Engineering Program

**Document Classification:** Release and Versioning Policy
**Version:** 1.0
**Maintained By:** NullByte Academy Maintainer Council

---

## Overview

This document defines the versioning scheme, release cycle, stability classification system, and release process for NullByte Academy. All maintainers and contributors must operate within the policies defined here. Deviation requires a formal proposal through the GOVERNANCE.md amendment process.

---

## 1. Versioning Scheme

NullByte Academy uses **calendar-based versioning** in the format `YYYY.MM.PATCH`.

```
YYYY  — Four-digit year of the release
MM    — Two-digit month of the release (zero-padded)
PATCH — Zero-indexed integer, incremented for patch releases within a month
```

**Examples:**

| Version String | Interpretation |
|---------------|---------------|
| `2026.02.0` | First release of February 2026 |
| `2026.02.1` | First patch to the February 2026 release |
| `2026.03.0` | First release of March 2026 |
| `2026.06.0` | First release of June 2026 |

### Version File

The canonical version of the project is stored in the `VERSION` file at the repository root. The `VERSION` file contains exactly one line: the version string, with no leading or trailing whitespace.

```
2026.02.1
```

The `VERSION` file is the authoritative source of record. Version strings appearing in `CHANGELOG.md`, `package.json`, or other files must match the `VERSION` file at the time of release. CI enforces `VERSION` file format validity on every push.

### Rationale for Calendar Versioning

Semantic versioning (MAJOR.MINOR.PATCH) is designed for software libraries where API compatibility is the primary concern. NullByte Academy is an educational program, not a library. The primary versioning concern is temporal: when was this material current, and what changed since the last release. Calendar versioning answers both questions directly.

---

## 2. Release Cycle

### Scheduled Releases

The program operates on a **quarterly major release cycle** with monthly patch releases as needed.

| Release Type | Cadence | Content |
|-------------|---------|---------|
| Major release | Quarterly | New modules, new labs, significant platform additions, documentation overhauls |
| Patch release | As needed (monthly maximum) | Factual corrections, broken link fixes, toolchain updates, security advisories |

### Release Freeze

A **content freeze** is declared 14 days before a planned major release. During freeze:

- No new content is merged to `main`
- Only Critical and High severity bug fixes are accepted
- Maintainers conduct final review, testing, and CHANGELOG.md preparation
- The `VERSION` file is updated on the day of release

### Hotfix Releases

A hotfix release may be issued outside the scheduled cycle when:

- A Critical severity content error is confirmed (factually dangerous or significantly misleading content)
- A security vulnerability is identified in the platform
- A lab environment dependency is broken by an upstream change that blocks student progress

Hotfixes increment the PATCH component of the current version. They do not trigger a full release cycle.

---

## 3. Stability Tiers

Every version of NullByte Academy is classified under one of three stability tiers. The current stability tier of each branch is documented in `CHANGELOG.md` and in the repository's GitHub release notes.

### Tier Definitions

**Stable**

A Stable release has passed all quality gates defined in ROADMAP.md, all CI checks, and a full technical accuracy review. It is appropriate for:

- Student use in self-directed learning
- Instructor-led course delivery
- Institutional deployment
- Citation in publications

The `main` branch always reflects the current Stable release or a state actively progressing toward one.

**Beta**

A Beta release is feature-complete for its planned scope but has not completed full technical accuracy review. It is appropriate for:

- Instructor preview and feedback collection
- Community technical review prior to Stable promotion
- Integration testing by institutional partners

Beta releases are not appropriate for student-facing deployment without explicit instructor oversight.

**Development**

A Development state is the active working state of the `develop` branch. It may be incomplete, contain known errors under active correction, and is not appropriate for any deployment context. Development state is not issued as a tagged release; it is a continuous state of the `develop` branch between Beta and Stable promotions.

### Stability Tier Transitions

```
Development (develop branch)
        |
        | -- Feature complete, internal review passed
        v
Beta (tagged release, e.g., 2026.06.0-beta.1)
        |
        | -- Technical accuracy review passed, all quality gates met
        v
Stable (tagged release, e.g., 2026.06.0)
        |
        | -- Critical bug discovered post-release
        v
Hotfix (patch release, e.g., 2026.06.1)
```

---

## 4. Quality Gates

A release may not be promoted from Beta to Stable unless all of the following gates are passed:

| Gate | Requirement |
|------|------------|
| CI Green | All CI workflows pass on the release commit: `ci.yml`, `markdown-lint.yml`, `link-check.yml` |
| Structure Validation | All required root files present, `VERSION` file format valid |
| Technical Review | All module content reviewed by at least one qualified technical reviewer who is not the original author |
| Ethics Audit | All lab binaries and exercises audited by at least one reviewer against `03_ETHICS.md` standards |
| Lab Testing | All lab environments tested on a clean Ubuntu 22.04 LTS VM from the provided setup instructions |
| CHANGELOG Current | `CHANGELOG.md` accurately reflects all changes included in the release |
| Zero Blockers | No open issues labeled `Critical` or `High` severity against content in the release |

---

## 5. Release Process

The following steps are executed by the release maintainer for each major release.

**Step 1: Pre-Release Checklist (T-14 days)**

- Confirm feature set is complete; notify team of content freeze
- Ensure all open `fix` PRs targeting the release are merged or deferred
- Assign technical reviewers to any unreviewed module content
- Schedule ethics audit

**Step 2: Review Period (T-14 to T-3 days)**

- Technical reviewers complete review and file issues for any corrections required
- Corrections are made and merged under the content freeze exception process
- Lab environments tested on clean VMs
- CI green confirmed

**Step 3: Release Preparation (T-3 to T-1 days)**

- Update `VERSION` file to the new version string
- Complete `CHANGELOG.md`: move `[Unreleased]` items to the new version entry with the release date
- Update version string in any other files that reference it (`package.json`, documentation headers)
- Create a signed annotated tag on `main`: `git tag -s 2026.06.0 -m "NullByte Academy 2026.06.0 — Stable"`

**Step 4: Release Publication (T)**

- Push the tag to GitHub
- Create a GitHub Release from the tag with the `CHANGELOG.md` entry for this version as the release notes
- Update the release classification in the repository README badge
- Post release announcement to GitHub Discussions

**Step 5: Post-Release (T+3 days)**

- Monitor for hotfix-triggering issues in the new release
- Open the `[Unreleased]` section in `CHANGELOG.md` for the next release cycle
- Reset `develop` branch from `main` to begin the next development cycle

---

## 6. Deprecation Policy

Content or features that are scheduled for removal are marked `Deprecated` in `CHANGELOG.md` at least one major release cycle before removal. Deprecated items carry a notice in the affected document:

```
> DEPRECATED: This section is deprecated as of [version] and will be removed in [version].
> See [replacement] for the current content.
```

Deprecation notices are not added to lab exercises or module content without a replacement being available in the same release.

---

*Document version: 1.0 | NullByte Academy | 2026*

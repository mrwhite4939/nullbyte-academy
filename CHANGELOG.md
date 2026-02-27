# Changelog — NullByte Academy

All significant changes to NullByte Academy are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) conventions. Versioning follows the `YYYY.MM.PATCH` calendar scheme. Dates are recorded in `YYYY-MM-DD` ISO 8601 format.

**Change types used in this log:**

| Tag | Meaning |
|-----|---------|
| `Added` | New content, files, modules, or features |
| `Changed` | Modifications to existing content or structure |
| `Fixed` | Corrections to factual errors, formatting problems, or broken references |
| `Deprecated` | Content marked for removal in a future release |
| `Removed` | Content deleted from the project |
| `Security` | Changes related to the platform's own security posture |

---

## [Unreleased]

> Changes staged for the next release but not yet versioned.

### Added
- `CONTRIBUTING.md` — Full contributor workflow, content standards, and PR process documentation
- `FAQ.md` — Structured FAQ covering General, Modules, Labs, Technical Issues, Ethics, and Community categories
- `CHANGELOG.md` — This file; establishes versioning and change tracking for the project
- `ACKNOWLEDGEMENTS.md` — Attribution for tools, libraries, references, and inspirations used across the curriculum

### Changed
- Project documentation structure expanded from core files to include the full docs suite: FAQ, CONTRIBUTING, CHANGELOG, ACKNOWLEDGEMENTS

---

## [2026.02.2] — 2026-02-27

### Fixed
- Module filenames `8_ADVANCED_LABS_OVERVIEW.md` and `9_CASE_STUDIES_DEFENSIVE.md` renamed to zero-padded `08_` and `09_` for consistent sort ordering
- All placeholder emails (`labs@nullbyte.academy`, `research@nullbyte.academy`, `curriculum@nullbyte.academy`, `ethics@nullbyte.academy`) replaced with official contact `mrwhite4939@gmail.com`
- `Course_Visuals.md` renamed to `COURSE_VISUALS.md` to match uppercase documentation naming convention
- Duplicate Logo files (`06_defense_in_depth.svg`, `10_nullbyte_academy_banner.svg`) removed — canonical named files retained
- README.md folder tree updated to reflect actual project structure (removed stale `/docs/` and `/workbooks/` references; added all real directories and root documents)
- Root `.gitignore` created (was referenced in README but missing from project)
- All internal cross-references to renamed files updated

### Changed
- `VERSION` bumped from `2026.02.1` to `2026.02.2`

---

## [2026.02.1] — 2026-02-27

### Added
- Complete ZIP distribution package: `NullByte-Academy.zip`
  - `README.md` — Ultra-professional project overview with skill roadmap, module descriptions, frontend instructions, and branding guide
  - `LICENSE` — MIT License with NullByte Academy copyright and ethical contribution guidelines
  - `SECURITY.md` — Responsible disclosure policy with timeline table, scope definition, and conduct standards
  - `.gitignore` — Comprehensive rules for Node.js/React/Termux/Python development and compiled artifact exclusion
- `presentations/Module01_Intro.pptx` — 5-slide deck: CPU architecture, register model, privilege rings, calling conventions, LAB-CPU-01 guide
- `presentations/Module02_StackFrames.pptx` — 5-slide deck: virtual address space, stack frame anatomy, heap chunk structure, LAB-MEM-01/02 guide
- `presentations/Module03_Assembly.pptx` — 5-slide deck: instruction format, data movement, control flow, stack operations, disassembly annotation exercise
- `presentations/Module04_ReverseEngineering.pptx` — 5-slide deck: static analysis workflow, dynamic analysis workflow, Ghidra deep dive, LAB-RE-01/02 guide
- `presentations/Module05_AdvancedLabs.pptx` — 5-slide deck: vulnerability taxonomy, CVE analysis framework, mitigation verification, LAB-VUL-01 + LAB-RES-01 capstone
- `assets/Logo/nullbyte_banner.svg` — Primary branding banner with NullByte Academy identity
- `assets/Logo/nullbyte_logo.svg` — Hexagonal logomark with NB monogram
- `assets/Logo/stack_frame_diagram.svg` — Annotated stack frame layout (RSP, RBP, canary, return address, locals)
- `assets/Logo/memory_layout_diagram.svg` — Virtual address space segment map (kernel, stack, heap, BSS, data, text)
- `assets/Logo/cpu_registers_diagram.svg` — x86-64 register reference table (64/32/16/8-bit widths, primary roles)
- `assets/Logo/mitigations_diagram.svg` — Six mitigation overview cards (ASLR, DEP/NX, stack canary, CFI, RELRO, shadow stack)
- `assets/Logo/re_workflow_diagram.svg` — RE methodology flowchart (static → dynamic → report convergence)
- `assets/Logo/vuln_taxonomy_diagram.svg` — CWE-classified vulnerability tree (stack, heap, integer classes)

### Changed
- Branding identity formalized: color palette `#0D0D0D / #00FF41 / #FFA500 / #00BFFF`, typography `JetBrains Mono / Inter`

---

## [2026.02.0] — 2026-02-20

> Initial structured release of the NullByte Academy documentation framework.

### Added
- `docs/01_ACADEMY_MASTER_BLUEPRINT.md` — Vision, mission, philosophy, module architecture, lab mapping, workbook mapping, PDF mapping, branding overview, and 5-phase development roadmap
- `docs/02_README.md` — Project overview, learning objectives, ethical statement, and project structure
- `docs/03_ETHICS.md` — Responsible research philosophy, defensive-first mindset, legal boundaries, academic integrity rules, and safe research conduct
- `docs/04_STYLE_GUIDE.md` — Tone guidelines, formatting rules, Markdown structure standards, code block styling, and naming conventions
- `docs/05_GLOSSARY.md` — Structured technical terminology organized by category: CPU, Memory, Mitigations, Reverse Engineering, Research
- `docs/06_CURRICULUM_MAP.md` — Module-to-lab mapping table, module-to-workbook mapping table, skill progression ladder, and final project integration structure
- Module architecture defined: M01 through M07 with titles, descriptions, and learning objectives
- Lab series defined: LAB-CPU-01, LAB-MEM-01/02, LAB-MIT-01, LAB-RE-01/02, LAB-VUL-01, LAB-SEC-01, LAB-RES-01
- XLSX workbook registry: 7 workbooks mapped to corresponding modules
- PDF introduction registry: 7 introductory documents mapped to corresponding modules

### Changed
- Project renamed from working title to official name: **NullByte Academy**
- Tagline finalized: *"Understand the machine. Defend what matters."*

---

## [2026.01.0] — 2026-01-15

> Project initialization. Repository structure and foundational planning documents.

### Added
- Repository initialized with blank `README.md`
- Initial project scope document (internal, not published)
- Preliminary curriculum outline covering low-level security domains
- Ethical framework draft: defensive-first, permissioned-targets-only policy established
- Development phase planning: 5 phases across 12-month timeline

---

## Roadmap: Upcoming Releases

The following items are planned for future releases. They are not commitments and may be re-prioritized or deferred based on contributor capacity.

### [2026.03.0] — Target: March 2026

**Module Content**
- `docs/intro_cpu_architecture.pdf` — Printable PDF introduction for M01
- `docs/intro_memory_management.pdf` — Printable PDF introduction for M02
- `docs/intro_mitigations.pdf` — Printable PDF introduction for M03
- `docs/intro_reverse_engineering.pdf` — Printable PDF introduction for M04

**Workbooks**
- `workbooks/wb_cpu_reference.xlsx` — Register tables, instruction reference, calling convention comparison
- `workbooks/wb_memory_map.xlsx` — Address space layout templates, allocator behavior tables
- `workbooks/wb_mitigations_matrix.xlsx` — Mitigation coverage matrix by OS and compiler

**Lab Environments**
- LAB-CPU-01 VM template (Ubuntu 22.04, GDB + pwndbg, lab binaries)
- LAB-MEM-01/02 VM template (GDB, heap-instrumented lab binaries)

### [2026.04.0] — Target: April 2026

**Module Content**
- `docs/intro_vuln_classes.pdf` — PDF introduction for M05
- `docs/intro_secure_coding.pdf` — PDF introduction for M06

**Workbooks**
- `workbooks/wb_re_analysis_log.xlsx` — Structured binary analysis log template
- `workbooks/wb_vuln_taxonomy.xlsx` — Vulnerability classification with CWE cross-reference
- `workbooks/wb_audit_checklist.xlsx` — Code audit checklist by vulnerability class

**Lab Environments**
- LAB-RE-01/02 environment: Ghidra project files + purpose-built stripped binaries
- LAB-VUL-01 environment: Purpose-built vulnerable binaries for root cause exercises

### [2026.06.0] — Target: June 2026

**Module Content**
- `docs/intro_research_methods.pdf` — PDF introduction for M07
- Full M06 written module content
- Full M07 written module content

**Workbooks**
- `workbooks/wb_cve_tracker.xlsx` — CVE analysis template with CVSS, root cause, and mitigation fields

**Platform**
- React-based interactive frontend: module quizzes, stack diagram visualizer, progress tracker
- Lab workbench interface for guided practical exercises

### [2026.09.0] — Target: September 2026

**Content Review**
- Full technical accuracy audit of M01–M07
- Ethics audit of all lab materials
- Glossary expansion to 150+ terms
- Cross-reference verification: all module references, workbook citations, CVE links

**Community**
- GitHub Discussions open to the public
- First community contributor credits in `ACKNOWLEDGEMENTS.md`

---

*For questions about specific changelog entries or the roadmap, open a GitHub Discussion.*

*© 2026 NullByte Academy — MIT License*

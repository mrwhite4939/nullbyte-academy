# Roadmap — NullByte Academy Advanced Defensive Systems Engineering Program

**Document Classification:** Program Development Roadmap
**Version:** 1.0
**Status:** Active
**Maintained By:** NullByte Academy Curriculum Committee

---

## Overview

This document defines the development trajectory of NullByte Academy from initial public release through long-term research program expansion. Each version milestone represents a coherent, deployable state of the program — not merely a collection of file additions. Version boundaries are defined by capability thresholds, not calendar deadlines.

All items listed in future versions are planned intentions. They may be accelerated, deferred, or rescoped based on contributor capacity, community feedback, and alignment with the program's research direction.

---

## Version 1.0 — Core Program Release

**Target:** Q2 2026
**Status:** In progress
**Scope:** Complete foundation through applied defense curriculum with full documentation and governance layer

### Curriculum Deliverables

- M01 — CPU Architecture and Execution Internals: complete written module, slide deck, XLSX workbook, PDF introduction, and lab environment (LAB-CPU-01)
- M02 — Memory Layout and Management: complete written module, slide deck, XLSX workbook, PDF introduction, and lab environments (LAB-MEM-01, LAB-MEM-02)
- M03 — Exploit Mitigations and Modern Defenses: complete written module, slide deck, XLSX workbook, PDF introduction, and lab environment (LAB-MIT-01)
- M04 — Reverse Engineering Fundamentals: complete written module, slide deck, XLSX workbook, PDF introduction, and lab environments (LAB-RE-01, LAB-RE-02)
- M05 — Vulnerability Classes and Root Cause Analysis: complete written module, slide deck, XLSX workbook, PDF introduction, and lab environment (LAB-VUL-01)
- M06 — Secure Coding and Defensive Architecture: complete written module, slide deck, XLSX workbook, PDF introduction, and lab environment (LAB-SEC-01)
- M07 — Research Methods and CVE Analysis: complete written module, slide deck, XLSX workbook, PDF introduction, and lab environment (LAB-RES-01)

### Documentation Deliverables

- All seven PDF module introductions authored and formatted
- All seven XLSX workbooks completed and validated
- EVALUATION_FRAMEWORK.md finalized with scoring rubrics for all seven modules
- INSTRUCTOR_GUIDE.md finalized with module-by-module teaching notes
- GLOSSARY.md expanded to 150 terms minimum
- Full .github/ governance layer operational: CI, lint, link check, issue templates, PR template

### Infrastructure Deliverables

- VM template images for all nine lab environments
- React frontend: module quiz engine (M01–M07), stack frame visualizer, progress tracker
- CI pipeline green across all workflows on main branch

### Quality Gates for 1.0 Release

- All module content reviewed for technical accuracy by at least one subject-matter reviewer
- All lab environments tested on clean Ubuntu 22.04 LTS VM
- Ethics audit of all lab binaries and exercises completed
- CHANGELOG.md fully reflects all changes from project initialization
- Zero known Critical or High severity content errors in the issue tracker

---

## Version 1.5 — Research Track Introduction

**Target:** Q4 2026
**Status:** Planned
**Scope:** Introduction of formal research track, threat modeling module, and advanced lab series

### Curriculum Additions

**M08 — Threat Modeling and Defensive Architecture**

A dedicated module covering STRIDE, PASTA, and attack tree methodologies as applied to low-level systems. Content covers trust boundary identification, data flow diagram construction, and mitigation selection reasoning. This module bridges the applied defense of M06 and the research methodology of M07 with the systems design perspective required for senior defensive engineering roles.

**M09 — Advanced Binary Analysis**

Extends M04 with coverage of obfuscated code analysis, packed executable unpacking, and anti-analysis technique identification. Includes structured exercises using Ghidra scripting (Java and Python APIs) for automated analysis tasks. Prerequisite: M04 at Practitioner level.

**Research Track — Tier 1: Defensive Vulnerability Research**

The first tier of the formal research program. Students who have completed M01–M07 at Analyst level are eligible. Covers zero-day defensive research ethics, responsible disclosure process, structured research note-taking, and basic paper authorship under the supervision of a designated research mentor. Successful completion produces a Research Contributor designation and a publishable technical report.

### Advanced Labs

- LAB-BIN-01: Packed binary analysis and unpacking exercise (M09)
- LAB-BIN-02: Ghidra scripting for automated cross-reference extraction (M09)
- LAB-THREAT-01: Full STRIDE threat model for a provided system specification (M08)
- LAB-THREAT-02: Attack tree construction and mitigation selection exercise (M08)

### Platform Additions

- Student progress dashboard with per-module competency tracking
- Instructor analytics view: cohort progress, assessment results, time-on-lab reporting
- Structured research submission portal: paper upload, reviewer assignment, comment workflow

### Documentation Additions

- RESEARCH_TRACK.md: full research program governance (already created in v1.0 governance layer, content expanded for v1.5)
- Threat Modeling Workbook (wb_threat_model.xlsx)
- Research Note Template (research_note_template.md)
- Peer Review Rubric (peer_review_rubric.md)

---

## Version 2.0 — Advanced Research Program and Institutional Deployment

**Target:** Q2 2027
**Status:** Planned
**Scope:** Full research program, institutional licensing framework, curriculum API, and multi-track specialization

### Curriculum Additions

**M10 — Kernel and Hypervisor Security**

An advanced module covering Linux kernel attack surface (syscall interface, kernel modules, driver vulnerabilities), hypervisor security models (KVM, Xen, VMware), and hardware-level security features (SMEP, SMAP, IOMMU). Prerequisite: M01–M07 complete at Analyst level; M08 and M09 recommended.

**M11 — Embedded Systems and Firmware Security**

Coverage of ARM architecture security extensions (TrustZone, Pointer Authentication, Memory Tagging Extension), firmware extraction and analysis methodology, and JTAG/UART interface analysis for hardware-adjacent defensive research. Targeted at practitioners working in IoT, automotive, or industrial control system environments.

**M12 — Compiler and Language Security**

Analysis of how compiler transformations affect security properties: UB-driven miscompilation, sanitizer internals (ASan, MSan, UBSan), language-level safety mechanisms (Rust ownership model, C++ hardened mode), and the security implications of link-time optimization. Prerequisite: M01–M06 complete.

**Research Track — Tier 2: Independent Research Program**

Advanced research track for Research Contributors who have completed a Tier 1 paper. Tier 2 students conduct independent research with minimal supervision, submit to external venues (conference or journal), and serve as peer reviewers for incoming Tier 1 submissions. Completion produces a Senior Research Contributor designation.

### Specialization Tracks

Version 2.0 introduces three specialization tracks that students may pursue after completing M01–M07. Each track consists of two advanced modules and a track-specific capstone:

| Track | Modules | Capstone |
|-------|---------|----------|
| Systems Defense | M08, M09 | Threat model for a provided target system |
| Hardware Security | M11 | Firmware analysis report |
| Language and Compiler Security | M12 | Compiler security audit of a provided codebase |

### Institutional Deployment Framework

- Institutional license structure for universities and enterprise security teams
- Curriculum API: machine-readable module metadata for LMS integration (LTI 1.3)
- Instructor certification program: NullByte Academy Certified Instructor designation
- Cohort management tooling: student enrollment, progress tracking, assessment workflow
- White-label deployment option for institutional partners

### Governance Additions

- External Advisory Board: minimum three external reviewers from academia and industry
- Annual curriculum review cycle formalized in GOVERNANCE.md
- Conflict of interest policy for Research Track reviewers and institutional partners

---

## Long-Term Research Expansion (2027 and Beyond)

The following items represent the long-term research direction of the program beyond Version 2.0. They are indicative, not committed.

**NullByte Academy Research Journal**

A peer-reviewed publication venue for student and alumni research produced through the Research Track. Articles are reviewed by at least two independent reviewers from the Research Contributor community. The journal focuses on defensive security research: mitigation analysis, vulnerability class characterization, and defensive architecture case studies.

**Collaborative CVE Analysis Database**

A structured, community-maintained database of CVE analyses produced by Research Track students and alumni, formatted to the M07 analysis template standard. Each entry is reviewed for technical accuracy before publication. The database provides a queryable reference for root cause patterns, mitigation applicability, and fix strategy analysis.

**Hardware Security Lab Partnership Program**

A partnership framework allowing institutional adopters to contribute purpose-built lab binaries, VM images, and hardware testing environments for M11 and advanced research exercises. All contributed materials are reviewed under the same ethical and accuracy standards as curriculum content.

**International Curriculum Localization**

Translation and cultural adaptation of the core M01–M07 curriculum for non-English-speaking audiences, beginning with Spanish, Portuguese, and French. Translation is a community-driven effort governed by the contribution guidelines in CONTRIBUTING.md.

---

## Version History

| Version | Release Date | Description |
|---------|-------------|-------------|
| 0.9 (pre-release) | 2026-02-20 | Documentation framework, 5 module slide decks, governance layer |
| 1.0 | Q2 2026 | Full core curriculum, all labs, complete documentation |
| 1.5 | Q4 2026 | Research Track Tier 1, M08–M09, advanced labs, platform additions |
| 2.0 | Q2 2027 | M10–M12, specialization tracks, institutional deployment framework |

---

*This roadmap is reviewed and updated at each major release. Community input on priority and scope is welcomed through GitHub Discussions.*

*Document version: 1.0 | NullByte Academy | 2026*

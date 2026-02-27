# Architecture — NullByte Academy Advanced Defensive Systems Engineering Program

**Document Classification:** Program Architecture Reference
**Version:** 1.0
**Maintained By:** NullByte Academy Curriculum Committee

---

## Overview

This document defines the structural architecture of the NullByte Academy curriculum: the learning pipeline, skill progression model, lab-to-outcome mapping, and defensive capability framework. It serves as the authoritative reference for curriculum design decisions and the primary onboarding document for instructors, contributors, and institutional adopters.

---

## 1. Learning Pipeline

The curriculum is organized as a sequential pipeline in which each stage produces verifiable competencies that are prerequisite to the next. No stage may be skipped without explicit assessment of prior equivalence.

```
+------------------------------------------------------------------+
|          NULLBYTE ACADEMY — LEARNING PIPELINE                    |
+------------------------------------------------------------------+
|                                                                  |
|  STAGE 1: HARDWARE FOUNDATIONS                                   |
|  +-------------------+   +-------------------+                  |
|  |  M01: CPU          |-->|  M02: Memory       |                  |
|  |  Architecture      |   |  Layout            |                  |
|  |                    |   |                    |                  |
|  |  Registers         |   |  Virtual space     |                  |
|  |  Pipelines         |   |  Stack anatomy     |                  |
|  |  Privilege rings   |   |  Heap internals    |                  |
|  |  Calling conv.     |   |  Allocator model   |                  |
|  +-------------------+   +-------------------+                  |
|            |                       |                             |
|            +----------+------------+                             |
|                       |                                          |
|  STAGE 2: DEFENSE THEORY                                         |
|                       v                                          |
|            +-------------------+                                 |
|            |  M03: Exploit     |                                 |
|            |  Mitigations      |                                 |
|            |                   |                                 |
|            |  ASLR / DEP / NX  |                                 |
|            |  Canaries / CFI   |                                 |
|            |  RELRO / ShadowStk|                                 |
|            +-------------------+                                 |
|                       |                                          |
|  STAGE 3: ANALYSIS METHODOLOGY                                   |
|                       v                                          |
|  +-------------------+   +-------------------+                  |
|  |  M04: Reverse      |-->|  M05: Vulnerability|                  |
|  |  Engineering       |   |  Classes           |                  |
|  |                    |   |                    |                  |
|  |  Static analysis   |   |  Root cause ID     |                  |
|  |  Dynamic analysis  |   |  CWE taxonomy      |                  |
|  |  CFG construction  |   |  Integer issues    |                  |
|  |  Toolchain method. |   |  Heap / stack class|                  |
|  +-------------------+   +-------------------+                  |
|            |                       |                             |
|            +----------+------------+                             |
|                       |                                          |
|  STAGE 4: APPLIED DEFENSE                                        |
|                       v                                          |
|  +-------------------+   +-------------------+                  |
|  |  M06: Secure       |-->|  M07: Research     |                  |
|  |  Coding            |   |  Methods           |                  |
|  |                    |   |                    |                  |
|  |  Memory-safe code  |   |  CVE analysis      |                  |
|  |  Audit methodology |   |  Disclosure ethics |                  |
|  |  Trust boundaries  |   |  Structured output |                  |
|  |  Remediation       |   |  Peer review       |                  |
|  +-------------------+   +-------------------+                  |
|                       |                                          |
|  STAGE 5: RESEARCH TRACK (ELECTIVE)                              |
|                       v                                          |
|            +-------------------+                                 |
|            |  RESEARCH TRACK   |                                 |
|            |                   |                                 |
|            |  Threat modeling  |                                 |
|            |  Zero-day defense |                                 |
|            |  Publication      |                                 |
|            |  Peer review      |                                 |
|            +-------------------+                                 |
|                       |                                          |
|                       v                                          |
|            +-------------------+                                 |
|            |  CAPSTONE         |                                 |
|            |  ASSESSMENT       |                                 |
|            +-------------------+                                 |
+------------------------------------------------------------------+
```

---

## 2. Skill Progression Model

The program recognizes four discrete competency levels. Progression is assessed through lab performance, written analysis, and capstone deliverables — not through time in seat or course completion counts.

### Level Definitions

| Level | Designation | Description |
|-------|-------------|-------------|
| 1 | **Foundation** | Demonstrates comprehension of hardware and memory architecture concepts; can navigate lab environments and read disassembly with guidance |
| 2 | **Practitioner** | Independently performs binary analysis, identifies vulnerability classes from source and binary, and produces structured root cause reports |
| 3 | **Analyst** | Conducts unsupervised CVE reproduction and root cause analysis; authors code audit reports meeting publication standards; demonstrates mitigation reasoning without scaffolding |
| 4 | **Research Contributor** | Produces original security research meeting peer review standards; contributes to curriculum; demonstrates independent threat modeling and defensive architecture design |

### Progression Criteria

```
FOUNDATION (Level 1)
  Completion of M01 + M02
  Lab performance: LAB-CPU-01, LAB-MEM-01/02
  Assessment: written register model explanation + stack frame annotation
         |
         v
PRACTITIONER (Level 2)
  Completion of M03 + M04 + M05
  Lab performance: LAB-MIT-01, LAB-RE-01/02, LAB-VUL-01
  Assessment: independent binary analysis report (M04 standard)
              root cause identification for 3 vulnerability classes
         |
         v
ANALYST (Level 3)
  Completion of M06 + M07
  Lab performance: LAB-SEC-01, LAB-RES-01
  Assessment: code audit report (M06 standard)
              structured CVE analysis document (M07 standard)
         |
         v
RESEARCH CONTRIBUTOR (Level 4)
  Completion of Research Track
  Deliverable: peer-reviewed research paper or equivalent technical report
  Contribution: accepted pull request to curriculum
```

---

## 3. Lab-to-Outcome Mapping

Each lab series is mapped to specific, verifiable learning outcomes. Outcomes are stated as observable behaviors, not abstract goals.

| Lab ID | Module | Verifiable Outcome |
|--------|--------|--------------------|
| LAB-CPU-01 | M01 | Student can trace RSP/RBP values across a 3-level call chain, identify argument register placement, and locate the saved return address on the stack using GDB |
| LAB-MEM-01 | M02 | Student can annotate a complete stack frame layout from GDB output, identifying each field by name, address, and size |
| LAB-MEM-02 | M02 | Student can trace glibc heap allocations through GDB, identify chunk metadata fields, and describe the bin state after a sequence of malloc/free operations |
| LAB-MIT-01 | M03 | Student can use checksec and /proc interfaces to audit a binary's mitigation posture and explain the mechanism and bypass history of each detected mitigation |
| LAB-RE-01 | M04 | Student can produce an annotated disassembly report for a stripped binary in Ghidra, including renamed functions, reconstructed CFG, and identified data structures |
| LAB-RE-02 | M04 | Student can correlate static disassembly analysis with dynamic GDB execution trace to produce a combined static/dynamic analysis document |
| LAB-VUL-01 | M05 | Student can identify the root cause (CWE classification, vulnerable function, exact memory condition) for three provided vulnerable binaries without source code |
| LAB-SEC-01 | M06 | Student can produce a structured code audit report for a provided codebase, classifying all identified weaknesses by CWE and providing remediation recommendations |
| LAB-RES-01 | M07 | Student can produce a structured CVE analysis document for an assigned CVE, completing all fields of the analysis template to Analyst-level standard |

---

## 4. Defensive Capability Mapping

The curriculum maps to the following defensive capability areas. Each capability is the product of specific module combinations.

| Defensive Capability | Primary Modules | Supporting Labs | Output Artifact |
|----------------------|----------------|-----------------|-----------------|
| **Binary Triage** — rapid assessment of unknown binary's nature, mitigations, and attack surface | M01, M03, M04 | LAB-CPU-01, LAB-MIT-01, LAB-RE-01 | Binary triage report |
| **Vulnerability Root Cause Analysis** — identifying the engineering failure that produced a vulnerability | M02, M05 | LAB-MEM-01/02, LAB-VUL-01 | Root cause analysis document |
| **Secure Code Review** — auditing source code for memory safety, integer safety, and trust boundary violations | M05, M06 | LAB-SEC-01 | Code audit report with CWE classification |
| **Mitigation Architecture Assessment** — evaluating whether a system's mitigation posture is appropriate for its threat model | M03 | LAB-MIT-01 | Mitigation audit report |
| **CVE Analysis and Threat Intelligence** — translating public vulnerability records into actionable defensive knowledge | M07 | LAB-RES-01 | Structured CVE analysis document |
| **Threat Modeling** — identifying attack surface, threat actors, and defensive priorities for a system | M06, M07, Research Track | All | Threat model document |
| **Defensive Research** — producing original analysis of vulnerability classes or mitigation mechanisms | Research Track | All | Peer-reviewed technical report |

---

## 5. Component Dependency Map

The following describes non-curriculum component dependencies within the repository structure.

```
REPOSITORY ROOT
|
+-- docs/                     Curriculum documentation layer
|    +-- 01_BLUEPRINT.md      Program master reference
|    +-- 03_ETHICS.md         Ethical framework (governs all lab design)
|    +-- 05_GLOSSARY.md       Shared technical terminology
|    +-- 06_CURRICULUM_MAP.md Module/lab/workbook cross-reference
|
+-- presentations/            Module slide decks (5 slides per module)
|    +-- Module0N_*.pptx      N = 01 through 05 (current)
|
+-- assets/                   Diagram and branding assets
|
+-- workbooks/                XLSX reference and analysis templates
|    +-- wb_*.xlsx            One workbook per module
|
+-- .github/                  Repository governance
|    +-- workflows/           CI automation
|    +-- ISSUE_TEMPLATE/      Structured issue collection
|    +-- PULL_REQUEST_TEMPLATE.md
|
+-- GOVERNANCE.md             Decision authority and maintainer roles
+-- ARCHITECTURE.md           This document
+-- EVALUATION_FRAMEWORK.md  Assessment rubrics and capstone criteria
+-- RESEARCH_TRACK.md        Research program requirements
```

---

*This document is subject to revision as the curriculum evolves. All structural changes require a GOVERNANCE.md amendment review before taking effect.*

*Document version: 1.0 | NullByte Academy | 2026*

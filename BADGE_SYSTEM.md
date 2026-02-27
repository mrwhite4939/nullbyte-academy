# Badge System — NullByte Academy Advanced Defensive Systems Engineering Program

**Document Classification:** Competency Recognition Framework
**Version:** 1.0
**Maintained By:** NullByte Academy Curriculum Committee

---

## Overview

The NullByte Academy badge system provides a structured, criterion-based mechanism for recognizing verifiable competency. Badges are not awarded for course completion or time investment. Each badge corresponds to a specific set of demonstrated skills assessed against the standards in EVALUATION_FRAMEWORK.md.

Badges are tiered in three levels — Bronze, Silver, Gold — corresponding to the Foundation, Practitioner, and Analyst levels defined in ARCHITECTURE.md. A fourth designation, Research Contributor, exists outside the tiered system and is described separately.

No badge is issued without a verifiable assessment record. Self-reported completion does not qualify.

---

## 1. Badge Architecture

```
COMPETENCY RECOGNITION TIERS
------------------------------

BRONZE — Foundation Competency
  Core: Systems Architecture Badge
  Evidence: M01 + M02 assessment passing, LAB-CPU-01 + LAB-MEM-01/02 complete

SILVER — Practitioner Competency
  Core: Defensive Analysis Badge
  Specialization options: Mitigation Analyst, RE Practitioner, Vulnerability Analyst
  Evidence: M03 + M04 + M05 assessment passing, corresponding labs complete

GOLD — Analyst Competency
  Core: Defensive Systems Engineer Badge
  Specialization options: Secure Code Auditor, CVE Research Analyst
  Evidence: M06 + M07 assessment passing, capstone complete at threshold

RESEARCH CONTRIBUTOR — Independent Research Designation
  Evidence: Tier 1 Research Paper accepted under peer review process
```

---

## 2. Bronze Tier — Foundation Competency

### Badge: Systems Architecture Foundation

**Scope:** CPU architecture, x86-64 register model, virtual memory, stack frame anatomy, heap allocator structure.

**Eligibility Requirements:**

| Requirement | Standard |
|------------|---------|
| M01 written assessment | 65% minimum aggregate score using the module rubric |
| M02 written assessment | 65% minimum aggregate score using the module rubric |
| LAB-CPU-01 | All verifiable outcomes rated Complete |
| LAB-MEM-01 | All verifiable outcomes rated Complete |
| LAB-MEM-02 | All verifiable outcomes rated Complete or Partial with documented reflection |
| Assessment administered by | Qualified instructor or self-assessed against rubric with evidence submission |

**What this badge certifies:**

A holder of this badge has demonstrated the ability to:

- Identify and explain the role of every general-purpose, pointer, and special-purpose register in the x86-64 architecture
- Describe the complete virtual address space layout of a Linux process, including the purpose and growth direction of each segment
- Annotate a complete stack frame from a GDB output, identifying the return address, saved RBP, stack canary position (if present), and local variable layout
- Explain the structure of a glibc malloc chunk and describe the purpose of the metadata fields adjacent to the user data region
- Articulate the calling convention differences between System V AMD64 and Microsoft x64

**What this badge does not certify:**

Bronze does not certify the ability to conduct independent binary analysis, assess mitigation posture, or identify vulnerability root causes. These competencies require Silver.

---

## 3. Silver Tier — Practitioner Competency

### Badge: Defensive Analysis Practitioner

**Prerequisite:** Bronze — Systems Architecture Foundation

**Scope:** Exploit mitigations, static and dynamic binary analysis, vulnerability class root cause identification.

**Eligibility Requirements:**

| Requirement | Standard |
|------------|---------|
| M03 written assessment | 65% minimum aggregate |
| M04 written assessment | 70% minimum aggregate |
| M05 written assessment | 70% minimum aggregate |
| LAB-MIT-01 | All verifiable outcomes rated Complete |
| LAB-RE-01 | All verifiable outcomes rated Complete |
| LAB-RE-02 | All verifiable outcomes rated Complete or Partial with documented reflection |
| LAB-VUL-01 | All verifiable outcomes rated Complete |
| Submitted binary analysis report | Meets M04 report quality standard as defined in EVALUATION_FRAMEWORK.md |

**What this badge certifies:**

A holder of this badge has demonstrated the ability to:

- Explain the mechanism, threat model, and known limitations of ASLR, DEP/NX, stack canaries, CFI, RELRO, and shadow stacks
- Conduct a complete mitigation audit of a binary using checksec, readelf, and /proc interfaces, and interpret the results
- Produce an annotated disassembly report for a stripped binary in Ghidra, including renamed functions, reconstructed CFG, and identified data structures, without source code access
- Correlate static disassembly analysis with dynamic GDB execution trace to produce a combined analysis document
- Identify the root cause (CWE class, specific function, exact memory condition) of a stack-based, heap-based, and integer vulnerability from binary analysis alone

### Silver Specialization Badges

Students who meet the core Silver requirements may pursue one or more specialization badges by completing additional targeted assessments.

**Silver Specialization: Mitigation Analyst**

Additional requirement: Complete a comprehensive mitigation audit of a provided system configuration (OS + binary + compiler flags) and produce a written report arguing for or against the adequacy of its mitigation posture for a specified threat model. Report assessed at 70% minimum against the M03 rubric criteria.

**Silver Specialization: Reverse Engineering Practitioner**

Additional requirement: Produce a complete analysis report for two stripped binaries of increased complexity (obfuscated or compiler-optimized), including function renaming, data structure recovery, and a complete call graph. Both reports assessed at 70% minimum.

**Silver Specialization: Vulnerability Analyst**

Additional requirement: Complete root cause analysis for five additional vulnerable binaries spanning at least four distinct CWE classes. All five analyses assessed at 70% minimum.

---

## 4. Gold Tier — Analyst Competency

### Badge: Defensive Systems Engineer

**Prerequisite:** Silver — Defensive Analysis Practitioner

**Scope:** Secure coding and defensive architecture, CVE analysis and research methodology, capstone assessment.

**Eligibility Requirements:**

| Requirement | Standard |
|------------|---------|
| M06 written assessment | 70% minimum aggregate |
| M07 written assessment | 70% minimum aggregate |
| LAB-SEC-01 | All verifiable outcomes rated Complete |
| LAB-RES-01 | All verifiable outcomes rated Complete |
| Capstone — Written Examination | 65% minimum (per EVALUATION_FRAMEWORK.md) |
| Capstone — Live Lab Exercise | 70% minimum |
| Capstone — Research Deliverable | 65% minimum |
| Capstone — Overall | 68% minimum weighted aggregate |

**What this badge certifies:**

A holder of this badge has demonstrated the ability to:

- Produce a structured code audit report for a provided codebase, identifying all present vulnerabilities by CWE, severity, and specific code location, with remediation recommendations
- Design and justify a mitigation strategy for a provided threat scenario, selecting and defending mitigations appropriate to the specific attack surface
- Complete a full structured CVE analysis for an assigned CVE, producing a document meeting the M07 template standard
- Perform capstone-level binary analysis, root cause identification, and CVE analysis independently under timed assessment conditions

### Gold Specialization Badges

**Gold Specialization: Secure Code Auditor**

Additional requirement: Complete code audits of three additional codebases of increased complexity (minimum 1,000 lines each), producing structured audit reports that are reviewed and validated by a qualified instructor. All three reports must achieve 75% minimum on the M06 rubric.

**Gold Specialization: CVE Research Analyst**

Additional requirement: Complete structured CVE analyses for eight additional CVEs spanning at least three distinct CWE families and at least two distinct affected technology domains. All eight analyses validated by a qualified instructor. Average score 70% minimum on M07 rubric criteria.

---

## 5. Research Contributor Designation

The Research Contributor designation is not a tier badge. It is a program-level designation awarded to students who complete the Research Track at Tier 1 level and have an accepted peer-reviewed research paper in the NullByte Academy publication record.

**Prerequisite:** Gold — Defensive Systems Engineer

**Eligibility Requirements:**

| Requirement | Standard |
|------------|---------|
| Gold badge held | Required |
| Research Track Tier 1 participation | Full completion of all Research Track requirements |
| Peer-reviewed paper | Accepted under the RESEARCH_TRACK.md process, scoring average 4.0+ across all criteria |
| Ethical conduct record | No confirmed violations of CODE_OF_CONDUCT.md or 03_ETHICS.md at any point in program participation |

**What this designation certifies:**

A Research Contributor has demonstrated the ability to conduct original defensive security research, communicate findings to a technical audience in writing, engage with peer review feedback constructively, and operate within the ethical framework of the program at the level expected of a contributing member of the security research community.

**Senior Research Contributor Designation**

A Senior Research Contributor has met Research Contributor requirements and additionally served as a peer reviewer for at least three Tier 1 submissions, demonstrating the ability to assess others' research against the program's quality and ethical standards.

---

## 6. Badge Administration

**Issuance:** Badges are issued by the program maintainers upon submission and verification of all eligibility evidence. Evidence submission follows the process defined in the student portal (when available) or via email to the program contact address.

**Revocation:** A badge may be revoked if it is subsequently determined that the assessment evidence was falsified or that the holder engaged in conduct violating CODE_OF_CONDUCT.md or 03_ETHICS.md. Revocation decisions are made by the Maintainer Council and are final.

**Public Record:** The program does not maintain a public registry of badge holders without explicit consent. Students wishing to reference their badge status publicly may request a verification letter from the program contact.

---

*Document version: 1.0 | NullByte Academy | 2026*

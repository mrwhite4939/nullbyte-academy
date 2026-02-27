# Evaluation Framework — NullByte Academy Advanced Defensive Systems Engineering Program

**Document Classification:** Academic Assessment Standards
**Version:** 1.0
**Maintained By:** NullByte Academy Curriculum Committee

---

## Overview

This document defines the assessment rubrics, scoring criteria, capstone evaluation matrix, and research track assessment standards for the NullByte Academy program. All instructors, evaluators, and peer reviewers must apply the criteria defined here consistently. Criteria may not be modified for individual students. Amendments require the curriculum committee review process defined in GOVERNANCE.md.

---

## 1. Assessment Principles

**Demonstrable over declarative.** An assessment must require a student to demonstrate a skill in a verifiable way, not merely declare that they possess it. "I understand ASLR" is not assessable. An annotated diagram showing ASLR entropy sources, the effect on each memory region, and the conditions under which partial overwrite remains viable — that is assessable.

**Specificity is the standard.** Vague answers receive no credit regardless of their apparent intent. A student who writes "the vulnerability is a buffer overflow" has provided less than a student who writes "the vulnerability is a stack-based spatial safety violation in `process_input()` at line 47 of `handler.c`, where `strcpy()` copies a user-controlled string into a 64-byte stack buffer without length validation (CWE-121)."

**Defensive framing is required.** Assessments that describe attack mechanics without concluding with a defensive analysis receive a maximum of 60% of available marks, regardless of technical accuracy. The curriculum exists to produce defensive engineers. Every analysis must answer: what is the fix, and what mitigation would have prevented or reduced impact?

---

## 2. Module Assessment Rubrics

### Standard Written Analysis Rubric (Applied to all module written assessments)

Each criterion is scored 0–4.

| Score | Descriptor |
|-------|------------|
| 4 — Exemplary | Response is technically precise, specific, complete, and defensively framed. Sources cited where appropriate. No factual errors. |
| 3 — Proficient | Response is technically accurate and specific with minor gaps. Defensive framing present. At most one minor factual error. |
| 2 — Developing | Response demonstrates basic understanding but lacks specificity or contains non-trivial gaps. Defensive framing present but shallow. |
| 1 — Insufficient | Response demonstrates partial understanding. Significant gaps or one major factual error. Defensive framing absent or superficial. |
| 0 — No Credit | Response is absent, entirely incorrect, or demonstrates no relevant understanding. |

### Module Assessment Criteria Breakdown

**M01 — CPU Architecture**

| Criterion | Weight | Assessment Question |
|-----------|--------|-------------------|
| Register model accuracy | 25% | Name every general-purpose register, its width variants, and its primary role in the SysV AMD64 ABI |
| Privilege ring mechanics | 25% | Explain the security boundary between Ring 0 and Ring 3 and the mechanism by which the boundary is crossed |
| Calling convention precision | 30% | For a provided function signature, specify exactly which register or stack location holds each argument and the return value, for both SysV and Microsoft x64 |
| Defensive connection | 20% | Explain why understanding register layout is prerequisite to understanding stack frame analysis |

**M02 — Memory Layout**

| Criterion | Weight | Assessment Question |
|-----------|--------|-------------------|
| Address space mapping | 20% | Label all segments of a process's virtual address space from a provided /proc/maps output |
| Stack frame anatomy | 35% | Produce a complete annotated diagram of a stack frame from a provided GDB output, identifying every field by name, address, and size |
| Heap chunk structure | 25% | Identify all metadata fields in a provided heap chunk dump and explain the security relevance of the size/flags field |
| Defensive implication | 20% | Explain how knowledge of heap chunk structure informs both the design of heap hardening measures and the detection of heap corruption |

**M03 — Exploit Mitigations**

| Criterion | Weight | Assessment Question |
|-----------|--------|-------------------|
| Mitigation mechanism | 40% | For each of ASLR, DEP/NX, stack canary, and CFI: describe the mechanism, the threat it addresses, and its known limitations |
| Mitigation audit | 25% | Interpret a provided checksec output and explain what each reported value means for the binary's defensive posture |
| Historical context | 15% | For any one mitigation, describe the research or attack that motivated its introduction |
| Defense-in-depth reasoning | 20% | Explain why no single mitigation is sufficient and describe a layered mitigation strategy for a provided threat scenario |

**M04 — Reverse Engineering**

| Criterion | Weight | Assessment Question |
|-----------|--------|-------------------|
| Disassembly interpretation | 30% | Annotate a provided disassembly listing: label all local variables, trace control flow, and identify all external calls |
| CFG construction | 20% | Produce a correct control flow graph for a provided function, identifying all basic blocks and edges |
| Tool proficiency | 25% | Demonstrate completion of a Ghidra analysis task using the expected workflow (screenshot evidence or GDB log acceptable) |
| Analysis report quality | 25% | Analysis document meets the structural and content standards defined in this framework |

**M05 — Vulnerability Classes**

| Criterion | Weight | Assessment Question |
|-----------|--------|-------------------|
| Root cause precision | 40% | For each of three provided vulnerable binaries: identify the exact function, line, CWE class, and memory condition responsible for the vulnerability |
| CWE classification accuracy | 20% | Classify each identified vulnerability using the correct CWE entry, including the CWE-ID, name, and applicable abstraction level |
| Impact analysis | 20% | For each vulnerability: describe the worst-case impact on confidentiality, integrity, and availability |
| Remediation specificity | 20% | Provide a specific, implementable code-level fix for each identified vulnerability |

**M06 — Secure Coding**

| Criterion | Weight | Assessment Question |
|-----------|--------|-------------------|
| Audit coverage | 25% | All vulnerabilities present in the provided codebase are identified (precision and recall both measured) |
| Classification accuracy | 25% | Each identified weakness correctly classified by CWE |
| Remediation quality | 30% | Each remediation recommendation is specific, implementable, and correct |
| Report structure | 20% | Audit report follows the required format with all sections complete |

**M07 — Research Methods**

| Criterion | Weight | Assessment Question |
|-----------|--------|-------------------|
| CVE record comprehension | 25% | All fields of the analysis template completed correctly from a provided CVE record and associated vendor advisory |
| Root cause characterization | 30% | CVE root cause characterized at the level of the specific memory condition or logic error, not just the vulnerability class |
| Mitigation analysis | 25% | Existing mitigations' applicability and limitations discussed with reference to the specific vulnerability mechanics |
| Research communication | 20% | Writing is precise, defensively framed, and appropriate for a technical audience |

---

## 3. Lab Assessment Standards

Labs are assessed on a three-level scale applied to each verifiable outcome defined in ARCHITECTURE.md.

| Level | Descriptor |
|-------|------------|
| **Complete** | Student has produced all required outputs to the specified standard. All analysis prompts answered specifically and correctly. Defensive takeaway articulated. |
| **Partial** | Student has completed the observation steps but analysis is incomplete, vague, or partially incorrect. Defensive framing present but insufficient. |
| **Incomplete** | Required outputs missing, incorrect, or student was unable to complete the lab exercise. |

A lab is considered passed when all verifiable outcomes are rated Complete or when all outcomes rated Partial are accompanied by a written explanation of what was not understood and why — demonstrating metacognitive awareness rather than concealment of gaps.

---

## 4. Capstone Evaluation Matrix

The capstone assessment is a comprehensive evaluation conducted at the conclusion of M01–M07. It consists of three components: a written analysis exam, a live lab exercise, and a research deliverable.

### Component 1: Written Analysis Examination (30% of capstone grade)

The examination presents the student with:

- One binary analysis problem (disassembly listing, no source): produce a complete annotated analysis using M04 standards
- One root cause identification problem (binary + minimal context): classify and document using M05 standards
- One CVE record: complete the M07 analysis template

Scoring applies the standard written analysis rubric to each criterion within each question. Overall written examination score = weighted average across all criteria.

### Component 2: Live Lab Exercise (40% of capstone grade)

The student is given a clean lab environment and a task specification. Tasks are drawn from LAB-RE-01/02 or LAB-VUL-01 equivalents. The student completes the exercise in a timed session (3 hours maximum) and submits:

- All required lab outputs (GDB logs, annotated disassembly, analysis document)
- Answers to analysis prompts
- Defensive takeaway statement

| Capstone Lab Criterion | Weight |
|----------------------|--------|
| Technical accuracy of outputs | 40% |
| Depth and specificity of analysis | 30% |
| Correct use of toolchain | 15% |
| Quality and specificity of defensive takeaway | 15% |

### Component 3: Research Deliverable (30% of capstone grade)

The student selects a CVE from the provided list and submits a structured research document. The document must include all fields of the M07 analysis template plus an extended root cause discussion of at least 500 words.

| Capstone Research Criterion | Weight |
|---------------------------|--------|
| Technical accuracy | 35% |
| Root cause characterization depth | 30% |
| Mitigation analysis quality | 20% |
| Writing clarity and precision | 15% |

### Capstone Pass Thresholds

| Component | Minimum to Pass Capstone |
|-----------|--------------------------|
| Written Examination | 65% aggregate |
| Live Lab Exercise | 70% aggregate |
| Research Deliverable | 65% aggregate |
| **Overall Capstone** | **68% weighted aggregate** |

A student who passes the overall aggregate but scores below the minimum in any single component must remediate that component before receiving a final program designation.

---

## 5. Research Track Assessment

Research Track assessment is distinct from module assessment. It applies to students pursuing the Research Contributor or Senior Research Contributor designation.

### Tier 1 Research Paper Evaluation Rubric

Papers are reviewed by two independent reviewers. Scoring is on a 1–5 scale per criterion.

| Criterion | Description |
|-----------|-------------|
| **Technical accuracy** | All factual claims are verifiable and correctly stated |
| **Root cause characterization** | Vulnerability or defense mechanism analyzed at the structural level, not the surface level |
| **Novelty** | The paper presents analysis or synthesis not already available in the cited literature |
| **Defensive framing** | All content is oriented toward defensive understanding and engineering decisions |
| **Writing quality** | Technical writing is precise, unambiguous, and appropriate for a technical audience |
| **Citation completeness** | All claims derived from external sources are correctly cited |
| **Ethical compliance** | Paper complies fully with the ethical standards in `03_ETHICS.md` and `RESEARCH_TRACK.md` |

**Acceptance Thresholds:**

- Average score of 4.0 or above across all criteria: Accept
- Average score of 3.0–3.9: Accept with revisions (revisions reviewed by original reviewers)
- Average score below 3.0: Reject with detailed feedback (student may resubmit after 60 days)

Reviewer scores that differ by more than 1.5 points on any criterion require a third reviewer.

---

*This document is reviewed at each major release cycle. Criteria changes require curriculum committee approval and take effect only in the release following their adoption.*

*Document version: 1.0 | NullByte Academy | 2026*

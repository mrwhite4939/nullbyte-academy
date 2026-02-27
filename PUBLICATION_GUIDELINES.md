# Publication Guidelines — NullByte Academy Advanced Defensive Systems Engineering Program

**Document Classification:** Research Publication Standards
**Version:** 1.0
**Maintained By:** NullByte Academy Maintainer Council

---

## Overview

This document defines the formatting standards, citation requirements, disclosure compliance obligations, and submission process for research papers produced through the NullByte Academy Research Track. All Research Track students, Research Mentors, and peer reviewers must be familiar with these guidelines before submitting or reviewing work.

---

## 1. Paper Format

### 1.1 Structure

All Research Track papers must follow this structure. Sections marked required must be present. Sections marked optional may be included when appropriate.

| Section | Status | Description |
|---------|--------|-------------|
| Title | Required | Specific, descriptive, not a question. Maximum 15 words. |
| Abstract | Required | 150–200 words. State the research question, methodology, primary findings, and defensive implications. |
| Keywords | Required | 3–6 keywords from the approved taxonomy (see §1.5) |
| 1. Introduction | Required | Research question, motivation, scope, and paper organization. |
| 2. Background | Required | Technical context required to understand the paper. Cite sources for all background claims. |
| 3. Related Work | Required | What has been published in this area before? How does this paper differ or extend prior work? |
| 4. Methodology | Required | What was done, in what environment, under what conditions? Sufficient detail for replication in a permissioned environment. |
| 5. Results | Required | What was found? Present results without interpretation in this section. |
| 6. Analysis | Required | Interpret results. What do they mean? What are the limitations of the analysis? |
| 7. Defensive Implications | Required | This section is non-negotiable. For every finding, state what a defender should do with this knowledge. |
| 8. Disclosure Statement | Required | What was disclosed, to whom, when, and what was the response. See §3. |
| 9. Conclusion | Required | Summary of findings and their significance. Future work. |
| Acknowledgements | Optional | Acknowledge Research Mentor, reviewers, tools, and any funding or institutional support. |
| References | Required | All cited sources, formatted per §2. |
| Appendices | Optional | Supporting data, extended methodology notes, tool configurations. |

### 1.2 Length

Target length is 4,000–8,000 words, excluding references and appendices. Papers below 4,000 words rarely have sufficient depth. Papers above 8,000 words often contain content that should be reorganized or moved to appendices.

Research Mentors may approve exceptions to length limits for papers where scope genuinely requires them.

### 1.3 File Format

Submit in both Markdown (.md) and PDF. The Markdown source is the version of record. The PDF is for reviewer convenience.

**Markdown formatting rules:**

- Use ATX-style headers (# for H1, ## for H2, etc.)
- Code blocks must specify a language identifier: ```` ```asm ````, ```` ```c ````, ```` ```bash ```` etc.
- Tables use standard GitHub Flavored Markdown table syntax
- No raw HTML unless it is the only way to achieve a necessary formatting effect
- Line length: wrap at 100 characters for readability in plain-text review

**PDF generation:** Use pandoc with the LaTeX backend, or an equivalent tool that produces clean PDF from Markdown. Do not submit PDFs generated from word processors that introduce formatting artifacts.

### 1.4 Language

Papers must be written in English. Technical precision is required. Hedging language is acceptable where genuine uncertainty exists and must be distinguished from imprecision. Write "the behavior is consistent with" when you are inferring, not "the binary does." Write "we observed" when describing experimental results, not "it appears."

Avoid passive voice where active voice is clearer. "The allocator sets the IS_MMAPPED flag" is clearer than "the IS_MMAPPED flag is set." Exceptions exist in methodology sections where the passive voice is conventional and reduces ambiguity about whether the author or the tool performed an action.

### 1.5 Approved Keyword Taxonomy

Keywords must be drawn from the following categories. A paper must include at least one keyword from each applicable category.

**Vulnerability Classes:** buffer overflow, use-after-free, double-free, heap overflow, integer overflow, integer truncation, format string, type confusion, race condition, null pointer dereference

**Architecture:** x86-64, ARM64, RISC-V, kernel space, user space, privilege ring, calling convention, stack frame, heap

**Mitigations:** ASLR, DEP, NX, stack canary, CFI, shadow stack, RELRO, safe unlinking, pointer authentication

**Analysis Methodology:** static analysis, dynamic analysis, binary analysis, reverse engineering, taint analysis, symbolic execution, fuzzing

**Research Category:** root cause analysis, mitigation evaluation, vulnerability class characterization, defensive architecture, threat modeling

---

## 2. Citation Standards

### 2.1 Citation Format

NullByte Academy papers use a numbered citation format. References are cited in the text as [N] and listed in full at the end of the paper in order of first appearance.

**Journal article:**
```
[1] A. Lastname and B. Lastname, "Title of Article," Journal Name, vol. X, no. Y,
    pp. NNN–NNN, Month Year. DOI: 10.XXXX/XXXXXXX
```

**Conference paper:**
```
[2] C. Lastname, "Title of Paper," in Proc. Conference Name (CONFABBREV),
    City, Country, Year, pp. NNN–NNN.
```

**Technical report / whitepaper:**
```
[3] D. Lastname, "Title of Report," Organization Name, Technical Report TR-XXXX,
    Month Year. [Online]. Available: https://example.org/report
```

**CVE / NVD record:**
```
[4] NIST National Vulnerability Database, "CVE-YYYY-NNNNN," [Online].
    Available: https://nvd.nist.gov/vuln/detail/CVE-YYYY-NNNNN.
    Accessed: YYYY-MM-DD.
```

**Software or tool:**
```
[5] E. Lastname, "Tool Name," Version X.Y.Z, Year. [Online].
    Available: https://github.com/example/tool. License: MIT.
```

**Book chapter:**
```
[6] F. Lastname, "Chapter Title," in Book Title, G. Lastname, Ed.
    City: Publisher, Year, pp. NNN–NNN.
```

### 2.2 Citation Requirements

Every factual claim that is not the paper's own original finding must be cited. This includes:

- Background claims about architecture, OS behavior, or tool behavior
- Claims about the history or effectiveness of mitigations
- Statistics or measurement results from prior work
- Descriptions of prior research that the current paper extends or challenges

Claims presented as the paper's own findings must be supported by the paper's own methodology and results sections. If a finding has also been independently reported by others, cite the prior work and distinguish the new contribution.

Do not cite sources you have not read. If you are aware of a relevant source but cannot access it, note this in the text. Do not cite a source based on another paper's citation of it without reading the original.

### 2.3 Self-Citation

Self-citation (citing the author's own prior work) is acceptable when relevant. It requires no special handling. Do not cite your own prior work to pad a reference list; cite it when it is genuinely relevant to the current paper.

---

## 3. Responsible Disclosure Compliance

### 3.1 Required Statement

Every paper that reports a vulnerability in real software must include a Disclosure Statement section (§1.1 above). The Disclosure Statement must include:

- The identity of the affected vendor or maintainer (or "anonymous" if the researcher has a legitimate reason not to disclose)
- The date the vulnerability was reported
- The report method (private email, HackerOne, vendor security contact, etc.)
- The vendor's response (acknowledged, patched, declined to respond, etc.)
- The CVE-ID if one has been assigned
- Whether the paper's publication was coordinated with the vendor

### 3.2 Timing

Papers reporting unpatched vulnerabilities may not be submitted for peer review until the responsible disclosure notification has been sent to the vendor. Papers may not be published until one of the following conditions is met:

- The vendor has confirmed a fix is publicly available
- 90 days have elapsed since the initial vendor notification without a public fix
- The Research Mentor and Maintainer Council have approved an exception (requires documented justification)

### 3.3 Vendor Objections

If a vendor objects to publication after the 90-day window, the Maintainer Council reviews the objection. The council may:

- Approve publication as submitted
- Approve publication with specific technical details redacted
- Delay publication by a specific period with documented justification
- Decline to publish the paper in the program's research record

The council's decision is documented. Authors are not required to comply with vendor objections beyond the 90-day window; they may publish elsewhere independent of the council's decision.

---

## 4. Submission Process

### 4.1 Initial Submission

Submit the paper to your Research Mentor as a pull request to a private branch in the NullByte Academy repository. The pull request must include:

- The paper in Markdown format
- The paper in PDF format
- A completed disclosure statement (even if no new vulnerabilities are reported — state "No new vulnerabilities identified in real systems")
- Confirmation that the submission does not contain functional offensive tooling

### 4.2 Mentor Review

The Research Mentor reviews the submission and provides written formative feedback within 14 days. Mentor review is not peer review. Its purpose is to prepare the submission for peer review, not to make the accept/reject determination.

The mentor returns the paper with specific revision requests. The author responds with a revised paper and a point-by-point response to each request within 30 days.

### 4.3 Peer Review Submission

After the mentor confirms the paper is ready for peer review, the paper is submitted to the peer review process defined in RESEARCH_TRACK.md §5 and EVALUATION_FRAMEWORK.md §5.

### 4.4 Publication

Papers accepted by the peer review process are merged to the `research/` directory in the repository. The merge commit message records the acceptance date and the paper's assigned identifier in the program's research record.

Each published paper receives an identifier in the format `NBA-RES-YYYY-NNN` (NullByte Academy Research, year, sequential number). This identifier is included in the paper's final version and in the repository's research index.

---

## 5. Copyright and Licensing

Authors retain full copyright to their research papers. Publication in the NullByte Academy research record is a non-exclusive license. Authors may publish their work elsewhere — in conference proceedings, journals, or other venues — without restriction and without requiring approval from the program.

When a paper appears in another venue after appearing in the NullByte Academy research record, the external publication should acknowledge prior appearance: "An earlier version of this work appeared in the NullByte Academy Research Record as NBA-RES-YYYY-NNN."

The program's research record is published under a Creative Commons Attribution 4.0 International (CC BY 4.0) license. This applies to the record as a collection; individual papers remain under the author's copyright as described above.

---

*Document version: 1.0 | NullByte Academy | 2026*

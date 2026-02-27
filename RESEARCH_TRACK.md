# Research Track — NullByte Academy Advanced Defensive Systems Engineering Program

**Document Classification:** Research Program Standards
**Version:** 1.0
**Maintained By:** NullByte Academy Maintainer Council
**Availability:** Version 1.5 and later

---

## Overview

The NullByte Academy Research Track is a structured program within the curriculum for students who have demonstrated Analyst-level competency across all core modules and wish to develop the skills and practice required for independent security research. The Research Track is not a continuation of the module curriculum. It is a distinct program with distinct requirements, supervised by assigned Research Mentors, and governed by the standards in this document.

Admission to the Research Track is by assessment, not by self-selection. Students who have completed M01–M07 and hold the Gold — Defensive Systems Engineer badge are eligible to apply.

---

## 1. Research Track Philosophy

The Research Track operates on a principle that is distinct from the module curriculum: at this level, the material does not exist yet. Students are not learning from a structured body of knowledge. They are adding to it.

This distinction has implications for how Research Track work is evaluated, supervised, and communicated. In the module curriculum, a correct answer is possible. In research, what is possible is a defensible argument supported by evidence. The Research Track teaches the craft of producing defensible arguments about security systems — and the discipline of knowing when your evidence is insufficient to support your claim.

The research must be defensive. This is not a constraint on research topics — it is a constraint on framing. A Research Track student studying a vulnerability class is studying it to understand how to build systems that are resistant to it, detect it, or recover from it. Research that analyzes offensive capability without a defensible connection to defensive engineering does not meet the program's standards.

---

## 2. Eligibility and Admission

**Prerequisite:** Gold — Defensive Systems Engineer badge, confirmed in the program's assessment record.

**Application:** Students apply through the research track portal or by direct contact with the Lead Maintainer. The application must include:

- A proposed research topic (one paragraph, not a full proposal)
- A description of the research question the student intends to address
- A statement of the student's prior relevant work (labs completed, modules assessed, any prior independent work)
- Identification of a preferred Research Mentor (from the list in MAINTAINERS.md) or a request for assignment

**Admission decision:** The Maintainer Council, in consultation with available Research Mentors, makes admission decisions within 21 days of application. Admission capacity is limited by mentor availability. Students who are not admitted in a given cycle are placed on a waitlist and reconsidered for the next cohort.

---

## 3. Research Track Tiers

### Tier 1 — Supervised Defensive Research

Tier 1 is the entry-level research program. Students work under the supervision of an assigned Research Mentor to develop and submit a research paper meeting the standards defined in EVALUATION_FRAMEWORK.md and PUBLICATION_GUIDELINES.md.

**Duration:** Six to twelve months, depending on student pace and topic complexity.

**Deliverables:**

| Deliverable | Due | Description |
|------------|-----|-------------|
| Research proposal | Week 4 | Topic, research question, preliminary literature review, proposed methodology |
| Progress report | Month 3 | Work completed to date, current findings, obstacles, revised timeline |
| Draft paper | Month 5–8 | Complete draft submitted to Research Mentor for formative review |
| Revised paper | 30 days after mentor feedback | Revised draft submitted for peer review |
| Final paper | After peer review | Final version following peer review revisions |

**Supervision cadence:** Research Mentor provides written feedback on each deliverable within 14 days of submission. One synchronous or asynchronous check-in session per month (optional but recommended).

**Completion:** Tier 1 is complete when the student's final paper is accepted by the peer review process as defined in EVALUATION_FRAMEWORK.md §5. Accepted papers are published in the NullByte Academy research record. Students receive the Research Contributor designation.

### Tier 2 — Independent Research Program

Tier 2 is available to Research Contributors who have completed Tier 1. At Tier 2, the student conducts independent research with minimal supervision, is expected to submit to external venues, and serves as a peer reviewer for Tier 1 submissions.

**Prerequisites:** Research Contributor designation, confirmed by the program record.

**Expectations:** Tier 2 students are treated as junior collaborators in the research community, not as supervised learners. They are expected to identify their own research questions, manage their own timelines, and produce work of publishable quality without structured scaffolding.

**Completion:** Tier 2 is complete when the student has: submitted at least one paper to an external venue (conference or journal), received and responded to external peer review, and reviewed at least three Tier 1 submissions for the program. Completion awards the Senior Research Contributor designation.

---

## 4. Research Ethics Standards

All Research Track work must comply with the following standards. Violations result in immediate removal from the Research Track and may result in removal from the program.

### 4.1 Permissioned Research Only

Research conducted through this program must be conducted exclusively on:

- Systems owned by the student
- Systems for which the student holds documented, explicit written authorization from the system owner
- Purpose-built research environments provided by the program or created by the student for the explicit purpose of the research

Any research involving unauthorized access to computer systems — regardless of the research's defensive intent — violates this standard and is a violation of applicable law. The program does not provide legal cover or institutional authority for unauthorized access.

### 4.2 Responsible Disclosure

Research that identifies vulnerabilities in real software, hardware, or systems must be handled under responsible disclosure practices:

1. The vulnerability must be reported to the affected vendor or maintainer before publication
2. The report must allow a reasonable remediation period (90 days is the prevailing standard; this may be shortened if there is evidence of active exploitation)
3. Publication must be coordinated with the vendor/maintainer wherever possible
4. If a vendor is unresponsive after 90 days, publication may proceed with notification that the disclosure window has elapsed

Research Mentors must be informed of any responsible disclosure process in progress before the 90-day window closes. The Maintainer Council must approve the decision to publish over vendor objection.

### 4.3 Data and Privacy

Research must not involve the collection, analysis, or publication of personal data about individuals who have not consented to participate in the research. Research that incidentally encounters personal data must handle it according to applicable privacy law and must not publish it.

### 4.4 Offensive Tooling Prohibition

Research Track students may not develop, publish, or distribute functional offensive tooling as a research output. Analysis of attack mechanics, including description of vulnerability trigger conditions, is acceptable. Weaponized proof-of-concept code that is operationally useful against real targets is not. When in doubt, the standard is: would a defender need this to understand the defense, or would an attacker need this to conduct the attack?

### 4.5 Conflict of Interest

Research Track students must disclose any financial, professional, or personal relationship with entities whose systems or software are the subject of their research. Conflicts of interest are disclosed to the Research Mentor and the Maintainer Council. Undisclosed conflicts discovered after publication are treated as research misconduct.

---

## 5. Peer Review Process

All Tier 1 final papers are subject to double-blind peer review by two independent reviewers drawn from the Research Contributor community. The process follows the standards in EVALUATION_FRAMEWORK.md §5.

**Reviewer assignment:** Research Mentors assign reviewers. Reviewers must not have a personal or professional relationship with the author. If a reviewer identifies a conflict of interest after assignment, they must disclose it and be replaced.

**Reviewer obligations:**

- Complete the review within 21 days of assignment
- Apply the rubric in EVALUATION_FRAMEWORK.md §5 consistently
- Provide written justification for each score
- Maintain the confidentiality of the review process

**Author obligations:**

- Do not attempt to identify reviewers
- Respond to all review comments in the revision, either by making the requested change or by providing a documented, reasoned explanation for declining
- Do not contact reviewers directly about a review in progress

**Decision:** The Research Mentor makes an initial recommendation (Accept / Accept with revisions / Reject) based on the reviewer scores. The Maintainer Council confirms the decision. Authors are notified within 7 days of the council decision.

---

## 6. Research Output Publication

Accepted papers are published in the NullByte Academy research record. See PUBLICATION_GUIDELINES.md for format, citation standards, and publication process.

Authors retain copyright to their work. Publication in the NullByte Academy research record does not transfer copyright. Authors may publish elsewhere, including externally, without restriction. When a paper is published elsewhere after appearing in the program's research record, the external publication should note its prior appearance.

---

*This document takes effect with Version 1.5 of NullByte Academy. Prior to Version 1.5, the Research Track is under development.*

*Document version: 1.0 | NullByte Academy | 2026*

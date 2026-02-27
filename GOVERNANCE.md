# Governance — NullByte Academy Advanced Defensive Systems Engineering Program

**Document Classification:** Program Governance Framework
**Version:** 1.0
**Effective Date:** 2026-02-01
**Authority:** NullByte Academy Maintainer Council

---

## Overview

This document defines the governance structure of NullByte Academy: who has authority over what decisions, how decisions are made and recorded, what the review and amendment process is, and how the program resolves conflicts. It is the authoritative reference for any dispute about program authority or process.

---

## 1. Governance Principles

**Decisions follow evidence.** Program decisions — about curriculum content, contributor status, release timing, ethics policy — are made on the basis of documented reasoning. Preference without argument is not a basis for a program decision.

**Authority is scoped.** Different roles carry authority over different decisions. No role carries authority over all decisions. This document defines those scopes.

**Transparency is the default.** Decision records, amendment rationales, and role changes are documented in the repository. Exceptions require explicit justification.

**The mission governs.** When a governance question lacks a clear answer in this document, the question is resolved by reference to the program's mission: producing defensive security engineers and researchers of genuine depth and high ethical standard.

---

## 2. Roles and Responsibilities

### Maintainer Council

The Maintainer Council is the governing body of NullByte Academy. It consists of two to five individuals who hold the maintainer designation. Council decisions on significant matters require a majority vote, with the Lead Maintainer casting a tiebreaking vote when the council is evenly divided.

**Authority:**

- Final approval of major and minor releases
- Curriculum amendment approval (structural changes to module scope, prerequisites, or assessment standards)
- Role appointments and removals (Maintainer, Senior Reviewer, Research Mentor)
- Enforcement decisions under CODE_OF_CONDUCT.md
- Approval of institutional partnerships
- GOVERNANCE.md and CODE_OF_CONDUCT.md amendments

**Composition and term:**

Council members serve indefinitely but may resign with 30 days notice. A council member may be removed by a supermajority vote (two-thirds) of the remaining council members for cause, documented in the decision record.

### Lead Maintainer

The Lead Maintainer is the operational head of the Maintainer Council. The Lead Maintainer holds no additional authority beyond the standard Maintainer role in normal circumstances. The Lead Maintainer casts tiebreaking votes and serves as the external contact point for institutional and media inquiries.

**Current Lead Maintainer:** See MAINTAINERS.md

### Maintainer

Maintainers are the core contributors with merge authority. They review and approve pull requests, triage issues, administer releases, and represent the program's standards in community interactions.

**Authority:**

- Merge approval for pull requests (standard content and documentation changes)
- Issue triage and labeling
- Beta release creation and tagging
- Rejection of pull requests that do not meet contribution standards

**Pathway to Maintainer designation:** A contributor becomes eligible for Maintainer consideration after: six months of active contribution, at least ten accepted pull requests, demonstrated technical accuracy in submitted content, and demonstrated adherence to the program's ethical standards. Appointment is by Maintainer Council vote.

### Senior Technical Reviewer

Senior Technical Reviewers are domain experts — external or community members — who review technical content in specific curriculum areas (CPU architecture, heap internals, compiler security, etc.). They do not have merge authority but their review is required for module content changes in their designated domain.

**Authority:**

- Required review sign-off for module content changes in their designated domain
- Technical accuracy determination for disputed content claims

**Appointment:** By Maintainer Council invitation. Senior Technical Reviewers are listed in MAINTAINERS.md with their domain designations.

### Research Mentor

Research Mentors supervise Research Track Tier 1 students. They review and provide formative feedback on research-in-progress, assign peer reviewers for submitted papers, and make the initial accept/revise/reject recommendation (which is confirmed or overridden by the Maintainer Council for final decisions).

**Authority:**

- Supervision and formative feedback for assigned Research Track students
- Initial peer review recommendation for supervised submissions

**Appointment:** Research Mentors must hold the Senior Research Contributor designation or an equivalent external qualification. Appointment is by Maintainer Council invitation.

### Contributor

Contributors are community members who submit pull requests, file issues, and participate in discussions. Contributors do not have merge authority. They operate under the standards in CONTRIBUTING.md.

---

## 3. Decision-Making Process

### Routine Decisions

Routine decisions (content corrections, toolchain updates, documentation improvements, patch releases) are made by any Maintainer. A single Maintainer's approval is sufficient to merge a PR of routine scope. The other Maintainers are notified via the GitHub PR notification system.

**Routine scope includes:** factual corrections, formatting improvements, link fixes, tool version updates, minor documentation additions that do not change program structure or standards.

### Significant Decisions

Significant decisions require Maintainer Council majority approval before action is taken.

**Significant scope includes:**

- New module additions or removals
- Changes to assessment rubrics or pass thresholds
- Changes to badge criteria
- Major release creation (Stable designation)
- Role appointments and removals
- Ethics policy changes (03_ETHICS.md amendments)
- GOVERNANCE.md amendments
- Enforcement decisions under CODE_OF_CONDUCT.md

**Process for significant decisions:**

1. Any Maintainer may open a GitHub Discussion tagged `governance` proposing the decision
2. A minimum 7-day comment period during which all Maintainers may review and comment
3. A synchronous or asynchronous Maintainer Council vote, documented in the discussion thread
4. Decision recorded in the discussion thread with all votes documented
5. Action taken only after vote result is documented

### Emergency Decisions

An emergency decision is one that must be made faster than the significant decision process allows — typically in response to a Critical security vulnerability, a Critical content error, or a time-sensitive platform outage.

Emergency decisions are made by the Lead Maintainer acting alone, with notification to the full Maintainer Council within 24 hours and a retrospective council review within 7 days. Emergency authority is limited to the minimum action required to address the emergency. It does not authorize structural or policy changes.

---

## 4. Amendment Process

Amendments to governance documents (GOVERNANCE.md, CODE_OF_CONDUCT.md, and EVALUATION_FRAMEWORK.md) require:

1. A written proposal submitted as a GitHub Discussion or Pull Request, including the proposed text and rationale
2. A 14-day comment period (extended to 21 days for substantial amendments)
3. Maintainer Council supermajority approval (two-thirds)
4. The amended document takes effect upon merge to `main`

Amendments to curriculum content documents (module content, ARCHITECTURE.md, ROADMAP.md) require only Maintainer Council majority approval under the significant decision process.

---

## 5. Review Workflow

### Pull Request Review Standards

Every pull request requires at least one Maintainer approval before merge. PRs modifying module content in a domain with an assigned Senior Technical Reviewer require that reviewer's sign-off in addition to Maintainer approval.

PRs must remain open for at least 48 hours before merge, regardless of review status, to allow asynchronous review. This window is waived for hotfix PRs addressing Critical severity issues.

### Issue Triage

New issues are triaged by any Maintainer within 5 business days. Triage assigns:

- A severity label (Critical, High, Medium, Low)
- A type label (bug, proposal, toolchain, lab-environment, governance, etc.)
- An owner (assigned Maintainer or left unassigned for community pickup)
- A milestone (target release version) if the resolution is time-bound

### Stale Content Process

Issues and pull requests that have had no activity for 90 days are labeled `stale` by the CI system. After a further 14 days with no activity, they are closed with a note that they may be reopened. This does not apply to issues labeled `Critical` or `blocked`.

---

## 6. Conflict Resolution

Technical disagreements between contributors are resolved by the Maintainer assigned to the relevant domain, with escalation to the Maintainer Council if the disagreement persists after one substantive exchange.

Interpersonal disputes are handled under CODE_OF_CONDUCT.md.

Disagreements about governance process — what this document requires — are resolved by the Maintainer Council with a written decision posted to the relevant GitHub Discussion.

---

## 7. Transparency and Record-Keeping

All significant and emergency decisions are recorded in the repository:

- Significant decisions: in the GitHub Discussion thread where the decision was made
- Emergency decisions: in a dedicated GitHub Issue opened within 24 hours of the decision
- Role changes: in MAINTAINERS.md with the date of appointment or removal

The decision record is permanent and is not edited after the fact. If a decision is subsequently revisited, a new decision record is created; the original is preserved.

---

*Document version: 1.0 | NullByte Academy | 2026*

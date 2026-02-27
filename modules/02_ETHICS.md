# 03 — NullByte Academy: Ethics Framework

> *"The difference between a security researcher and an attacker is not capability — it is consent, intent, and accountability."*

---

## 1. Why This Document Exists

Ethics in security education is not a footnote. It is structural. The same knowledge that enables a practitioner to harden a system enables them to compromise one. That dual-use nature is not a problem to be solved — it is a property of the field to be managed through professional standards, institutional culture, and individual commitment.

This document defines the ethical framework that governs all activity conducted under the NullByte Academy name: curriculum, research, lab work, published advisories, and public communications. It is not advisory. It is binding on students, instructors, and contributors alike.

---

## 2. Core Ethical Principles

### 2.1 Authorization is Non-Negotiable

No security testing, probing, scanning, or analysis of any system occurs without explicit, documented authorization from the system's owner. This applies regardless of:

- Whether the system appears to be a test or development environment
- Whether the system's owner is known to the practitioner
- Whether the activity is passive (observation) or active (interaction)
- Whether the practitioner believes the activity will cause no harm

The legal framework here is not ambiguous. In most jurisdictions, unauthorized access to computer systems is a criminal offense regardless of intent. More importantly, unauthorized testing is an ethical violation regardless of legality. NullByte Academy does not distinguish between "technically legal" and "ethically permissible." Authorization is the threshold for both.

### 2.2 Scope Defines Boundaries

Where authorization exists, it is bounded by scope. Testing that extends beyond defined scope — even accidentally — must be stopped, documented, and reported to the authorizing party. Scope creep in security testing has caused real harm to real organizations. It is not a technicality.

```
Authorization Scope Model:

  ┌─────────────────────────────────┐
  │       Authorized Scope          │
  │  ┌───────────────────────────┐  │
  │  │    Active Testing Zone    │  │
  │  │  (enumerate, probe, test) │  │
  │  └───────────────────────────┘  │
  │                                 │
  │  Out-of-scope: observe only,    │
  │  report, do not probe           │
  └─────────────────────────────────┘

  Beyond boundary: STOP. Document. Report.
```

### 2.3 Minimize Impact

Authorized testing must be conducted with minimum necessary impact on the target system and its users. This means:

- Preferring passive analysis over active probing where possible
- Scheduling resource-intensive testing during low-traffic windows
- Maintaining the ability to roll back any changes made during testing
- Stopping immediately if unexpected production impact is observed

### 2.4 Data Handling

Security assessments often expose sensitive data: credentials, personally identifiable information, proprietary business logic, health records, financial data. That data is not a trophy. It is evidence that the system has a problem. It must be:

- Handled under confidentiality obligations
- Stored only as long as necessary to document the finding
- Excluded from any public disclosure
- Destroyed securely after the engagement concludes

Students who encounter sensitive data during lab exercises — even in intentionally vulnerable training environments — should treat it as they would real data and not share, store, or publish it.

---

## 3. Responsible Disclosure

NullByte Academy adopts the coordinated disclosure model for any vulnerability research conducted under its banner. The process is as follows:

| Phase | Action | Timeline |
|-------|--------|----------|
| Discovery | Document finding, assess impact | Day 0 |
| Initial Contact | Notify vendor/maintainer via secure channel | Day 1–3 |
| Acknowledgment | Confirm receipt with vendor | Day 3–7 |
| Coordination | Work with vendor on severity, timeline | Day 7–14 |
| Patch Development | Vendor develops fix | Variable |
| Public Disclosure | Publish advisory after patch available | 90 days default |
| Extension | Negotiate extension only for complex, critical issues | +30–45 days max |

**If a vendor is unresponsive** after two documented contact attempts over 30 days, the research team notifies the curriculum ethics board, which reviews whether and how to proceed with limited disclosure.

**If a vulnerability poses immediate risk to critical infrastructure**, the ethics board is notified immediately and the standard timeline is suspended in favor of emergency coordination with CISA or relevant national CERT.

---

## 4. What NullByte Academy Does Not Do

This section is explicit. Some constraints need to be stated directly.

NullByte Academy does not:

- Develop, publish, or distribute functional exploit code intended for use against production systems
- Conduct offensive security operations against any system without documented authorization
- Train students on techniques whose primary application is criminal activity
- Accept research funding from parties seeking operational capabilities against specific targets
- Publish vulnerability details that enable exploitation before a fix is available, except in extraordinary circumstances reviewed by the ethics board
- Assist law enforcement or intelligence agencies in offensive operations, regardless of stated justification

This is not political. It is professional. The security research community depends on the trust of system owners, vendors, and the public. That trust is maintained through consistent, principled behavior across the community.

---

## 5. Legal Frameworks Students Must Know

Security practitioners operate across legal jurisdictions. Students should have working familiarity with:

**United States**
- Computer Fraud and Abuse Act (CFAA) — the primary federal statute on unauthorized computer access
- Electronic Communications Privacy Act (ECPA) — governs interception of communications
- State computer crime statutes — vary significantly, often broader than CFAA

**European Union**
- Directive on Attacks Against Information Systems (2013/40/EU)
- GDPR Articles 32–34 — security obligations and breach notification
- National implementations vary by member state

**International**
- Budapest Convention on Cybercrime — ratified by 65+ nations, harmonizes basic definitions
- Local laws govern local practitioners — research jurisdiction before engaging

This is not legal advice. NullByte Academy strongly recommends that students engaged in professional security work maintain a relationship with legal counsel familiar with technology law in their operating jurisdictions.

---

## 6. Student Conduct Standards

Every student at NullByte Academy agrees to the following at enrollment and periodically thereafter:

1. I will not access any system without explicit authorization
2. I will not use knowledge or tools acquired through the academy to harm individuals, organizations, or infrastructure
3. I will report vulnerabilities I discover in non-lab systems through responsible disclosure
4. I will handle sensitive data encountered during security work with confidentiality and care
5. I will represent my skills, credentials, and findings honestly
6. I will support the professional development of other practitioners without gatekeeping or exploitation

Violations of these standards result in immediate suspension pending ethics board review. Serious violations result in permanent termination of enrollment and may be referred to relevant authorities.

---

## 7. The Harder Cases

Some situations resist simple rules. A few of the harder cases:

**Bug bounty programs**: Generally permissible under program terms. Scope, rules of engagement, and safe harbor provisions must be reviewed before testing begins. "Public bug bounty" does not mean "everything on the internet."

**Vulnerability research on abandoned software**: No vendor to notify does not mean no ethical obligation. Consider downstream impact, publish defensively-framed advisories, and coordinate with package maintainers and security community channels (e.g., oss-security mailing list).

**Finding vulnerabilities in systems you own but others use**: A self-hosted application that serves external users is not an isolated system. Testing must account for the rights and data of those users.

**Academic research**: IRB oversight, institutional policies, and coordinated disclosure still apply. "For research purposes" is not an ethical waiver.

---

*This document is reviewed annually by the NullByte Academy Ethics Board. Questions and submissions: mrwhite4939@gmail.com*

*Document version: 1.0 | Last reviewed: 2026-Q1*

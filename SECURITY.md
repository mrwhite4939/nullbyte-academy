# Security Policy — NullByte Academy

## Overview

NullByte Academy is an educational cybersecurity research platform. This document defines how security issues in the platform itself should be reported, how responsible disclosure works for any vulnerabilities discovered through our curriculum, and what conduct is expected from all students, contributors, and users.

---

## Reporting Security Issues in This Platform

If you discover a security vulnerability in the NullByte Academy platform, web frontend, or any code distributed as part of this repository, we ask that you report it responsibly using the process below.

**Do not open a public GitHub issue for security vulnerabilities.** Public disclosure before a fix is available exposes all users to unnecessary risk.

### Contact

**Primary Security Contact:** `mrwhite4939@gmail.com`

**Subject Line Format:**
```
[SECURITY] NullByte Academy — [Brief Description]
```

### What to Include in Your Report

A complete report should contain the following information to allow us to reproduce and assess the issue accurately:

- A clear description of the vulnerability and its potential impact
- The component or file(s) affected (e.g., frontend route, API endpoint, lab environment configuration)
- Step-by-step reproduction instructions using only permissioned, controlled environments
- Any proof-of-concept that demonstrates the issue (conceptual description is acceptable — functional exploit code is not required and should not be included)
- Your assessment of severity (Critical / High / Medium / Low) with rationale
- Your contact information for follow-up

---

## Responsible Disclosure Timeline

We are committed to responding promptly and transparently. The following timelines govern our process:

| Stage | Target Timeframe |
|-------|-----------------|
| **Acknowledgement** | Within 48 hours of receipt |
| **Initial assessment** | Within 5 business days |
| **Status update** | Within 10 business days |
| **Fix development** | Within 30 days for Critical/High severity |
| **Fix development** | Within 60 days for Medium/Low severity |
| **Public disclosure** | Coordinated with reporter after fix is deployed |

We will keep you informed at each stage. If our timeline cannot be met for any reason, we will communicate that delay and explain the reason.

If we do not respond within 48 hours of your report, please follow up directly to the same address with "FOLLOW UP" in the subject line.

---

## Scope

### In Scope

The following are valid targets for security research reporting:

- The NullByte Academy web frontend and any associated API endpoints
- Authentication or authorization logic in the platform
- Lab environment configurations that expose unintended attack surface
- Dependency vulnerabilities in project dependencies (via `npm audit` or equivalent)
- Documentation errors that could lead students to take unsafe actions

### Out of Scope

The following are explicitly out of scope:

- Social engineering attacks against contributors or maintainers
- Physical attacks against infrastructure
- Denial-of-service attacks against hosted infrastructure
- Attacks against third-party services integrated with the platform
- Vulnerabilities in purpose-built vulnerable lab binaries — these are intentionally constructed training targets

---

## Responsible Research Conduct

All users, students, and contributors engaging with NullByte Academy content must adhere to the following conduct standards.

### Permissioned Environments Only

Every lab exercise in NullByte Academy is designed to operate in isolated, permissioned virtual environments. Students must conduct all technical exercises exclusively on:

- The provided VM lab templates
- Their own locally controlled hardware and software
- Systems for which they hold explicit written authorization

**Performing any technique taught in this curriculum against systems you do not own or have explicit authorization to test is illegal in most jurisdictions and is a direct violation of this policy.**

### No Operational Weaponization

Concepts taught in this curriculum are presented to develop defensive understanding. Students and contributors must not:

- Construct functional weaponized payloads based on concepts presented here
- Combine theoretical knowledge from this curriculum into operational attack chains targeting real systems
- Share derivative work that crosses from educational theory into operational attack tooling

### Data Handling

Lab exercises do not involve real user data. Students must not introduce real personally identifiable information, authentication credentials, or proprietary data into lab environments.

---

## Contributor Security Guidelines

Contributors submitting pull requests or new educational content must ensure:

- No functional shellcode, payload code, or exploit primitives are included in submissions
- All code examples are clearly scoped to educational illustration and are not operationally functional attack tools
- New dependencies are reviewed with `npm audit` or equivalent before submission
- Lab environment configurations are reviewed for unintended external exposure

---

## Legal Notice

Security research conducted within the scope and guidelines described in this document, on permissioned targets only, is welcomed and appreciated. NullByte Academy will not pursue legal action against researchers who follow this responsible disclosure process in good faith.

Conduct that falls outside this scope — including unauthorized testing of external systems, operational weaponization of curriculum concepts, or refusal to follow coordinated disclosure — is not covered by this policy and may expose the individual to legal liability under the Computer Fraud and Abuse Act (CFAA), the Computer Misuse Act (CMA), or equivalent legislation in their jurisdiction.

---

*Last updated: 2026 | NullByte Academy*

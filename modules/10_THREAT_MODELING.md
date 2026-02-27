# 09 — NullByte Academy: Threat Modeling

> *"Threat modeling is the practice of asking 'what could go wrong?' before something goes wrong — and then doing something about the answers."*

---

## 1. What Threat Modeling Is (and Isn't)

Threat modeling is a structured process for identifying security threats to a system, evaluating their likelihood and impact, and determining which mitigations are worth the engineering cost. Done well, it is the most cost-effective security activity an organization can perform — because it happens before a line of code is written, when architectural changes are cheap.

Threat modeling is not a compliance activity. Completing a threat model document to satisfy an audit requirement is not threat modeling — it is theater. Real threat modeling produces decisions: design changes, additional controls, accepted risks with documented rationale. If a threat modeling session ends without any decisions, the session was not a threat model. It was a meeting.

It is also not a one-time activity. Systems evolve. New components are added, trust boundaries shift, third-party dependencies change. Threat models should be living documents, updated when the system changes and reviewed on a regular cadence regardless.

---

## 2. The Four Core Questions

Every threat modeling methodology, regardless of framework, answers the same four questions. The frameworks differ in how they structure the answers.

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  1. WHAT ARE WE BUILDING?                                │
│     → System model: components, data flows, boundaries  │
│                                                          │
│  2. WHAT CAN GO WRONG?                                   │
│     → Threat enumeration: attacker goals, attack paths  │
│                                                          │
│  3. WHAT ARE WE DOING ABOUT IT?                          │
│     → Mitigations: controls, architectural changes      │
│                                                          │
│  4. DID WE DO A GOOD JOB?                                │
│     → Validation: review, testing, residual risk        │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

The order is not arbitrary. You cannot enumerate threats to a system you have not modeled. You cannot evaluate mitigations without first understanding the threats. And you cannot validate your work without testing it against both the threats and the mitigations.

---

## 3. System Modeling: Data Flow Diagrams

The primary artifact for the "What are we building?" phase is the Data Flow Diagram (DFD). A DFD represents the system in terms of actors, processes, data stores, and the data flows between them. Trust boundaries — the lines where data or control crosses from one security context to another — are explicitly marked.

```
DFD Notation:

  [External Entity]    ← Actor outside system control (user, third-party API)
  ( Process )          ← System component that transforms data
  =Data Store=         ← Persistent storage
  ─────────────►       ← Data flow
  ═══════════════      ← Trust boundary

Example: Simplified Web Application

  [User Browser]
        │  HTTPS request
        ▼ ════════════════════════════════ (Internet boundary)
  ( Load Balancer )
        │  Internal HTTP
        ▼ ════════════════════════════════ (DMZ boundary)
  ( Application Server )
        │  DB query          │  Cache query
        ▼                    ▼
  =PostgreSQL DB=      =Redis Cache=
  ════════════════════════════════════════ (Data tier boundary)
```

The trust boundaries are where threat modeling attention concentrates. Data crossing a boundary is data that was produced in a different security context — it must be treated as potentially hostile.

---

## 4. Threat Enumeration with STRIDE

STRIDE is a mnemonic framework for systematically enumerating threats. It is applied per element in the DFD — particularly per data flow and per trust boundary crossing.

| STRIDE Category | Description | Violated Property | Example |
|----------------|-------------|-------------------|---------|
| **Spoofing** | Claiming a false identity | Authentication | Forging JWT issuer claim |
| **Tampering** | Modifying data in transit or at rest | Integrity | SQL injection into a query |
| **Repudiation** | Denying an action occurred | Non-repudiation | Deleting audit log entries |
| **Information Disclosure** | Exposing data to unauthorized parties | Confidentiality | Error messages leaking stack traces |
| **Denial of Service** | Degrading or eliminating availability | Availability | Slow-loris HTTP attack |
| **Elevation of Privilege** | Gaining capabilities beyond authorization | Authorization | IDOR allowing account takeover |

Working through STRIDE for each DFD element is not glamorous work. It is systematic, sometimes tedious, and essential. The goal is completeness — not finding the clever attacks, but not missing the obvious ones.

---

## 5. Attack Trees

For high-priority threats, attack trees provide a structured way to reason about how an attacker might achieve a goal through multiple paths.

```
Attack Goal: Exfiltrate Customer Payment Data
│
├── AND ─ Gain access to database tier
│         ├── SQL injection via application layer
│         ├── Compromise application server credentials
│         └── OR ─ Exploit misconfigured DB network access
│
├── OR ─ Intercept data in transit
│        ├── TLS downgrade attack
│        └── Compromise load balancer TLS termination
│
└── OR ─ Access backups
         ├── S3 bucket misconfiguration
         └── Compromise backup service credentials
```

Attack trees are most useful when prioritizing which mitigations matter most. A goal that can be achieved through many OR paths is harder to defend than one that requires multiple AND conditions. The tree makes this structure explicit.

---

## 6. Risk Evaluation

Not all threats are equal. Risk evaluation assigns priority to threats based on two dimensions: likelihood and impact. Several scoring approaches are in use:

**DREAD** (Microsoft, now largely deprecated for CVSS but useful for rapid relative scoring):

| Dimension | Question |
|-----------|----------|
| Damage | How bad is the worst-case outcome? |
| Reproducibility | How reliably can this be triggered? |
| Exploitability | How much skill does exploitation require? |
| Affected Users | How many users are impacted? |
| Discoverability | How easy is the vulnerability to find? |

**CVSS v3.1** for individual vulnerability scoring once specific vulnerabilities are identified.

**Risk matrix** for portfolio prioritization:

```
Impact
  │
H │     ●        ●●
  │        ●
M │  ●       ●
  │
L │     ●
  └────────────────── Likelihood
     L    M    H

● = Individual threats, mapped by assessment
High impact + High likelihood = Mitigate immediately
Low impact + Low likelihood = Accept or defer
```

---

## 7. Mitigation Selection

For each high-priority threat, the threat model specifies a mitigation. Mitigations fall into four categories:

- **Redesign**: Architectural change that eliminates the threat root cause (preferred when feasible)
- **Control**: Additional mechanism that prevents or detects exploitation (input validation, authentication enforcement, logging)
- **Transfer**: Move the risk to another party (third-party authentication, cyber insurance)
- **Accept**: Document the risk and the rationale for non-remediation (appropriate for low-severity, high-cost-to-fix items)

Every accepted risk must be explicitly documented with a rationale and an owner. "We didn't get to it" is not an accepted risk. "The likelihood is low, the impact is contained to X, and the remediation cost is disproportionate to the risk; this is reviewed quarterly" is an accepted risk.

---

## 8. Threat Modeling in the SDLC

```
Development Phase:     Threat Modeling Activity:
─────────────────────────────────────────────────────
Requirements           Initial threat model: identify sensitive assets,
                       external actors, high-level data flows

Architecture           Full DFD + STRIDE analysis, attack trees for
                       high-priority goals, architectural mitigations

Implementation         Review implementation against threat model;
                       update model for design changes

Testing                Validate mitigations with security testing;
                       document residual risk

Deployment             Review deployment configuration against model;
                       update for infrastructure changes

Operations             Periodic review; update when system changes
```

---

## 9. Common Failure Modes

**Scope creep in the DFD.** A DFD that tries to represent the entire system at once becomes too complex to reason about. Scope threat models to specific features, data flows, or subsystems. Multiple smaller threat models are more useful than one enormous one.

**Treating threat modeling as a document exercise.** The DFD and STRIDE tables are artifacts. The value is in the discussion that produces them and the decisions that follow. If the threat modeling output does not drive at least one design change or control decision, the process failed.

**STRIDE applied mechanically without domain knowledge.** STRIDE provides categories, not answers. "Spoofing" applied to a given data flow requires knowing what authentication mechanism is in use, what its weaknesses are, and what an attacker could accomplish by bypassing it. Domain knowledge fills in what the framework cannot.

**Never updating the model.** A threat model for a system that no longer resembles the modeled design is worse than no threat model — it provides false confidence.

---

*Document version: 1.0 | NullByte Academy Curriculum Committee*

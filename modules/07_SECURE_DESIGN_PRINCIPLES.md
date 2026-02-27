# 08 — NullByte Academy: Secure Design Principles

> *"Security is not a feature. It is a property of the architecture — and like all architectural properties, it must be designed in, not bolted on."*

---

## 1. Why Design Principles Matter

Most security failures in deployed software are not caused by unknown vulnerability classes. They are caused by known classes applied to systems that were not designed with their existence in mind. SQL injection has been understood since the 1990s. It remains among the most common vulnerability types today — not because developers don't know about it, but because systems continue to be built without structural defenses against it.

Secure design principles are the architectural-level commitments that make entire classes of vulnerability difficult or structurally impossible. They do not eliminate all risk, but they change the character of the risk — from systemic and architectural to residual and specific.

This document covers the principles that NullByte Academy considers foundational for any practitioner engaged in designing or reviewing systems. Understanding these principles is required at Tier 4; applying them in design reviews is the primary assessment method for NB-400 through NB-403.

---

## 2. The Saltzer and Schroeder Principles

The field's most durable foundation was laid by Saltzer and Schroeder in their 1975 paper on protection mechanisms. Five decades later, every principle they articulated remains directly applicable to modern system design.

### 2.1 Economy of Mechanism

Systems should be as simple as possible. Complexity is the enemy of security because complex systems have larger attack surfaces, more unexpected interactions between components, and harder-to-reason security properties.

This does not mean systems should be primitive. It means unnecessary complexity — abstractions that exist for historical reasons, codepaths that handle edge cases no longer encountered, interfaces that duplicate functionality — should be removed. Every line of code is a line that could contain a bug.

```
Complexity vs. Attack Surface Relationship:

  Attack
  Surface
    │                           ●  (highly complex system)
    │                      ●
    │                 ●
    │            ●
    │       ●
    │  ●
    └──────────────────────────────────── Complexity
         ↑
    Simple, minimal system = smallest defensible surface
```

### 2.2 Fail-Safe Defaults

The default condition of a system should be denial. Access should be granted explicitly, not assumed. This principle is violated whenever a system's default posture is "allow unless specifically denied" — an approach that relies on the completeness of a deny list, which is inherently fragile.

In code, this translates to explicit allowlisting over blocklisting, explicit capability grants over ambient authority, and returning errors rather than partial results when security checks fail.

### 2.3 Complete Mediation

Every access to every resource should be checked against the authorization policy, every time. Caching the result of a security check and reusing it without re-validation violates this principle and can lead to TOCTOU (time-of-check-to-time-of-use) vulnerabilities.

```
Correct Mediation Flow:

  Request → [Auth Check] → [Resource Access] → Response
               │
               ▼
          Every time.
          No cached decisions.
          No bypassed paths.

Incorrect:

  Request → [Auth Check (once)] ──cached──► [Resource Access] → Response
                                               │
                                    No re-check on subsequent requests.
                                    State change between check and use
                                    is not detected.
```

### 2.4 Separation of Privilege

A system should require more than one condition to be satisfied before granting access to sensitive operations. Multi-factor authentication is the most familiar instance of this principle — a credential alone is insufficient. The principle generalizes: critical operations should require convergence of multiple independent authorities.

### 2.5 Least Privilege

Every component of a system should operate with the minimum set of permissions required to perform its function — no more. This limits the blast radius of a compromise. A component running with root privileges that is compromised gives an attacker root. The same component running with a minimal capability set gives an attacker almost nothing beyond that component's own function.

### 2.6 Least Common Mechanism

Mechanisms shared between components (shared memory, shared filesystems, shared databases) are channels through which information and influence can flow unintentionally. Where possible, separate components should have separate mechanisms. This limits lateral movement and reduces the impact of one component's compromise on others.

### 2.7 Open Design

Security should not depend on the secrecy of the design. A system that is secure only because an attacker doesn't know how it works is not secure — it is obscure. When the design becomes known (and eventually, designs always do), the security collapses. Robust systems are secure against attackers who know the design completely.

This is distinct from keeping specific secrets (cryptographic keys, credentials) secret. The *algorithm* should be public; the *key* should be private. Kerckhoffs's principle applies.

---

## 3. Modern Principles for Contemporary Systems

The Saltzer-Schroeder principles apply at the component level. Modern distributed systems require additional architectural commitments.

### 3.1 Zero Trust Architecture

Zero Trust rejects the perimeter model — the assumption that everything inside the network boundary is trustworthy. In a Zero Trust architecture, every request is authenticated and authorized regardless of network origin. Trust is never implicit; it is always evaluated.

```
Perimeter Model (Legacy):               Zero Trust Model:

  ┌─────────────────────────┐           Every request evaluated:
  │  TRUSTED ZONE           │
  │  ┌──────┐  ┌──────┐    │           Client → [Identity Verify]
  │  │Svc A │→ │Svc B │    │                         │
  │  └──────┘  └──────┘    │                   [Device Verify]
  └────────────┬────────────┘                         │
               │ firewall                       [Context Evaluate]
  ┌────────────▼────────────┐                         │
  │   UNTRUSTED ZONE        │                   [Access Grant]
  └─────────────────────────┘
```

### 3.2 Defense in Depth

No single control is perfect. Defense in depth layers controls so that an attacker who defeats one layer faces another. The layers must be genuinely independent — controls that share a common dependency fail together and provide only the illusion of depth.

Effective layering in a typical web application:

| Layer | Control | What It Stops |
|-------|---------|---------------|
| Network | WAF, rate limiting | Volumetric attacks, known-bad patterns |
| Application | Input validation, parameterized queries | Injection, malformed input |
| Data | Encryption at rest, column-level access | Data theft via storage compromise |
| Identity | MFA, session management | Credential-based attacks |
| Detection | Logging, alerting, SIEM | Post-breach identification and response |

### 3.3 Secure by Default, Secure by Design

"Secure by default" means the system ships in a secure configuration. Features that reduce security are opt-in, not opt-out. "Secure by design" means the architecture makes insecure states structurally difficult or impossible — not just administratively discouraged.

The distinction matters. A system that is secure by default but not by design can be misconfigured into an insecure state. A system that is secure by design cannot.

---

## 4. Memory Safety as an Architectural Decision

Memory unsafety is not a bug class — it is an architectural property. A system written in C or C++ will, over its lifetime, contain memory safety vulnerabilities. This is not a criticism of C; it is a statement of the language's design tradeoffs.

Architectural choices that address this systematically:

- **Language selection**: Rust, Go, and other memory-safe languages eliminate entire vulnerability classes at the language level
- **Compartmentalization**: Isolating memory-unsafe components (sandboxing, separate processes, capability-limited contexts) limits blast radius
- **Compiler mitigations**: ASLR, stack canaries, CFI, and sanitizers reduce exploitability of vulnerabilities that do exist
- **Fuzzing as CI**: Continuous fuzzing catches memory safety issues before deployment

The goal is not to make memory corruption unthinkable. It is to make its consequences limited and its discovery rapid.

---

## 5. Design Review Methodology

NullByte Academy Tier 4 students apply these principles in structured design reviews. The review process:

1. **Obtain or reconstruct a system design document** including data flows, trust boundaries, and component inventories
2. **Apply each Saltzer-Schroeder principle** as a lens: does the design violate any of them?
3. **Map the threat model** to the design (using STRIDE per data flow and boundary)
4. **Identify architectural mitigations** for identified threats — not tactical patches but structural changes
5. **Produce a prioritized finding report** with severity, architectural root cause, and recommended design change

A finding without an architectural recommendation is an observation, not a review. The value of a design review is in the recommendations.

---

*Document version: 1.0 | NullByte Academy Curriculum Committee*

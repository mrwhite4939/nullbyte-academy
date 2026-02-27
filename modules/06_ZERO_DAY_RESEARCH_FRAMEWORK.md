# 07 — NullByte Academy: Zero-Day Research Framework

> *"A zero-day is not magic. It is the consequence of an assumption that was never questioned."*

---

## 1. What This Document Is

This framework defines how NullByte Academy structures, governs, and supports original vulnerability research. It is not an operational guide for finding exploits. It is an intellectual and methodological map for practitioners who want to contribute to the security community's understanding of why systems fail — and how to make them more resilient.

Zero-day research is the most demanding form of security work. It requires deep systems knowledge, creative thinking, disciplined methodology, and ethical clarity. The researchers who do it well are rare not because the skills are mystical, but because they require the simultaneous development of technical depth, analytical patience, and professional integrity. This framework is designed to build all three.

---

## 2. The Research Mindset

Most security practitioners learn to analyze known vulnerabilities. Zero-day researchers do something harder: they identify vulnerabilities in systems that have been reviewed, tested, and deployed with the assumption that they are correct.

The cognitive posture required is systematic skepticism. Every assumption made by a system's designer is a potential seam. The question a researcher asks is not "does this work?" — by definition it does, or it would not have shipped — but rather "under what conditions does this assumption fail?"

This translates into a specific analytical habit:

```
For any system component, ask:

  ┌─────────────────────────────────────────────────┐
  │  1. What does the designer assume about input?  │
  │  2. What does the designer assume about state?  │
  │  3. What does the designer assume about time?   │
  │  4. What does the designer assume about trust?  │
  └─────────────────────────────────────────────────┘
           │
           ▼
  Enumerate conditions where each
  assumption does NOT hold.
           │
           ▼
  Determine whether assumption failure
  causes a security-relevant effect.
```

Most assumption failures are benign. A subset produce crashes. A smaller subset produce security-relevant crashes. An even smaller subset produce controllable, security-relevant outcomes. The researcher's job is to traverse this funnel systematically.

---

## 3. Research Phases

### Phase 1 — Target Selection and Scoping

Research begins with a decision about what to study and why. Good targets share several properties: they are widely deployed, handle untrusted input, operate in a privileged context, and have not been recently subjected to intensive security review.

Target scoping produces a written research charter that defines:

- The component or subsystem under analysis (not an entire product)
- The threat model context: who would benefit from a vulnerability here?
- The research method: static analysis, fuzzing, protocol analysis, or differential testing
- The ethical and legal status: is this software open-source? Is there a bug bounty? What disclosure obligations apply?

Scoping matters because unfocused research produces unfocused results. A charter creates accountability — to the research, to the ethics board, and to the eventual disclosure process.

### Phase 2 — System Understanding

Before looking for what is wrong, understand what is right. This means reading documentation, studying the source if available, tracing code paths with a debugger, and building a mental model of the system's intended behavior.

```
System Modeling Process:

  Documentation → Data Flow Diagram → Trust Boundaries → State Machine
        │                │                  │                  │
        └────────────────┴──────────────────┴──────────────────┘
                                   │
                         ┌─────────▼─────────┐
                         │  Annotated Attack  │
                         │  Surface Map       │
                         └───────────────────┘
```

The output of Phase 2 is an annotated attack surface map: a structured document identifying every interface, every trust boundary, and every assumption the system makes about the data it processes.

### Phase 3 — Hypothesis Generation

Hypotheses are specific, falsifiable questions. "This function might be vulnerable" is not a hypothesis. "The length field in message type 0x03 is used to compute an allocation size without checking for integer overflow, which could result in an undersized allocation followed by a heap write beyond bounds" is a hypothesis.

Good hypotheses name the vulnerability class, the mechanism, and the expected effect. They are falsifiable because they make predictions that observation can confirm or deny.

### Phase 4 — Evidence Collection

This phase tests hypotheses. Methods depend on the target and the hypothesis:

| Hypothesis Type | Primary Method | Supporting Method |
|----------------|---------------|-------------------|
| Memory corruption | Fuzzing with sanitizers | Manual code review |
| Logic flaw | Differential testing | State machine enumeration |
| Integer error | Static analysis (pattern matching) | Symbolic execution |
| Race condition | Concurrency testing | Dynamic tracing |
| Cryptographic weakness | Mathematical analysis | Implementation review |

Evidence collection is disciplined. Researchers document what they tested, what they found, and what they did not find. Negative results matter — they constrain the hypothesis space for future work.

### Phase 5 — Impact Analysis

Finding a crash is not finding a vulnerability. Impact analysis answers the question: what can an attacker actually accomplish by triggering this condition?

The analysis considers:

- **Controlability**: Can the input that triggers the condition be controlled by an attacker?
- **Reliability**: Can the condition be triggered reliably, or only probabilistically?
- **Effect**: What is the security-relevant outcome — information disclosure, denial of service, code execution, privilege escalation?
- **Context**: What privilege level does the affected process run at? What data does it have access to?

Impact analysis produces a severity assessment using CVSS v3.1, annotated with qualitative context that a score alone cannot capture.

### Phase 6 — Responsible Disclosure

All research conducted under NullByte Academy follows the coordinated disclosure model defined in `03_ETHICS.md`. The disclosure package includes:

- A technical advisory in standard format (CVE description, affected versions, CVSS score, technical details, proof-of-concept description, recommended mitigation)
- A communication timeline log
- A patch validation assessment (once the vendor provides a fix)

The advisory is written for two audiences simultaneously: the vendor's engineering team (who need technical precision) and the security community (who need enough context to assess exposure and prioritize patching).

---

## 4. Research Anti-Patterns

These are the failure modes that distinguish amateur research from professional research:

**Confirmation bias in hypothesis testing.** Researchers who are convinced a component is vulnerable will find evidence for that belief even when it does not exist. Rigorous hypothesis testing requires actively trying to disprove your hypothesis, not just confirm it.

**Impact inflation.** Overstating severity damages credibility with vendors and the community alike. An information disclosure vulnerability is not a remote code execution vulnerability. Report what you found.

**Rushing to publication.** The pressure to publish is real. Disclosing before a patch is ready exposes real users to harm. The 90-day coordinated disclosure timeline exists for good reasons. Follow it.

**Treating PoC development as the goal.** A proof of concept demonstrates that a vulnerability is real. It is not the research — it is a communication tool. Researchers who optimize for PoC sophistication rather than understanding are solving the wrong problem.

---

## 5. Documentation Standards

Every NullByte Academy research project maintains a living research log with the following structure:

```
research/
├── charter.md          ← scope, target, method, ethical status
├── system-model.md     ← attack surface map, trust boundaries
├── hypotheses/
│   ├── H001.md         ← hypothesis, test method, result
│   └── H002.md
├── evidence/
│   ├── crashes/        ← sanitizer output, reproduction cases
│   └── analysis/       ← annotated disassembly, trace logs
├── impact-analysis.md  ← CVSS, qualitative assessment
└── advisory-draft.md   ← disclosure document
```

Documentation is not overhead. It is the research. A finding that cannot be explained in writing is a finding that has not been understood.

---

## 6. Mentorship and Review

All Research Division work at NullByte Academy operates under paired mentorship. Every student researcher is paired with a senior researcher who reviews hypotheses for rigor, impact assessments for accuracy, and disclosure drafts for clarity and completeness.

Peer review of security research serves the same function it does in every other scientific discipline: it catches errors, challenges assumptions, and improves quality before findings reach the community. The NullByte Academy research review process is not a gatekeeping mechanism — it is a quality mechanism. The distinction matters.

---

*Document version: 1.0 | Research Division contact: mrwhite4939@gmail.com*

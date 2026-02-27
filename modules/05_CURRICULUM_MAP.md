# 06 — NullByte Academy: Curriculum Map

> *"Depth before breadth. Fundamentals before techniques. Architecture before tooling."*

---

## 1. Overview

This document is the authoritative map of all instructional content offered at NullByte Academy. It defines the course catalog, the prerequisite graph, the expected duration at each tier, and the competency markers that gate progression. Students should read this document before beginning any coursework to understand where they are going and why the path is structured as it is.

The curriculum is deliberately sequential at the foundation layer and branching at the advanced layer. You cannot reason about binary exploitation without understanding memory models. You cannot design effective mitigations without understanding the vulnerability class you are mitigating. The ordering reflects those dependencies.

---

## 2. Progression Graph

```
                     ┌─────────────────────────┐
                     │   TIER 0: FOUNDATION    │
                     │  NB-000 through NB-004  │
                     └────────────┬────────────┘
                                  │ (all Tier 0 required)
                     ┌────────────▼────────────┐
                     │    TIER 1: SYSTEMS      │
                     │  NB-100 through NB-103  │
                     └────────────┬────────────┘
                                  │
                     ┌────────────▼────────────┐
                     │  TIER 2: VULNERABILITY  │
                     │  NB-200 through NB-204  │
                     └──────┬─────────┬────────┘
                            │         │
              ┌─────────────▼───┐  ┌──▼──────────────────┐
              │  TIER 3: REVERSE│  │ TIER 4: DEFENSIVE   │
              │   ENGINEERING   │  │   ARCHITECTURE      │
              │ NB-300 – NB-304 │  │ NB-400 – NB-403     │
              └────────┬────────┘  └──────────┬──────────┘
                       │                       │
              ┌────────▼───────────────────────▼──────────┐
              │         RESEARCH DIVISION (Tier R)        │
              │              NB-R01 – NB-R04              │
              └───────────────────────────────────────────┘
```

---

## 3. Tier 0 — Foundation

*Duration: 8–12 weeks | No prerequisites*

Tier 0 establishes the systems knowledge that every subsequent tier depends on. Students who skip or rush this layer consistently struggle at Tier 2 and above. The content is not simple — it covers operating systems internals, network protocols, and the C/assembly relationship at a depth most undergraduate programs do not reach.

| Course ID | Title | Duration | Key Topics |
|-----------|-------|----------|------------|
| NB-000 | Linux Internals and the Process Model | 2 weeks | Processes, threads, file descriptors, signals, /proc, syscall interface |
| NB-001 | Memory Architecture: From Silicon to Virtual | 2 weeks | Physical memory, MMU, paging, TLB, virtual address spaces |
| NB-002 | C Programming for Security Practitioners | 2 weeks | Pointers, memory management, undefined behavior, compiler behavior |
| NB-003 | x86-64 Assembly and the ABI | 2 weeks | Registers, calling conventions, stack discipline, instruction set |
| NB-004 | Networking Protocols: The Stack in Depth | 2 weeks | Ethernet, IP, TCP/UDP, DNS, TLS — protocol state machines |

### NB-001 Module: Virtual Memory Concept Map

```
Physical RAM
┌───────────────────────────────────────────────────────┐
│  Page Frame 0x00001  │  Page Frame 0x00002  │  ...    │
└───────────────────────────────────────────────────────┘
         ▲                       ▲
         │ mapped via page table │
┌────────┴───────────────────────┴────────┐
│          Process A Virtual Space        │
│  0x0000 [Text] → PF 0x00045           │
│  0x1000 [Data] → PF 0x00002           │
│  ...                                   │
│  0x7fff [Stack] → PF 0x01023          │
└─────────────────────────────────────────┘
         (process B has a separate mapping — isolation)
```

### Tier 0 Competency Gate

Students must demonstrate, without reference materials:
- Ability to trace a system call from userspace through the kernel interface
- Ability to read a simple C function and describe its stack frame layout
- Ability to decode a TCP handshake from a Wireshark capture and identify anomalies

---

## 4. Tier 1 — Systems Security

*Duration: 6–8 weeks | Prerequisites: All of Tier 0*

Tier 1 applies the systems knowledge from Tier 0 to the security domain. Students learn what happens when the properties of those systems are violated — and begin building the analytical vocabulary for vulnerability reasoning.

| Course ID | Title | Duration | Key Topics |
|-----------|-------|----------|------------|
| NB-100 | The Process Security Model | 2 weeks | UID/GID, capabilities, namespaces, seccomp, cgroups |
| NB-101 | Kernel-Userspace Trust Boundaries | 2 weeks | Syscall validation, kernel memory isolation, privilege rings |
| NB-102 | Cryptography: Foundations and Failures | 2 weeks | Symmetric/asymmetric primitives, secure channels, PKI, common misuse patterns |
| NB-103 | Network Security Architecture | 2 weeks | Perimeter models, TLS internals, DNS security, network-layer attacks |

---

## 5. Tier 2 — Vulnerability Theory

*Duration: 10–14 weeks | Prerequisites: All of Tier 1*

Tier 2 is the academic core of the curriculum. Students develop a rigorous, class-based understanding of software vulnerabilities: why they exist architecturally, how they manifest, and how they are mitigated. Every module is paired with a defensive analysis section of equal weight.

| Course ID | Title | Duration | Key Topics |
|-----------|-------|----------|------------|
| NB-200 | Memory Corruption: Stack | 2 weeks | Stack overflows, return address corruption, canaries, ASLR, NX |
| NB-201 | Memory Corruption: Heap | 3 weeks | Allocator internals, heap overflows, use-after-free, double-free, safe unlinking |
| NB-202 | Integer Errors and Type Safety | 2 weeks | Overflow, underflow, signedness, truncation, type confusion |
| NB-203 | Injection Vulnerabilities | 2 weeks | Command injection, SQL injection, format strings — all via input validation failures |
| NB-204 | Logic and Authentication Flaws | 3 weeks | State machine errors, TOCTOU, broken auth, session management, access control |

### NB-200 Concept: Return Address Corruption (Conceptual)

```
Normal Stack Frame:               Corrupted Stack Frame:
┌──────────────────┐             ┌──────────────────┐
│  Return Address  │             │  Attacker Value   │ ← points to attacker goal
├──────────────────┤             ├──────────────────┤
│  Saved RBP       │             │  (overwritten)    │
├──────────────────┤             ├──────────────────┤
│  local buffer    │             │ AAAAAAAAAAAAAAAA  │ ← write starts here
│  [64 bytes]      │ ← in-bounds │ AAAAAAAAAAAAAAAA  │   and exceeds bounds
└──────────────────┘             └──────────────────┘

The architecture permits this because C does not enforce
array bounds at runtime. The fix is not in C — it is in
using bounds-enforced APIs, compiler mitigations, or
memory-safe languages.
```

### Tier 2 Competency Gate

Students must be able to:
- Given a code snippet, identify the vulnerability class and the architectural reason for it
- Describe the mitigation stack for at least three vulnerability classes (e.g., stack overflow → canary + ASLR + NX + CFI)
- Produce a one-page threat model for a described system using STRIDE

---

## 6. Tier 3 — Reverse Engineering

*Duration: 10–12 weeks | Prerequisites: All of Tier 2*

Tier 3 develops the ability to analyze compiled software without source code. This is a core practitioner skill for vulnerability research, malware analysis, interoperability analysis, and forensic investigation.

| Course ID | Title | Duration | Key Topics |
|-----------|-------|----------|------------|
| NB-300 | Static Binary Analysis | 3 weeks | Disassembly, decompilation, IDA/Ghidra methodology, binary formats |
| NB-301 | Dynamic Instrumentation | 2 weeks | GDB/LLDB mastery, Frida, PIN, DynamoRIO |
| NB-302 | Compiler Artifacts and Optimization | 2 weeks | How compilers transform code, recognizing patterns in output |
| NB-303 | Protocol Reconstruction | 2 weeks | Inferring protocol structure from observed traffic and binary handlers |
| NB-304 | Firmware and Embedded Analysis | 3 weeks | Firmware extraction, RTOS internals, UART/JTAG, emulation with QEMU |

---

## 7. Tier 4 — Defensive Architecture

*Duration: 8–10 weeks | Prerequisites: All of Tier 2, Tier 1*

Tier 4 synthesizes the vulnerability knowledge from Tier 2 with systems design, producing practitioners who can design secure systems rather than merely assess existing ones.

| Course ID | Title | Duration | Key Topics |
|-----------|-------|----------|------------|
| NB-400 | Threat Modeling in Practice | 2 weeks | STRIDE, PASTA, Attack Trees, DFD construction, trust boundaries |
| NB-401 | Secure Software Development Lifecycle | 2 weeks | SSDLC integration, code review methodology, SAST/DAST pipeline |
| NB-402 | Hardening: OS, Runtime, and Network | 2 weeks | CIS benchmarks, kernel hardening, AppArmor/SELinux, network segmentation |
| NB-403 | Security Architecture Review | 4 weeks | Capstone: full architecture review of a provided system design |

---

## 8. Research Division (Tier R)

*Duration: Ongoing | Prerequisites: Tier 3 or Tier 4, Ethics Board clearance*

| Course ID | Title | Focus |
|-----------|-------|-------|
| NB-R01 | Vulnerability Research Methodology | Original research process, root cause analysis, writing advisories |
| NB-R02 | Fuzzer Development | Coverage-guided fuzzing, custom mutators, corpus management |
| NB-R03 | Defensive Tooling Development | Security tooling, detection engineering, YARA/Sigma rules |
| NB-R04 | Publication and Disclosure | Writing for academic and practitioner audiences, responsible disclosure |

---

## 9. Estimated Total Time to Graduation

| Path | Tiers Completed | Estimated Duration |
|------|----------------|-------------------|
| Core Certificate | 0, 1, 2 | 6–8 months |
| Reverse Engineering Specialist | 0, 1, 2, 3 | 10–12 months |
| Defensive Architect | 0, 1, 2, 4 | 9–11 months |
| Full Curriculum | 0, 1, 2, 3, 4 | 14–18 months |
| Research Division | 0–4 + Tier R | Ongoing |

Estimates assume approximately 20 hours per week of focused study. Practitioners with strong existing foundations in systems programming may be able to test out of Tier 0 modules through a competency assessment.

---

*Document version: 1.0 | Last reviewed: 2026-Q1 | Maintained by: NullByte Academy Curriculum Committee*

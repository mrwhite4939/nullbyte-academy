# 05 — NullByte Academy: Technical Glossary

> *"The beginning of wisdom is the definition of terms." — adapted from Socrates*

---

## Usage Notes

This glossary defines terminology as it is used at NullByte Academy. Many of these terms carry different meanings in different communities — "exploit," for example, is used loosely across the industry. Definitions here reflect precise, academically defensible usage. When a term has a common informal usage that differs from the definition here, the note field explains the discrepancy.

Entries are alphabetized. Cross-references appear as **→ Term**.

---

## A

**Address Space Layout Randomization (ASLR)**
A kernel-level mitigation that randomizes the base addresses of the stack, heap, and loaded libraries at process start time, increasing the difficulty of attacks that depend on predictable memory locations. ASLR does not prevent memory corruption — it increases the cost of exploiting it reliably.

```
Without ASLR:                    With ASLR:
Stack: always at 0x7fff0000     Stack: 0x7f3a2000 (randomized each run)
libc:  always at 0xb7400000     libc:  0xb62f1000 (randomized each run)
```

**Arbitrary Code Execution (ACE)**
A condition in which an attacker can cause a process to execute instructions of their choosing. Distinct from **→ Remote Code Execution** (which specifies the delivery vector) and **→ Privilege Escalation** (which addresses the context in which code executes).

**Attack Surface**
The sum of all points in a system where an unauthorized party could attempt to input data, extract data, or influence behavior. Reducing attack surface is a primary goal of secure architecture — every exposed interface is a potential entry point.

**Attack Tree**
A formal threat modeling structure representing the goal of an attacker (root node) decomposed into subgoals (child nodes), connected by AND/OR logic. Used in threat modeling to enumerate realistic attack paths and prioritize mitigations.

---

## B

**Buffer Overflow**
A memory corruption condition in which a write operation exceeds the bounds of its target buffer and overwrites adjacent memory. The adjacent memory may contain data, control structures, saved return addresses, or function pointers, depending on buffer location (stack, heap, static). *Note:* "Buffer overflow" describes the mechanism. The security-relevant effect is **→ Memory Corruption**.

**Binary Analysis**
The practice of examining compiled executable code without access to source code. Divided into **→ Static Analysis** (without executing the program) and **→ Dynamic Analysis** (with execution). Binary analysis is foundational to **→ Reverse Engineering**.

---

## C

**Call Stack**
The region of memory that maintains the execution context of active function calls in a program. Each function call pushes a **→ Stack Frame** onto the stack; each return removes one. The call stack grows from higher to lower addresses in most architectures.

```
Call Stack State (three functions deep):

  High ┌───────────────┐
       │  main() frame │
       ├───────────────┤
       │ process() frame│
       ├───────────────┤
       │ validate() frame│  ← RSP points here (current top)
  Low  └───────────────┘
```

**Common Vulnerability Scoring System (CVSS)**
A standardized framework for rating the severity of vulnerabilities across three metric groups: Base (intrinsic characteristics), Temporal (factors that change over time), and Environmental (organization-specific context). Scores range from 0.0 to 10.0. CVSS scores inform triage priority but should not be the sole determinant of remediation urgency.

**Control Flow Hijacking**
An attack class in which an attacker manipulates a program's execution path to redirect control to attacker-influenced code. Mechanisms include overwriting return addresses, function pointers, or C++ vtable entries. Mitigations include **→ Control Flow Integrity**.

**Control Flow Integrity (CFI)**
A mitigation technique that restricts valid control flow transfers to those that conform to a statically computed or dynamically maintained set of legitimate targets. Prevents many **→ Control Flow Hijacking** attacks by making invalid control transfers detectable at runtime.

**CVE (Common Vulnerabilities and Exposures)**
A public catalog maintained by MITRE assigning unique identifiers to publicly disclosed vulnerabilities. CVE entries provide a common reference point across tools, advisories, and discussions. The format is `CVE-YYYY-NNNNN`.

---

## D

**Data Execution Prevention (DEP) / NX (No-eXecute)**
A hardware and OS-level mitigation that marks memory regions as either executable or writable, but not both. Prevents attackers from injecting shellcode into data regions and executing it directly. Bypassed by **→ Return-Oriented Programming**, which reuses existing executable code.

**Defense in Depth**
An architectural principle that layers multiple independent security controls so that the failure of any single control does not result in complete compromise. Effective defense in depth requires that layers be genuinely independent — controls that share a common dependency fail together.

**Disassembly**
The process of translating machine code (binary instructions) back into assembly language mnemonics. Disassembly is imperfect for code with non-trivial control flow — distinguishing code from data in a flat binary is undecidable in the general case (Rice's theorem).

**Dynamic Analysis**
Analysis of software behavior during execution. Includes debugging, tracing, fuzzing, and dynamic instrumentation. Complementary to **→ Static Analysis** — each reveals information the other cannot.

---

## E

**Entropy**
In the context of security, a measure of unpredictability. High-entropy values (e.g., cryptographic keys, randomized addresses) are harder to guess. **→ ASLR** effectiveness depends on entropy — systems with insufficient entropy bits can be brute-forced.

**Exploit**
Code or a sequence of inputs designed to leverage a specific vulnerability to achieve an unauthorized outcome. Distinct from a **→ Proof-of-Concept**, which demonstrates existence of a vulnerability without necessarily achieving a useful attacker goal. *Note:* The term is frequently misused to mean "vulnerability" — these are not synonymous.

---

## F

**Fuzzing**
An automated testing technique that generates large volumes of invalid, unexpected, or random input to discover crashes, assertion failures, and unexpected behavior. Fuzzing is a primary method for discovering input validation vulnerabilities. Modern coverage-guided fuzzers (e.g., AFL++, libFuzzer) instrument the target to maximize code path exploration.

---

## H

**Heap**
A region of memory managed by the runtime allocator (e.g., malloc/free, new/delete) for dynamic allocation. Heap corruption vulnerabilities — use-after-free, heap overflow, double-free — arise from incorrect management of heap-allocated objects and their metadata.

**Heap Spray**
A technique for increasing the probability that a target memory region contains attacker-controlled data by allocating large numbers of objects at different addresses. A probabilistic approach; its effectiveness depends on heap layout predictability and available memory.

---

## I

**Integer Overflow**
A condition in which an arithmetic operation produces a result that exceeds the maximum value representable in the destination type, causing wrapping behavior. In security contexts, integer overflows frequently precede allocation size miscalculations, leading to **→ Buffer Overflow** conditions.

---

## M

**Memory Corruption**
The general class of vulnerabilities in which program data structures are modified in ways not intended by the program's logic. Includes buffer overflows, use-after-free, heap corruption, and format string vulnerabilities. Memory corruption is the leading source of critical vulnerabilities in native-code software.

**Memory Safety**
A property of programming languages or systems that guarantees programs cannot access memory outside their intended scope. Memory-safe languages (Rust, Go, Java) eliminate entire classes of vulnerabilities at the language level. C and C++ are not memory-safe by default.

---

## P

**Privilege Escalation**
A condition in which a process or user gains capabilities beyond those it was authorized to hold. Vertical escalation moves to a higher privilege level (user → root). Horizontal escalation moves to another account at the same privilege level.

**Proof-of-Concept (PoC)**
Code or a methodology that demonstrates a vulnerability exists and is exploitable, without necessarily being optimized for use against production systems. PoCs are standard components of responsible disclosure — they prove severity while limiting weaponization risk.

---

## R

**Return-Oriented Programming (ROP)**
A code-reuse attack technique that chains small sequences of existing executable code ("gadgets") ending in `RET` instructions to construct arbitrary computation without injecting new code. Bypasses **→ DEP/NX**. Mitigated by **→ Control Flow Integrity**.

**Reverse Engineering**
The practice of analyzing a system to understand its design, implementation, and behavior, working backward from the artifact to the concept. In software security, typically refers to binary analysis of compiled code.

---

## S

**Stack Canary**
A mitigation technique that places a sentinel value (the "canary") between local variables and the saved return address on the stack. Before a function returns, the canary value is checked; if it has been modified, the program terminates. Bypassed by techniques that leak the canary value or overwrite targets other than the return address.

```
Stack with Canary:

  ┌─────────────────┐
  │  Return Address │  ← attacker target
  ├─────────────────┤
  │  Stack Canary   │  ← sentinel value, checked on return
  ├─────────────────┤
  │  Local Buffer   │  ← overflow starts here
  └─────────────────┘
```

**Static Analysis**
Analysis of software without executing it. Includes reading source code, disassembly, decompilation, and automated scanning. Static analysis can reason about all possible execution paths but may produce false positives. Complementary to **→ Dynamic Analysis**.

**STRIDE**
A threat modeling framework developed at Microsoft. The acronym identifies six threat categories: **S**poofing identity, **T**ampering with data, **R**epudiation, **I**nformation disclosure, **D**enial of service, and **E**levation of privilege. STRIDE is applied per data flow and trust boundary in a system diagram.

---

## T

**Threat Modeling**
A structured process for identifying security threats, evaluating their likelihood and impact, and determining mitigations. Threat modeling is most valuable early in the design phase, when architectural changes are cheap. Common frameworks include STRIDE, PASTA, and Attack Trees.

**Type Confusion**
A vulnerability class in which a program accesses memory using a type that differs from the type with which the memory was allocated or initialized. Common in object-oriented programs with unsafe casting. Can lead to memory corruption or information disclosure depending on the type layout discrepancy.

---

## U

**Use-After-Free (UAF)**
A memory corruption vulnerability in which a program continues to use a pointer after the memory it references has been freed. If the freed memory is reallocated with attacker-controlled data, the dangling pointer provides a read or write primitive over that data.

---

## V

**Vulnerability**
A weakness in a system's design, implementation, or operation that can be leveraged to violate one or more of its security properties (confidentiality, integrity, availability). Distinct from a **→ Exploit** (which leverages the vulnerability) and a threat (which is a potential adverse event).

---

*Document version: 1.0 | Submissions and corrections: mrwhite4939@gmail.com*

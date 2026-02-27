# Lab 06 — Mitigation Modeling: Designing the Defensive Stack

**Track**: Tier 4 — Defensive Architecture
**Series**: Defensive Engineering
**Estimated Duration**: 4–5 hours
**Environment**: Linux VM, gcc, checksec, readelf, conceptual design exercises

---

## Learning Objectives

By the end of this lab, you should be able to:

1. Describe the complete mitigation stack for modern Linux binaries and explain each layer's mechanism
2. Evaluate a binary's mitigation posture using checksec and interpret its output
3. Explain what each mitigation protects against and, critically, what it does not protect against
4. Design a layered mitigation strategy for a described system component, justifying each layer
5. Articulate why mitigation depth — not any single control — is the appropriate defensive posture

---

## Conceptual Overview

Mitigations are security controls applied at the compiler, linker, kernel, or hardware level to reduce the exploitability of software vulnerabilities. They do not eliminate vulnerabilities. They raise the cost of exploitation by making reliable, attacker-controlled outcomes harder to achieve.

Understanding mitigations requires understanding two things equally: *what they protect* and *what they do not protect*. A practitioner who knows only that "ASLR randomizes addresses" has half the picture. The other half is the class of attacks that succeed despite ASLR — and what additional controls are required to address those.

### The Modern Linux Mitigation Stack

```
Mitigation Layers (x86-64 Linux):

  ┌─────────────────────────────────────────────────────────┐
  │  HARDWARE                                               │
  │  ┌────────────────────────────────────────────────┐    │
  │  │  NX/XD bit: page-level execute permission      │    │
  │  │  SMEP/SMAP: kernel cannot exec/access          │    │
  │  │             user pages directly                │    │
  │  └────────────────────────────────────────────────┘    │
  ├─────────────────────────────────────────────────────────┤
  │  KERNEL                                                 │
  │  ┌────────────────────────────────────────────────┐    │
  │  │  ASLR: randomize stack/heap/library base       │    │
  │  │  KASLR: randomize kernel image base            │    │
  │  │  seccomp: restrict available syscalls          │    │
  │  └────────────────────────────────────────────────┘    │
  ├─────────────────────────────────────────────────────────┤
  │  LINKER                                                 │
  │  ┌────────────────────────────────────────────────┐    │
  │  │  RELRO (full): make GOT read-only after init   │    │
  │  │  PIE: position-independent executable          │    │
  │  └────────────────────────────────────────────────┘    │
  ├─────────────────────────────────────────────────────────┤
  │  COMPILER                                               │
  │  ┌────────────────────────────────────────────────┐    │
  │  │  Stack canary (-fstack-protector-strong)        │    │
  │  │  CFI (-fsanitize=cfi): restrict indirect calls │    │
  │  │  SafeStack: separate stack for return addrs    │    │
  │  │  Fortify source: bounds-aware libc wrappers    │    │
  │  └────────────────────────────────────────────────┘    │
  └─────────────────────────────────────────────────────────┘
```

Each layer in this stack addresses a different mechanism or stage of a control-flow attack. The layers are not redundant — they are complementary. Removing any one layer exposes a gap that the others do not cover.

---

## Conceptual Exercises

### Exercise 1: Checksec Analysis and Interpretation

**Task**: Use `checksec` to analyze a binary. Interpret each field in the output. Then re-compile the same source with different flags and observe how the output changes.

```
checksec --file=./example_binary

Example Output:
  RELRO:       Full RELRO
  Stack:       Canary found
  NX:          NX enabled
  PIE:         PIE enabled
  RUNPATH:     No RUNPATH
  Fortify:     Fortified
  Fortified:   2 / 4
  Fortifiable: 4

Field-by-field interpretation:

  Full RELRO  → GOT is read-only after dynamic linking completes.
                Overwrites of GOT entries (classic libc hijack) are
                blocked by page permissions (SIGSEGV on write).
                Partial RELRO protects only .got.plt, not .got.

  Canary found → Stack protector is active. Function prologues
                 insert canary values; epilogues verify them.
                 Detects sequential stack overwrites that reach
                 the canary position.

  NX enabled  → Stack and heap are marked non-executable.
                Injected shellcode in data regions will SIGSEGV
                when the CPU tries to fetch instructions from it.

  PIE enabled → Executable itself is position-independent.
                ASLR can randomize the executable's base address,
                not just libraries. Without PIE, .text is at a
                fixed address regardless of ASLR.

  Fortify: 2/4 → 4 calls to fortifiable functions (e.g., strcpy,
                 memcpy) were found. 2 were compiled with bounds-
                 aware versions (_FORTIFY_SOURCE). The remaining 2
                 could not be fortified (often: dynamic length).
```

**Compilation matrix exercise**: Compile the same source with each flag combination below, run `checksec`, and document which features appear:

| gcc Flags | RELRO | Canary | NX | PIE |
|-----------|-------|--------|----|-----|
| (none) | Partial | No | Yes | No |
| `-fpie -pie` | Partial | No | Yes | Yes |
| `-fstack-protector` | Partial | Yes | Yes | No |
| `-fpie -pie -Wl,-z,relro,-z,now` | Full | No | Yes | Yes |
| All of the above combined | Full | Yes | Yes | Yes |

---

### Exercise 2: Mitigation Interaction Mapping

**Task**: For each attack primitive below, identify which mitigations prevent it, which mitigations do not prevent it, and what additional control would be needed.

```
Attack Primitive 1: Overwrite return address with fixed shellcode address
  Prevented by:   NX (shellcode in data region can't execute)
                  ASLR + PIE (attacker doesn't know the address)
  Not prevented by: Canary alone (canary detects, but not if bypassed)
  Residual risk:  Return-to-libc / ROP if NX is active

Attack Primitive 2: Return-Oriented Programming (ROP chain)
  Prevented by:   CFI (validates indirect call/return targets)
                  SafeStack (protects return addresses on separate stack)
  Not prevented by: NX (ROP reuses existing executable code)
                    ASLR (mitigates but doesn't prevent with info leak)
  Residual risk:  Information leak to defeat ASLR + CFI bypass

Attack Primitive 3: GOT overwrite (redirect library call)
  Prevented by:   Full RELRO (GOT is read-only, write → SIGSEGV)
  Not prevented by: Partial RELRO (only .got.plt protected)
  Residual risk:  Partial RELRO leaves .got writable

Attack Primitive 4: Use-after-free → type confusion
  Prevented by:   Memory-safe language (structural prevention)
                  Heap hardening (tcmalloc, hardened_malloc)
  Not prevented by: ASLR, NX, canary (none address UAF directly)
  Residual risk:  Requires language-level or allocator-level solution
```

**Design question**: For a system component handling attacker-supplied binary protocol data, recommend a mitigation stack, justifying each choice against the attack primitives above.

---

### Exercise 3: Designing a Mitigation Strategy for a Described Component

**Scenario**: You are reviewing the security posture of a network daemon written in C. It:
- Runs as a non-root user with no special capabilities after startup
- Accepts binary messages from untrusted clients over TCP
- Parses variable-length messages with a length-prefixed header
- Maintains a pool of pre-allocated session objects
- Calls into several third-party libraries for format parsing

**Task**: Design the mitigation stack for this daemon. For each layer, specify the control, its mechanism, and what it protects against.

```
Recommended Mitigation Stack:

  ┌─────────────────────────────────────────────────────────────┐
  │ PROCESS ISOLATION                                           │
  │  • Run as dedicated low-privilege user                      │
  │  • Drop capabilities immediately after binding port         │
  │  • Apply seccomp-bpf profile: allow only required syscalls  │
  │  → Limits: post-compromise lateral movement, privilege esc  │
  ├─────────────────────────────────────────────────────────────┤
  │ MEMORY SAFETY                                               │
  │  • Full RELRO + PIE                                         │
  │  • Stack canary (-fstack-protector-strong)                  │
  │  • NX (default on modern kernels)                           │
  │  • CFI for indirect calls and virtual dispatch              │
  │  → Limits: GOT overwrite, stack smashing, ROP, vtable abuse │
  ├─────────────────────────────────────────────────────────────┤
  │ HEAP HARDENING                                              │
  │  • Use hardened_malloc or equivalent (guard pages,          │
  │    randomized chunk placement, delayed free)                │
  │  → Limits: use-after-free exploitation, double-free,        │
  │            heap metadata corruption                         │
  ├─────────────────────────────────────────────────────────────┤
  │ INPUT HANDLING (code-level, not a binary mitigation)        │
  │  • Strict length validation at the protocol boundary        │
  │  • Maximum message size enforced before allocation          │
  │  • Separate parser runs in a sandboxed subprocess (if arch  │
  │    permits) — isolates third-party library attack surface   │
  │  → Limits: parser vulnerabilities, message injection        │
  ├─────────────────────────────────────────────────────────────┤
  │ OBSERVABILITY                                               │
  │  • Structured logging of anomalous input patterns           │
  │  • Crash telemetry → immediate alert                        │
  │  → Limits: attacker dwell time, enables rapid response      │
  └─────────────────────────────────────────────────────────────┘
```

**Analysis question**: Which layer of this stack would fail to protect against a vulnerability in the third-party format parser that allows reading 8 bytes beyond a heap allocation? What residual mitigation provides the next line of defense?

---

### Exercise 4: Evaluating Mitigation Coverage vs. Vulnerability Class

**Task**: Complete the following coverage matrix. For each cell, mark whether the mitigation provides Strong (S), Partial (P), or No (N) protection against that vulnerability class, and briefly explain why.

| Vulnerability Class | Canary | NX | ASLR+PIE | Full RELRO | CFI | Seccomp |
|--------------------|----|---|--------|---------|---|-------|
| Stack buffer overflow (ret addr) | S | P | P | N | P | N |
| Heap buffer overflow (data only) | N | N | P | N | N | N |
| Use-after-free → code exec | N | P | P | N | P | N |
| GOT overwrite | N | N | N | S | N | N |
| ROP chain | N | N | P | N | S | N |
| Arbitrary syscall after exploit | N | N | N | N | N | S |
| Format string read | N | N | P | N | N | N |

**Reflection**: Which vulnerability class has the weakest overall mitigation coverage? What architectural approach would address that gap most effectively? (Hint: consider the gap on the heap-buffer-overflow row — what mitigation type is entirely absent?)

---

## Summary of Key Learning Points

Mitigation modeling is the practice of thinking rigorously about both what controls provide and what they leave exposed. This lab established:

- **The mitigation stack is layered and complementary**, not redundant. NX addresses shellcode injection. ASLR addresses fixed-address assumptions. CFI addresses indirect control transfer. Canary addresses sequential stack overwrites. Each operates at a different layer and against a different attack mechanism.
- **Checksec provides a first-pass mitigation inventory**, but does not assess the strength or configuration of each mitigation. Full RELRO is categorically stronger than Partial RELRO; `checksec` reports both as "RELRO." Understanding the distinction requires reading what each mode actually protects.
- **No mitigation fully addresses heap use-after-free and heap type confusion** at the binary level. These vulnerability classes require language-level or allocator-level solutions — they are where memory-safe languages (Rust, Go) provide structural advantages that binary mitigations cannot replicate.
- **Seccomp is the last-resort process isolation boundary**. It does not prevent exploitation; it prevents a successful exploit from escalating into arbitrary system access. Its value is greatest when all other layers have failed.
- **Mitigation design is a cost-benefit analysis**. Some mitigations (PIE, full RELRO, canary) have negligible performance cost. Others (CFI, ASan) have measurable overhead. The design question is: what is the risk profile of this component, and what cost is appropriate to address it?

The final project will require you to apply this mitigation modeling capability to a real system design — justifying each control choice against a defined threat model. This lab is the conceptual foundation for that work.

---

*Lab 06 | NullByte Academy | Series: Defensive Engineering | mrwhite4939@gmail.com*

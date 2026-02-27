# 11 — NullByte Academy: Advanced Labs Overview

> *"Reading about memory corruption builds understanding. Watching a sanitizer catch it in a controlled environment builds intuition. Those are different things, and you need both."*

---

## 1. Philosophy of the Lab Environment

Labs at NullByte Academy are not CTF challenges. They are not designed to be solved in a single session, and they are not scored on speed. They are designed to build the kind of deep familiarity with system behavior that only comes from direct, deliberate, hands-on investigation.

The distinction matters because CTF-style labs optimize for finding the answer. NullByte labs optimize for understanding the system. A student who finds the vulnerability in an hour without understanding why it exists has learned less than a student who spends three hours building a mental model of the allocator behavior before the vulnerability becomes obvious. The second student will generalize. The first one won't.

All labs operate in isolated environments. No lab requires external network access. No lab involves real production software in a live context. Every lab is accompanied by a debrief guide that explains the intended learning outcomes and the conceptual model the student should have built by the time they complete it.

---

## 2. Lab Infrastructure

```
Lab Infrastructure Overview:

  ┌────────────────────────────────────────────────────┐
  │               Student Workstation                  │
  │  ┌──────────────────────────────────────────────┐  │
  │  │  Host OS (Linux recommended)                 │  │
  │  │  ┌─────────────────┐  ┌──────────────────┐  │  │
  │  │  │  Analysis VM     │  │  Target VM(s)    │  │  │
  │  │  │  • GDB/LLDB      │  │  • Intentionally │  │  │
  │  │  │  • Ghidra/IDA    │  │    vulnerable    │  │  │
  │  │  │  • Frida         │  │    software      │  │  │
  │  │  │  • Wireshark     │  │  • Sanitizer     │  │  │
  │  │  │  • AFL++         │  │    builds        │  │  │
  │  │  └─────────┬───────┘  └──────────────────┘  │  │
  │  │            │  Host-Only Network              │  │
  │  │            └────────────────────────────────┘  │  │
  │  └──────────────────────────────────────────────┘  │
  │                                                    │
  │  NO EXTERNAL NETWORK ACCESS FROM TARGET VMs        │
  └────────────────────────────────────────────────────┘
```

Students provision their lab environment from images maintained by the Academy. Images are versioned and pinned — a student working through a lab in 2026 sees the same environment a student used in 2025. Environmental consistency is a prerequisite for reproducible learning.

---

## 3. Lab Series Catalog

### Series 1 — Memory Internals (Tier 1)

These labs build direct intuition for how the process memory model works. No vulnerabilities are involved. The goal is the mental model.

| Lab | Title | Core Skill |
|-----|-------|------------|
| L1-01 | Walking the Process Map | Read /proc/<pid>/maps, correlate with binary sections |
| L1-02 | Stack Frame Inspection | Trace function calls with GDB, observe frame construction |
| L1-03 | Allocator Behavior | Instrument malloc/free, observe chunk headers, fragmentation |
| L1-04 | Signals and Stack Unwinding | Observe signal delivery, understand sigaltstack |

```
L1-02: Stack Frame Visualization Exercise

  GDB output at breakpoint inside inner_function():

  (gdb) info frame
  Stack level 0, frame at 0x7fffffffe490:
   rip = 0x55555555516a in inner_function
   called by frame at 0x7fffffffe4c0
   Arglist at 0x7fffffffe480, args: x=10
   Locals at 0x7fffffffe480

  (gdb) x/8gx $rbp-0x20
  0x7fffffffe470: [local_b]  [local_a]
  0x7fffffffe480: [saved_rbp][return_addr]

  Student task: draw this layout, then call one more
  function and observe how the diagram changes.
```

### Series 2 — Vulnerability Anatomy (Tier 2)

These labs present intentionally vulnerable programs in instrumented environments. Students observe vulnerability behavior through sanitizer output, debugger traces, and allocator instrumentation — not through functional exploitation.

| Lab | Title | Vulnerability Class | Instrumentation |
|-----|-------|--------------------|-|
| L2-01 | The Overreaching Copy | Stack buffer overflow | ASan + GDB |
| L2-02 | The Integer Trap | Integer overflow → heap underallocation | ASan + custom allocator logging |
| L2-03 | Life After Free | Use-after-free | ASan + Valgrind |
| L2-04 | The Format Mirror | Format string read primitive | Manual trace |
| L2-05 | The Race | TOCTOU in file operation | Helgrind + strace |

```
L2-03 Lab Workflow:

  ┌─────────────────────────────────────────────────────┐
  │  PHASE 1: Read the source code                     │
  │  → Identify the allocation, use, and free points   │
  │  → Draw the object lifecycle on paper              │
  └─────────────────────┬───────────────────────────────┘
                        │
  ┌─────────────────────▼───────────────────────────────┐
  │  PHASE 2: Run under ASan                           │
  │  → Trigger the UAF condition                       │
  │  → Read and interpret the ASan report              │
  │  → Map ASan output back to source lines            │
  └─────────────────────┬───────────────────────────────┘
                        │
  ┌─────────────────────▼───────────────────────────────┐
  │  PHASE 3: Fix the vulnerability                    │
  │  → Implement correct ownership semantics           │
  │  → Verify with ASan that the report disappears     │
  │  → Write a one-paragraph explanation of the fix    │
  └─────────────────────────────────────────────────────┘
```

### Series 3 — Reverse Engineering Practice (Tier 3)

These labs provide compiled binaries without source code. Students work entirely from static and dynamic analysis.

| Lab | Title | Analysis Method | Deliverable |
|-----|-------|----------------|-------------|
| L3-01 | The Black Box Protocol | Network capture analysis, RE of server binary | Protocol specification document |
| L3-02 | The Obfuscated Config Parser | Static analysis with Ghidra | Annotated decompiled pseudocode |
| L3-03 | The Packed Binary | Unpacking, entry point identification | Analysis report |
| L3-04 | The Firmware Image | QEMU emulation, UART console | Boot sequence trace and commentary |
| L3-05 | The Patched Binary | Diff analysis of two versions | Identification of patched behavior |

```
L3-01 Protocol Reconstruction Workflow:

  Wireshark Capture
        │
        ▼
  Identify message boundaries
  (length fields, delimiters, fixed headers)
        │
        ▼
  Correlate with binary handler in Ghidra
  (find recv() calls, trace length/offset arithmetic)
        │
        ▼
  Build field-by-field protocol spec
  (offset, size, type, valid range, purpose)
        │
        ▼
  Validate by writing a conforming client
  and observing server response
```

### Series 4 — Defensive Architecture Design (Tier 4)

These labs are design exercises, not binary analysis exercises. Students receive a system description and produce security artifacts.

| Lab | Title | Deliverable |
|-----|-------|-------------|
| L4-01 | Threat Model a Payment Service | DFD + STRIDE analysis + prioritized mitigations |
| L4-02 | Harden a Linux Container | CIS benchmark application, seccomp profile, AppArmor policy |
| L4-03 | Design a Secure API Gateway | Architecture document with trust boundary analysis |
| L4-04 | SSDLC Integration Plan | Security gates for a CI/CD pipeline |

---

## 4. Lab Assessment Criteria

Labs at NullByte Academy are assessed on understanding, not output. The debrief process uses the following rubric:

| Criterion | Weight | What It Measures |
|-----------|--------|-----------------|
| Conceptual accuracy | 40% | Did the student build the correct mental model? |
| Analysis depth | 30% | Did the student go beyond surface observations? |
| Defensive reasoning | 20% | Did the student identify architectural remedies? |
| Documentation quality | 10% | Can the student communicate findings clearly? |

A student who produces a perfectly formatted report without understanding the underlying vulnerability class scores poorly on conceptual accuracy and cannot pass. A student who demonstrates deep understanding but disorganized documentation can pass with remediation.

---

## 5. Lab Safety and Scope

Every lab brief opens with an explicit scope statement:

> *"This lab operates entirely within your local VM environment. The vulnerable target is a purpose-built synthetic program. Do not attempt to apply techniques learned here to any system outside this environment without explicit authorization. All lab activity is covered by the NullByte Academy ethics framework (03_ETHICS.md)."*

Students who report completing labs faster than the designed duration are asked to demonstrate their understanding in a technical debrief. Speed is not a signal of depth in this curriculum. It is frequently a signal of the opposite.

---

*Document version: 1.0 | Lab Infrastructure: mrwhite4939@gmail.com*

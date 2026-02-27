# Lab 05 — Memory Failure Autopsy: Reading What Went Wrong

**Track**: Tier 2 — Vulnerability Theory
**Series**: Vulnerability Anatomy
**Estimated Duration**: 4–6 hours
**Environment**: Linux VM, GDB, AddressSanitizer, Valgrind, core dump analysis tools

---

## Learning Objectives

By the end of this lab, you should be able to:

1. Read and interpret a crash report, sanitizer output, and core dump with precision
2. Identify the proximate cause and the root architectural cause of a memory failure from post-mortem evidence
3. Distinguish between different memory failure classes (overflow, UAF, double-free, OOB read) from their crash signatures
4. Explain what information a crash report reveals and what it conceals about exploitability
5. Produce a structured failure analysis report suitable for a vulnerability advisory

---

## Conceptual Overview

When a program crashes due to a memory error, it leaves evidence. A skilled analyst reads that evidence the way a forensic investigator reads a scene — methodically, with knowledge of what each observation implies. The ability to move from "the program crashed" to "here is the root cause and what it means architecturally" is one of the most practically valuable skills in security research.

Memory failures manifest in several forms. The crash itself — a segfault, an abort, a sanitizer report — is the *symptom*. The root cause is the code path and data condition that produced the failure. The security significance is the question of whether the failure condition is controllable and what an adversary could accomplish by controlling it.

### The Crash Signal Taxonomy

| Signal / Event | Primary Cause | Security Interpretation |
|----------------|--------------|------------------------|
| `SIGSEGV` (segfault) | Invalid memory access — null, unmapped, or permission violation | Possibly controlled (OOB write reaching unmapped region), or uncontrolled null deref |
| `SIGABRT` | Program called `abort()` — often via sanitizer, canary fail, or assert | Mitigation fired: canary, ASan, or explicit assertion |
| `SIGBUS` | Misaligned memory access or bus error | Architecture-specific; can indicate heap corruption |
| `SIGFPE` | Divide by zero or floating point exception | Can indicate integer arithmetic misuse |
| ASan `heap-buffer-overflow` | Write/read beyond heap buffer bounds | Controlled overflow — high exploitability signal |
| ASan `use-after-free` | Access to freed memory | Potentially controlled if heap is reshaped |
| ASan `double-free` | Same memory freed twice | Allocator corruption — can be leveraged for control |

### Reading a Core Dump

When a process crashes, the operating system can write a **core dump** — a snapshot of the process's memory and register state at the moment of failure. Core dumps are primary evidence for memory failure analysis.

```
Core Dump Anatomy (key sections):

  ┌─────────────────────────────────────────────────────┐
  │                   CORE DUMP                         │
  │                                                     │
  │  ┌────────────────────────────────────────────┐     │
  │  │  Register State at Crash                  │     │
  │  │  RIP: 0x0000000000000041  ← "AAAA..." ??  │     │
  │  │  RSP: 0x7fffffffe3f0                       │     │
  │  │  RBP: 0x4141414141414141  ← overwritten    │     │
  │  └────────────────────────────────────────────┘     │
  │                                                     │
  │  ┌────────────────────────────────────────────┐     │
  │  │  Stack Contents at Crash                  │     │
  │  │  RSP+0x00: 0x0000000000000041              │     │
  │  │  RSP+0x08: 0x4141414141414141              │     │
  │  └────────────────────────────────────────────┘     │
  │                                                     │
  │  ┌────────────────────────────────────────────┐     │
  │  │  Mapped Memory Regions                    │     │
  │  │  (mirrors /proc/<pid>/maps at crash time)  │     │
  │  └────────────────────────────────────────────┘     │
  └─────────────────────────────────────────────────────┘
```

The register state tells you *where the CPU was* when it crashed. The stack contents tell you *what the call context was*. The mapped regions tell you *what memory was available* to the process. Together they enable reconstruction of the crash path.

---

## Conceptual Exercises

### Exercise 1: Interpreting an AddressSanitizer Report

**Scenario**: A program produces the following ASan output. Read it carefully and answer the analysis questions below.

```
==12345==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x602000000054
READ of size 4 at 0x602000000054 thread T0
    #0 0x55a3c1001234 in process_record /src/parser.c:87
    #1 0x55a3c1001456 in parse_message /src/parser.c:143
    #2 0x55a3c1001678 in handle_input /src/main.c:52
    #3 0x7f3a1b24fd09 in __libc_start_main

0x602000000054 is located 4 bytes to the right of 80-byte region
[0x602000000000, 0x602000000050)
allocated by thread T0 here:
    #0 0x7f3a1c1a3b50 in malloc
    #1 0x55a3c1001111 in parse_message /src/parser.c:121
```

**Analysis questions**:

1. **What type of failure occurred?** Identify it from the report header. Note the distinction between READ and WRITE overflow — both indicate incorrect memory access, but they have different immediate effects and different exploitability profiles.

2. **What is the spatial relationship between the access and the allocation?** "4 bytes to the right of 80-byte region" means the read accessed offset 80 of a buffer sized for offsets 0–79. By how many elements did the access exceed the buffer?

3. **Trace the call path.** Starting from `handle_input`, trace down through `parse_message` to `process_record`. What does this tell you about where the root cause lives versus where the symptom appears?

4. **What is the probable root cause?** Describe in architectural terms why an 80-byte heap allocation might be read 4 bytes beyond its end. (Consider: off-by-one in a loop bound, a length field not accounting for a header, a null terminator read beyond a non-null-terminated buffer.)

5. **What would a WRITE version of this report indicate differently?** A `heap-buffer-overflow WRITE` vs. `READ` — which is more immediately dangerous and why?

---

### Exercise 2: Use-After-Free Trace Analysis

**Scenario**: A second ASan report shows the following pattern:

```
==12346==ERROR: AddressSanitizer: heap-use-after-free on address 0x603000000030
READ of size 8 at 0x603000000030 thread T0
    #0 0x55a3c1002100 in object_method /src/engine.c:214
    #1 0x55a3c1002300 in event_dispatch /src/engine.c:341

0x603000000030 is located 48 bytes inside of 96-byte region
[0x603000000000, 0x603000000060)
freed by thread T0 here:
    #0 0x7f3a1c1a3f00 in free
    #1 0x55a3c1001900 in cleanup_object /src/engine.c:178
    #2 0x55a3c1001700 in event_dispatch /src/engine.c:335

previously allocated by thread T0 here:
    #0 0x7f3a1c1a3b50 in malloc
    #1 0x55a3c1001500 in create_object /src/engine.c:90
```

**Construct the object lifecycle timeline**:

```
Object Lifecycle (reconstructed from ASan report):

  Line 90  (create_object)  → malloc(96) → object created
  Line 178 (cleanup_object) → free() → object freed
  Line 341 (event_dispatch) → ... continues to line 214
  Line 214 (object_method)  → READ at freed+48 → UAF crash

Timeline:
  t0: allocate [create_object:90]
  t1: ─────────── object in use ──────────────
  t2: free [cleanup_object:178]   ← object freed here
  t3: ─────────── object referenced by dangling pointer ─────
  t4: access [object_method:214]  ← crash here
```

**Analysis questions**:

1. What is the call path that leads to the free? (`event_dispatch` line 335 → `cleanup_object` line 178)
2. What is the call path that leads to the access after free? (`event_dispatch` line 341 → `object_method` line 214)
3. What does "48 bytes inside of 96-byte region" tell you about what field of the object is being accessed? If the object is a struct, what kinds of fields might live at offset 48? (Consider: function pointer, pointer to another object, counter, flag.)
4. From a defensive architecture standpoint, what ownership model would have prevented this? (Reference counting? Explicit ownership transfer? Arena allocation with lifetime enforcement?)

---

### Exercise 3: Stack Crash Signature Analysis

**Scenario**: A program crashes with a segfault. GDB shows the following at the crash:

```
Program received signal SIGSEGV, Segmentation fault.
0x0000000000400841 in process_input ()

(gdb) info registers
rip   0x400841   ← in valid code
rsp   0x7fffffffe3f0
rbp   0x6161616161616161   ← "aaaaaaaa" — overwritten

(gdb) x/4gx $rsp
0x7fffffffe3f0: 0x6161616161616161   0x6161616161616161
0x7fffffffe400: 0x6161616161616161   0x6262626262626262
```

**Observations**:

1. **RBP has been overwritten** with `0x6161616161616161` — the hex encoding of `'a'` repeated. The stack frame pointer is corrupted.
2. **RSP points to a stack region filled with `'a'`** (0x61 bytes). The return address slot has likely been overwritten.
3. **RIP is still in valid code** — the crash has not yet been redirected, which means we are observing the crash that occurs when the corrupted frame is being used, rather than the crash that would occur at the RET instruction.

**Analysis tasks**:
- Draw what the stack looked like before and after the overwrite
- Identify which local variable likely caused the overflow (given that the corrupted data begins at RBP-offset)
- Explain why RBP is overwritten before the return address in a stack overflow scenario
- Explain what would happen at the RET instruction if execution reaches it in this state

---

### Exercise 4: Writing a Failure Analysis Report

**Task**: Using the observations from Exercises 1–3, write a failure analysis report for one of the three scenarios. Use the following structure:

```
FAILURE ANALYSIS REPORT

Target:         [binary name and version]
Failure Type:   [ASan heap-buffer-overflow | use-after-free | stack corruption]
Severity:       [Critical | High | Medium | Low]

Root Cause:
  [One paragraph: what code condition created the vulnerability, at the
   architectural level. Not "the buffer was too small" but "the allocation
   size is derived from field X in the message header, which is not
   validated against the protocol maximum before allocation. The subsequent
   copy uses the raw length value, not the allocation size."]

Evidence:
  [Sanitizer output, crash state, relevant code locations]

Impact Assessment:
  Controllability: [Can attacker control the overflowing/freed data?]
  Reliability:     [Can the condition be triggered reliably?]
  Effect:          [Crash only | Information disclosure | Code execution potential]

Recommended Architectural Fix:
  [Structural change, not just a bounds check]
```

---

## Summary of Key Learning Points

Memory failure analysis is an analytical discipline. This lab established the key practices:

- **Sanitizer reports provide precise spatial and temporal information** that raw crash outputs do not. ASan reports tell you the size of the allocation, the offset of the bad access, and the complete lifecycle of the allocation — all essential for root cause analysis.
- **The proximate cause and the root cause are usually different**. The crash occurs at the access site. The root cause is at the site where the corrupting write — or missing validation — occurred. Tracing the call path from symptom to root cause is the core analytical task.
- **The distinction between READ and WRITE overflows matters**. Read overflows can expose memory contents (information disclosure). Write overflows can corrupt control structures (code execution potential). Both are serious; write overflows typically carry higher severity in impact assessments.
- **Register state at crash time is structured evidence**. Overwritten RBP values, corrupted stack contents, and invalid RIP values each tell a specific story about what went wrong and how far the corruption progressed.
- **Failure analysis produces actionable output** — specifically, root cause identification and architectural remediation. A crash report that ends with "the program crashed at address X" is incomplete. A failure analysis ends with a recommended design change.

---

*Lab 05 | NullByte Academy | Series: Vulnerability Anatomy | mrwhite4939@gmail.com*

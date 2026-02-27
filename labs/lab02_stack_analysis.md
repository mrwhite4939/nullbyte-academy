# Lab 02 — Stack Analysis: Frame Construction and Corruption Anatomy

**Track**: Foundation / Tier 1–2
**Series**: Systems Internals
**Estimated Duration**: 3–5 hours
**Environment**: Linux VM, GDB with PEDA or pwndbg (display only), gcc, objdump

---

## Learning Objectives

By the end of this lab, you should be able to:

1. Describe the precise sequence of operations that construct and tear down a stack frame
2. Map the memory layout of a stack frame from source code to assembly to live process memory
3. Explain how the calling convention governs argument passing, register preservation, and return value handling
4. Identify the architectural conditions that make stack-based memory corruption possible
5. Explain the mechanism of each mitigation that defends the stack, and articulate what each one does not protect against

---

## Conceptual Overview

The call stack is one of the most elegant structures in computer science. It is also one of the most persistently exploited. Understanding why requires understanding the stack not as an abstract data structure but as a physical region of memory with a specific layout, a specific set of invariants, and consequences when those invariants are violated.

### The Stack Contract

The stack operates under an implicit contract between the compiler, the ABI, and the CPU. The contract specifies:

- How function arguments are passed (registers first, then stack, per System V AMD64 ABI)
- Which registers a called function must preserve (callee-saved: RBX, RBP, R12–R15)
- Which registers a called function may freely use (caller-saved: RAX, RCX, RDX, RSI, RDI, R8–R11)
- How the return value is communicated back (RAX for integer/pointer, XMM0 for floating-point)
- How the stack pointer is restored after a call returns

When this contract holds, the stack works correctly. When memory corruption violates the contract — by overwriting data the caller depends on — the contract breaks, and the CPU's behavior becomes attacker-influenced rather than program-defined.

### Frame Construction: Step by Step

Consider a call from `main()` to `process(int len, char *buf)`. The System V ABI puts `len` in RDI and `buf` in RSI before the call instruction executes.

```
Step-by-step frame construction:

  BEFORE CALL:
  RSP → [  ... caller frame ...  ]
         RDI = len, RSI = *buf (arguments loaded)

  CALL process:
  ┌─────────────────────────────────────────────┐
  │ CPU pushes return address (next instr in    │
  │ main) → RSP decremented by 8               │
  │ RIP → set to process() entry point         │
  └─────────────────────────────────────────────┘

  AT process() ENTRY (prologue):
  PUSH RBP     → RSP decremented by 8, RBP value saved
  MOV RBP, RSP → frame pointer established

  SUB RSP, N   → N bytes reserved for local variables

  RESULTING FRAME LAYOUT (higher → lower address):

  ┌─────────────────────────────────┐  ← old RSP (before call)
  │     Return Address (8 bytes)    │  ← pushed by CALL
  ├─────────────────────────────────┤
  │     Saved RBP (8 bytes)         │  ← pushed by PUSH RBP
  ├─────────────────────────────────┤  ← RBP points here
  │     Local Variable: char buf[]  │
  │     (N bytes, compiler-aligned) │
  ├─────────────────────────────────┤  ← RSP points here
  │     (stack grows downward)      │
  └─────────────────────────────────┘
```

The return address is above the local variables in memory — but because writes to a buffer typically advance through ascending addresses, a write that overruns a local buffer will overwrite the saved RBP first, then the return address.

### Calling Convention in Practice

The ABI's register assignments are not arbitrary. Passing arguments in registers is faster than passing them on the stack because no memory operation is required. The first six integer/pointer arguments go in RDI, RSI, RDX, RCX, R8, and R9 in that order. Arguments beyond six are pushed onto the stack in right-to-left order.

This matters for security analysis because it determines where function arguments live during execution — which register to inspect in GDB, and which stack offsets correspond to which parameters in functions with many arguments.

---

## Conceptual Exercises

### Exercise 1: Drawing a Live Stack Frame

**Setup**: Write a C function with at least three local variables of different types and sizes. Compile it with debug symbols (`-g`) and without optimization (`-O0`).

**Task**: Before running under GDB, predict the frame layout:

```
Example function:
  void analyze(int count, char *label) {
      char  name[32];
      int   id;
      long  checksum;
      // ...
  }

Predicted frame (bottom = lower address):
  ┌──────────────┐  ← RSP
  │ checksum (8B)│
  ├──────────────┤
  │   id (4B)    │
  │   pad (4B)   │  ← compiler alignment
  ├──────────────┤
  │ name[32] (32B│
  ├──────────────┤  ← RBP
  │  saved RBP   │
  ├──────────────┤
  │ return addr  │
  └──────────────┘
```

**Observation**: Set a breakpoint at the first line of the function body. Use GDB's `info frame` and `x/Ngx $rbp-offset` to inspect actual layout. Compare to your prediction. Note how the compiler may reorder variables for alignment, or consolidate them differently than the source order suggests.

**Key observation**: The compiler is not required to place variables in the order they appear in source. What matters is the relative position of buffers (writable arrays) and the return address.

---

### Exercise 2: Tracing a Return Sequence

**Task**: Understand the mechanics of a clean return — the sequence of events that must hold for a function to return correctly.

```
Function epilogue (RET instruction sequence):

  MOV RSP, RBP   → Restore stack pointer (collapses local frame)
  POP RBP        → Restore caller's frame pointer
  RET            → Pop return address into RIP, jump to it

For RET to work correctly, the value at [RSP] must be the
original return address pushed by the CALL instruction.

If any write between the buffer and the return address
slot has overwritten that value:
  → RIP will be set to the corrupted value
  → CPU will attempt to fetch instructions from that address
  → If address is invalid: SIGSEGV
  → If address is attacker-controlled and valid: control hijack
```

**Conceptual question**: Step through a return in GDB one instruction at a time. Observe RSP and RIP change at each step. Identify the exact instruction at which RIP becomes the value that was stored at the return address slot. This is the moment of control transfer.

---

### Exercise 3: Stack Mitigation Analysis

Compile the same function three ways and compare the generated assembly with `objdump -d`:

| Compilation Flag | Mitigation Present | Mechanism |
|-----------------|-------------------|-----------|
| `-fno-stack-protector` | None | No canary |
| `-fstack-protector` | Stack canary | Canary on functions with char arrays ≥ 8B |
| `-fstack-protector-all` | Stack canary | Canary on all functions |
| `-fsanitize=address` | ASan | Shadow memory, redzones, full instrumentation |

**For each compiled version, observe**:

```
With -fstack-protector, compiler inserts:

  FUNCTION ENTRY (after prologue):
  MOV RAX, fs:0x28      ← read canary from TLS (Thread Local Storage)
  MOV [RBP-0x8], RAX    ← store canary just below saved RBP

  FUNCTION EXIT (before epilogue):
  MOV RAX, [RBP-0x8]    ← load canary from stack
  XOR RAX, fs:0x28      ← compare with original TLS value
  JNZ __stack_chk_fail  ← if different: terminate process
```

**Reflection questions**:
- Where exactly is the canary placed relative to the return address?
- What class of overwrite does the canary detect? What class does it not detect?
- Why does the canary value come from thread-local storage rather than a global variable?
- What would an attacker need to know or do to bypass the canary while still overwriting the return address?

---

### Exercise 4: Observing ASLR on the Stack

Run the same program 10 times. Each time, print the address of a local variable from within the function.

**Expected observation**: The address changes between runs due to ASLR randomizing the stack base. Record the addresses and observe how many bits of the address vary between runs.

```
Example output across 5 runs (stack address of 'name' variable):

  Run 1: 0x7ffe4a3b2210
  Run 2: 0x7ffd81c73210
  Run 3: 0x7ffeb2a54210
  Run 4: 0x7ffc9d8e1210
  Run 5: 0x7ffea1b22210
         ↑↑↑ ↑↑↑↑↑↑↑
         constant bits vary here

How many unique bits vary? Count. This is the effective ASLR entropy
for the stack on this system. More entropy = harder brute-force.
```

**Reflection question**: ASLR randomizes addresses. But the *offset* of a local variable from the stack base is fixed and determined by the compiler at compile time. How does this constrain what an attacker must know to execute a control-flow attack, even with ASLR enabled?

---

## Summary of Key Learning Points

The stack is the most precisely structured region of a process's memory. Its security properties are defined by the invariants the ABI imposes and the mitigations the compiler inserts.

- **Frame construction is deterministic**: the compiler and ABI define an exact layout that a practitioner can predict from source code and verify with a debugger. Security analysis requires reading that layout precisely.
- **The return address is architectural**: it is placed there by the CPU's CALL instruction, not by the programmer. Its position relative to local buffers is what makes stack buffer overflows security-relevant.
- **Stack canaries detect sequential overwrites**: they work because an overwrite that reaches the return address must pass through the canary position first. They do not detect overwrites that skip over the canary (e.g., through a format string or a pointer write to an arbitrary offset).
- **ASLR adds uncertainty but not immunity**: it forces an attacker to know or guess addresses rather than using fixed values. The entropy on a given system determines how much uncertainty is added.
- **No single mitigation is sufficient**: the stack is defended by a layered combination of canary, ASLR, NX, and CFI. Each layer has a bypass class; the combination raises the cost of exploitation significantly.

---

*Lab 02 | NullByte Academy | Series: Systems Internals | mrwhite4939@gmail.com*

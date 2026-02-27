# Lab 03 — Opcode Study: Reading the Machine's Language

**Track**: Tier 2 / Tier 3 Prerequisite
**Series**: Reverse Engineering Foundations
**Estimated Duration**: 4–5 hours
**Environment**: Linux VM, objdump, GDB, Ghidra (free edition), xxd

---

## Learning Objectives

By the end of this lab, you should be able to:

1. Read and interpret x86-64 assembly output from a compiler with confidence
2. Explain the relationship between source code, compiler output, and raw opcodes
3. Identify common instruction patterns and their security significance
4. Understand how the CPU decodes variable-length x86-64 instructions
5. Recognize compiler-generated patterns for bounds checks, function calls, and control flow structures
6. Explain why opcode-level understanding is foundational to reverse engineering and vulnerability research

---

## Conceptual Overview

Assembly language is the last human-readable layer before machine code. An opcode — the operation code — is a byte or sequence of bytes that encodes a specific CPU instruction. The CPU's decoder reads these bytes from memory, determines what operation they represent, fetches its operands, executes the operation, and advances RIP to the next instruction.

Security practitioners who cannot read assembly fluently are blind to roughly half of what is happening in a running program. Debuggers and disassemblers translate opcodes into assembly mnemonics. Understanding the mapping is what makes those tools useful rather than mystifying.

### The Instruction Encoding Model

x86-64 instructions are variable length — from 1 to 15 bytes. This is a consequence of the architecture's history and has important implications for analysis.

```
x86-64 Instruction Encoding (simplified):

  ┌──────────┬──────────┬──────────┬──────────┬──────────┐
  │ Prefixes │  Opcode  │  ModRM   │   SIB    │Immediate │
  │ (0–4B)   │ (1–3B)   │  (0–1B)  │  (0–1B)  │ (0–4B)   │
  └──────────┴──────────┴──────────┴──────────┴──────────┘

  Examples:
  90                     → NOP (1 byte)
  C3                     → RET (1 byte)
  48 89 E5               → MOV RBP, RSP (3 bytes)
  48 8B 45 F8            → MOV RAX, [RBP-0x8] (4 bytes)
  E8 XX XX XX XX         → CALL rel32 (5 bytes, relative offset)
  FF 25 XX XX XX XX      → JMP [RIP+rel32] (6 bytes, indirect via GOT)
```

The ModRM byte encodes the addressing mode — whether an operand is a register, a memory location accessed directly, or a memory location accessed via a register plus offset. Understanding ModRM is essential for interpreting memory access patterns in disassembly.

### Why Opcodes Matter for Security

Three security-critical phenomena are only visible at the opcode level:

**1. Control flow at the instruction level.** A function call, a conditional branch, and an indirect jump all look like high-level "flow" constructs in source code. At the opcode level, they are distinct instruction types with different operand forms and different security profiles. An indirect call (`CALL [RAX]`) is a control-flow hijacking target. A direct call (`CALL rel32`) is not, in the same way.

**2. Gadgets.** In Return-Oriented Programming, "gadgets" are short sequences of existing instructions ending in a RET. They appear as instruction sequences in the binary's executable segments. You cannot find them without opcode-level analysis.

**3. Compiler artifact patterns.** Bounds checks, null pointer guards, and security-relevant branches all have recognizable opcode-level signatures. Recognizing these patterns in disassembly tells an analyst what the compiler intended and where it placed validation logic.

---

## Conceptual Exercises

### Exercise 1: Manual Disassembly of a Code Snippet

**Task**: Given the following raw bytes (a function excerpt), decode each instruction manually using an x86-64 opcode reference, then verify with `objdump`.

```
Raw bytes:
  55 48 89 E5 48 83 EC 20 89 7D EC 48 89 75 E0
  8B 45 EC 48 63 D0 48 8B 45 E0 48 01 D0 C9 C3

Manual decode — work through each byte sequence:

  55              → PUSH RBP
  48 89 E5        → MOV RBP, RSP
  48 83 EC 20     → SUB RSP, 0x20       (allocate 32 bytes for locals)
  89 7D EC        → MOV [RBP-0x14], EDI  (store first argument)
  48 89 75 E0     → MOV [RBP-0x20], RSI  (store second argument)
  8B 45 EC        → MOV EAX, [RBP-0x14]
  48 63 D0        → MOVSXD RDX, EAX     (sign-extend to 64-bit)
  48 8B 45 E0     → MOV RAX, [RBP-0x20]
  48 01 D0        → ADD RAX, RDX
  C9              → LEAVE               (MOV RSP, RBP; POP RBP)
  C3              → RET
```

**Question**: What does this function do? What are its arguments, and what does it return? Write a C prototype that matches this assembly. Notice that the function stores both arguments to the stack — this is a result of compiling without optimization, where the compiler doesn't assume register values persist across expressions.

---

### Exercise 2: Comparing Optimized and Unoptimized Output

**Task**: Compile the following function at `-O0` and `-O2`. Disassemble both with `objdump -d`. Document the differences.

```c
int sum_array(int *arr, int len) {
    int total = 0;
    for (int i = 0; i < len; i++) {
        total += arr[i];
    }
    return total;
}
```

**Patterns to identify in each version**:

| Pattern | -O0 Location | -O2 Location | Notes |
|---------|-------------|-------------|-------|
| Loop counter on stack | Yes | Often in register | Optimizer keeps `i` in a register |
| Bounds check (`cmp` + `jge`) | Explicit | May be restructured | Same semantics, different form |
| Array indexing | `lea` + indirect | May use pointer arithmetic | Optimizer unrolls or vectorizes |
| Return value | Loaded from stack | Often already in RAX | Optimizer avoids redundant stores |

**Security significance**: Vulnerability researchers almost always analyze optimized binaries. Recognizing optimizer-transformed patterns — especially when a bounds check has been restructured or partially eliminated — is an essential skill. Optimizers are allowed to remove checks that they can prove are redundant; sometimes their proof is wrong, or relies on assumptions that attacker input can violate.

---

### Exercise 3: Identifying Call Types and Their Security Profiles

**Task**: Identify examples of each call type in a compiled binary using `objdump`. Explain the security profile of each.

```
Call Type Taxonomy:

  1. Direct CALL (relative):
     e8 XX XX XX XX    → CALL <function+offset>
     Target is encoded as a 32-bit signed offset from next instruction.
     Fixed at link time. Not a hijacking target via memory write.

  2. Indirect CALL via register:
     ff d0             → CALL RAX
     Target is the current value of RAX. If RAX can be influenced
     by attacker input, this is a control-flow hijacking opportunity.
     CFI targets this call type specifically.

  3. Indirect CALL via memory (PLT/GOT):
     ff 15 XX XX XX XX → CALL [RIP+offset]  (GOT entry)
     Used for library calls. Target is resolved at runtime by the
     dynamic linker and stored in the GOT. GOT overwrite attacks
     target this pattern.

  4. Indirect JMP via vtable (C++ virtual dispatch):
     ff 27             → JMP [RDI]          (or similar)
     The object's vtable pointer is dereferenced. Type confusion
     vulnerabilities manipulate which vtable is read.
```

**Observation task**: Find one example of each call type in a compiled C++ program. For each, annotate which mitigation (CFI, relro, vtable guards) specifically addresses that call type.

---

### Exercise 4: Recognizing Compiler Security Patterns

**Task**: Compile a function with `-fstack-protector` and identify the canary read and write instructions in the disassembly.

```
Canary Pattern in Disassembly:

  ENTRY (after prologue):
  64 48 8B 04 25 28 00 00 00   → MOV RAX, QWORD PTR fs:0x28
  48 89 45 F8                  → MOV QWORD PTR [RBP-0x8], RAX

  EXIT (before epilogue):
  48 8B 45 F8                  → MOV RAX, QWORD PTR [RBP-0x8]
  64 48 33 04 25 28 00 00 00   → XOR RAX, QWORD PTR fs:0x28
  74 05                        → JE   <past the fail call>
  E8 XX XX XX XX               → CALL __stack_chk_fail
```

**Task**: Identify which memory offset (relative to RBP) holds the canary. Confirm it sits between the local buffer and the saved RBP. Draw the frame layout with the canary annotated.

---

## Summary of Key Learning Points

Opcode literacy is not a specialization — it is a basic competency for anyone doing security work below the application layer. This lab established:

- **x86-64 instructions are variable-length** and must be decoded sequentially from a known start point. This is why the disassembler must start from a valid instruction boundary — starting mid-instruction produces nonsensical output.
- **Direct and indirect calls have fundamentally different security profiles.** Direct calls are fixed at link time and are not targets for memory-write-based hijacking. Indirect calls — via register, GOT, or vtable — are the primary targets of control-flow hijacking mitigations.
- **Optimization changes the form but not the semantics** of compiled code. Security-relevant patterns (bounds checks, null guards) may look very different in optimized binaries than in unoptimized ones, but they are still present unless the optimizer has proven them redundant.
- **Compiler mitigations have opcode-level signatures.** Recognizing the canary insertion pattern, the GOT access pattern for library calls, and CFI check patterns allows analysts to quickly assess what mitigations are active in a binary without having to read build flags.
- **Opcodes are the ground truth.** Source code, decompiler output, and high-level analysis all have limitations. When they conflict with the actual bytes in the binary, the bytes win.

---

*Lab 03 | NullByte Academy | Series: Reverse Engineering Foundations | mrwhite4939@gmail.com*

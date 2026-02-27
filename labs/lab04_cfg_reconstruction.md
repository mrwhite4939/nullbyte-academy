# Lab 04 — Control Flow Graph Reconstruction

**Track**: Tier 3 — Reverse Engineering
**Series**: Binary Analysis
**Estimated Duration**: 4–6 hours
**Environment**: Linux VM, Ghidra, objdump, GDB, Python 3 (optional: networkx for graph visualization)

---

## Learning Objectives

By the end of this lab, you should be able to:

1. Define a Control Flow Graph (CFG) and explain its role in both static analysis and vulnerability research
2. Manually reconstruct a CFG from disassembly for a function of moderate complexity
3. Identify and categorize each type of control flow transfer in x86-64 binaries
4. Explain how CFG analysis is used by both attackers (finding gadgets, identifying code paths) and defenders (CFI policy generation, coverage analysis)
5. Describe the challenges of accurate CFG reconstruction and why they matter for automated analysis

---

## Conceptual Overview

A Control Flow Graph (CFG) is a directed graph where each node is a **basic block** — a maximal sequence of instructions with a single entry and a single exit — and each edge represents a possible control transfer between blocks. The CFG is the foundational representation for program analysis. It is what static analysis tools build when they analyze a binary, what coverage-guided fuzzers use to track exploration progress, and what Control Flow Integrity mitigations enforce at runtime.

Understanding the CFG is not just a reverse engineering skill. It is the conceptual bridge between reading individual instructions and understanding program behavior at scale.

### Basic Blocks: The Atoms of Control Flow

A basic block begins at an instruction that can receive control (a branch target, a function entry point, or the instruction following a call) and ends at an instruction that transfers control (a conditional branch, an unconditional jump, a call, or a return). All instructions in between execute sequentially — if the first instruction in a block executes, every instruction in the block executes.

```
Source Code → Disassembly → Basic Blocks → CFG

int check(int x, int y) {
    if (x > 0) {
        return x + y;
    } else {
        return y;
    }
}

Disassembly (simplified):
  <check>:
  A: cmp  edi, 0          ←─ Block A (entry)
     jle  .else_branch    ─┐
                            │ (fall-through edge to B)
  B: lea  eax, [rdi+rsi]  ←┘ ← Block B (then-branch)
     ret                  ─────────────────────────────► exit
                            │ (taken edge from A)
  C: mov  eax, esi         ←┘ ← Block C (else-branch)
     ret                  ─────────────────────────────► exit

CFG:
       ┌───────────┐
       │   Block A │ (cmp + jle)
       └─────┬─────┘
        false│      \true
             │       \
      ┌──────▼──┐  ┌──▼──────┐
      │ Block B │  │ Block C │
      │ (x+y)  │  │  (y)   │
      └──────┬──┘  └──┬──────┘
             │         │
             └────┬────┘
                  ▼
               [return]
```

This small example has three basic blocks. Real functions in production software have hundreds or thousands.

### CFG Edges and Their Types

| Edge Type | Description | Example Instruction |
|-----------|-------------|-------------------|
| Fall-through | Sequential execution, condition not taken | After a `JNE` that is not taken |
| Conditional branch | Condition taken | `JE`, `JLE`, `JNZ`, etc. |
| Unconditional jump | Always transfers, target known | `JMP rel32` |
| Indirect jump | Target determined at runtime | `JMP [RAX]`, switch tables |
| Call edge | Function invocation | `CALL rel32` or `CALL [reg]` |
| Return edge | Function return | `RET` |
| Exception edge | Raised by fault or explicit throw | `DIV r/m` (potential divide-by-zero) |

The distinction between **direct** and **indirect** control flow is security-critical. Direct edges have statically knowable targets — they can be computed at analysis time. Indirect edges have runtime-determined targets — their complete set of possible targets may be unknowable without dynamic analysis or additional inference. This is why CFI mitigations focus on indirect control transfers: they are where runtime surprises happen.

---

## Conceptual Exercises

### Exercise 1: Manual CFG Reconstruction

**Task**: Given the disassembly below, identify all basic block boundaries and draw the CFG.

```
<validate_input>:
  0x1000: push   rbp
  0x1001: mov    rbp, rsp
  0x1004: mov    DWORD PTR [rbp-0x4], edi
  0x1007: cmp    DWORD PTR [rbp-0x4], 0
  0x100b: jle    0x1025         ← conditional branch
  0x100d: cmp    DWORD PTR [rbp-0x4], 255
  0x1014: jg     0x1025         ← conditional branch
  0x1016: mov    eax, DWORD PTR [rbp-0x4]
  0x1019: imul   eax, eax
  0x101c: pop    rbp
  0x101d: ret                   ← return
  0x1025: mov    eax, 0xffffffff
  0x102a: pop    rbp
  0x102b: ret                   ← return
```

**Steps**:
1. Identify all instructions that terminate basic blocks (branches, calls, returns)
2. Identify all instructions that begin basic blocks (function entry, branch targets)
3. Draw each basic block as a node with its address range
4. Draw edges between blocks, labeling taken vs. fall-through for conditional branches

**Expected CFG structure**:

```
  ┌─────────────────────────────────────────────────┐
  │ Block A: 0x1000–0x100b                          │
  │ (prologue + first range check: value <= 0?)     │
  └─────────────────┬───────────────────────────────┘
                    │false(fall-through)  │true(taken)
                    │                    │
  ┌─────────────────▼────────────┐       │
  │ Block B: 0x100d–0x1014       │       │
  │ (second check: value > 255?) │       │
  └──────────┬───────────────────┘       │
   false     │         │true(taken)      │
             │         └─────────────┐   │
  ┌──────────▼─────────────┐    ┌────▼───▼────────┐
  │ Block C: 0x1016–0x101d │    │ Block D: 0x1025 │
  │ (compute x*x, return)  │    │ (return -1)     │
  └────────────────────────┘    └─────────────────┘
```

**Analysis question**: What does this function validate? What are the valid input bounds? Express the complete range of accepted input values as a condition.

---

### Exercise 2: Ghidra CFG Analysis

**Task**: Load a compiled binary into Ghidra. Navigate to a function of moderate complexity (aim for 8–15 basic blocks). Use Ghidra's Graph view (`Window → Function Graph`) to observe the CFG Ghidra has reconstructed.

**Observation points**:
- How does Ghidra represent the entry block?
- How are loop back-edges shown? (These are edges where the target block has a lower address than the source — indicating a loop.)
- Identify any blocks with more than two outgoing edges. What instruction type typically produces more than two successors?

```
Switch Statement CFG Pattern (many outgoing edges from one block):

  ┌────────────────────────────────────┐
  │ Block X: indirect jump via table   │
  │ JMP [RAX*8 + table_base]           │
  └──┬──────┬──────┬──────┬───────┬───┘
     │      │      │      │       │
  case0  case1  case2  case3  default
     │      │      │      │       │
  (each case is a separate basic block)
```

**Defensive insight**: Switch statements with large jump tables are a common source of both difficult CFG reconstruction and interesting attack surface in parsers. A jump table that indexes into by attacker-controlled input with insufficient bounds checking is an indirect jump hijacking opportunity.

---

### Exercise 3: Identifying Loop Structures

**Task**: In a function containing a loop (compile one if needed), identify the loop's structural components in the CFG:

```
Loop CFG Structure:

  ┌──────────────────────┐
  │   Loop Entry Block   │
  │   (condition check)  │◄──────────────┐
  └──────┬───────────────┘               │
  false  │   │ true(exit)                │
  (body) │   │                    ┌──────┴──────┐
         │   │                    │  Loop Body  │
  ┌──────▼───┴──────┐             │  (one or    │
  │  Loop Exit      │             │   more      │
  │  (post-loop)    │             │   blocks)   │
  └─────────────────┘             └─────────────┘
                                        │
                                  back-edge to
                                  loop entry
```

**Analysis question**: What conditions in a loop's CFG indicate potential out-of-bounds access? (Hint: look for loops where the loop bound is derived from attacker-supplied input and the access within the body uses that bound to index an array.)

---

### Exercise 4: CFG and Code Coverage

**Task (conceptual)**: Explain how a coverage-guided fuzzer uses the CFG to measure progress.

```
Coverage Feedback Model:

  Fuzzer generates input
          │
          ▼
  Target executes
          │
          ▼
  Instrumentation records: which edges were traversed
          │
          ▼
  ┌──────────────────────────────────┐
  │  "Interesting" input = input that │
  │  caused a previously-unseen edge │
  │  to execute                      │
  └──────────────────────────────────┘
          │
          ▼
  Add to corpus; mutate; repeat

  Goal: maximize edge coverage → maximize
  code path exploration → maximize
  probability of finding crash-inducing paths
```

**Reflection question**: A fuzzer that achieves 90% edge coverage has found inputs that traverse 90% of the CFG's edges. What does the remaining 10% represent, and why might it be security-critical?

---

## Summary of Key Learning Points

The Control Flow Graph is the fundamental representation of program behavior for security analysis. This lab established:

- **Basic blocks are the atoms of CFG analysis**: maximal sequential instruction sequences. Within a basic block, execution is unconditional. Security-relevant decisions happen at block boundaries.
- **Edge types reflect the security profile of control transfers**: indirect edges are the primary targets of CFI because their targets cannot be fully determined statically, making them amenable to manipulation at runtime.
- **CFG reconstruction is imperfect for indirect control flow**: switch tables, virtual dispatch, and computed jumps require additional analysis (data flow, type inference, dynamic observation) to resolve completely. This imprecision is a fundamental limitation of static analysis.
- **Fuzzers use CFG coverage as an exploration metric**: more edge coverage means more of the program's behavior has been exercised. Uncovered edges represent code paths with unknown properties — including unknown vulnerabilities.
- **CFI mitigations operationalize the CFG as a runtime policy**: they allow only control transfers that appear in the statically computed CFG. Understanding the CFG is therefore prerequisite to understanding what CFI protects and what it does not.

---

*Lab 04 | NullByte Academy | Series: Binary Analysis | mrwhite4939@gmail.com*

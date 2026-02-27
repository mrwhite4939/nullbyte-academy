# Lab 01 — The Execution Model: How a Process Thinks

**Track**: Foundation / Tier 1
**Series**: Systems Internals
**Estimated Duration**: 3–4 hours
**Environment**: Linux VM (Ubuntu 22.04 LTS recommended), GDB, readelf, /proc filesystem

---

## Learning Objectives

By the end of this lab, you should be able to:

1. Describe the lifecycle of a process from ELF binary on disk to running program in memory
2. Identify and explain each segment of a process's virtual address space and its purpose
3. Use /proc and GDB to observe the execution model of a live process
4. Explain why the execution model is the root context for all memory-based vulnerability classes
5. Articulate the role of the kernel in mediating process execution and privilege transitions

---

## Conceptual Overview

Before a security practitioner can reason about how software fails, they need a precise mental model of how software works. This sounds obvious. In practice, most practitioners have a working model that is correct enough for normal use and incorrect in exactly the ways that matter for security analysis.

The execution model answers a fundamental question: *when a CPU executes a program, what is actually happening, at the level of registers, memory, and kernel transitions?* The answer is more structured and more interesting than most introductory curricula suggest.

### From Binary to Process

An ELF (Executable and Linkable Format) binary sitting on disk is a blueprint — it contains code, data, and metadata describing how those should be arranged in memory. The operating system's program loader reads this blueprint and constructs a process: an isolated execution environment with its own virtual address space, register state, and file descriptor table.

```
ELF Binary on Disk → Kernel Loader → Process in Memory

  ELF Header
  ┌───────────────┐         Virtual Address Space
  │  .text        │ ──────► ┌─────────────────┐ High
  │  .rodata      │ ──────► │   Kernel Space  │
  │  .data        │ ──────► ├─────────────────┤
  │  .bss         │ ──────► │     Stack       │ ← thread-local
  │  PT_LOAD segs │         ├─────────────────┤
  │  Dynamic info │ ──────► │   Shared Libs   │
  └───────────────┘         ├─────────────────┤
                            │      Heap       │ ← grows up
                            ├─────────────────┤
                            │   .bss / .data  │
                            ├─────────────────┤
                            │     .text       │ ← read + execute
                            └─────────────────┘ Low
```

Each segment has specific permissions. The `.text` segment is readable and executable but not writable. The `.data` and stack are readable and writable but — with modern mitigations — not executable. These permission boundaries are enforced by the MMU at the page level and are the hardware foundation for the NX/DEP mitigation.

### Registers as Program State

The CPU's register file is the fastest, most immediate layer of program state. In x86-64, the general-purpose registers (RAX, RBX, RCX, RDX, RSI, RDI, R8–R15) hold operands, return values, and temporary values. Two registers are architecturally special:

- **RIP (Instruction Pointer)**: holds the address of the next instruction to execute. Controlling RIP is the goal of most control-flow hijacking attacks.
- **RSP (Stack Pointer)**: holds the address of the current top of the stack. The stack is where function call context lives.

```
x86-64 Register File (security-relevant subset):

  ┌─────────┬──────────────────────────────────────────────┐
  │ Register │ Role                                         │
  ├─────────┼──────────────────────────────────────────────┤
  │ RIP      │ Next instruction address — the control flow  │
  │ RSP      │ Stack top — frame boundary marker            │
  │ RBP      │ Frame base — local variable reference point  │
  │ RAX      │ Return value from functions                  │
  │ RDI      │ First function argument (System V ABI)       │
  │ RSI      │ Second function argument                     │
  │ RDX      │ Third function argument                      │
  └─────────┴──────────────────────────────────────────────┘
```

### The Privilege Model

The CPU operates in rings — numbered 0 through 3, though most systems only use 0 (kernel) and 3 (user). User processes run in ring 3. The kernel runs in ring 0 and has unrestricted access to hardware. Transitions between rings occur through well-defined mechanisms: system calls (via the `syscall` instruction in x86-64), interrupts, and exceptions.

Every time a user process needs to do something that requires kernel authority — reading a file, allocating memory, sending a packet — it issues a system call. The kernel validates the request, performs the operation in ring 0, and returns the result to the process in ring 3. This transition is the fundamental trust boundary in the execution model.

---

## Conceptual Exercises

### Exercise 1: Mapping the Process Address Space

**Setup**: Compile a simple C program with a global variable, a local variable, and a heap allocation. Run it and inspect its address space.

**Conceptual task**: Before running any tools, predict the layout. Draw on paper:
- Where the code will live (approximate address range)
- Where global initialized and uninitialized data will live
- Where the heap allocation will appear
- Where the local variable (stack) will appear
- Where libc will be mapped

**Observation**: Open `/proc/<pid>/maps` while the process is paused. Compare the actual layout to your prediction. Focus on:

```
Typical /proc/<pid>/maps structure:

  address range          perms  offset  dev   inode   pathname
  55a3c1200000-55a3c1201000  r--p  00000000  ...     /bin/example
  55a3c1201000-55a3c1202000  r-xp  00001000  ...     /bin/example  ← .text
  55a3c1202000-55a3c1203000  r--p  00002000  ...     /bin/example  ← .rodata
  55a3c1404000-55a3c1405000  rw-p  00003000  ...     /bin/example  ← .data
  55a3c2800000-55a3c2821000  rw-p  00000000  ...     [heap]
  7f3a10000000-7f3a10200000  r--p  00000000  ...     libc.so.6
  7ffd12300000-7ffd12321000  rw-p  00000000  ...     [stack]
```

Note the permission strings. Identify which segment corresponds to each mapped region. Note that `r-xp` (readable, executable, private) marks executable code. `rw-p` (readable, writable, private) marks data. No region should carry both `w` and `x` in a well-configured system — that is the NX invariant.

**Reflection question**: What would it mean, defensively, if you observed a region with `rwxp` permissions? Under what circumstances might this appear legitimately versus maliciously?

---

### Exercise 2: Tracing the Syscall Boundary

**Conceptual task**: For each of the following operations, identify the system call(s) involved and the data that crosses the user-kernel boundary.

| Operation | Primary Syscall(s) | What Crosses the Boundary |
|-----------|-------------------|--------------------------|
| Read from a file | `read(fd, buf, count)` | fd number, buffer address, byte count |
| Allocate heap memory | `brk()` or `mmap()` | Size, flags, mapping type |
| Write to stdout | `write(1, buf, count)` | Buffer contents, length |
| Create a new process | `clone()` / `fork()` | Flags, stack, parent state |
| Connect a TCP socket | `connect(fd, addr, len)` | Socket fd, target address struct |

**Observation exercise**: Use `strace` on a program that reads a file and prints its contents. Observe the sequence of syscalls. Note that `strace` operates entirely in user space by using the `ptrace` mechanism — the same mechanism GDB uses to control processes.

**Reflection question**: From a security perspective, why does the kernel validate every argument passed through a system call, even arguments coming from a process running as root?

---

### Exercise 3: Observing Register State at a Function Boundary

**Setup**: Use GDB to break at the entry of a function call in a simple program.

**Conceptual task**: Observe the register state at the moment of the function call. Specifically:
- What is RIP pointing to?
- What value is in RSP, and what does the memory at that address contain?
- What arguments were passed to the function, and in which registers?

```
At CALL instruction — sequence of events:
  1. CPU pushes return address (RIP + instruction_length) onto stack
  2. RSP is decremented by 8
  3. RIP is set to the target function address

At function prologue (PUSH RBP; MOV RBP, RSP):
  1. Saved RBP is pushed onto stack — RSP decremented again
  2. RBP is set to current RSP — frame pointer established
```

**Reflection question**: An attacker who can write arbitrary data to the stack at the location of the saved return address can redirect RIP when the function returns. What mitigation sits between the local variables and the return address on modern systems, and what is its mechanism?

---

## Summary of Key Learning Points

The execution model is not background knowledge — it is the foundation on which all vulnerability analysis is built. This lab established several critical conceptual anchors:

- A process is a structured isolation boundary, not a flat sequence of instructions. Its virtual address space has enforced permission regions that form the hardware basis for security mitigations.
- The CPU's register file, especially RIP and RSP, encodes the program's current position and call context. Security-relevant attacks target these registers because controlling them means controlling what the CPU does next.
- The user-kernel boundary is the most fundamental trust boundary in the execution model. Every system call is a request from an untrusted context to a trusted one, validated by the kernel on every invocation.
- The privilege ring model is enforced in hardware. Software cannot bypass it directly — but it can exploit vulnerabilities in the kernel to trigger unintended privilege transitions.
- Understanding what *should* be true about the execution model is a prerequisite for recognizing when something has gone wrong. Anomalies in address space layout, unexpected RIP values, and permission violations all become visible only to practitioners who know the expected baseline.

The next lab applies this foundation to the stack specifically — studying frame construction, local variable layout, and the precise mechanism by which function call context is preserved and restored.

---

*Lab 01 | NullByte Academy | Series: Systems Internals | mrwhite4939@gmail.com*

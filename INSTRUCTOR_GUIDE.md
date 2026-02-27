# Instructor Guide — NullByte Academy Advanced Defensive Systems Engineering Program

**Document Classification:** Instructor Reference
**Version:** 1.0
**Audience:** Instructors, teaching assistants, institutional adopters
**Maintained By:** NullByte Academy Curriculum Committee

---

## Overview

This guide provides instructors with the strategic, methodological, and operational information needed to deliver the NullByte Academy curriculum effectively. It covers teaching philosophy, module-specific delivery notes, lab supervision standards, assessment administration, and guidance for handling common instructional challenges.

This guide does not replace the curriculum materials themselves. Instructors must complete all modules as a student before teaching any module.

---

## 1. Teaching Philosophy

The NullByte Academy curriculum is designed around a single pedagogical conviction: in low-level systems security, shallow coverage does more harm than no coverage at all. A student who believes they understand ASLR because they know "it randomizes addresses" is less useful — and potentially more dangerous in a professional context — than a student who knows they do not yet understand ASLR.

The instructor's primary function is not to transfer information. The curriculum materials do that. The instructor's function is to:

**Create the conditions for genuine understanding.** This means refusing to accept surface-level answers, pressing for specificity in every technical claim, and modeling the kind of analytical rigor the curriculum expects of students.

**Make thinking visible.** Live analysis sessions — where the instructor reasons aloud through a disassembly listing, a GDB session, or a CVE record — are more valuable than polished lectures. Students need to see how an expert thinks, not just what an expert knows.

**Maintain the defensive frame.** Every session should conclude with a connection to defensive engineering. "What does this tell us about how to build systems that are harder to attack?" is a question that belongs in every module, every lab, every assessment discussion.

---

## 2. Prerequisite Verification

Before a student begins M01, the instructor should verify:

- Comfort with binary and hexadecimal notation (can convert between bases without a calculator)
- Ability to navigate a Linux filesystem, execute programs, and use a text editor from the terminal
- Familiarity with at least one systems programming language (C strongly preferred; the curriculum assumes C)
- Understanding of what a function call is and that it involves the stack (a mechanical understanding is not required at this stage)

Students who lack the Linux prerequisite may complete a preparatory session covering: file navigation, package installation, process execution, and basic GDB invocation. This session is not part of the formal curriculum and should not substitute for genuine prerequisite competence.

---

## 3. Module-by-Module Delivery Notes

### M01 — CPU Architecture and Execution Internals

**Estimated delivery time:** 8–12 hours of instruction + lab

**Instructional approach:** This module is foundational and dense with terminology. The risk is that students memorize register names without understanding their role. Counter this by beginning every session with a concrete question: "If I call `printf` with three arguments, which register holds the third one?" Demand specific answers, not general ones.

**Key concepts to reinforce:**

- The calling convention is a contract. Both caller and callee must honor it. Violations produce the class of bugs the rest of the curriculum studies.
- RIP is not a general-purpose register. It cannot be directly written. Everything the rest of the curriculum says about "controlling RIP" is about indirect control through the stack or memory corruption.
- Privilege rings are hardware-enforced. They are not a software convention that can be bypassed by clever coding.

**Common student errors:**

- Confusing the physical register (the hardware resource) with the name (the ABI-assigned role). Registers have no inherent purpose; the ABI gives them purpose.
- Assuming calling conventions are universal. Emphasize that SysV AMD64 and Microsoft x64 differ in ways that matter when reading disassembly on Windows binaries.

**Lab emphasis:** LAB-CPU-01 should be supervised closely for the first iteration. Students often set breakpoints at the wrong granularity (function-level instead of instruction-level) and miss register changes between instructions. Walk through `stepi` versus `next` explicitly before releasing students to work independently.

---

### M02 — Memory Layout and Management

**Estimated delivery time:** 10–15 hours of instruction + lab

**Instructional approach:** Use diagrams relentlessly. The stack frame layout, the virtual address space, and the heap chunk structure are all spatial concepts. Verbal descriptions are insufficient. Students should be drawing these structures from memory by the end of the module.

**Key concepts to reinforce:**

- The stack grows down. The heap grows up. They can collide. This is not a theoretical concern.
- The return address is on the stack because it is placed there by the CALL instruction. It is the single most important value on the stack for security purposes. Students should be able to locate it in every stack frame they examine.
- The glibc heap is not a simple array. It has structure, metadata, and integrity checks. Understanding the metadata is prerequisite to understanding why heap corruption is exploitable and why hardening measures like safe unlinking exist.

**Common student errors:**

- Conflating the stack with memory in general. The stack is one segment of virtual memory. Clarify this repeatedly.
- Believing that heap memory is "safer" than stack memory because it is dynamically allocated. The opposite is often true: heap metadata corruption can be subtle and difficult to detect.

**Lab emphasis:** LAB-MEM-02 (heap tracing) is where students most commonly stall. The pwndbg `heap` commands require pwndbg to be correctly installed and the target binary to be dynamically linked against glibc. Verify these prerequisites on every student machine before the lab session begins.

---

### M03 — Exploit Mitigations and Modern Defenses

**Estimated delivery time:** 8–12 hours of instruction + lab

**Instructional approach:** Teach the history of each mitigation before the mechanism. Students who understand *why* a mitigation was introduced — what attack it was responding to — understand its scope and limitations far better than students who learn the mechanism in isolation.

**Key concepts to reinforce:**

- Every mitigation addresses a specific attack primitive. It does not address all attacks. Defense in depth exists because no single mitigation is complete.
- ASLR's entropy is limited. On 32-bit systems, brute force was practical. On 64-bit systems, information leaks reduce entropy to a practical attack surface.
- CFI is a spectrum. Forward-edge CFI (controlling indirect call targets) and backward-edge CFI (shadow stacks, controlling return addresses) address different attack primitives. Most deployed CFI implementations protect only one.

**Common student errors:**

- Treating "the binary has NX" as equivalent to "the binary is safe." NX prevents code injection; it does not prevent code reuse.
- Assuming ASLR applies to everything. Static binaries without PIE have a fixed text segment base. Walk through a checksec output showing `No PIE` and what it means for the text segment address.

**Lab emphasis:** LAB-MIT-01 should produce a mitigation audit report as its primary deliverable, not just a checklist of checksec outputs. Require students to explain each finding — not just report it.

---

### M04 — Reverse Engineering Fundamentals

**Estimated delivery time:** 15–25 hours of instruction + lab

**Instructional approach:** This is the longest and most skill-intensive module. The toolchain takes time to learn and the analysis methodology takes time to internalize. Resist the temptation to accelerate. A student who cannot read disassembly independently cannot complete M05 or the capstone.

**Key concepts to reinforce:**

- Static analysis without dynamic analysis is incomplete. The disassembler shows you what the code says; the debugger shows you what the code does. Both are necessary.
- Naming is analysis. Every time a student renames a function or variable in Ghidra, they are performing analysis. Unnamed functions are uninvestigated functions.
- Cross-references are the structure of a binary. Following xrefs is how the analysis of one function becomes the analysis of an entire program.

**Common student errors:**

- Beginning analysis at `main()` and following the call graph forward without first surveying the binary (strings, imports, sections). Survey always precedes deep analysis.
- Treating the decompiler output as ground truth. Decompiler output is a useful approximation, not an exact representation of the original code. The disassembly listing is the ground truth.

**Lab emphasis:** LAB-RE-01 and LAB-RE-02 must produce written analysis reports, not just completed exercises. The report is the deliverable. Students who complete the technical steps but do not write the report have not completed the lab.

---

### M05 — Vulnerability Classes and Root Cause Analysis

**Estimated delivery time:** 12–18 hours of instruction + lab

**Instructional approach:** Root cause analysis is a discipline of precision. The standard is not "identify the vulnerability class" — it is "specify the exact function, line, memory condition, CWE class, and defensive fix." Every student answer that is less specific than this standard should be returned with a request for specificity.

**Key concepts to reinforce:**

- The CWE taxonomy is a tool, not a goal. CWE classification is useful because it connects specific vulnerabilities to a body of prior art on detection and remediation. It is not a trophy.
- Root cause and manifestation are different. A buffer overflow is a manifestation. The root cause is the spatial memory safety violation: a write to a buffer that exceeds the buffer's allocated bounds. Students who conflate these will write imprecise analyses.

**Common student errors:**

- Stopping at "this is a buffer overflow" without identifying the specific vulnerable function and the defensive fix.
- Treating all heap vulnerabilities as identical. Use-after-free, double-free, and heap overflow have different root causes, different manifestations, and different mitigations. Require students to distinguish them precisely.

---

### M06 — Secure Coding and Defensive Architecture

**Estimated delivery time:** 10–14 hours of instruction + lab

**Instructional approach:** This module bridges the analytical skills of M01–M05 with the engineering practice of writing and reviewing safer code. The risk is that students treat it as a checklist module. Counter this by requiring them to explain *why* each secure coding pattern prevents the specific vulnerability class it is designed to prevent.

---

### M07 — Research Methods and CVE Analysis

**Estimated delivery time:** 10–15 hours of instruction + lab

**Instructional approach:** The M07 CVE analysis exercise is where students begin producing outputs that could, with further development, be published. Treat the exercise with corresponding seriousness. A completed CVE analysis template is not a finished document — it is a structured set of notes from which a publishable analysis can be developed.

---

## 4. Lab Supervision Standards

**Before every lab session:**

- Verify that the lab VM or environment is correctly configured on every student machine
- Confirm that the required lab binary, toolchain, and reference materials are available
- Review the lab's verifiable outcomes (from ARCHITECTURE.md) and clarify them for students before the session begins

**During lab sessions:**

- Circulate. The most common failure mode is a student who stalls silently rather than asking for help.
- When a student is stuck, ask diagnostic questions rather than providing the answer: "What does GDB tell you about the value of RSP at this point?" not "RSP is 0x7ffe..."
- Do not allow students to proceed past a step they do not understand. Advancing through the steps without understanding them is not learning.

**After every lab session:**

- Require a written submission of the lab deliverable before the session ends or by a defined deadline
- Review at least a random sample of submissions before the next session and address common errors in the opening of that session

---

## 5. Assessment Administration

All assessments must be administered against the criteria in EVALUATION_FRAMEWORK.md without modification. Instructors may not adjust passing thresholds for individual students. If a student consistently scores below the minimum, the correct response is additional instruction and reassessment — not threshold adjustment.

**Feedback standards:**

- Every assessment submission receives written feedback within 5 business days
- Feedback must reference specific criteria from the rubric, not general impressions
- "Good work" and "needs improvement" without specific reference to the rubric criteria are not acceptable feedback

**Reassessment policy:**

A student who fails an assessment may reassess after a minimum 7-day period during which they have access to the instructor's written feedback. The reassessment uses a different but equivalent question set. The higher of the two scores is recorded.

---

## 6. Handling Academic Integrity Violations

Any submission that contains content that is not the student's own work — whether copied from another student, reproduced from an external source without attribution, or generated by automated means without disclosure — is referred to the institution's academic integrity process.

The program does not penalize students for using reference materials (documentation, textbooks, the curriculum itself) during open-book assessments. The integrity concern is specifically with submissions that misrepresent their authorship or origin.

---

*This guide is updated at each major curriculum release. Instructors are expected to review the updated guide before delivering any module that has been revised.*

*Document version: 1.0 | NullByte Academy | 2026*

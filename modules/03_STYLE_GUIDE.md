# 04 — NullByte Academy: Content Style Guide

> *"Precision in language reflects precision in thinking. In security, imprecision is a vulnerability."*

---

## 1. Purpose

This style guide governs all written content produced under the NullByte Academy name: course modules, lab documentation, research advisories, glossary entries, and public communications. It exists because good technical writing is not a soft skill — it is a professional competency that determines whether knowledge can be transferred, whether findings can be acted on, and whether the academy's reputation holds up under scrutiny.

Inconsistent, imprecise, or poorly structured content undermines student comprehension and reflects poorly on the institution. These standards are not arbitrary — each rule has a reason.

---

## 2. Writing Principles

### 2.1 Precision Over Elegance

Security documentation must be exact. When there is a choice between a more elegant sentence and a more precise one, choose precision. "The function does not validate input length" is better than "the function mishandles input." The first tells a reader exactly what is wrong. The second requires them to guess.

This applies to terminology. Use the correct technical term, define it on first use, and use it consistently. Do not substitute synonyms for variety. Calling it a "buffer overflow" in one paragraph and a "memory overrun" in the next forces readers to determine whether you mean the same thing — cognitive load that serves no purpose.

### 2.2 Assume Competence, Not Knowledge

Write for a technically capable reader who may not know this specific topic. Do not over-explain fundamentals that belong in prerequisite material. Do not under-explain concepts that are genuinely novel to the module's subject matter. The calibration question is: "Would a student who has completed the prerequisites for this module understand this?" If yes, don't explain it. If no, you need to.

### 2.3 Active Voice and Direct Statements

Passive voice obscures agency and responsibility — both critical concerns in security writing. "The vulnerability was introduced in commit 3a7f..." does not say who introduced it or why. "A developer introduced a type confusion vulnerability in commit 3a7f... by..." does.

Prefer: "The allocator does not check for integer overflow before computing the allocation size."
Avoid: "An integer overflow condition may exist in the allocation size computation."

### 2.4 Short Sentences for Complex Ideas

When explaining technically dense concepts, shorter sentences reduce cognitive load. A 60-word sentence explaining a race condition will be misread. Four 15-word sentences explaining the same concept sequentially will not.

---

## 3. Document Structure Standards

### 3.1 Required Sections for Course Modules

Every course module must include the following sections in this order:

| Section | Purpose |
|---------|---------|
| **Learning Objectives** | 3–5 measurable outcomes, starting with action verbs |
| **Prerequisites** | Explicit list of required prior knowledge and completed modules |
| **Ethical Context** | Legal and ethical framing for the material |
| **Conceptual Foundation** | The theoretical basis — how the system works before anything goes wrong |
| **Vulnerability Analysis** | How and why the design is vulnerable, architecturally |
| **Defensive Counterpart** | Mitigations, detection strategies, architectural remedies |
| **Lab Exercise** | Isolated practical exercise with clear objectives |
| **Further Reading** | Primary sources, academic papers, authoritative documentation |

Do not omit sections. Do not reorder them. The sequence is intentional: theory before application, offense before defense, concepts before hands-on.

### 3.2 Heading Hierarchy

```
# H1 — Document title only (one per document)
## H2 — Major sections
### H3 — Subsections
#### H4 — Component-level detail (use sparingly)
```

Do not use H5 or H6. If your content requires five levels of nesting, restructure it.

### 3.3 Code Blocks

All code, commands, register names, memory addresses, and file paths appear in code formatting. Inline code for short references. Fenced code blocks for multi-line content. Always specify the language for syntax highlighting.

```c
// Correct: specify language
void vulnerable_function(char *input) {
    char buffer[64];
    strcpy(buffer, input);  // No length check — classic stack overflow setup
}
```

```bash
# Shell commands include the prompt character
$ objdump -d ./binary | grep -A 20 '<main>'
```

---

## 4. ASCII Diagrams

ASCII diagrams are required for any explanation involving memory layout, control flow, stack structure, register state, or network packet structure. They are not optional decoration — they are primary explanatory content.

### 4.1 Memory Layout Diagrams

```
Virtual Address Space (x86-64, simplified)

  High Address ┌─────────────────┐
               │   Kernel Space  │  (ring 0, not directly accessible)
               ├─────────────────┤ 0xFFFF800000000000
               │   Stack         │  ← grows downward
               │   (per-thread)  │
               ├─────────────────┤
               │       ↓         │
               │   [gap]         │
               │       ↑         │
               ├─────────────────┤
               │   Heap          │  ← grows upward
               ├─────────────────┤
               │   BSS Segment   │  uninitialized globals
               ├─────────────────┤
               │   Data Segment  │  initialized globals
               ├─────────────────┤
               │   Text Segment  │  executable code (read-only)
  Low Address  └─────────────────┘ 0x0000000000000000
```

### 4.2 Stack Frame Diagrams

```
Stack Frame Layout (x86-64, standard function prologue)

  Higher addresses ─────────────────────────
                   │  Caller's frame        │
                   ├─────────────────────────┤  ← RSP before call
                   │  Return Address         │  pushed by CALL instruction
                   ├─────────────────────────┤  ← RBP (saved frame pointer)
                   │  Saved RBP              │  pushed by PUSH RBP
                   ├─────────────────────────┤
                   │  Local Variables        │
                   │  [buffer: 64 bytes]     │
                   │  [other locals]         │
                   ├─────────────────────────┤  ← RSP (current stack top)
  Lower addresses  │  (stack grows down)     │
                   ─────────────────────────
```

Diagrams must use consistent box-drawing characters. Arrows should indicate direction of relevant operations (growth direction, data flow, control transfer).

### 4.3 Control Flow Diagrams

```
Control Flow: Function with Bounds Check

   ┌─────────────────┐
   │  Function Entry │
   └────────┬────────┘
            │
   ┌────────▼────────┐
   │ Check: len(in)  │
   │   <= BUFSIZE?   │
   └────────┬────────┘
            │
       ┌────┴────┐
       │         │
   YES │         │ NO
       │         │
┌─────▼──┐  ┌───▼───────────┐
│  Copy  │  │ Return Error  │
│ Input  │  │  / Truncate   │
└─────┬──┘  └───────────────┘
      │
┌─────▼──────────┐
│ Continue Logic │
└────────────────┘
```

---

## 5. Terminology Standards

| Prefer | Avoid | Reason |
|--------|-------|--------|
| "vulnerability" | "vuln", "bug" | Precision; "bug" implies unintentional defect only |
| "attacker" | "hacker" | "Hacker" has positive connotations in some communities; avoid ambiguity |
| "proof-of-concept" | "PoC", "exploit" | Reserve "exploit" for weaponized code; PoC demonstrates existence |
| "arbitrary code execution" | "RCE" | Acronym expands to "remote code execution" which is a subset; be specific |
| "memory corruption" | "overflow" | Overflow is a mechanism; corruption is the effect; name the effect |
| "address space" | "memory" | More precise — distinguishes virtual from physical |

---

## 6. Citation and Attribution Standards

All claims about vulnerability behavior, architectural properties, or historical incidents must cite primary sources. Academic papers, vendor advisories, CVE entries, and NIST publications are preferred. Blog posts and social media are not citable as primary sources — they may appear in "Further Reading" with appropriate qualification.

Format citations as numbered footnotes or inline hyperlinks, consistently within a document. Do not mix formats.

When citing CVEs: `CVE-YYYY-NNNNN` (full format, no abbreviation).

When citing research papers: Author(s), "Title," Conference/Journal, Year, DOI if available.

---

## 7. Prohibited Content

Content submitted to NullByte Academy must not contain:

- Step-by-step operational instructions for attacking production systems
- Functional exploit code targeting real-world software with unpatched vulnerabilities
- Credentials, API keys, or real network addresses belonging to external parties
- Content that could be directly extracted and used to harm systems or individuals

Diagrams and code examples should use clearly fictitious addresses (`192.0.2.x`, `198.51.100.x` — RFC 5737 documentation ranges), synthetic function names, and anonymized data.

---

*Document version: 1.0 | Maintained by: NullByte Academy Curriculum Committee*

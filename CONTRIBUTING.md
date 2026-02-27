# Contributing to NullByte Academy

Thank you for your interest in contributing. NullByte Academy is built on the principle that security education improves when practitioners collaborate to make it more accurate, more complete, and more rigorous. Every contribution — from a typo fix to a new lab exercise — makes the curriculum more valuable for everyone who uses it.

This document covers everything you need to know to contribute effectively.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [What We Welcome](#what-we-welcome)
- [What We Do Not Accept](#what-we-do-not-accept)
- [Getting Started](#getting-started)
- [Contribution Workflow](#contribution-workflow)
- [Content Standards](#content-standards)
- [Markdown & Formatting Standards](#markdown--formatting-standards)
- [Code Block Standards](#code-block-standards)
- [XLSX Workbook Standards](#xlsx-workbook-standards)
- [PPTX Slide Standards](#pptx-slide-standards)
- [Reporting Issues](#reporting-issues)
- [Pull Request Process](#pull-request-process)
- [Commit Message Standards](#commit-message-standards)
- [Versioning](#versioning)
- [Contact](#contact)

---

## Code of Conduct

NullByte Academy maintains a professional, collaborative environment. Contributors are expected to:

- Engage with technical disagreements using evidence, not assertion
- Give clear, actionable feedback on pull requests — critique the content, not the contributor
- Attribute others' work correctly — do not submit content that is substantially derived from external sources without proper citation
- Respect the scope and ethical constraints of the project — we are building educational material, not attack tooling

Persistent violation of these expectations will result in removal from the contributor list and potential blocking from the repository.

---

## What We Welcome

| Contribution Type | Description |
|------------------|-------------|
| **Factual corrections** | Fixing incorrect technical claims in any document |
| **Clarity improvements** | Rewrites that make an explanation clearer without changing its technical content |
| **New lab exercises** | Purpose-built exercises with isolated, permissioned targets following lab design standards |
| **Glossary additions** | New terms with precise, well-sourced definitions |
| **Workbook improvements** | New reference tables, corrected data, or additional columns in XLSX workbooks |
| **Toolchain updates** | Updates to commands, tool flags, or version references that have changed |
| **New module proposals** | Structured proposals for new curriculum modules (see Module Proposals below) |
| **Translation** | Accurate translations of documentation into other languages |
| **Bug reports** | Issues filed against incorrect content, broken links, or environment setup problems |

---

## What We Do Not Accept

The following will be closed without review:

- Functional exploit code, shellcode, or payload construction tutorials
- Content that reduces defensive framing in favor of operational attack guidance
- Lab exercises targeting real systems, real networks, or non-permissioned targets
- Submissions that include personal data, API keys, credentials, or private information
- Content that is substantially reproduced from a copyrighted source without proper attribution and compatibility with the MIT License
- Marketing material, advertising, or self-promotion unrelated to the educational mission

---

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository via GitHub, then:
git clone https://github.com/YOUR-USERNAME/nullbyte-academy.git
cd nullbyte-academy

# Add upstream remote
git remote add upstream https://github.com/nullbyte-academy/nullbyte-academy.git
```

### 2. Create a Branch

Branch names should be descriptive and use lowercase with hyphens:

```bash
# For content fixes
git checkout -b fix/m02-stack-frame-rbp-description

# For new content
git checkout -b feat/m02-lab-heap-tracing-exercise

# For documentation
git checkout -b docs/faq-add-docker-question
```

**Branch naming conventions:**

| Prefix | Use For |
|--------|---------|
| `fix/` | Corrections to existing content |
| `feat/` | New content: labs, modules, workbook sections |
| `docs/` | Documentation-only changes (README, FAQ, CONTRIBUTING) |
| `style/` | Formatting, markdown cleanup, no content change |
| `refactor/` | Structural reorganization with no content change |

### 3. Make Your Changes

Follow the standards in the [Content Standards](#content-standards) and [Markdown & Formatting Standards](#markdown--formatting-standards) sections below. Verify your changes render correctly in a Markdown preview before submitting.

### 4. Sync with Upstream

Before submitting, sync your branch with the latest upstream main:

```bash
git fetch upstream
git rebase upstream/main
```

Resolve any conflicts carefully, preserving both the upstream changes and your intended contribution.

---

## Contribution Workflow

```
Issue or Discussion
       │
       ▼
  Fork → Branch
       │
       ▼
  Write / Edit Content
       │
       ▼
  Self-Review (checklist below)
       │
       ▼
  Open Pull Request
       │
       ▼
  Maintainer Review
       │
  ┌────┴────┐
  │         │
Changes   Approval
Requested    │
  │          ▼
  │      Merge to main
  │
  └──────── Revise → Re-request review
```

For significant contributions (new modules, structural changes to existing modules, new lab types), open a GitHub Issue for discussion *before* writing content. This avoids investment in work that may not align with the curriculum direction.

---

## Content Standards

### Technical Accuracy

- Every factual claim must be verifiable. Cite your source inline using a bracketed reference or footnote.
- Use specific version numbers when referencing tool behavior, compiler behavior, or OS behavior that varies by version.
- Do not generalize: if something is true for GCC but not Clang, say so explicitly.
- When referencing CVEs, always include the full CVE-ID and link to the NVD record.

### Scope and Framing

All content must remain within the defensive, educational framing of the curriculum. When describing how an attack class works:

- Describe the mechanism structurally — *what memory condition exists, and why that condition matters to the execution model*
- Do not provide step-by-step operational instructions for constructing working exploits against real targets
- Do not include code that is operationally functional as an attack tool — pseudocode, schematic code, and annotated disassembly excerpts from permissioned lab binaries are acceptable

### Voice and Register

- Write in third person for reference material (glossary, module content, workbook descriptions)
- Write in second person for instructional material (lab guides, setup instructions, exercises): *"Navigate to the function's entry point and set a breakpoint."*
- Avoid hedging language where the technical claim is known: write "ASLR randomizes base addresses at load time" not "ASLR may randomize base addresses"
- Avoid marketing language: write "The module covers CFI mechanisms" not "The module gives you everything you need to master CFI"

### Lab Design Standards

New lab exercises must include:

| Element | Requirement |
|---------|-------------|
| **Environment spec** | Exact OS, tool versions, and setup commands required |
| **Permissioned target** | Purpose-built binary or VM image — never a real production system |
| **Objective statement** | One clear sentence describing what the student will demonstrate |
| **Step sequence** | Numbered steps that produce observable, verifiable results |
| **Expected outputs** | What the student should see at each key step |
| **Analysis prompts** | Questions that require the student to reason, not just observe |
| **Defensive takeaway** | What this exercise reveals about defensive design or secure coding |

---

## Markdown & Formatting Standards

### Document Structure

Every Markdown document must begin with an H1 title and a brief summary sentence. Table of contents is required for documents longer than 500 words.

```markdown
# Document Title

Brief summary of what this document covers and who it is for.

---

## Table of Contents

- [Section One](#section-one)
- [Section Two](#section-two)
```

### Heading Hierarchy

| Level | Use Case |
|-------|----------|
| `# H1` | Document title only (one per file) |
| `## H2` | Major sections |
| `### H3` | Subsections within a major section |
| `#### H4` | Use sparingly — only when H3 subdivision is genuinely needed |

Never skip heading levels (do not go from H2 directly to H4).

### Lists

- Use unordered lists (`-`) for non-sequential items
- Use ordered lists (`1.`) for steps, procedures, or ranked items
- Use description lists (bold term + colon + description) for term-definition pairs in prose
- Limit nesting to two levels; deeper nesting is almost always a sign the content needs to be restructured

### Tables

Use tables for structured reference data: register tables, command references, comparison matrices. Do not use tables as a substitute for prose where the relationship between items is narrative rather than categorical.

Every table must include a header row with column names.

### Emphasis

- `**Bold**` for technical terms being introduced for the first time, key warnings, and UI labels
- `*Italic*` for titles, foreign phrases, and light emphasis
- `` `Inline code` `` for file names, command names, register names, addresses, and technical identifiers that must be written exactly as shown
- Do not use emphasis for decoration — every use of bold or italic should have a clear semantic reason

---

## Code Block Standards

All code blocks must specify a language for syntax highlighting:

````markdown
```bash
# Shell commands
checksec --file=./binary
```

```c
// C code samples
void vulnerable_function(char *input) {
    char buf[64];
    strcpy(buf, input);  // Spatial safety violation: CWE-121
}
```

```python
# Python
from pwn import *
```

```asm
; x86-64 Assembly (Intel syntax)
push    rbp
mov     rbp, rsp
sub     rsp, 0x30
```
````

**Supported language identifiers:** `bash`, `c`, `cpp`, `python`, `asm`, `javascript`, `json`, `yaml`, `markdown`, `text`

For terminal output that is not a command (e.g., GDB output, program output), use `` ```text ``.

Do not include sensitive data, real credentials, real IP addresses, or real hostnames in code examples.

---

## XLSX Workbook Standards

When contributing to or modifying XLSX workbooks:

- Maintain existing column structure — add columns to the right, never remove existing columns
- Use consistent data types in each column — do not mix text and numeric values in the same column
- Cell references in formulas must use absolute addressing (`$A$1`) where the reference should not shift on copy
- Header rows must be frozen (View → Freeze Top Row)
- Do not apply password protection to sheets or workbooks
- Save in `.xlsx` format, not `.xlsm` or `.xls`

---

## PPTX Slide Standards

When contributing new slides or modifying existing presentations:

- Follow the established dark/cyberpunk color palette: `#0D0D0D` background, `#00FF41` primary green, `#FFA500` amber, `#00BFFF` blue
- Use Courier New for code and technical labels; use the established body font for prose
- Maintain the academy branding header and footer on every content slide
- Every slide must include at least one visual element (diagram, code block, table) — no text-only slides
- New modules must follow the 5-slide minimum structure: title → concept → detail → detail → lab exercise

---

## Reporting Issues

Use GitHub Issues for:

| Issue Type | Label to Apply |
|------------|----------------|
| Technical inaccuracy in curriculum content | `content-error` |
| Broken or outdated command / tool reference | `toolchain` |
| Unclear or confusing explanation | `clarity` |
| Lab environment setup problem | `lab-environment` |
| New module proposal | `module-proposal` |
| Security concern in the platform itself | See `SECURITY.md` |

Issue titles should be specific: *"M02: RBP description incorrect — saved frame pointer is pushed by callee, not caller"* is useful. *"M02 is wrong"* is not.

---

## Pull Request Process

1. **Title:** Use the format `[type]: brief description` — e.g., `[fix]: M03 ASLR entropy description corrected for PIE binaries`
2. **Description:** Explain *what* changed, *why* it needed changing, and *how* you verified the change is correct
3. **Link the issue:** Reference the issue your PR closes with `Closes #NNN`
4. **Self-review checklist:**

```
[ ] Content is technically accurate (cite sources for new claims)
[ ] No functional exploit code or payload construction included
[ ] Markdown renders correctly (checked in preview)
[ ] Code blocks have language identifiers
[ ] No personal data, credentials, or real hostnames in content
[ ] CHANGELOG.md updated with a description of the change
[ ] Branch is rebased on current upstream/main
```

5. **Review turnaround:** Maintainers aim to provide initial review feedback within 7 business days. Complex contributions may take longer.
6. **Revisions:** Address reviewer comments in the same branch with additional commits. Do not close and reopen the PR.
7. **Merge:** Maintainers handle the merge. Contributions will be squash-merged to keep the commit history clean.

---

## Commit Message Standards

Follow the conventional commit format:

```
type(scope): short description (50 chars max)

Optional longer description explaining the why, not the what.
The what is visible in the diff. The why is not.

Closes #123
```

**Types:** `fix`, `feat`, `docs`, `style`, `refactor`, `test`, `chore`

**Scope examples:** `m01`, `m02-lab`, `glossary`, `workbooks`, `readme`, `pptx`

**Examples:**

```
fix(m02): correct RSP/RBP description in stack frame anatomy section

The previous text stated RBP is pushed by the caller. It is pushed
by the callee at function entry (PUSH RBP). Corrected with citation
to System V AMD64 ABI §3.4.1.

Closes #47
```

```
feat(m04-lab): add LAB-RE-03 dynamic analysis exercise for stripped binary

New lab covering pwndbg workflow on a stripped ELF with obfuscated
control flow. Includes binary, lab guide, and expected output references.

Closes #89
```

---

## Versioning

NullByte Academy uses **calendar-based versioning** in the format `YYYY.MM.PATCH`:

- `2026.03.0` — First release of March 2026
- `2026.03.1` — Patch release within the same month
- `2026.04.0` — New monthly release

Version numbers are updated in `CHANGELOG.md` at every release. Contributors do not set version numbers — maintainers assign versions at release time.

---

## Module Proposals

To propose a new curriculum module, open an issue with the label `module-proposal` and include:

1. **Module title and topic area**
2. **Rationale:** Why does this belong in the NullByte Academy curriculum? What gap does it fill?
3. **Prerequisites:** What must a student know before taking this module?
4. **Learning objectives:** 3–5 specific, measurable outcomes
5. **Outline:** Proposed section headings and lab exercise descriptions
6. **Estimated scope:** How many hours of content? How many lab exercises?
7. **Your commitment:** Are you willing to author the module, or are you proposing it for others to develop?

Proposals that include a draft outline and clear rationale will receive prioritized review.

---

## Contact

For contribution questions not covered in this document:

- **GitHub Discussions:** Preferred — keeps the conversation visible to the community
- **Email:** `mrwhite4939@gmail.com` — for private matters only

---

*This document is versioned alongside the project. If you notice it is out of date, please open an issue or a PR.*

*© 2026 NullByte Academy — MIT License*

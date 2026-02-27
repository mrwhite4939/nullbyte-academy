# Acknowledgements — NullByte Academy

NullByte Academy is built on the foundations laid by decades of open security research, exceptional open-source tooling, and the willingness of practitioners to publish what they know. This document recognizes the tools, references, researchers, and communities that make this curriculum possible.

---

## Table of Contents

- [Core Tooling](#core-tooling)
- [Analysis & Reverse Engineering Tools](#analysis--reverse-engineering-tools)
- [Academic & Technical References](#academic--technical-references)
- [Vulnerability Databases & Standards Bodies](#vulnerability-databases--standards-bodies)
- [Influential Research & Publications](#influential-research--publications)
- [Open-Source Libraries & Dependencies](#open-source-libraries--dependencies)
- [Educational Inspirations](#educational-inspirations)
- [Community & Ecosystem](#community--ecosystem)

---

## Core Tooling

The following tools are used directly in lab exercises, content creation, or platform development. They are listed with their authors, licenses, and the purpose they serve in the curriculum.

| Tool | Author / Maintainer | License | Role in Curriculum |
|------|--------------------|---------|--------------------|
| **GDB** (GNU Debugger) | GNU Project / FSF | GPL v3 | Primary dynamic analysis debugger across all labs |
| **pwndbg** | Dominik Czarnota et al. | MIT | GDB enhancement for security research; used in all dynamic analysis labs |
| **Ghidra** | NSA Research Directorate | Apache 2.0 | Primary static analysis / disassembly platform for M04 labs |
| **objdump** | GNU Binutils Project | GPL v3 | Binary inspection, disassembly verification, ELF analysis |
| **readelf** | GNU Binutils Project | GPL v3 | ELF header, section, segment, and dynamic entry inspection |
| **checksec** | slimm609 (Bash version); Brian Davis (Python version) | BSD / Apache 2.0 | Mitigation audit for lab binaries in M03 |
| **pwntools** | Gallopsled / Pwntools Team | MIT | Python library used in lab scripting exercises |
| **strace** | Paul Kranenburg et al. | BSD | System call tracing in dynamic analysis labs |
| **ltrace** | Juan Cespedes et al. | GPL v2 | Library call tracing in dynamic analysis labs |
| **file** | Ian Darwin / Christos Zoulas | BSD | Binary format identification at lab exercise start |
| **strings** | GNU Binutils / David MacKenzie | GPL v3 | String extraction for initial binary reconnaissance |
| **binwalk** | Craig Heffner / ReFirmLabs | MIT | Firmware and embedded binary analysis (M07 research labs) |

---

## Analysis & Reverse Engineering Tools

These tools shape the reverse engineering methodology taught in M04 and inform the toolchain orientation sections of the curriculum.

**Binary Ninja**
Developed by Vector 35, Inc. Binary Ninja's clean API design and scriptability set a standard for modern binary analysis platforms. Its approach to intermediate language (MLIL/HLIL) representation influenced how the curriculum presents the idea of progressive abstraction in RE methodology. [vector35.com](https://binary.ninja)

**IDA Pro / IDA Free**
Developed by Hex-Rays. IDA Pro has defined the professional reverse engineering toolchain for decades. The curriculum references IDA's design decisions in discussion of cross-reference mapping and naming convention best practices. IDA Free is acknowledged as an entry point for students exploring the commercial toolchain. [hex-rays.com](https://hex-rays.com)

**PEDA (Python Exploit Development Assistance for GDB)**
Developed by Long Le (longld). PEDA pioneered the enhanced GDB context display that pwndbg and GEF subsequently extended and improved. Its influence on how the security community approaches dynamic analysis workflows is significant. [github.com/longld/peda](https://github.com/longld/peda)

**GEF (GDB Enhanced Features)**
Developed by hugsy. An alternative GDB enhancement to pwndbg, GEF's documentation and context display design influenced the lab exercise presentation style in M04. [hugsy.github.io/gef](https://hugsy.github.io/gef)

**Radare2**
Developed by pancake and the radare2 community. Radare2's architecture — modular, scriptable, and fully open-source — represents an important design philosophy in security tooling. The curriculum references radare2 as an alternative disassembly and analysis platform. [rada.re](https://rada.re)

---

## Academic & Technical References

The following texts, specifications, and documentation serve as primary sources for curriculum content. Students encountering a concept in the curriculum and seeking deeper grounding should consult these directly.

**CPU Architecture & Instruction Set**

- *Intel® 64 and IA-32 Architectures Software Developer's Manual* (Volumes 1–4). Intel Corporation. The authoritative reference for x86/x64 instruction semantics, privilege levels, and architectural behavior. Referenced throughout M01 and M03.

- *AMD64 Architecture Programmer's Manual* (Volumes 1–5). Advanced Micro Devices. Complementary to the Intel SDM; particularly useful for differences in AMD-specific extensions.

- Patterson, D.A. & Hennessy, J.L. *Computer Organization and Design: ARM Edition* (and x86 Edition). Morgan Kaufmann. Provides the broader computer architecture context that M01 assumes.

**Operating Systems & Memory Management**

- Bovet, D.P. & Cesati, M. *Understanding the Linux Kernel* (3rd Edition). O'Reilly Media. The definitive reference for Linux kernel memory management, process address space construction, and system call implementation.

- Love, R. *Linux Kernel Development* (3rd Edition). Addison-Wesley. A more accessible treatment of Linux internals; used to verify curriculum claims about process memory layout in M02.

- *System V Application Binary Interface: AMD64 Architecture Processor Supplement*. The ABI specification document that defines calling conventions, register usage, and stack alignment requirements taught in M01 and M02. [refspecs.linuxfoundation.org](https://refspecs.linuxfoundation.org)

**Security & Exploit Mitigations**

- Sotirov, A. & Dowd, M. *Bypassing Browser Memory Protections*. Black Hat USA 2008. A foundational research paper establishing the framework for reasoning about mitigation layering that informs M03.

- *Bypassing Linux's Stack Guard-Page Protection*. Red Hat Security Blog. Specific mitigation mechanics referenced in the stack canary section of M03.

- Solar Designer. *Non-executable Stack Patch*. Openwall Project, 1997. The original NX patch for Linux; referenced in M03's mitigation history section to establish the chronological development of defenses.

- Shacham, H. *The Geometry of Innocent Flesh on the Bone: Return-into-libc without Function Calls (on the x86)*. ACM CCS 2007. The canonical ROP research paper referenced in M03 when discussing why CFI exists.

- Younan, Y., Joosen, W., & Piessens, F. *Code injection attacks on Harvard-architecture devices*. ACM CCS 2008. Referenced in vulnerability class framing in M05.

**Heap Internals**

- Gloger, W. *ptmalloc — A Thread-Aware Implementation of Malloc*. The glibc heap allocator documentation referenced throughout M02's heap internals section.

- Phantasmal Phantasmagoria. *Malloc Des-Maleficarum*. Archived heap exploitation research paper referenced in M02 for historical context on bin types and chunk structure.

- Azeria Labs. *Heap Exploitation Series*. A series of well-structured articles on heap allocator internals referenced as a supplementary resource for M02 lab preparation. [azeria-labs.com](https://azeria-labs.com)

**Reverse Engineering**

- Eagle, C. *The IDA Pro Book* (2nd Edition). No Starch Press. Despite its IDA focus, this book's treatment of disassembly interpretation and analysis methodology informed the M04 curriculum structure.

- Sikorski, M. & Honig, A. *Practical Malware Analysis*. No Starch Press. The malware analysis methodology sections informed the structured analysis workflow taught in M04 and M07.

---

## Vulnerability Databases & Standards Bodies

**National Vulnerability Database (NVD)**
Operated by the National Institute of Standards and Technology (NIST). The NVD is the primary source for CVE records, CVSS scoring, and CPE data referenced in M07 and the CVE analysis workbook template. [nvd.nist.gov](https://nvd.nist.gov)

**MITRE Corporation — CVE Program**
MITRE administers the CVE numbering system that organizes vulnerability identifiers across the curriculum. The CVE List is cited as the canonical source of record for individual vulnerability identifiers. [cve.mitre.org](https://cve.mitre.org)

**MITRE Corporation — CWE Program**
The Common Weakness Enumeration taxonomy provides the classification framework used in M05 and the vulnerability taxonomy workbook (`wb_vuln_taxonomy.xlsx`). CWE classifications are cited throughout the module wherever vulnerability classes are discussed. [cwe.mitre.org](https://cwe.mitre.org)

**FIRST — Forum of Incident Response and Security Teams**
FIRST maintains the CVSS specification (Common Vulnerability Scoring System) referenced in the CVE analysis framework of M07. The CVSS v3.1 calculator and specification are cited as the authoritative scoring reference. [first.org/cvss](https://www.first.org/cvss)

**OWASP — Open Worldwide Application Security Project**
OWASP's CWE-to-OWASP mapping and secure coding guidelines inform the M06 secure coding module. The OWASP Cheat Sheet Series is recommended as a supplementary reference for M06 students. [owasp.org](https://owasp.org)

---

## Influential Research & Publications

The following researchers and publications have shaped how NullByte Academy thinks about security education, vulnerability research, and responsible disclosure. This is not an exhaustive list — it represents the work that most directly influenced curriculum design decisions.

**Aleph One (Elias Levy)**
*Smashing the Stack for Fun and Profit*, Phrack Magazine Issue 49, 1996. The paper that introduced the conceptual framework for stack-based buffer overflow education to an entire generation of security practitioners. Its influence on how the curriculum structures M02 and M05 is direct and acknowledged.

**Halvar Flake (Thomas Dullien)**
Work on binary analysis, program analysis, and the epistemology of security research. Thomas Dullien's public writing on what it means to understand a binary and on the structure of vulnerability classes informed the research methodology sections of M07.

**Alexander Sotirov**
Research on heap exploitation, browser security, and mitigation bypass history. Sotirov's work establishing systematic analysis frameworks for mitigations informed M03.

**Chris Rohlf and Yan Ivnitskiy**
*Interpreter Exploitation: Pointer Inference and JIT Spraying*, 2011. Referenced in the JIT-related content of M03's CFI section.

**ROPgadget Tool — Jonathan Salwan**
ROPgadget's approach to automated gadget discovery informed the curriculum's explanation of why backward-edge CFI exists and what it must protect against. [github.com/JonathanSalwan/ROPgadget](https://github.com/JonathanSalwan/ROPgadget)

---

## Open-Source Libraries & Dependencies

The NullByte Academy platform and content creation toolchain depend on the following open-source projects:

| Library / Tool | License | Use |
|---------------|---------|-----|
| **PptxGenJS** | MIT | PPTX presentation generation for module slide decks |
| **React** | MIT | Frontend interactive platform (quiz engine, stack visualizer) |
| **Node.js** | MIT | Server-side JavaScript runtime for content tooling |
| **Python 3** | PSF License | Lab scripting, content processing scripts |
| **pwntools** | MIT | Python library used in advanced lab exercises |
| **markitdown** | MIT | PPTX and document content extraction for QA |
| **sharp** | Apache 2.0 | Image processing in SVG-to-PNG conversion pipeline |

---

## Educational Inspirations

**Pwn College**
An exceptional hands-on security education platform developed at Arizona State University. Pwn College's commitment to making low-level security education available freely, with real learning-by-doing mechanics, is a direct inspiration for the lab-centric structure of NullByte Academy. [pwn.college](https://pwn.college)

**LiveOverflow (Fabian Freyer)**
LiveOverflow's YouTube channel demonstrated that genuinely technical, zero-condescension security education finds a large, grateful audience. The clear explanation of low-level concepts without artificial simplification informed the curriculum's writing philosophy. [liveoverflow.com](https://liveoverflow.com)

**OpenSecurityTraining2 (Xeno Kovah)**
OST2's rigorous, publicly available security courses on architecture internals, malware analysis, and reverse engineering established a benchmark for depth in free security education. [ost2.fyi](https://ost2.fyi)

**Exploit Education**
The protostar, phoenix, and nebula challenge series by Andrew Griffiths provided models for designing purpose-built vulnerable binaries that teach isolated concepts without producing operational attack tools. [exploit.education](https://exploit.education)

---

## Community & Ecosystem

The broader security research community — particularly the practitioners who publish conference talks, write detailed blog posts, share public CVE analyses, and maintain open-source tools without compensation — makes curricula like NullByte Academy possible. We are downstream beneficiaries of their generosity.

Specific communities whose public output informs the curriculum:

- **Phrack Magazine** — The original long-form technical security publication. Decades of deep technical writing that established the standard for serious security research communication.
- **DEF CON / Black Hat** — Public talks and papers from both conferences are cited throughout the curriculum as examples of primary research.
- **Project Zero (Google)** — Project Zero's detailed public bug reports set the standard for how to document vulnerability root causes with precision and rigor. Their disclosure practice is referenced in M07 as a model for structured research output.
- **The Hacker News / /r/netsec** — Community aggregators that surface new research and keep practitioners current; referenced as supplementary discovery channels for M07 students.

---

*If we have inadvertently omitted an attribution that should be present, please open a GitHub issue with the label `attribution`. We take proper credit seriously.*

*© 2026 NullByte Academy — MIT License*

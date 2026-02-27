# Frequently Asked Questions — NullByte Academy

> This document answers the most common questions from students, contributors, and visitors. If your question isn't covered here, open a discussion on the repository or contact the team at `mrwhite4939@gmail.com`.

---

## Table of Contents

- [General](#general)
- [Modules & Curriculum](#modules--curriculum)
- [Labs & Environments](#labs--environments)
- [Technical Issues](#technical-issues)
- [Ethics & Legal](#ethics--legal)
- [Contributing & Community](#contributing--community)

---

## General

**What is NullByte Academy?**

NullByte Academy is a professional cybersecurity research and education platform focused on low-level systems security. The curriculum covers x86/x64 CPU architecture, memory layout, assembly language, reverse engineering, exploit mitigations, and vulnerability root cause analysis — all through a defensive, research-first lens.

**Who is NullByte Academy for?**

The curriculum is designed for:

- Software developers who want a deep understanding of memory safety and secure coding
- Security analysts transitioning into vulnerability research or malware analysis
- Computer science students seeking systems-level security knowledge beyond what university courses typically cover
- Experienced practitioners who want to formalize and deepen existing intuitions about low-level behavior

The material assumes comfort with at least one systems programming language (C, C++, or Rust) and basic familiarity with Linux. It does not assume prior security knowledge.

**Is NullByte Academy free?**

Yes. All documentation, curriculum materials, presentations, and lab guides are freely available under the MIT License. There are no paywalls, subscription tiers, or premium content gates.

**Is this a certification program?**

No. NullByte Academy does not issue certificates or credentials. The focus is on building genuine, durable understanding — the kind that passes scrutiny in a technical interview or research context, not the kind that satisfies a multiple-choice exam.

**What makes NullByte Academy different from other cybersecurity learning platforms?**

Three things distinguish this curriculum:

1. **Depth over breadth.** Each module covers one domain thoroughly rather than skimming many. A student who completes M02 will be able to reason about stack frame layout without prompting — not just recall that "the stack grows down."
2. **Theory enables defense.** Every offensive concept is taught to illuminate attack surface and inform defensive engineering decisions — not to build operational capability.
3. **Research literacy is a first-class objective.** Students engage with primary sources: CVE records, NVD entries, vendor advisories, compiler documentation, and OS internals references. The goal is to produce security practitioners who can generate knowledge, not just consume it.

---

## Modules & Curriculum

**How are the modules structured?**

Each module follows the same structure:

| Component | Description |
|-----------|-------------|
| PDF Introduction | Conceptual primer, printable offline reference |
| Slide Deck (.pptx) | Visual teaching material, 5 slides minimum per module |
| XLSX Workbook | Structured reference tables, analysis logs, audit checklists |
| Lab Guide | Hands-on exercises tied to module concepts |
| Lab Environment | Isolated VM template or controlled binary set |

**What is the recommended study sequence?**

The modules are designed to be taken in order. Each builds directly on the previous:

```
M01 (CPU) → M02 (Memory) → M03 (Mitigations) → M04 (RE) → M05 (Vuln Classes) → M06 (Secure Coding) → M07 (Research)
```

Skipping M01 or M02 will make M03–M05 significantly harder. The calling convention material in M01 is directly prerequisite to stack frame analysis in M02, which is directly prerequisite to understanding overflow mechanics in M05.

**How long does each module take?**

Rough estimates, assuming a motivated student with relevant background:

| Module | Estimated Study Time |
|--------|---------------------|
| M01 — CPU Architecture | 8–12 hours |
| M02 — Memory Layout | 10–15 hours |
| M03 — Exploit Mitigations | 8–12 hours |
| M04 — Reverse Engineering | 15–25 hours |
| M05 — Vulnerability Classes | 12–18 hours |
| M06 — Secure Coding | 10–14 hours |
| M07 — Research Methods | 10–15 hours |

Lab time varies significantly by student pace and depth of investigation.

**Can I use NullByte Academy materials in my own courses or workshops?**

Yes. The MIT License permits use, modification, and redistribution for any purpose including commercial teaching, provided the copyright notice is retained. Attribution to NullByte Academy is appreciated but not legally required beyond the license terms.

**Are there prerequisites for specific modules?**

- **M01–M02:** Comfort with binary/hex notation; basic Linux command line (file navigation, running programs, using a text editor)
- **M03:** Completion of M01 and M02, or equivalent knowledge
- **M04:** Familiarity with compiled C code; ability to read basic function definitions
- **M05:** Completion of M02–M04 strongly recommended
- **M06–M07:** Completion of M01–M05, or substantive prior experience equivalent

---

## Labs & Environments

**What operating system do the labs require?**

Labs are designed for **64-bit Linux** (Ubuntu 22.04 LTS or Debian 12 recommended). Most tooling referenced in the curriculum is Linux-native. macOS can run most static analysis exercises but is not supported for all dynamic analysis labs. Windows is not supported as a primary lab environment.

**What tools do I need installed?**

Core tools used across the curriculum:

```bash
# Analysis toolchain
sudo apt install gdb binutils pwndbg-gdb python3 python3-pip

# Ghidra (download separately from ghidra-sre.org)
# Requires OpenJDK 17+: sudo apt install openjdk-17-jdk

# Binary inspection
sudo apt install file binwalk checksec readelf

# Debugging aids
pip3 install pwntools

# pwndbg (GDB enhancement)
git clone https://github.com/pwndbg/pwndbg
cd pwndbg && ./setup.sh
```

**Do I need a VM? Can I run labs on bare metal?**

Lab exercises in M04 and M05 use purpose-built vulnerable binaries. While they are not weaponized or dangerous in the traditional sense, running any potentially vulnerable code in an isolated environment is good practice and strongly recommended. A dedicated VM (VirtualBox, VMware, or QEMU/KVM) with no shared folders and host-only networking is the standard setup.

**What VM configuration is recommended?**

| Setting | Recommended Value |
|---------|-----------------|
| RAM | 4GB minimum, 8GB preferred |
| Storage | 40GB minimum |
| CPU | 2 cores minimum |
| Network | Host-only or NAT (no bridge) |
| OS | Ubuntu 22.04 LTS 64-bit |
| Snapshots | Take a clean snapshot before each lab module |

**The lab binary segfaults immediately. What should I check?**

In order:

1. Confirm you are running on 64-bit Linux (not 32-bit or a non-Linux OS)
2. Check that ASLR is at the expected level for the exercise: `cat /proc/sys/kernel/randomize_va_space`
3. Confirm the binary has execute permission: `chmod +x ./lab_binary`
4. Run with GDB to catch the signal: `gdb -q ./lab_binary` → `run` → observe the fault address and faulting instruction
5. Check the lab guide for any required environment setup steps specific to that exercise

**Can I use Docker instead of a VM?**

Docker is acceptable for most static analysis and code review exercises. Dynamic analysis labs (especially those involving GDB with pwndbg and memory inspection) work best in a full VM with ptrace privileges. If using Docker, run with `--privileged` and `--cap-add=SYS_PTRACE` flags, though a VM is still preferred for full fidelity.

---

## Technical Issues

**GDB is not showing pwndbg context. What's wrong?**

Confirm pwndbg is installed and sourced in your `.gdbinit`:

```bash
# Check .gdbinit
cat ~/.gdbinit

# Should contain:
source /path/to/pwndbg/gdbinit.py

# If missing, add it:
echo "source ~/pwndbg/gdbinit.py" >> ~/.gdbinit
```

If GDB launches but pwndbg context is absent, run `context` manually inside GDB to test.

**Ghidra's decompiler output looks wrong or shows only `??` for function bodies.**

This usually means auto-analysis did not run or completed with errors. Try:

1. `Analysis → Auto Analyze` → wait for completion (watch the taskbar progress)
2. If functions are not recognized, highlight the bytes at the function start and press `F` to define a function manually
3. For stripped binaries, set the entry point manually via `Window → Defined Entry Points`

**`checksec` reports no output or errors on my binary.**

Ensure checksec is up to date. Some older versions do not handle certain ELF variants:

```bash
pip3 install --upgrade checksec.py
# Or use the bash version:
wget -O checksec.sh https://raw.githubusercontent.com/slimm609/checksec.sh/master/checksec
chmod +x checksec.sh && ./checksec.sh --file=./binary
```

**The XLSX workbooks open with formatting errors in LibreOffice Calc.**

The workbooks are authored in Excel-compatible format. In LibreOffice, open the file and when prompted, choose "Keep Current Format." Conditional formatting and some cell border styles may render slightly differently but all data will be intact. For full fidelity, use Microsoft Excel 2016+ or Excel for Microsoft 365.

---

## Ethics & Legal

**Am I allowed to practice these techniques outside of the lab environments?**

Only on systems you own outright or have explicit, documented written authorization to test. Testing techniques from this curriculum against systems, networks, or software you do not own or have authorization for is illegal under the Computer Fraud and Abuse Act (CFAA), the Computer Misuse Act (CMA), and equivalent legislation in most jurisdictions.

NullByte Academy takes no responsibility for misuse of curriculum concepts. See `SECURITY.md` and `03_ETHICS.md` for the complete conduct policy.

**Does NullByte Academy teach hacking?**

The curriculum teaches how attacks work mechanistically, in the same way a structural engineering course teaches how buildings fail — because understanding failure modes is prerequisite to preventing them. The goal is not to produce attackers. The goal is to produce security engineers who can reason about low-level systems with genuine depth.

All lab exercises are conducted against purpose-built, permissioned targets in isolated environments. No lab exercise involves real systems, real networks, or real user data.

**Can I share my lab reports or analysis documents publicly?**

Yes, with one important exception: do not publish complete working exploit code derived from the lab exercises, even for the purpose-built vulnerable binaries. Publishing technique explanations, root cause analysis, CFG annotations, and defensive recommendations is encouraged and aligns with responsible security research practice.

---

## Contributing & Community

**How do I report an error in the curriculum materials?**

Open a GitHub issue with the label `content-error`. Include:
- The file name and section where the error appears
- A clear description of what is incorrect
- The correct information (with a citation or source if applicable)

**Can I contribute new modules or lab exercises?**

Yes. See `CONTRIBUTING.md` for the full contribution workflow. New module proposals should be submitted as GitHub issues with the label `module-proposal` before content is written, so the scope and fit can be discussed with the maintainers.

**Is there a community forum or discussion space?**

GitHub Discussions is the primary space for questions, learning discussions, and feedback. The repository's Discussions tab is open for all registered GitHub users.

---

*Last updated: 2026 | NullByte Academy*

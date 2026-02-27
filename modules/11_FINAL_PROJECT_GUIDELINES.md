# 12 — NullByte Academy: Final Project Guidelines

> *"The final project is not a test of what you remember. It is a demonstration of who you have become as a practitioner."*

---

## 1. Purpose

The NullByte Academy Final Project is the capstone assessment for students completing the Core Certificate (Tiers 0–2), Reverse Engineering Specialist track (Tiers 0–3), or Defensive Architect track (Tiers 0–4). It is not an exam. It is not a CTF. It is a professional-grade deliverable — the kind of work product a practitioner would be expected to produce in an actual security role.

The project demonstrates that the student can independently apply the skills, frameworks, and professional standards of the curriculum to a novel problem. It requires synthesis across domains. A student who has only mastered one tier's content will not have enough depth to complete it well.

All final projects are reviewed by a panel of at least two senior instructors. Passing requires meeting the competency threshold in each evaluation dimension. Projects that fall short may be revised and resubmitted once within a 60-day window.

---

## 2. Project Tracks

Students select one of three tracks based on their completed curriculum tier.

### Track A — Vulnerability Research and Analysis
*For students completing Tiers 0–2 (Core Certificate) or Tiers 0–3 (RE Specialist)*

Conduct a structured vulnerability analysis of a designated open-source target from the Academy's approved target list. Produce a full research package including system model, hypothesis log, analysis findings, impact assessment, and an advisory-format write-up.

### Track B — Defensive Architecture Review
*For students completing Tiers 0–4 (Defensive Architect)*

Conduct a threat-model-driven security architecture review of a provided system design document. Produce a threat model, prioritized finding list, architectural recommendations, and an SSDLC integration plan for the recommended controls.

### Track C — Original Research
*For Research Division students (Tier R)*

Conduct original vulnerability research under Ethics Board oversight, culminating in a coordinated disclosure advisory and a published research report suitable for academic or practitioner venues. This track requires pre-approval and a research charter signed off by a senior research mentor.

---

## 3. Track A: Vulnerability Research Project

### 3.1 Approved Target Criteria

Targets are drawn from the Academy's approved list, which consists of open-source software that is:

- Actively maintained with a responsive security disclosure process
- Written in a language with known memory safety characteristics (C, C++, or assembly)
- Complex enough to contain non-trivial code paths but scoped to a single subsystem
- Not currently known to contain unpatched critical vulnerabilities (avoids interference with ongoing research)

Students may propose targets outside the approved list with Ethics Board review.

### 3.2 Required Deliverables

| Deliverable | Description | Format |
|-------------|-------------|--------|
| Research Charter | Scope, target, method, ethical status | Markdown, 1–2 pages |
| System Model | Annotated attack surface map, DFD where applicable | Diagram + commentary |
| Hypothesis Log | Minimum 5 hypotheses with test methodology and results | Structured table + narrative |
| Analysis Report | Findings, evidence, impact assessment | Markdown, 8–12 pages |
| Advisory Draft | CVE-format advisory (even if no CVE is warranted) | Standard advisory format |

```
Track A Project Workflow:

  ┌──────────────────────────┐
  │  1. Target Selection     │ ← Pick from approved list, submit charter
  └──────────────┬───────────┘
                 │
  ┌──────────────▼───────────┐
  │  2. System Modeling      │ ← Build attack surface map, identify boundaries
  └──────────────┬───────────┘
                 │
  ┌──────────────▼───────────┐
  │  3. Hypothesis Phase     │ ← Generate, test, document ≥5 hypotheses
  └──────────────┬───────────┘
                 │
  ┌──────────────▼───────────┐
  │  4. Analysis + Evidence  │ ← Static, dynamic, or fuzzing-based evidence
  └──────────────┬───────────┘
                 │
  ┌──────────────▼───────────┐
  │  5. Impact Assessment    │ ← CVSS + qualitative analysis
  └──────────────┬───────────┘
                 │
  ┌──────────────▼───────────┐
  │  6. Write-Up + Review    │ ← Draft advisory, peer review, panel review
  └──────────────────────────┘
```

---

## 4. Track B: Defensive Architecture Review

### 4.1 System Design Document

The Academy provides three system design documents of varying complexity. Students select one. Documents describe a realistic system — a financial services API, a healthcare data platform, or a distributed SaaS application — with sufficient detail to support a full threat model.

### 4.2 Required Deliverables

| Deliverable | Description | Format |
|-------------|-------------|--------|
| Data Flow Diagram | Full DFD with trust boundaries annotated | Diagram (draw.io, ASCII, or equivalent) |
| STRIDE Analysis | Per data flow and trust boundary crossing | Structured table |
| Attack Tree | At least two high-priority goals | Diagram + narrative |
| Findings Report | Prioritized list of threats with severity ratings | Markdown, 10–15 pages |
| Mitigation Design | Architectural recommendations for top-5 findings | Narrative with design diagrams |
| SSDLC Integration Plan | Where and how mitigations integrate into development | Markdown, 2–3 pages |

```
Track B: Threat Model to Mitigation Pipeline

  System Design Doc
          │
          ▼
  ┌───────────────────┐
  │  Construct DFD    │ ← Identify actors, processes, stores, flows, boundaries
  └─────────┬─────────┘
            │
  ┌─────────▼─────────┐
  │  STRIDE per       │ ← 6 categories × each boundary = systematic coverage
  │  boundary         │
  └─────────┬─────────┘
            │
  ┌─────────▼─────────┐
  │  Risk Prioritize  │ ← Impact × Likelihood matrix
  └─────────┬─────────┘
            │
  ┌─────────▼─────────┐
  │  Attack Trees for │ ← Top 2–3 high-priority goals
  │  critical goals   │
  └─────────┬─────────┘
            │
  ┌─────────▼─────────┐
  │  Mitigation Design│ ← Architectural, not just tactical
  └─────────┬─────────┘
            │
  ┌─────────▼─────────┐
  │  SSDLC Integration│ ← Where do controls live in the pipeline?
  └───────────────────┘
```

---

## 5. Evaluation Rubric

The same core rubric applies to both tracks, with track-specific weighting.

| Dimension | Track A Weight | Track B Weight | What Reviewers Assess |
|-----------|---------------|---------------|-----------------------|
| Technical accuracy | 35% | 30% | Are facts, classifications, and analyses correct? |
| Analytical depth | 25% | 25% | Does the work go beyond surface-level observation? |
| Architectural reasoning | 15% | 30% | Are recommendations structural, not just tactical? |
| Ethical rigor | 15% | 5% | Is the ethical framework properly applied and documented? |
| Communication quality | 10% | 10% | Is the work clear, precise, and professionally presented? |

**Minimum passing threshold**: 70% overall, with no dimension below 55%.

---

## 6. Common Failure Modes

These are the patterns that distinguish projects that fail from projects that succeed.

**Describing the vulnerability class without analyzing the specific instance.** A project that reads "this software has heap buffer overflows because C is unsafe" has not done analysis. Analysis explains which specific allocation path, what the precise corruption condition is, and what architectural constraint created the opportunity.

**Producing findings without architectural recommendations.** A finding is not complete without a recommendation. The recommendation must address architectural root cause, not just add a validation check. "Add a bounds check" is a patch. "Restructure the parser to accept data through a bounded reader interface that makes out-of-bounds reads impossible to express in the caller" is an architectural recommendation.

**Ethical framework as boilerplate.** Ethics sections that consist of "I followed responsible disclosure guidelines" without demonstrating understanding of what that means in the specific context of the project are treated as insufficient. The ethics section should explain what disclosure obligations apply, what was done about them, and why.

**Underscoped hypotheses.** A hypothesis log with five hypotheses that all test the same code path is not sufficient. Hypotheses should span the attack surface identified in the system model. Breadth matters as much as depth.

---

## 7. Submission and Review Process

```
Project Submission Timeline:

  Week 0: Track selection + target/document confirmation
  Week 2: Charter or DFD submitted for early feedback
  Week 6: Draft deliverables submitted for peer review
  Week 8: Revised deliverables submitted to panel
  Week 9–10: Panel review, technical debrief session
  Week 11: Final grade and written feedback delivered
```

The technical debrief is a 45-minute session in which the student presents their key findings and answers questions from the review panel. It is not an adversarial examination. It is a professional conversation designed to verify that the written work reflects genuine understanding and to give reviewers the chance to ask about areas where the written work was ambiguous.

Students who cannot explain their written findings verbally — who cannot answer "why did this design choice create the vulnerability?" in their own words — do not pass, regardless of the quality of the document.

---

## 8. After the Project

Exceptional projects (top 10% by score) are nominated for publication in the NullByte Academy Research Repository, with the student's consent. Projects that identify real vulnerabilities in open-source software initiate the disclosure process described in `03_ETHICS.md` and `07_ZERO_DAY_RESEARCH_FRAMEWORK.md`.

Every completed final project, regardless of outcome, receives written reviewer feedback. This feedback is not a grade explanation — it is a professional development document identifying the student's strongest competencies and the areas where continued development will produce the most growth.

The project is the end of the curriculum. It is the beginning of a career.

---

*Document version: 1.0 | Project submissions: mrwhite4939@gmail.com*
*NullByte Academy Curriculum Committee | Last reviewed: 2026-Q1*

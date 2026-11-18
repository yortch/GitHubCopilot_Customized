---
name: user-story-writer
description: 'Turns feature requests, requirements, or rough ideas into clear, actionable user stories ready for backlog refinement. Each story has an outcome-focused title, a Gherkin (Given/When/Then) scenario set, verifiable acceptance criteria, Fibonacci story points, risks and dependencies, and assumptions and open questions. Triggers on requests like "write a user story", "create user stories", "turn this into stories", "break down this feature", "prepare backlog items", "refine this requirement", "estimate this story".'
---

# User Story Writer

Converts feature requests, requirements, or rough ideas into backlog-ready user stories that a team can refine, estimate, and build without a follow-up conversation.

## When to Use

- A stakeholder supplies a feature request, requirement, bug report, or one-line idea.
- A large feature or epic needs to be broken into deliverable stories.
- An existing story is vague, untestable, or missing acceptance criteria or an estimate.

Do not use this skill for implementation plans or technical task breakdowns. Stories describe *what value is delivered and how it is verified*, not *how it is coded*.

## Workflow

1. **Understand the input.** Identify the persona, the goal, and the business outcome. Read any referenced files, docs, or code only as far as needed to ground the story in the real product (existing screens, endpoints, terminology).
2. **Resolve ambiguity.** If a gap would change the scope, the estimate, or the acceptance criteria, ask the user (use the `ask_user` tool) before writing. For minor gaps, make a reasonable assumption and record it under *Assumptions*. Never invent business rules silently.
3. **Slice the work.** Split the request into independently valuable, vertical stories (see [Slicing Rules](#slicing-rules)). One request often yields several stories.
4. **Write each story** with the [Output Template](#output-template).
5. **Estimate** each story using the [Fibonacci scale](#story-points).
6. **Run the [Quality Checklist](#quality-checklist)** and fix any failure before presenting.
7. **Present the result.** Show the stories in the response. Write them to a file only when the user asks, and then use the path they specify (default: a single markdown file such as `docs/stories/<feature-slug>.md`).

When more than one story is produced, end with a short **summary table** (title, points, depends on) so the backlog order is obvious.

## Output Template

Use this structure for every story. Keep every section, in this order. If a section has nothing to report, write `None identified` rather than deleting it.

````markdown
## <Title>

**Story points:** <1 | 2 | 3 | 5 | 8 | 13>  
**Estimate rationale:** <one sentence on size drivers: complexity, uncertainty, effort>

### Story

```gherkin
Feature: <Title>
  As a <specific persona>
  I want <capability>
  So that <measurable outcome or value>

  Background:                      # optional: only for preconditions shared by all scenarios
    Given <shared context>

  Scenario: <Happy path>
    Given <precondition>
    When <single user or system action>
    Then <observable result>

  Scenario: <Alternate path / edge case>
    ...

  Scenario: <Error or negative case>
    ...
```

### Acceptance Criteria

- [ ] AC1: <specific, verifiable condition> *(Scenario: <name>)*
- [ ] AC2: <specific, verifiable condition> *(Scenario: <name>)*
- [ ] AC3: <non-functional condition with a threshold, e.g. "p95 response under 500 ms">

### Risks and Dependencies

| Type | Item | Impact / Mitigation |
|------|------|---------------------|
| Risk | <what could go wrong> | <impact and mitigation> |
| Dependency | <team, story, API, data, or decision> | <what is blocked and by when> |

### Assumptions

- <assumption made to proceed>

### Open Questions

- [ ] <question> *(Owner: <who can answer>)*
````

## Writing Rules

### Title

- Concise (about 3 to 8 words), outcome-focused, and written from the user's point of view.
- Start with the capability or result, not the implementation. Good: `Track order delivery status`. Bad: `Add DeliveryStatus column and endpoint`.
- Unique within the backlog and free of ticket jargon such as "Implement", "Create API for", or "Refactor".

### Gherkin story

- Open with the `Feature:` and the `As a / I want / So that` narrative. Use a **specific persona** ("returning customer", "warehouse manager"), never just "user".
- `So that` states a real outcome, not a restatement of the capability.
- One `Scenario` per distinct behavior. Include at minimum: the happy path, one meaningful edge or alternate path, and one error or negative case.
- Each scenario has **one** `When`. Chain extra `Given`/`Then` steps with `And`.
- Steps describe observable behavior in business language: no CSS selectors, SQL, endpoints, or class names unless the story is about an API contract.
- Use `Scenario Outline` with an `Examples:` table when the same flow varies only by data.
- Keep concrete, realistic values in steps ("a cart containing 2 items") instead of vague ones ("some items").

### Acceptance criteria

- Each criterion is binary (pass or fail), specific, and testable by someone who did not write the story.
- Map every functional criterion to at least one scenario, and every scenario to at least one criterion.
- Add non-functional criteria (performance, accessibility, security, audit, localization, compatibility) only when relevant, each with a measurable threshold.
- Avoid vague words: "fast", "user-friendly", "properly", "etc.", "as appropriate".
- State what is **out of scope** as a final plain bullet (`- Out of scope: ...`, no checkbox) when the boundary would otherwise be ambiguous.

### Risks and dependencies

- **Risks** are uncertain events that could hurt delivery or the outcome (technical unknowns, performance, security or privacy, data quality, regulatory, UX adoption). Give an impact and a mitigation for each.
- **Dependencies** are things this story needs from others: another story, a team, a third-party API, environment, data, design, or a decision. Name the owner when known and say what is blocked.
- Reference other stories by title. Do not invent systems, teams, or constraints that the input and codebase do not support; if unsure, move it to *Open Questions*.

### Assumptions and open questions

- **Assumptions** are things taken as true to write the story. Each should be something the team could later confirm or refute.
- **Open questions** need an answer before or during refinement. Phrase each as a real question, ideally with an owner. If an open question would materially change the points, say so.
- A story with unresolved blocking questions is still presented, but flag it as **Needs refinement** next to the estimate.

## Story Points

Use the Fibonacci scale: **1, 2, 3, 5, 8, 13**. Points reflect *relative* size combining effort, complexity, and uncertainty, not hours.

| Points | Meaning | Typical signals |
|--------|---------|-----------------|
| 1 | Trivial | Well-understood, single small change, no unknowns |
| 2 | Small | Minor change in one area, low risk |
| 3 | Moderate | Clear scope across a few components, little uncertainty |
| 5 | Substantial | Multiple components, some unknowns or integration work |
| 8 | Large | Significant complexity or uncertainty, cross-team coordination |
| 13 | Very large | Heavy unknowns; **strongly consider splitting** |

Rules:

- Never output a value outside the scale. If a story feels like 21 or more, it is too big: split it and estimate the pieces.
- A 13 must carry a note explaining why it could not be split, or be split.
- Higher uncertainty moves a story up one step; do not hide uncertainty by lowering effort.
- State the one-sentence rationale next to the points. These are proposed estimates for the team to confirm in refinement, so say so when presenting.
- If there is no codebase context to calibrate against, say the estimate is provisional.

See [references/estimation-guide.md](./references/estimation-guide.md) for calibration questions and examples.

## Slicing Rules

Prefer **vertical slices** that deliver user-visible value end to end over horizontal layers (UI only, API only, database only).

Split a story when any of these hold:

- It exceeds 8 points, or has more than about 6 scenarios.
- It contains several personas, workflows, or "and/or" outcomes.
- Parts of it could ship and be used independently.

Common slicing patterns: by workflow step, by persona, by happy path versus edge cases, by data variation or business rule, by CRUD operation, or by a simple version first and enhancements later. Each slice must still satisfy INVEST: Independent, Negotiable, Valuable, Estimable, Small, Testable.

## Quality Checklist

Verify before presenting. Fix any failure.

- [ ] Title is outcome-focused, concise, and has no implementation jargon.
- [ ] Persona is specific and the `So that` is a real outcome.
- [ ] Scenarios are valid Gherkin: one `When` each, business language, with happy, edge, and error coverage.
- [ ] Every acceptance criterion is testable and mapped to a scenario (and vice versa).
- [ ] Story points use only 1, 2, 3, 5, 8, or 13, with a rationale.
- [ ] Risks and dependencies are specific and each risk has a mitigation.
- [ ] Assumptions and open questions are separated, and nothing is invented as fact.
- [ ] Story is small enough to finish in one sprint and independently valuable.
- [ ] All template sections are present, in order.

## Examples

A complete worked example is in [references/example-story.md](./references/example-story.md).

# Story Point Estimation Guide

Story points are a **relative** measure of size. Estimate by comparing against stories the team already understands, not by converting to hours.

## Scale

`1, 2, 3, 5, 8, 13` only. Anything larger than 13 must be split.

## Calibration questions

Rate the story on each dimension, then pick the point value that fits the highest rating.

| Dimension | Low | Medium | High |
|-----------|-----|--------|------|
| **Effort**: how much work? | One small change | A few components | Many components or layers |
| **Complexity**: how hard to get right? | Straightforward logic | Several rules or states | Concurrency, security, data migration, complex rules |
| **Uncertainty**: how much is unknown? | Done something similar | Some unknowns or an external dependency | New technology, unclear requirements, unproven integration |

Rule of thumb:

- All Low → **1 to 2**
- Mostly Low/Medium → **3**
- Any Medium with real integration work → **5**
- Any High, or Medium on all three → **8**
- High uncertainty plus high effort or complexity → **13**, then try to split or run a spike

## Spikes

When uncertainty is the dominant driver, do not inflate the estimate. Write a time-boxed **spike** story (for example, "Evaluate payment provider webhooks") with an explicit question to answer, and estimate the dependent story after the spike completes.

## Splitting oversized stories

A 13, or anything that feels larger, should be split. Try, in order:

1. **Workflow steps**: browse, then add, then checkout, then confirm.
2. **Happy path first**: ship the main flow, add edge cases and error handling as follow-ups.
3. **Business rules**: one rule or rule variation per story.
4. **Personas**: customer first, administrator later.
5. **Data variations**: one data type or source at a time.
6. **Simple to enhanced**: a minimal version now, filters, sorting, and bulk actions later.

## Worked examples

| Story | Points | Why |
|-------|--------|-----|
| Show a product's stock status on the detail page | 2 | One existing field surfaced in one existing view; no new rules |
| Filter the product list by category | 3 | UI control plus query parameter across two components; clear scope |
| Track order delivery status with progress timeline | 5 | New UI, new API response data, a status state machine, and tests |
| Let a supplier upload products in bulk via CSV | 8 | File validation, partial-failure handling, async processing, and security concerns |
| Replace the checkout flow with a third-party payment provider | 13 | New external integration, security and compliance, unknowns: split or spike first |

## Presenting estimates

- Always include a one-sentence rationale naming the main size driver.
- Label estimates **proposed**; the delivery team owns the final number.
- Mark estimates **provisional** when open questions could change the size, and name the question.

# GitHub Copilot for Product Owners: Demo Script

**Audience:** Product owners, product managers, and business analysts  
**Suggested duration:** 2 hours  
**Demo application:** OctoCAT Supply  
**Storyline:** Discover a product opportunity, refine it into a backlog, publish it to Azure Boards, and hand an approved story to the GitHub Copilot cloud agent.

> **Before the session:** Clone the [demo fork](https://github.com/yortch/GitHubCopilot_Customized).

**Opening talk track**

> "Today we will follow a product owner's workflow: understand the product, identify value, refine requirements, and move approved work into delivery. Copilot helps us draft and investigate; the product owner still owns priority, scope, and acceptance."

## 1. GitHub Copilot and Agentic AI Overview

**Goal:** Give the audience enough context to understand the demonstrations.

### Slides: Zero to Agents, First Half

### Client Walkthrough

| Show | Demonstrate | Product-owner framing |
| --- | --- | --- |
| VS Code | Chat with repository context, attach the cart image, and locate the model and mode/agent controls. | Understand existing behavior and collaborate with the delivery team. |
| Copilot App | Open the relevant project/session and show its available model and agent controls. | Work with project context in the prepared app experience. |
| GitHub.com | Show the repository and the cloud-agent entry point or an existing session. | Delegate approved implementation work and review the resulting pull request. |

**Presenter actions**

1. In VS Code, open the model picker and select a model available to the audience's environment.
2. Explain that model selection and agent selection are separate decisions: the model powers reasoning; the agent supplies workflow instructions and tools.
3. Keep the same model for the later prompt comparison so model changes do not obscure the effect of the workflow.
4. Introduce **Plan**: research, clarify, and propose a plan before implementation.
5. Introduce **Agent**: perform multi-step work using permitted tools. Depending on access, this may include changing files or creating external work items.
6. Distinguish a local Agent session from an asynchronous **cloud-agent** session that works in GitHub and produces a pull request.

**Talk track**

> "Choose the working style as well as the model. Planning is useful when the problem is unclear; an agent is useful when we authorize it to take action. Neither replaces a product decision."

**Transition:** "Let's start with discovery rather than immediately asking for a shopping cart."

## 2. Creating Better and More Consistent Product Requirements

**Goal:** Generate a shortlist that separates product opportunities from bugs and incomplete behavior.

**Show:** VS Code with repository context. Use a read-only investigation setup where available; do not authorize edits.

### Demo Prompt: Feature Ideation

```text
Act as a product discovery partner for a product owner. Explore this application to identify gaps in its current capabilities and propose valuable features for the next release.

First, build a concise picture of what the application does and who it appears to serve. Then distinguish between missing capabilities users may expect, existing bugs or incomplete behavior, and new feature opportunities.

Recommend a prioritized shortlist of features. For each, include the user problem, expected user or business value, rough effort, dependencies or risks, and acceptance criteria. Do not include technical implementation details. Call out assumptions and areas where product-owner input would change the recommendation.

Do not modify code or include technical details. If the product context or release constraints are unclear, make reasonable assumptions and flag them rather than stopping. End with the top three decisions or questions for the product owner.
```

**Expected outcome:** A prioritized discovery draft ending with three product-owner decisions or questions, without code changes.

**Talk track**

> "This is a discovery partner, not an automatic roadmap. Notice what it knows from the application, what it assumes, and where customer evidence or business strategy could change the ranking."

**Demo continuity:** Use "complete purchase" if the selected baseline supports that opportunity. If cart and checkout already work, use the actual top opportunity or a verified incomplete part of the purchase journey. Do not manufacture a missing capability.

## 3. Custom Product Owner Agents, Part 1

**Goal:** Apply a product-owner role consistently and refine the selected opportunity into an epic and two outcome-focused stories.

**Show:** Select the prepared **Product Owner** custom agent. Briefly show its role instructions and tool boundaries.

**Talk track**

> "A custom agent packages a role and its working boundaries. Instead of restating 'stay at the product level' every time, we can make that the agent's default behavior."

### Demo Prompt: Epic and Stories

Continue the discovery conversation, or attach its agreed shortlist if switching clients or sessions:

```text
Help me draft an Epic and user stories for the first-priority P1 item we identified, such as completing a purchase.

Focus on user outcomes, scope, and testable acceptance criteria. Call out assumptions, dependencies, and open product decisions. Do not include technical implementation details, modify code, or create external work items yet.
```

**Review:** Confirm the epic's business outcome, the story boundaries, and which questions must be resolved before delivery.

### Demo Prompt: Consolidate Granular Stories

If four stories split cart and checkout too finely, attach the [shopping cart design](./design/cart.png), then use:

```text
Combine user stories 1 and 2 into one shopping cart story. Use the attached docs/design/cart.png as the layout reference and make conformance to its visible layout part of the acceptance criteria.

Combine user stories 3 and 4 into one checkout-process story.

Keep the Epic and exactly two user stories. Preserve the important acceptance criteria, risks, dependencies, and open questions. Keep this at the product level; do not add technical implementation details or create work items yet.
```

**Presenter note:** Adjust story numbers to match the actual response. If there are already two well-scoped stories, request the layout refinement without unnecessary consolidation.

**Expected outcome:** One draft epic and two reviewed stories: shopping cart and checkout, or their agreed equivalents.

**Transition:** "We have reviewed the content. Now we can deliberately publish it to our system of record."

## 4. GitHub Copilot and Azure DevOps

**Goal:** Demonstrate tool-assisted backlog creation, not another round of drafting.

**Show:** The reviewed conversation and the authenticated Azure DevOps MCP integration.

**Talk track**

> "The MCP integration gives Copilot tools to work with Azure DevOps. Drafting text and creating a real backlog item are different actions, so we review the destination and content before allowing the write."

### Demo Prompt: Publish the Backlog

```text
Create above epic and user stories into my demo-project.
```

### Presenter Actions

1. Confirm that `demo-project` is in the intended Azure DevOps organization.
2. Review and approve the proposed work item hierarchy.
3. Review tool permission prompts; approve only the intended operations.
4. Inspect the returned IDs and links.
5. Click the **shopping cart** story link and open it in Azure DevOps.
6. Show its description, acceptance criteria, and parent link.

**Expected outcome:** Real work items in the correct project, with the appropriate hierarchy and preserved acceptance criteria.

**Fallback:** If authentication or writes fail, show the drafted content and a clearly labeled prepared backlog. If only some writes succeed, retain their IDs and reconcile before retrying to avoid duplicates.

## 5. Azure Boards and GitHub Copilot Cloud Agent

**Goal:** Hand an approved story from Azure Boards to implementation in a connected GitHub repository.

**Show:** The shopping cart story opened in section 4.

### Presenter Actions

1. Ask the presenter to open the shopping cart user story in Azure Boards.
2. Review the story's scope and acceptance criteria, then click **Create a pull request with GitHub Copilot**.
3. Show that a GitHub Copilot agent session is created in GitHub for the story.
4. Once the agent session completes, show the pull request it created in GitHub.
5. Return to the Azure Boards user story and show the pull request link added to it.
6. Continue to section 6 while the agent runs. Return to the live session, pull request, and updated user story during wrap-up.

**Expected outcome:** The work item starts a GitHub Copilot agent session. When the session completes successfully, it creates a pull request in GitHub and adds the pull request link to the Azure Boards user story.

**Talk track**

> "The user story launches a GitHub Copilot agent session. When the work is complete, the agent creates a pull request and links it back to the story. We are delegating implementation, not acceptance: people still inspect the changes, validation evidence, and business behavior before approval."

**Fallback:** If the action is absent, verify the GitHub connection, approved permissions, eligible access, and supported work item type. If the session is slow or fails, explain that the PR and work-item link are created only after successful completion; use a clearly labeled prepared example if needed. Do not present prepared output as the live result, and do not merge merely to finish the demo.

## 6. Custom Product Owner Agents, Part 2

**Goal:** Contrast a one-off prompt, interactive planning, and a repeatable story-writing workflow.

**Slides:** Use the second half of **Zero to Agents** to introduce reusable customization:

| Mechanism | What it provides |
| --- | --- |
| Prompt | Instructions and context for the current request. |
| Custom agent | A reusable role with instructions and configured tools. |
| Plan mode/agent | A dedicated workflow for researching, clarifying, and planning before implementation. |
| Skill | Reusable task-specific instructions and resources, loaded when selected or relevant. |

### A. Baseline: User Story Without a Dedicated Skill or Plan

**Suggested time:** 4 minutes.

Start a new session in the prepared baseline environment. Use the default chat/agent, not the Product Owner custom agent or Plan. Attach the [cart image](./design/cart.png).

```text
Transform an ambiguous business requirement into a structured user story with clear acceptance criteria: "implement shopping cart using cart.png".

Do not implement it or create external work items.
```

**Point out**

- What structure did the model choose without a shared template?
- Did it ask questions, document them, or quietly make assumptions?
- Are the acceptance criteria clear enough for backlog refinement?

**Presenter note:** Inspect the actual response rather than promising a weak result. A plain prompt can produce a good story; the comparison is about repeatability and workflow control.

### B. Plan Mode: Clarify Before Planning

**Suggested time:** 4 minutes.

Start another new session with the same model and image. Select **Plan**, or use the client's supported planning entry point.

```text
Implement shopping cart using the attached cart.png. Grill me with clarification questions before finalizing the plan.

Do not implement anything yet.
```

**Presenter actions**

1. Answer the interactive clarification questions based on the agreed demo scope.
2. Review the resulting plan without starting implementation.
3. Highlight any technical steps, affected files, or testing details.

**Talk track**

> "This prompt asks to implement a feature, so a technical implementation plan is a reasonable result. Plan mode can help uncover ambiguity, but an implementation plan is not the same artifact as a product user story."

**Fallback:** If no interactive questions appear, explicitly ask the planner to pause and present its unresolved clarification questions before finalizing the plan. Do not imply that every planning session asks questions in the same way.

### C. Skills: Reuse the Team's Story-Writing Standard

**Suggested time:** 7 minutes.

Start a new Agent session that can create a workspace skill. This step intentionally writes customization files, not application code.

#### Demo Prompt: Create the Skill

```text
Create a reusable skill named `user-story-writer` that turns feature requests, requirements, or rough ideas into clear, actionable user stories ready for backlog refinement.

Generate user stories with the following template:
- A concise, outcome-focused title.
- Written using Gherkin format.
- Clear validation acceptance criteria.
- Story points in the Fibonacci scale.
- Relevant risks and dependencies.
- Assumptions and open questions.
```

**Presenter actions**

1. Review the generated skill's name, description, and instructions. In a VS Code setup using `.github/skills`, the expected file is `.github/skills/user-story-writer/SKILL.md`.
2. Confirm that it includes the requested story template and Fibonacci scale.
3. Save it, then start a fresh session so the comparison does not rely on the creation conversation.

#### Demo Prompt: Automatic Skill Selection

Attach the same cart image, then enter:

```text
Create a user story for implementing shopping cart using the attached cart.png. Do not implement it or create external work items.
```

Inspect the session's tool activity or skill-loading indication, where available. A matching output format alone does not prove the skill loaded. Automatic selection depends on the client and the skill's description and configuration.

> **Alternate:** The skill can also be invoked explicitly as a slash command. Type `/` in chat, select `user-story-writer`, and add the request.

**Point out**

- The repeated structure: title, user value, Gherkin criteria, points, risks, dependencies, assumptions, and open questions.
- Note whether questions were documented rather than asked interactively in this example. Skills do not inherently suppress questions.
- A custom agent and a skill can complement each other: the agent defines the role; the skill defines a reusable task workflow.
- Gherkin scenarios make acceptance criteria concrete; they do not prove the behavior is implemented or tested.

**Expected outcome:** A saved, reusable skill and a story that follows its template, with unresolved decisions visible for refinement.

## Wrap-up

**Closing talk track**

> "We moved from discovery to a reviewed backlog, then from an approved story to a draft implementation. Consistency came from a reusable role and skill, not just a longer prompt. The product owner still decides what matters, resolves ambiguity, and accepts the outcome."

## Presenter References

- [Existing agentic SDLC demo](./agentic-sdlc-demo-script.md)
- [General Copilot demo](./demo-script.md)
- [Azure Boards: Use GitHub Copilot with work items](https://learn.microsoft.com/en-us/azure/devops/boards/github/work-item-integration-github-copilot?view=azure-devops)
- [GitHub: Integrate cloud agent with Azure Boards](https://docs.github.com/en/copilot/how-tos/copilot-integrations/integrate-cloud-agent-with-azure-boards)
- [VS Code: Plan work with agents](https://code.visualstudio.com/docs/agents/run/planning)
- [VS Code: Agent skills, discovery, and slash commands](https://code.visualstudio.com/docs/agent-customization/agent-skills)

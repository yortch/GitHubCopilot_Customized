# **Demo Script: Agentic SDLC with GitHub Copilot**

## 1. Planning Stage: Requirement to User Story

**Goal:** Use GitHub Copilot to turn a product requirement into an actionable GitHub issue.

### Prerequisite

- Ensure there are no existing GitHub issues for this requirement.

### Demo Flow

1. Start with the shopping cart requirement and `cart.png`.
2. Switch to the GitHub Copilot app.
3. Ask GitHub Copilot to draft the user story.

   **Prompt**

   > Draft a user story for implementing a shopping cart using cart.png.

4. Review the generated user story.
5. Ask GitHub Copilot to create the corresponding GitHub issue.

   **Prompt**

   > Create a GitHub issue in my fork of this project.

---

## 2. Development & Validation Stage: Issue to Pull Request

**Goal:** Show the developer workflow from an assigned issue through implementation, testing, validation, and pull request creation.

### Prerequisites

Configure or show an existing ruleset for the `main` branch that:

- Requires a pull request before merging.
- Requires at least one approval.
- Triggers GitHub Copilot code review when a pull request is created.

### Demo Flow

1. In the GitHub Copilot app, go to the **Issues** list.
2. Find the shopping cart issue created during the planning stage.
3. Select **New session**, with the issue preselected as context.
4. Ask GitHub Copilot to implement and validate the user story.

   **Prompt**

   > Implement this user story in a new branch and create unit tests. Once completed, update the GitHub issue with the results and include validation screenshots as evidence for the acceptance criteria. Create a pull request targeting the `develop` branch.

5. Review:
   - Implementation changes.
   - Unit tests.
   - Updated GitHub issue and validation evidence.
   - Created pull request.
   - GitHub Copilot code review results.

---

## 3. Deployment Stage: CI with GitHub Actions

**Goal:** Demonstrate using the cloud agent to create the CI portion of the deployment workflow.

> **Presenter note:** In the interest of time, we will demonstrate creation of the CI workflow rather than the deployment itself.

### Demo Flow

1. Open a new GitHub Copilot session on GitHub.com for the repository.
2. Ask GitHub Copilot to create the CI workflow.

   **Prompt**

   > Create a CI pipeline as a GitHub Actions workflow in the `iac` branch. The CI workflow should run on pushes to any branch and include lint and build stages.

3. Review the generated GitHub Actions workflow and explain where deployment stages could be added.

---

## 4. Security & Quality Stage: Continuous Feedback and Remediation

**Goal:** Show how security and code quality become part of the development workflow rather than separate activities.

### Demo Setup

Enable or show the following repository capabilities:

- **Dependabot**
  - Dependabot alerts
  - Dependabot security updates
  - Dependabot version updates
- **Code scanning**
  - CodeQL analysis
  - AI scanning for pull requests
- **Code quality**
  - Enable code quality analysis

### Demo Flow

1. Show security and quality findings.
2. Review findings surfaced in the development/PR workflow.
3. Show available automated or AI-assisted remediation.
4. Demonstrate how findings can feed back into the developer workflow.

### Closing Message

> This completes the lifecycle: **Plan → Develop & Validate → Deploy → Secure & Improve**, with GitHub Copilot and GitHub capabilities assisting throughout the SDLC.

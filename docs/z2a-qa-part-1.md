# Zero to Agents (Part 1): QA/Testers

Audience: QA engineers and testers  
Focus: AI-assisted test planning and unit testing with GitHub Copilot  
Demo repository: [yortch/GitHubCopilot_Customized](https://github.com/yortch/GitHubCopilot_Customized)

## Session Setup

Start from the `shopping-cart` branch:

```bash
git clone https://github.com/yortch/GitHubCopilot_Customized.git
cd GitHubCopilot_Customized
git switch shopping-cart
```

## 1. AI-Assisted Test Planning and Test Case Creation

Demo goal: Turn a sample requirement into a structured test plan and test cases.

### Create a Test Plan

Use Plan Mode. Prompt:

> Create a test plan with test cases for this requirement https://github.com/yortch/GitHubCopilot_Customized/issues/29
> Include happy-path, negative, and edge-case scenarios.

## 2. Unit Testing with GitHub Copilot

Demo goal: Review an existing application, identify missing unit tests, and create additional tests.

### Implement and Iterate

Prompt:

> Implement tests cases from plan, iterate until all unit tests pass.

## Continue

Continue with [Zero to Agents (Part 2): QA/Testers](https://github.com/yortch/agentic-devops-demo/blob/main/docs/z2a-qa-part-2.md).
---
name: analyze-and-plan-issue
description: "指定されたGitHub Issue番号に対する実装計画を作成する（計画のみ）"
argument-hint: ISSUES=<issue_number>
---

You have been provided with a GitHub Issue identifier via the ISSUES argument.

The value of ISSUES is a concrete and valid GitHub issue number or URL.
You MUST use this value directly.
You MUST NOT ask the user to clarify or re-enter the issue number.

You are operating in DESIGN / PLANNING ONLY mode.

STRICT RULES:
- You MUST NOT modify any source code.
- You MUST NOT create commits or pull requests.
- You MUST NOT apply patches.
- You MUST NOT run commands that change the repository state.

Task:

Analyze GitHub issue identified by ISSUES = "$ISSUES"
and create a detailed implementation plan.

Follow these steps:

1. Run `gh issue view "$ISSUES"` to retrieve the issue details.
2. Understand and summarize the problem.
3. Infer relevant parts of the codebase (high-level only).
4. Produce an implementation plan using the required format below.
5. Create a new sub-issue under the original issue:
   - Title: "<original issue title>[実装計画]"
   - Content: implementation plan ONLY.

IMPORTANT:
- Assume ISSUES is already known and valid.
- Do NOT ask any follow-up questions.
- Proceed deterministically.

--------------------------------------------------
REQUIRED IMPLEMENTATION PLAN FORMAT
--------------------------------------------------

# <Feature or Issue Name> 実装計画

## 概要
- What will be implemented in this phase
- What is explicitly out of scope

## 現在のプロジェクト状態
- Framework / libraries
- Existing routes, components, helpers
- Assumptions and constraints

## 関連デザイン / 仕様分析
- UI or spec summary (e.g. Figma)
- Visual and behavioral expectations

## 実装タスク
Break down into numbered tasks.
For each task:
- Purpose
- Files to be created or modified (names only)
- Responsibilities of each component/module
- Reasoning behind the approach

## テスト計画
- Test type (unit / integration)
- Target files
- What is validated
- What is intentionally not tested

## 技術的考慮事項
- Styling strategy
- Accessibility
- State management assumptions
- Trade-offs or risks

## このフェーズに含まれないもの
- Explicitly list excluded features

## 作成 / 修正されるファイル一覧（予定）
- Created:
- Modified:

## 成功基準
- Clear, testable acceptance criteria

--------------------------------------------------

IMPORTANT:
- The goal is to produce a plan at the same level of detail as a senior engineer's design proposal.
- Do NOT include diffs, commits, or executable commands.
- The only GitHub write operation allowed is creating the sub-issue using `gh`.

Use GitHub CLI (`gh`) for all GitHub-related actions.

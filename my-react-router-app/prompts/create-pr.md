---
name: create-pull-request
description: "現在のローカル変更をもとに、指定されたIssueをクローズするPull Requestを作成する"
argument-hint: ISSUES=<issue_numbers>
---

You are operating in PULL-REQUEST-CREATION mode.

Your task is to create a GitHub Pull Request based on the current local changes
compared to the main branch.

You have been provided with issue identifiers via the ISSUES argument.
If ISSUES is undefined or empty, use ISSUE as the source of issue numbers and treat it as ISSUES.
ISSUES is a comma-separated list of GitHub issue numbers (e.g. "2,5,12").

IMPORTANT: The ISSUES value is provided as a string. You MUST parse it as a comma-separated list and use each issue number to generate "Closes #<number>" statements.

You MUST use these issue numbers to generate "Closes #<number>" statements.
You MUST NOT ask the user to clarify or re-enter issue numbers.

--------------------------------------------------
ROLE AND SCOPE
--------------------------------------------------

This task is strictly for PULL REQUEST CREATION.

- You MUST NOT modify any source code.
- You MUST NOT add or change commits.
- You MUST NOT amend commit history.
- You MUST NOT rebase or squash commits.
- You MUST NOT change branch content.

Your responsibility is to:
- Verify that there are changes to include
- Push the current branch
- Create a Pull Request using GitHub CLI

--------------------------------------------------
PRE-CHECKS
--------------------------------------------------

1. Check the current git status:
   - Use `git status`
2. Compare changes with the main branch:
   - Use `git diff main`
3. Ensure there are changes to include in the PR.

If there are NO changes compared to main:
- STOP immediately
- Report that no Pull Request can be created

--------------------------------------------------
PULL REQUEST CREATION
--------------------------------------------------

1. Identify the current branch name.
2. Push the current branch to the remote repository.
3. Create a Pull Request using `gh pr create`.

--------------------------------------------------
PULL REQUEST TITLE RULES
--------------------------------------------------

- The title MUST be concise and descriptive.
- It MUST summarize the primary purpose of the changes.
- It MUST NOT include issue numbers directly.
- Write the title in Japanese.

Example:
- "ToDoリスト表示機能の実装"
- "レビュー指摘事項への対応"

--------------------------------------------------
PULL REQUEST DESCRIPTION RULES
--------------------------------------------------

The Pull Request description MUST:

- Be written entirely in Japanese
- Include a clear summary of what was changed
- Reference ALL issues provided in ISSUES
- Include "Closes #<issue_number>" for each issue

--------------------------------------------------
REQUIRED DESCRIPTION FORMAT
--------------------------------------------------

## 概要
- 今回の変更内容の要約を簡潔に記載

## 変更内容
- 主な修正点を箇条書きで記載
- 実装・レビュー反映・リファクタなどの区別が分かるようにする

## 関連Issue
- Closes #<issue_number>
- Closes #<issue_number>

IMPORTANT: Replace `<issue_number>` placeholders above with the actual issue numbers parsed from ISSUES. Generate one "Closes #<issue_number>" line for each issue number in ISSUES.

--------------------------------------------------
ARGUMENT PARSING RULES
--------------------------------------------------

- Parse ISSUES as a comma-separated list.
- Trim whitespace around each issue number.
- Generate one "Closes #<number>" line per issue.
- Preserve the original order of issue numbers.

Example:
ISSUES = "123, 456"

→
- Closes #123
- Closes #456

--------------------------------------------------
FAILURE HANDLING
--------------------------------------------------

You MUST STOP and report if:

- No changes exist compared to main
- The current branch cannot be pushed
- Pull Request creation fails

Do NOT retry automatically.

--------------------------------------------------
FINAL OUTPUT
--------------------------------------------------

After successfully creating the Pull Request, report in chat:

- Pull Request created
- Pull Request URL
- Branch name
- Issues closed

If execution stops, report:

- Execution stopped
- Reason

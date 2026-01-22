---
name: apply-review-feedback
description: "reviews ディレクトリ内のレビュー結果から対応が必要な項目のみを抽出し、修正を実施する"
argument-hint: NONE
---
You are operating in REVIEW-FEEDBACK-APPLY mode.

This task applies code changes based on review feedback documents.
The source of truth is the review markdown files under the `reviews/` directory.

--------------------------------------------------
ROLE AND SCOPE
--------------------------------------------------

This task is strictly for APPLYING REVIEW FEEDBACK.

- You MUST NOT reinterpret original requirements.
- You MUST NOT introduce new features.
- You MUST NOT refactor unrelated code.
- You MUST NOT make design decisions beyond the review scope.

Your responsibility is to:
- Read review feedback documents
- Extract ONLY actionable feedback
- Apply minimal code changes to address them
- Verify correctness via tests and checks

--------------------------------------------------
INPUT SOURCE
--------------------------------------------------

Review feedback files are located in the `reviews/` directory.

Rules:
- Read all `.md` files directly under `reviews/`
- EXCLUDE any files under `reviews/done/`
- Do NOT read files outside `reviews/`
- Treat each review file independently

--------------------------------------------------
REVIEW INTERPRETATION RULES (CRITICAL)
--------------------------------------------------

When reading review files, apply the following rules strictly.

### 1. Actionable items (ONLY these may be implemented)

Items in the section:
- 「指摘事項（修正必須）」

AND items explicitly marked with one of:
- 「今回対応」
- 「対応する」
- 「修正必須」

Only these are considered REQUIRED ACTIONS.

### 2. Non-actionable items (MUST be ignored)

The following sections or markers MUST NOT trigger any implementation:

- 「全体所感」
- 「改善提案（任意）」
- 「質問・確認事項」
- Any text marked as:
  - 「(回答)」
  - 「(説明)」
  - 「(仕様変更なし)」
  - 「(対応予定)」

These are explanations or future considerations only.

### 3. Exception handling (STOP conditions)

If a non-actionable section (including 「(回答)」) contains:
- An explicit admission of a bug or omission
- A statement that something is incorrect or missing
- A declaration of implementation policy change

You MUST STOP and report the issue for human clarification.
Do NOT infer intent or proceed automatically.

--------------------------------------------------
EXECUTION STEPS
--------------------------------------------------

1. Scan the `reviews/` directory and list all applicable review files.
2. For each review file:
   a. Extract ONLY actionable items according to the rules above.
   b. If no actionable items exist, skip that file.
3. Aggregate all extracted actionable items into a single task list.
4. Identify the source files related to each task.
5. Implement ONLY the changes necessary to satisfy the actionable items.
6. If tests are explicitly required by the review, add or update tests.
7. Run the following checks if available in the project:
   - Unit tests (e.g. `npm run test`)
   - Linting (e.g. `npm run lint`)
   - Type checking (e.g. `npm run typecheck`)
8. Fix failures caused by the applied review changes ONLY.
9. Create a single commit containing all review-driven changes.

--------------------------------------------------
COMMIT MESSAGE REQUIREMENTS
--------------------------------------------------

The commit message MUST clearly indicate that the changes
are driven by review feedback.

Recommended format:

fix: apply review feedback

- Address required review comments
- Source reviews:
  - reviews/<review-file-name>.md
  - reviews/<review-file-name>.md

--------------------------------------------------
FAILURE HANDLING
--------------------------------------------------

You MUST STOP immediately and DO NOT create a commit if:

- An actionable item is ambiguous or contradictory
- A review request conflicts with the implementation plan
- Applying a change requires design decisions not stated in the review
- Tests or checks fail and cannot be fixed within review scope

In such cases, report:
- The review file name
- The problematic section
- The reason execution was stopped

--------------------------------------------------
FINAL OUTPUT
--------------------------------------------------

After successful execution, report in chat:

- Review feedback applied
- Review files processed
- Commit hash

If execution is stopped, report:

- Execution stopped
- Reason
- Affected review file and section

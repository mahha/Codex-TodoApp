---
name: review-local-changes
description: "指定されたGitHub Issueに基づき、ローカル変更をレビューして日本語でレビューコメントを出力する"
argument-hint: ISSUES=<issue_number_or_plan_issue_number>
---

You are operating in REVIEW mode.

You have been provided with a GitHub Issue identifier via the ISSUES argument.
The value of ISSUES refers to a GitHub issue that defines
the context, intent, or implementation plan of the changes.

You MUST use this issue as the review baseline.
You MUST NOT ask the user to clarify or re-enter the issue number.

--------------------------------------------------
ROLE AND SCOPE
--------------------------------------------------

This task is strictly for CODE REVIEW.

- You MUST NOT modify any source code.
- You MUST NOT create commits.
- You MUST NOT fix issues yourself.
- You MUST NOT run commands that change repository state.

--------------------------------------------------
REVIEW STEPS
--------------------------------------------------

1. Identify the current local branch.
2. Compare the local branch with the main branch and collect diffs.
3. Use `gh issue view "$ISSUES"` to retrieve the issue details.
4. Understand the problem, scope, and constraints described in the issue.
5. Review the local changes based on the issue intent.
6. Write review feedback in Japanese.

--------------------------------------------------
REVIEW OUTPUT
--------------------------------------------------

You MUST write the review feedback as a Markdown file
under the `reviews/` directory.

The file name MUST follow this format:

<YYYY><Mon><DD>-<HH><MM>-issue<ISSUES>-review.md

Example:
If ISSUES="2", the file name would be: 2026Jan17-0832-issue2-review.md

IMPORTANT: Replace `<ISSUES>` in the file name template with the actual value of the ISSUES argument.

Rules:
- Use the current local date and time.
- Month MUST be in English short form (Jan, Feb, Mar, ...).
- Issue number MUST match ISSUES exactly.
- Do NOT overwrite existing files.

--------------------------------------------------
REQUIRED REVIEW FILE CONTENT
--------------------------------------------------

IMPORTANT: In the review file content template below, replace ALL occurrences of `<ISSUES>` with the actual value of the ISSUES argument (e.g., if ISSUES="2", replace `<ISSUES>` with "2").

# レビュー結果: Issue #<ISSUES>

## レビュー対象
- Issue: #<ISSUES>
- ブランチ: <current branch name>
- 比較対象: main ブランチ
- レビュー日時: <YYYY-MM-DD HH:MM>

## 全体所感
- 実装全体に対する総評
- Issue の意図との整合性

## 指摘事項（修正必須）
- [ ] 指摘内容
  - 該当ファイル:
  - 該当箇所:
  - 理由:
  - 修正提案:

## 改善提案（任意）
- [ ] 改善内容
  - 期待される効果:
  - 実装の方向性（概要レベル）:

## 質問・確認事項
- 疑問点
- Issue記述との解釈差分

## 良い点
- 評価できる設計・実装・テスト

--------------------------------------------------
FINAL OUTPUT
--------------------------------------------------

After writing the review file, report in chat:

- Review completed
- Review file name
- Review file path

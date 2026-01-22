---
name: implement-from-plan-with-report
description: "指定された[実装計画] Issueに基づいて実装を行い、完了レポートをIssueコメントとして投稿する"
argument-hint: ISSUES=<plan_issue_number>
---
You are operating in IMPLEMENTATION mode.

You have been provided with a GitHub Issue identifier via the ISSUES argument.
The value of ISSUES refers to a GitHub issue that itself represents
an implementation plan.

The provided issue MUST be treated as the single source of truth.
You MUST NOT search for or infer another parent or child issue.
You MUST NOT ask the user to clarify or re-enter the issue number.

--------------------------------------------------
ROLE AND SCOPE
--------------------------------------------------

This task is strictly for EXECUTION based on an existing implementation plan.

- Planning, redesign, or requirement discovery is NOT part of this task.
- The implementation plan is already finalized and approved.
- Your responsibility is to implement exactly what is written,
  then report completion in a structured issue comment.

--------------------------------------------------
STRICT RULES
--------------------------------------------------

- You MUST follow the implementation plan exactly as written.
- You MUST implement all tasks described in the plan.
- You MUST NOT change scope, add features, or reinterpret requirements.
- You MUST NOT remove or weaken tests defined in the plan.
- You MUST stop and report if the plan is ambiguous or incomplete.

You MAY:
- Modify source code.
- Create or update test files.
- Run tests, linters, and type checks.
- Create commits.

You MUST NOT:
- Modify the implementation plan issue body.
- Create new issues.
- Create pull requests unless explicitly instructed.

--------------------------------------------------
EXECUTION STEPS
--------------------------------------------------

1. Run `gh issue view "$ISSUES"` to retrieve the implementation plan.
2. Read the issue body in full and understand all implementation tasks.
3. Identify all files mentioned in the plan.
4. Locate relevant code in the repository.
5. Implement the required changes exactly as specified.
6. Create or update tests exactly as specified in the plan.
7. Run the following checks if available:
   - Unit tests (e.g. `npm run test`)
   - Linting (e.g. `npm run lint`)
   - Type checking (e.g. `npm run typecheck`)
8. Fix any failures revealed by these checks.
9. Create a single commit containing all changes.

--------------------------------------------------
COMMIT MESSAGE REQUIREMENTS
--------------------------------------------------

- The commit message MUST be descriptive and concise.
- It MUST reference the implementation plan issue number.
- Use the following format:

  <type>: <short summary>

  <detailed explanation>

  Implemented according to issue #<ISSUES>

--------------------------------------------------
IMPLEMENTATION COMPLETION COMMENT
--------------------------------------------------

After a successful commit, you MUST post a completion report
as a comment on the implementation plan issue using GitHub CLI.

Use the command:

  gh issue comment "$ISSUES" --body "<COMMENT_BODY>"

The comment body MUST strictly follow the format below.

--------------------------------------------------
REQUIRED COMMENT FORMAT
--------------------------------------------------

GitHub Issue #<ISSUES> - <issue title>

日付: <YYYY-MM-DD>
時刻: <HH:MM>

Issue: #<ISSUES> - 実装計画

概要
GitHub issue #<ISSUES> に基づき、実装計画に記載された内容をすべて実装しました。

✅ 完了した実装
- 実装計画に記載された各タスクを、番号付きリストで具体的に記述
- 作成・変更した主要コンポーネントや機能を要約

🧪 テスト結果
- 実行したテスト種別（単体テストなど）
- 合格数 / 総数
- 実行時間（分かる場合）

🧹 品質チェック
- TypeScript型チェック結果
- Lint結果（未設定の場合はその旨を明記）
- その他品質確認事項

📁 作成されたファイル
- 箇条書きで列挙

✏️ 修正されたファイル
- 箇条書きで列挙

🔧 技術メモ（あれば）
- 実装上の判断
- 設計上の注意点
- 将来拡張時の留意事項

🚫 このフェーズに含まれないもの
- 実装計画に明記された「対象外項目」を列挙

🧾 Git情報
- Commit: <commit hash>
- Branch: <branch name>
- Author: <author>

ステータス：完了、レビュー準備完了

--------------------------------------------------
FAILURE HANDLING
--------------------------------------------------

If any of the following occurs, STOP immediately and DO NOT post a completion comment:

- The implementation plan is ambiguous or contradictory.
- Required files or scripts are missing.
- Tests fail and cannot be fixed without deviating from the plan.

In such cases, report the failure and the reason instead.

--------------------------------------------------
FINAL OUTPUT
--------------------------------------------------

After posting the issue comment successfully, report in chat:

- Implementation completed
- Issue comment posted
- Commit hash

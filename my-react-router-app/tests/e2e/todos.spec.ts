import { expect, test } from "@playwright/test";

test("create todo from the form and see it on the list", async ({ page }) => {
  const title = `Playwright Todo ${Date.now()}`;
  const description = "E2E test todo description";

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "ToDo App" })).toBeVisible();

  await page.getByRole("link", { name: "+ Add" }).click();
  await expect(
    page.getByRole("heading", { name: "新しいTodoを追加" })
  ).toBeVisible();

  await page.getByLabel("タイトル").fill(title);
  await page.getByLabel("説明").fill(description);
  await page.getByRole("button", { name: "作成する" }).click();

  await expect(page).toHaveURL(/\/$/);

  const createdTodo = page.getByRole("listitem").filter({ hasText: title });
  await expect(createdTodo).toContainText(description);

  const activeTab = page.getByRole("link", { name: "未完了" });
  const completedTab = page.getByRole("link", { name: "完了" });

  await expect(activeTab).toBeVisible();
  await expect(completedTab).toBeVisible();

  await createdTodo.getByRole("checkbox", { name: title }).check();
  await expect(createdTodo).toHaveCount(0);

  await completedTab.click();
  const completedTodo = page.getByRole("listitem").filter({ hasText: title });
  await expect(completedTodo).toContainText(description);

  await completedTodo.getByRole("checkbox", { name: title }).uncheck();
  await expect(completedTodo).toHaveCount(0);

  await activeTab.click();
  await expect(page.getByRole("listitem").filter({ hasText: title })).toContainText(
    description
  );
});

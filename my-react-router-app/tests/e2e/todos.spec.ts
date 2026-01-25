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
});

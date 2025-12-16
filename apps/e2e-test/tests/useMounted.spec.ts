import { expect, test } from "@playwright/test";

test.describe("useMounted", () => {
  test("eventually becomes true after mount", async ({ page }) => {
    await page.goto("/#/useMounted");
    await expect(page.getByTestId("page:useMounted")).toBeVisible();

    // In practice this should become true quickly after effect runs.
    await expect(page.getByTestId("useMounted:value")).toHaveText("true", { timeout: 2000 });
  });
});



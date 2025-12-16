import { expect, test } from "@playwright/test";

test.describe("useScript", () => {
  test("loads ok script and reaches ready", async ({ page }) => {
    await page.goto("/#/useScript");
    await expect(page.getByTestId("page:useScript")).toBeVisible();

    await page.getByTestId("useScript:loadOk").click();
    await expect(page.getByTestId("useScript:status")).toHaveText("ready", { timeout: 5000 });
    await expect(page.getByTestId("useScript:okCount")).not.toHaveText("0", { timeout: 5000 });
  });

  test("404 script reaches error", async ({ page }) => {
    await page.goto("/#/useScript");
    await expect(page.getByTestId("page:useScript")).toBeVisible();

    await page.getByTestId("useScript:load404").click();
    await expect(page.getByTestId("useScript:status")).toHaveText("error", { timeout: 5000 });
  });
});



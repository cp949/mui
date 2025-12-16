import { expect, test } from "@playwright/test";

test.describe("useTimeoutData", () => {
  test("shows a message then auto-clears after timeout", async ({ page }) => {
    await page.goto("/#/useTimeoutData");
    await expect(page.getByTestId("page:useTimeoutData")).toBeVisible();

    await expect(page.getByTestId("useTimeoutData:message")).toHaveText("-");

    await page.getByTestId("useTimeoutData:show").click();

    // Should show some hello@... text quickly.
    await expect(page.getByTestId("useTimeoutData:message")).not.toHaveText("-", { timeout: 2000 });

    // Then should clear after ~120ms (we give plenty of slack).
    await expect(page.getByTestId("useTimeoutData:message")).toHaveText("-", { timeout: 3000 });
  });
});



import { expect, test } from "@playwright/test";

test.describe("useThrottledCallbackWithClearTimeout", () => {
  test("rapid calls produce immediate + trailing with latest args", async ({ page }) => {
    await page.goto("/#/useThrottledCallbackWithClearTimeout");
    await expect(page.getByTestId("page:useThrottledCallbackWithClearTimeout")).toBeVisible();

    await expect(page.getByTestId("useThrottled:count")).toHaveText("0");

    await page.getByTestId("useThrottled:fire1").click();
    await page.getByTestId("useThrottled:fire2").click();
    await page.getByTestId("useThrottled:fire3").click();

    // First call should be immediate, trailing call should happen after ~wait.
    await expect(page.getByTestId("useThrottled:count")).toHaveText("1", { timeout: 2000 });
    await expect(page.getByTestId("useThrottled:last")).toHaveText("1");

    await expect(page.getByTestId("useThrottled:count")).toHaveText("2", { timeout: 3000 });
    await expect(page.getByTestId("useThrottled:last")).toHaveText("3");
  });

  test("clearTimer cancels trailing call", async ({ page }) => {
    await page.goto("/#/useThrottledCallbackWithClearTimeout");
    await expect(page.getByTestId("page:useThrottledCallbackWithClearTimeout")).toBeVisible();

    await page.getByTestId("useThrottled:fire1").click();
    await expect(page.getByTestId("useThrottled:count")).toHaveText("1");

    await page.getByTestId("useThrottled:fire3").click();
    await page.getByTestId("useThrottled:clearTimer").click();

    await page.waitForTimeout(250);
    await expect(page.getByTestId("useThrottled:count")).toHaveText("1");
  });
});



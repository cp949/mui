import { expect, test } from "@playwright/test";

test.describe("useLatest", () => {
  test("delayed read observes latest committed value after rapid increments", async ({ page }) => {
    await page.goto("/#/useLatest");

    await expect(page.getByTestId("page:useLatest")).toBeVisible();
    await expect(page.getByTestId("useLatest:count")).toHaveText("0");

    await page.getByTestId("useLatest:inc").click();
    await page.getByTestId("useLatest:inc").click();
    await page.getByTestId("useLatest:inc").click();

    await expect(page.getByTestId("useLatest:count")).toHaveText("3");

    await page.getByTestId("useLatest:readDelayed").click();
    await expect(page.getByTestId("useLatest:result")).toHaveText("3 (delayed(30ms))");
  });
});



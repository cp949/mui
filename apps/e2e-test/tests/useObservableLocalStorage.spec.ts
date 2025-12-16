import { expect, test } from "@playwright/test";

test.describe("useObservableLocalStorage", () => {
  test("two instances stay in sync and clearing returns to default", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem("e2e-observable-local");
    });

    await page.goto("/#/useObservableLocalStorage");
    await expect(page.getByTestId("page:useObservableLocalStorage")).toBeVisible();

    const left = page.getByTestId("useObservableLocalStorage:left:value");
    const right = page.getByTestId("useObservableLocalStorage:right:value");

    await expect(left).not.toHaveText("-", { timeout: 2000 });
    await expect(right).not.toHaveText("-", { timeout: 2000 });

    await page.getByTestId("useObservableLocalStorage:left:setA").click();
    await expect(left).toHaveText("\"A\"");
    await expect(right).toHaveText("\"A\"");

    await page.getByTestId("useObservableLocalStorage:right:setB").click();
    await expect(left).toHaveText("\"B\"");
    await expect(right).toHaveText("\"B\"");

    await page.getByTestId("useObservableLocalStorage:left:clear").click();
    await expect(left).not.toHaveText("\"A\"");
    await expect(left).not.toHaveText("\"B\"");
    await expect(right).not.toHaveText("\"A\"");
    await expect(right).not.toHaveText("\"B\"");
    await expect(left).not.toHaveText("-", { timeout: 2000 });
    await expect(right).not.toHaveText("-", { timeout: 2000 });
  });
});



import { expect, test } from "@playwright/test";

test.describe("useObservableSessionStorage", () => {
  test("two instances stay in sync and clearing returns to default", async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.removeItem("e2e-observable-session");
    });

    await page.goto("/#/useObservableSessionStorage");
    await expect(page.getByTestId("page:useObservableSessionStorage")).toBeVisible();

    const left = page.getByTestId("useObservableSessionStorage:left:value");
    const right = page.getByTestId("useObservableSessionStorage:right:value");

    await expect(left).not.toHaveText("-", { timeout: 2000 });
    await expect(right).not.toHaveText("-", { timeout: 2000 });

    await page.getByTestId("useObservableSessionStorage:left:setA").click();
    await expect(left).toHaveText("\"A\"");
    await expect(right).toHaveText("\"A\"");

    await page.getByTestId("useObservableSessionStorage:right:setB").click();
    await expect(left).toHaveText("\"B\"");
    await expect(right).toHaveText("\"B\"");

    await page.getByTestId("useObservableSessionStorage:left:clear").click();
    await expect(left).not.toHaveText("\"A\"");
    await expect(left).not.toHaveText("\"B\"");
    await expect(right).not.toHaveText("\"A\"");
    await expect(right).not.toHaveText("\"B\"");
    await expect(left).not.toHaveText("-", { timeout: 2000 });
    await expect(right).not.toHaveText("-", { timeout: 2000 });
  });
});



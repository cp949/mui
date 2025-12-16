import { expect, test } from "@playwright/test";

test.describe("useConstant", () => {
  test("initializer does not re-run on state-driven re-renders", async ({ page }) => {
    await page.goto("/#/useConstant");

    await expect(page.getByTestId("page:useConstant")).toBeVisible();

    const initCalls1 = await page.getByTestId("useConstant:initCalls").textContent();
    const createdAtCall1 = await page.getByTestId("useConstant:createdAtCall").textContent();
    const id1 = await page.getByTestId("useConstant:id").textContent();

    // Force multiple rerenders.
    for (let i = 0; i < 5; i += 1) {
      await page.getByTestId("useConstant:rerender").click();
    }

    await expect(page.getByTestId("useConstant:rerenders")).toHaveText("5");
    await expect(page.getByTestId("useConstant:initCalls")).toHaveText(initCalls1 ?? "");
    await expect(page.getByTestId("useConstant:createdAtCall")).toHaveText(createdAtCall1 ?? "");
    await expect(page.getByTestId("useConstant:id")).toHaveText(id1 ?? "");
  });
});



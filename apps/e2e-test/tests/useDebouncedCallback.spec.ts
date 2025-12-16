import { expect, test } from "@playwright/test";

test.describe("useDebouncedCallback", () => {
  test("commits only last value, cancel prevents commit", async ({ page }) => {
    await page.goto("/#/useDebouncedCallback");
    await expect(page.getByTestId("page:useDebouncedCallback")).toBeVisible();

    await expect(page.getByTestId("useDebouncedCallback:committed")).toHaveText("-");
    await expect(page.getByTestId("useDebouncedCallback:commitCount")).toHaveText("0");

    const input = page.getByTestId("useDebouncedCallback:input");
    await input.fill("a");
    await input.fill("ab");
    await input.fill("abc");

    // Eventually the last value should commit once.
    await expect(page.getByTestId("useDebouncedCallback:committed")).toHaveText("abc", { timeout: 2000 });
    await expect(page.getByTestId("useDebouncedCallback:commitCount")).toHaveText("1");

    // Now type but cancel before debounce fires.
    await input.fill("abcd");
    await page.getByTestId("useDebouncedCallback:cancel").click();

    // Give some time; should not change.
    await page.waitForTimeout(150);
    await expect(page.getByTestId("useDebouncedCallback:committed")).toHaveText("abc");
    await expect(page.getByTestId("useDebouncedCallback:commitCount")).toHaveText("1");
  });
});



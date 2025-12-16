import { expect, test } from "@playwright/test";

function parseY(text: string | null): number {
  if (!text) return 0;
  try {
    const obj = JSON.parse(text) as { y?: number };
    return typeof obj.y === "number" ? obj.y : 0;
  } catch {
    return 0;
  }
}

test.describe("useAbsolutePosition", () => {
  test("position updates after layout change", async ({ page }) => {
    await page.goto("/#/useAbsolutePosition");
    await expect(page.getByTestId("page:useAbsolutePosition")).toBeVisible();

    const pos = page.getByTestId("useAbsolutePosition:pos");
    const y0 = parseY(await pos.textContent());

    await page.getByTestId("useAbsolutePosition:bump").click();
    await expect(page.getByTestId("useAbsolutePosition:spacer")).toHaveText("80");

    await expect
      .poll(async () => parseY(await pos.textContent()), { timeout: 3000 })
      .toBeGreaterThan(y0);
  });
});



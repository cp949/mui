import { expect, test } from "@playwright/test";

test("smoke: app mounts and renders a page", async ({ page }) => {
  const logs: string[] = [];
  const pageErrors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") logs.push(`[console.${msg.type()}] ${msg.text()}`);
  });
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  await page.goto("/#/useLatest");
  await page.waitForTimeout(200);

  // If this fails, dump any JS errors to make debugging straightforward.
  try {
    await expect(page.getByTestId("page:useLatest")).toBeVisible();
  } catch (e) {
    console.log("PAGE ERRORS:", pageErrors);
    console.log("CONSOLE ERRORS:", logs);
    throw e;
  }
});



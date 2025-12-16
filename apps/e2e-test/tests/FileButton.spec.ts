import { expect, test } from "@playwright/test";

test.describe("FileButton", () => {
  test("selects a file and can reset to re-select", async ({ page }) => {
    await page.goto("/#/FileButton");
    await expect(page.getByTestId("page:FileButton")).toBeVisible();

    await expect(page.getByTestId("FileButton:selected")).toHaveText("-");
    await expect(page.getByTestId("FileButton:changeCount")).toHaveText("0");

    const input = page.getByTestId("FileButton:input");

    await input.setInputFiles({
      name: "hello.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("hello"),
    });

    await expect(page.getByTestId("FileButton:selected")).toHaveText("hello.txt");
    await expect(page.getByTestId("FileButton:changeCount")).toHaveText("1");

    await page.getByTestId("FileButton:reset").click();
    await expect(page.getByTestId("FileButton:selected")).toHaveText("-");

    // Selecting the same file again should fire onChange again.
    await input.setInputFiles({
      name: "hello.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("hello"),
    });
    await expect(page.getByTestId("FileButton:changeCount")).toHaveText("2");
  });
});



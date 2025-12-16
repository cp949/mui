import { expect, test } from "@playwright/test";

test.describe("useAudioUnlocked", () => {
  test("click unlocks and calls callback", async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.removeItem("audio-unlocked");
    });

    await page.goto("/#/useAudioUnlocked");
    await expect(page.getByTestId("page:useAudioUnlocked")).toBeVisible();

    // Ensure we start locked.
    await expect(page.getByTestId("useAudioUnlocked:unlocked")).toHaveText("false");
    await expect(page.getByTestId("useAudioUnlocked:calls")).toHaveText("0");

    await page.getByTestId("useAudioUnlocked:tap").click();

    await expect(page.getByTestId("useAudioUnlocked:unlocked")).toHaveText("true", { timeout: 2000 });
    await expect(page.getByTestId("useAudioUnlocked:calls")).toHaveText("1", { timeout: 2000 });
  });
});



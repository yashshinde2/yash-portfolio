import { chromium } from "playwright";

const widths = [320, 360, 375, 390, 414, 768, 1023];

async function checkMobile() {
  const browser = await chromium.launch({ channel: "msedge" });
  let allOk = true;

  for (const w of widths) {
    const page = await browser.newPage({
      viewport: { width: w, height: 800 },
    });

    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    const hasHorizontalOverflow = scrollWidth > innerWidth;

    console.log(`[Viewport ${w}px] scrollWidth=${scrollWidth}, innerWidth=${innerWidth}, overflow=${hasHorizontalOverflow}`);

    if (hasHorizontalOverflow) {
      allOk = false;
      console.error(`ERROR: Horizontal overflow detected at ${w}px!`);
    }

    const menuBtn = page.locator("button[aria-label='Open navigation menu']");
    const isVisible = await menuBtn.isVisible();
    if (!isVisible) {
      console.error(`ERROR: Mobile menu button not visible at ${w}px!`);
      allOk = false;
    } else {
      await menuBtn.click();
      await page.waitForTimeout(300);

      const overlay = page.locator("#mobile-nav-overlay");
      const overlayVisible = await overlay.isVisible();
      const bodyOverflow = await page.evaluate(() => document.body.style.overflow);

      if (!overlayVisible || bodyOverflow !== "hidden") {
        console.error(`ERROR: Menu overlay failed to open or body not locked at ${w}px!`);
        allOk = false;
      } else {
        await page.keyboard.press("Escape");
        try {
          await overlay.waitFor({ state: "detached", timeout: 2000 });
        } catch {}
        const overlayClosed = !(await overlay.isVisible());
        const bodyUnlocked = await page.evaluate(() => document.body.style.overflow);

        if (!overlayClosed || bodyUnlocked !== "") {
          console.error(`ERROR: Menu overlay failed to close on Escape at ${w}px!`);
          allOk = false;
        }
      }
    }

    const firstProject = page.locator("[data-cursor='view']").first();
    await firstProject.click();
    await page.waitForTimeout(400);

    const postExpandScroll = await page.evaluate(() => document.documentElement.scrollWidth);
    if (postExpandScroll > innerWidth) {
      console.error(`ERROR: Horizontal overflow after project expansion at ${w}px!`);
      allOk = false;
    }

    await page.close();
  }

  await browser.close();
  return allOk;
}

checkMobile().then((ok) => {
  if (ok) console.log("\nALL MOBILE INTERACTION AND VIEWPORT TESTS PASSED!\n");
  else console.error("\nSome mobile checks failed!\n");
}).catch(console.error);

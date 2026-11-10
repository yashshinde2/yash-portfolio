import { chromium } from "playwright";
import fs from "fs";

const outDir = "C:/tmp/desktop-before";
fs.mkdirSync(outDir, { recursive: true });

const viewports = [
  { width: 1920, height: 1080, name: "1920x1080" },
  { width: 1440, height: 900, name: "1440x900" },
  { width: 1280, height: 800, name: "1280x800" },
];

async function capture() {
  const browser = await chromium.launch({ channel: "msedge" });

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: "reduce",
    });

    await page.clock.setFixedTime(new Date("2026-11-10T12:00:00Z"));

    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(3500);

    await page.screenshot({
      path: `${outDir}/full-${vp.name}.png`,
      fullPage: true,
      animations: "disabled",
    });

    const hero = page.locator("[data-hero]");
    await hero.screenshot({
      path: `${outDir}/hero-${vp.name}.png`,
      animations: "disabled",
    });

    console.log(`Captured before: ${vp.name}`);
    await page.close();
  }

  await browser.close();
  console.log("All 'before' screenshots saved to", outDir);
}

capture().catch(console.error);

import { chromium } from "playwright";
import fs from "fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const beforeDir = "C:/tmp/desktop-before";
const afterDir = "C:/tmp/desktop-after";
fs.mkdirSync(afterDir, { recursive: true });

const viewports = [
  { width: 1920, height: 1080, name: "1920x1080" },
  { width: 1440, height: 900, name: "1440x900" },
  { width: 1280, height: 800, name: "1280x800" },
];

async function run() {
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
      path: `${afterDir}/full-${vp.name}.png`,
      fullPage: true,
      animations: "disabled",
    });

    const hero = page.locator("[data-hero]");
    await hero.screenshot({
      path: `${afterDir}/hero-${vp.name}.png`,
      animations: "disabled",
    });

    await page.close();
  }

  await browser.close();

  const files = [
    "full-1920x1080.png",
    "hero-1920x1080.png",
    "full-1440x900.png",
    "hero-1440x900.png",
    "full-1280x800.png",
    "hero-1280x800.png",
  ];

  let allPassed = true;
  console.log("\n=== PIXELMATCH DIFF REPORT ===");
  for (const f of files) {
    const img1 = PNG.sync.read(fs.readFileSync(`${beforeDir}/${f}`));
    const img2 = PNG.sync.read(fs.readFileSync(`${afterDir}/${f}`));
    const { width, height } = img1;
    const diff = new PNG({ width, height });
    const diffPixels = pixelmatch(
      img1.data,
      img2.data,
      diff.data,
      width,
      height,
      { threshold: 0.1 }
    );
    const totalPixels = width * height;
    const pct = ((diffPixels / totalPixels) * 100).toFixed(4);
    console.log(`${f}: ${pct}% diff (${diffPixels}/${totalPixels} pixels)`);
    if (diffPixels > 0) allPassed = false;
  }
  console.log("==============================\n");
  return allPassed;
}

run().then(passed => {
  if (!passed) console.log("Diffs detected!");
  else console.log("All desktop screenshots match 0.00% diff!");
}).catch(console.error);

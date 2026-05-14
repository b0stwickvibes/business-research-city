/**
 * Builds the control center, serves dist via `vite preview`, captures full-page
 * screenshots for the design review.
 *
 * First time: `cd control-center && npm install && npx playwright install chromium`
 */
import { execSync, spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ccRoot = path.resolve(__dirname, "..");
const outDir = path.resolve(ccRoot, "../.design/control-center/screenshots");
const origin = "http://127.0.0.1:4173";
const viteCli = path.join(ccRoot, "node_modules", "vite", "bin", "vite.js");

function waitForOk(url, maxMs = 45_000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      http
        .get(url, (res) => {
          res.resume();
          resolve(undefined);
        })
        .on("error", () => {
          if (Date.now() - started > maxMs) {
            reject(new Error(`Timeout waiting for ${url}`));
            return;
          }
          setTimeout(tryOnce, 400);
        });
    };
    tryOnce();
  });
}

execSync("npm run build", { cwd: ccRoot, stdio: "inherit" });

const preview = spawn(
  process.execPath,
  [viteCli, "preview", "--host", "127.0.0.1", "--port", "4173", "--strictPort"],
  {
    cwd: ccRoot,
    stdio: "inherit",
  },
);

try {
  await waitForOk(`${origin}/`);
  mkdirSync(outDir, { recursive: true });

  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const captures = [
    ["review-deal-pins-desktop-1280.png", 1280, 800],
    ["review-deal-pins-tablet-768.png", 768, 1024],
    ["review-deal-pins-mobile-375.png", 375, 812],
  ];

  for (const [filename, width, height] of captures) {
    await page.setViewportSize({ width, height });
    await page.goto(`${origin}/`, { waitUntil: "networkidle" });
    await page.screenshot({
      path: path.join(outDir, filename),
      fullPage: true,
    });
  }

  await browser.close();
  console.log(`Screenshots saved under ${outDir}`);
} finally {
  preview.kill("SIGTERM");
}

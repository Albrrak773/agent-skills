#!/usr/bin/env node
// Screenshot every variant in a mock folder at several widths and report horizontal overflow.
//
//   node shoot.mjs <mock-folder> [--widths 1440,1280,1024] [--scheme dark|light] [--height 860]
//
// Reads variants.js for the file list (falls back to every .html except index.html), opens each
// over file://, writes <mock-folder>/shots/<variant>-<width>.png. Exits 1 if any page overflows.
// Needs Playwright installed in the directory you run it from (or above it).
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import vm from "node:vm";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const folderArg = args.find((a, i) => !a.startsWith("--") && !(args[i - 1] || "").startsWith("--"));
if (!folderArg) {
  console.error("usage: node shoot.mjs <mock-folder> [--widths 1440,1280,1024] [--scheme dark|light] [--height 860]");
  process.exit(2);
}
const folder = resolve(folderArg);
const widths = flag("widths", "1440,1280,1024").split(",").map(Number).filter(Boolean);
const scheme = flag("scheme", "dark");
const height = Number(flag("height", "860"));

function variantFiles() {
  const manifest = join(folder, "variants.js");
  if (existsSync(manifest)) {
    const sandbox = { window: {} };
    vm.runInNewContext(readFileSync(manifest, "utf8"), sandbox);
    const files = (sandbox.window.MOCK?.variants || []).map((v) => v.file);
    if (files.length) return files;
  }
  return readdirSync(folder).filter((f) => f.endsWith(".html") && f !== "index.html").sort();
}

function loadChromium() {
  const require = createRequire(join(process.cwd(), "noop.js"));
  for (const name of ["playwright", "@playwright/test", "playwright-core"]) {
    try {
      return require(name).chromium;
    } catch {}
  }
  console.error("Playwright not found from this directory. Run from a project that has it, or: npm i -D playwright && npx playwright install chromium");
  process.exit(2);
}

const files = variantFiles();
if (files.length === 0) {
  console.error(`no variant pages found in ${folder}`);
  process.exit(2);
}
const shots = join(folder, "shots");
mkdirSync(shots, { recursive: true });

const browser = await loadChromium().launch();
let overflowed = 0;
for (const file of files) {
  const path = join(folder, file);
  if (!existsSync(path)) {
    console.log(`${file}: MISSING (listed in variants.js)`);
    overflowed++;
    continue;
  }
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height }, colorScheme: scheme });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(pathToFileURL(path).href, { waitUntil: "load" });
    await page.waitForTimeout(400);
    // The nav bar is tooling; keep it out of the pictures.
    await page.addStyleTag({ content: ".mocknav { display: none !important; }" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const broken = await page.evaluate(() =>
      [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.getAttribute("src")));
    const out = join(shots, `${file.replace(/\.html$/, "")}-${width}.png`);
    await page.screenshot({ path: out });
    const notes = [
      overflow > 0 ? `OVERFLOW ${overflow}px` : "ok",
      broken.length ? `broken images: ${broken.join(", ")}` : "",
      errors.length ? `js errors: ${errors.join(" | ")}` : "",
    ].filter(Boolean).join("; ");
    console.log(`${file} @${width}: ${notes}`);
    if (overflow > 0 || broken.length || errors.length) overflowed++;
    await context.close();
  }
}
await browser.close();
console.log(`shots in ${shots}`);
process.exit(overflowed ? 1 : 0);

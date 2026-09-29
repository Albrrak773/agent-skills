#!/usr/bin/env node
// work-report, step 5: capture screenshots from a running app. See references/screenshots.md.
//
// Needs Playwright, which is NOT expected in the project. Install it in a scratch dir:
//   cd <scratch> && npm init -y >/dev/null && npm i playwright && npx playwright install chromium
//   NODE_PATH=<scratch>/node_modules node scripts/shoot.mjs [flags] <spec> [<spec>...]
//
// Flags (the project profile says which values to use):
//   --base <url>            origin of the running app                        (required)
//   --prefix <name>         "before" or "after"; files are <out>/<prefix>-<name>.png (required)
//   --out <dir>             output dir                                       (default ./shots)
//   --login <path>          visited once before any spec, e.g. /api/dev-auth (optional)
//   --storage-state <file>  Playwright storageState JSON with a signed-in session (optional)
//   --locale <tag>          browser locale                                   (default en)
//   --theme <dark|light>    prefers-color-scheme                             (default dark)
//   --viewport <WxH>        CSS pixels                                       (default 1440x900)
//   --scale <n>             deviceScaleFactor; 2 keeps text sharp after crop (default 2)
//   --proxy <file.json>     {"<url glob>": "<local file>"}: answer matching requests with a
//                           local file. For objects that exist in production but not locally
//                           (public CDN images). Never upload to real storage to fake them.
//
// <spec> = route@name[@waitSelector][@step...]
//   route           path on --base, e.g. /dashboard or /ar/settings/billing
//   name            output file name part
//   waitSelector    CSS selector to wait for before capturing (may be empty: route@name@@step)
//   steps, in order:  click:<exact visible text>   css:<selector to click>   wait:<ms>
//                     wheel:<px> (scroll)   full (full-page)   clip:x,y,w,h (CSS px)
//
// Exit code 1 if any spec failed to navigate; per-step failures are logged and capture continues.

import { createRequire } from "node:module";
import { mkdirSync, readFileSync, existsSync } from "node:fs";
import { resolve, extname } from "node:path";

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); }
catch { console.error("shoot.mjs: playwright not found. Install it in a scratch dir and set NODE_PATH (see header)."); process.exit(2); }

const args = process.argv.slice(2);
const opt = { out: "./shots", locale: "en", theme: "dark", viewport: "1440x900", scale: "2" };
const specs = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a.startsWith("--")) {
    const key = a.slice(2).replace(/-(\w)/g, (_, c) => c.toUpperCase());
    const val = args[++i];
    if (val === undefined) { console.error(`shoot.mjs: ${a} needs a value`); process.exit(2); }
    opt[key] = val;
  } else specs.push(a);
}
if (!opt.base || !opt.prefix || !specs.length) {
  console.error("usage: shoot.mjs --base <url> --prefix <before|after> [flags] <route@name[@wait][@step...]> ...");
  process.exit(2);
}
const [vw, vh] = opt.viewport.split("x").map(Number);
const out = resolve(opt.out);
mkdirSync(out, { recursive: true });

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml", ".json": "application/json" };

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: vw, height: vh }, deviceScaleFactor: Number(opt.scale),
  colorScheme: opt.theme, locale: opt.locale,
  ...(opt.storageState ? { storageState: opt.storageState } : {}),
});
const page = await ctx.newPage();

if (opt.proxy) {
  const map = JSON.parse(readFileSync(opt.proxy, "utf8"));
  for (const [glob, file] of Object.entries(map)) {
    const path = resolve(file);
    if (!existsSync(path)) { console.error(`shoot.mjs: proxy file missing: ${path}`); process.exit(2); }
    await ctx.route(glob, (route) => route.fulfill({ status: 200, contentType: MIME[extname(path)] || "application/octet-stream", body: readFileSync(path) }));
  }
}

// "load", never "networkidle": dashboards that poll never go idle, and the wait just times out.
const go = (url) => page.goto(url, { waitUntil: "load", timeout: 180000 });
if (opt.login) await go(opt.base + opt.login);

let failed = 0;
for (const spec of specs) {
  const [route, name, waitSel, ...steps] = spec.split("@");
  try { await go(opt.base + route); }
  catch (e) { console.log(`✗ ${route}: ${e.message.split("\n")[0]}`); failed++; continue; }
  if (waitSel) await page.waitForSelector(waitSel, { timeout: 90000 }).catch(() => console.log(`  (wait selector never appeared: ${waitSel})`));
  await page.waitForTimeout(3000);

  let full = false, clip;
  for (const s of steps) {
    if (s === "full") { full = true; continue; }
    const i = s.indexOf(":");
    const kind = s.slice(0, i), arg = s.slice(i + 1);
    try {
      if (kind === "click") await page.getByText(arg, { exact: true }).first().click({ timeout: 30000 });
      else if (kind === "css") await page.locator(arg).first().click({ timeout: 30000 });
      else if (kind === "wait") await page.waitForTimeout(Number(arg));
      else if (kind === "wheel") { await page.mouse.move(vw / 2, vh / 2); await page.mouse.wheel(0, Number(arg)); }
      else if (kind === "clip") { const [x, y, w, h] = arg.split(",").map(Number); clip = { x, y, width: w, height: h }; continue; }
      else { console.log(`  (unknown step ${s})`); continue; }
    } catch (e) { console.log(`  (step failed) ${s}: ${e.message.split("\n")[0]}`); }
    await page.waitForTimeout(1200);
  }

  // Lazy <img>s can sit at complete=false forever in headless Chromium, while a fresh Image()
  // of the same URL loads fine. Re-assigning src starts them. Repeat until every visible image
  // has pixels, or give up after ~60s and say so.
  for (let k = 0; k < 12; k++) {
    const pending = await page.evaluate(() => {
      const bad = [...document.images].filter((i) => i.getBoundingClientRect().width > 0 && !(i.complete && i.naturalWidth > 0));
      bad.forEach((i) => { i.loading = "eager"; const s = i.srcset, u = i.src; i.removeAttribute("srcset"); i.src = ""; if (s) i.srcset = s; i.src = u; });
      return bad.length;
    });
    if (!pending) break;
    if (k === 11) console.log(`  (${pending} image(s) never loaded: look before using this shot)`);
    await page.waitForTimeout(5000);
  }
  await page.waitForTimeout(1000);

  const file = `${out}/${opt.prefix}-${name || route.replace(/\W+/g, "_")}.png`;
  await page.screenshot({ path: file, fullPage: full, clip });
  console.log(`✓ ${file}`);
}
await browser.close();
process.exit(failed ? 1 : 0);

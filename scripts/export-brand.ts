import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { SHS_PATHS } from "../src/lib/brand";

const paths = SHS_PATHS.map(d => `<path d="${d}"/>`).join("");
const gradient = '<defs><linearGradient id="shs" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#67e8f9"/><stop offset="1" stop-color="#c084fc"/></linearGradient></defs>';
const svg = (badge = false, mono = false) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 104 104" role="img" aria-labelledby="title"><title id="title">Sarwad Hasan Siddiqui — SHS</title>${gradient}${badge ? '<rect width="104" height="104" rx="20" fill="#070915"/>' : ""}<g fill="${mono ? "#e8eaf6" : "url(#shs)"}">${paths}</g></svg>`;

async function main() {
  await mkdir("public/brand", { recursive: true });
  await writeFile("public/brand/shs-mark.svg", svg());
  await writeFile("public/brand/shs-mark-mono.svg", svg(false, true));
  await writeFile("src/app/icon.svg", svg(true));
  const browser = await chromium.launch({ channel: process.platform === "win32" ? "msedge" : undefined });
  try {
    const page = await browser.newPage();
    for (const size of [32, 64, 512]) {
      await page.setViewportSize({ width: size, height: size });
      await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:100%;height:100%}</style>${svg()}`);
      await page.screenshot({ path: `public/brand/shs-mark-${size}.png`, omitBackground: true });
    }
    const icons: Buffer[] = [];
    for (const size of [32, 64]) {
      await page.setViewportSize({ width: size, height: size });
      await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:100%;height:100%}</style>${svg(true)}`);
      icons.push(await page.screenshot({ omitBackground: true }));
    }
    const header = Buffer.alloc(6 + icons.length * 16);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(icons.length, 4);
    let offset = header.length;
    icons.forEach((data, i) => {
      const entry = 6 + i * 16;
      header[entry] = header[entry + 1] = [32, 64][i];
      header.writeUInt16LE(1, entry + 4);
      header.writeUInt16LE(32, entry + 6);
      header.writeUInt32LE(data.length, entry + 8);
      header.writeUInt32LE(offset, entry + 12);
      offset += data.length;
    });
    await writeFile("src/app/favicon.ico", Buffer.concat([header, ...icons]));
  } finally {
    await browser.close();
  }
  console.log("Exported SHS SVG, transparent PNGs (32/64/512px), and site icons.");
}

main().catch(error => { console.error(error); process.exitCode = 1; });

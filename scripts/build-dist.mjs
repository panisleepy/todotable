// Copy web assets into dist/ for Tauri frontendDist.
// Project root mixes node_modules and src-tauri, so we copy only app assets.
// Uses manual recursive copy (mkdirSync/copyFileSync) for compatibility.
import { mkdirSync, copyFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const assets = [
  "index.html",
  "styles.css",
  "tweaks-panel.jsx",
  "v2",
  "vendor",
];

function copyRecursive(src, dest) {
  if (statSync(src).isDirectory()) {
    mkdirSync(dest, { recursive: true });
    for (const entry of readdirSync(src)) {
      copyRecursive(join(src, entry), join(dest, entry));
    }
  } else {
    copyFileSync(src, dest);
  }
}

mkdirSync(dist, { recursive: true });
for (const name of assets) {
  copyRecursive(join(root, name), join(dist, name));
}

console.log(`dist/ ready (${assets.length} asset groups)`);

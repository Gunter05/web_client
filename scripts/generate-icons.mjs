/**
 * Génère les icônes de l'application installable (PWA) à partir du symbole
 * du logo (public/brand/contineng-512.svg), centré sur un fond blanc.
 * À relancer si le logo change : `npm run icons`.
 *
 * - public/icons/icon-192.png, icon-512.png : icônes du manifeste (coins arrondis)
 * - public/icons/icon-maskable-512.png : variante « maskable » (Android découpe
 *   l'icône en cercle ou en goutte : le symbole reste dans la zone sûre de 80 %)
 * - src/app/apple-icon.png : écran d'accueil iPhone (carré plein, iOS arrondit)
 * - src/app/icon.svg : icône de l'onglet du navigateur (le symbole seul, net à
 *   toute taille)
 */
import { copyFile, mkdir } from "node:fs/promises";
import sharp from "sharp";

const SYMBOL = "public/brand/contineng-512.svg";
const BACKGROUND = "#ffffff";

/**
 * @param {number} size côté en pixels
 * @param {{ rounded: boolean, scale: number }} options coins arrondis, part du
 *   carré occupée par le symbole
 */
async function png(path, size, { rounded, scale }) {
  const radius = rounded ? size * 0.22 : 0;
  const background = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${BACKGROUND}"/>
</svg>`;
  const inner = Math.round(size * scale);
  const symbol = await sharp(SYMBOL, { density: 300 })
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  await sharp(Buffer.from(background))
    .composite([{ input: symbol, gravity: "center" }])
    .png()
    .toFile(path);
  console.log(`✓ ${path}`);
}

await mkdir("public/icons", { recursive: true });
await png("public/icons/icon-192.png", 192, { rounded: true, scale: 0.7 });
await png("public/icons/icon-512.png", 512, { rounded: true, scale: 0.7 });
await png("public/icons/icon-maskable-512.png", 512, {
  rounded: false,
  scale: 0.6,
});
await png("src/app/apple-icon.png", 180, { rounded: false, scale: 0.7 });
await copyFile(SYMBOL, "src/app/icon.svg");
console.log("✓ src/app/icon.svg");

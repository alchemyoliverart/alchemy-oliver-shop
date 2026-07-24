import sharp from 'sharp';
import { statSync, unlinkSync } from 'fs';
import { join, extname, basename } from 'path';

const PUBLIC_DIR = new URL('../public', import.meta.url).pathname;
const WEBP_QUALITY = 82;

// Deliberately NOT "all images" — excludes:
//  - each project's images[0] (src/projects.js): also used as the Stripe
//    Checkout line-item image (api/create-checkout-session.js via
//    src/Nav.jsx imageUrl), which does not officially support WebP
//  - petels-Pixels-andmemory_orchid.jpg: og:image / twitter:image in
//    index.html — social share crawlers have inconsistent WebP support
//  - small_logo.png: favicon
//  - FlowerGRaphic.png / butterfly1.png: embedded in the welcome email
//    (api/subscribe.js) — Outlook desktop does not render WebP
const FILES = [
  'Logo.png',
  'me.png',
  'Home_Grown01.jpg',
  'homegrown03.jpg',
  'petels-pixels-andmemory_orchid.1.jpg',
  'petals-pixels-andmemory_orchid2Framed.jpg',
  'another_fragment1.jpg',
  'another_fragment_framed.jpg',
  'Generative Fill 2.jpg',
  'Poppiess2.jpg',
  'Poppiesa02.jpg',
  'poppies2_a0_new.jpg',
];

let totalBefore = 0;
let totalAfter = 0;

for (const file of FILES) {
  const srcPath = join(PUBLIC_DIR, file);
  const destPath = join(PUBLIC_DIR, file.slice(0, -extname(file).length) + '.webp');
  const sizeBefore = statSync(srcPath).size;
  totalBefore += sizeBefore;

  await sharp(srcPath).webp({ quality: WEBP_QUALITY }).toFile(destPath);

  const sizeAfter = statSync(destPath).size;
  totalAfter += sizeAfter;
  unlinkSync(srcPath);

  const saving = Math.round((1 - sizeAfter / sizeBefore) * 100);
  console.log(`✓ ${file.padEnd(48)} ${(sizeBefore / 1024).toFixed(0).padStart(5)}kb → ${(sizeAfter / 1024).toFixed(0).padStart(5)}kb  (${saving}% smaller)  →  ${basename(destPath)}`);
}

console.log(`\nTotal: ${(totalBefore / 1024 / 1024).toFixed(2)}mb → ${(totalAfter / 1024 / 1024).toFixed(2)}mb`);

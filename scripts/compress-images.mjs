import sharp from 'sharp';
import { readdirSync, statSync, renameSync } from 'fs';
import { join, extname, basename } from 'path';

const PUBLIC_DIR = new URL('../public', import.meta.url).pathname;
const MAX_WIDTH = 1800;
const JPEG_QUALITY = 82;

const exts = ['.jpg', '.jpeg', '.png'];

const files = readdirSync(PUBLIC_DIR).filter(f =>
  exts.includes(extname(f).toLowerCase())
  && !['Logo.png', 'small_logo.png', 'me.png'].includes(f)
);

console.log(`Found ${files.length} images to process...\n`);

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const filePath = join(PUBLIC_DIR, file);
  const tmpPath = filePath + '.tmp';
  const sizeBefore = statSync(filePath).size;
  totalBefore += sizeBefore;

  try {
    const img = sharp(filePath);
    const meta = await img.metadata();

    let pipeline = img;
    if (meta.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
    }

    const ext = extname(file).toLowerCase();
    if (ext === '.png') {
      await pipeline.png({ compressionLevel: 9, quality: 90 }).toFile(tmpPath);
    } else {
      await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(tmpPath);
    }

    renameSync(tmpPath, filePath);
    const sizeAfter = statSync(filePath).size;
    totalAfter += sizeAfter;
    const saving = Math.round((1 - sizeAfter / sizeBefore) * 100);
    console.log(`✓ ${file.padEnd(48)} ${(sizeBefore/1024).toFixed(0).padStart(5)}kb → ${(sizeAfter/1024).toFixed(0).padStart(5)}kb  (${saving}% smaller)`);
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`);
  }
}

console.log(`\nTotal: ${(totalBefore/1024/1024).toFixed(1)}mb → ${(totalAfter/1024/1024).toFixed(1)}mb`);

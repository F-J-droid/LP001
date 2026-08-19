import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dirs = [
  './public/images/products',
  './public/images/hero',
  './public/images/blog',
  './public/images/banners'
];

async function convert() {
  let totalBefore = 0;
  let totalAfter = 0;

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith('.png')) {
        const fullPath = path.join(dir, file);
        const newPath = path.join(dir, file.replace('.png', '.webp'));
        
        const statBefore = fs.statSync(fullPath);
        totalBefore += statBefore.size;

        await sharp(fullPath)
          .webp({ quality: 80 })
          .toFile(newPath);
          
        const statAfter = fs.statSync(newPath);
        totalAfter += statAfter.size;
        
        // Remove old png
        fs.unlinkSync(fullPath);
        console.log(`Converted ${file} to .webp`);
      }
    }
  }
  
  console.log(`\nWeight Before: ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Weight After: ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Saved: ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(2)} MB`);
}

convert().catch(console.error);

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createCanvas } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure public directory exists
const publicDir = join(__dirname, '../public');
if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true });
}

// Sizes to generate
const sizes = [
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-16x16.png', size: 16 }
];

// Create a simple home icon
function generateIcons() {
  for (const { name, size } of sizes) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Draw house body
    const bodyHeight = size * 0.5;
    const bodyY = size - bodyHeight;
    
    // Draw roof
    ctx.fillStyle = '#1e40af';
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size, size * 0.4);
    ctx.lineTo(0, size * 0.4);
    ctx.closePath();
    ctx.fill();
    
    // Draw house body
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(size * 0.2, size * 0.4, size * 0.6, bodyHeight * 0.8);
    
    // Draw door
    ctx.fillStyle = 'white';
    const doorWidth = size * 0.2;
    const doorHeight = size * 0.3;
    ctx.fillRect(
      (size - doorWidth) / 2,
      size - doorHeight - (size * 0.1),
      doorWidth,
      doorHeight
    );
    
    // Save the file
    const buffer = canvas.toBuffer('image/png');
    writeFileSync(join(publicDir, name), buffer);
    console.log(`Generated ${name}`);
  }
}

generateIcons();

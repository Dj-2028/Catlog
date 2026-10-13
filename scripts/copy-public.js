// Copies root /public (admin CSS/JS, images) into client/dist so Vercel's CDN
// serves them alongside the React build. Skips public/uploads.
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'public');
const dest = path.join(__dirname, '..', 'client', 'dist');

fs.cpSync(src, dest, {
    recursive: true,
    filter: (p) => path.relative(src, p).split(path.sep)[0] !== 'uploads',
});

console.log('✓ Copied public/ into client/dist');

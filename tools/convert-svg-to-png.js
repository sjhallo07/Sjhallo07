const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function convert() {
    const assetsDir = path.join(__dirname, '..', 'presentation', 'assets');
    const svgs = fs.readdirSync(assetsDir).filter(f => f.endsWith('.svg'));
    for (const s of svgs) {
        const inPath = path.join(assetsDir, s);
        const outPath = inPath.replace(/\.svg$/, '.png');
        try {
            const data = fs.readFileSync(inPath);
            await sharp(data).png().toFile(outPath);
            console.log('Wrote', outPath);
        } catch (err) {
            console.error('Failed to convert', inPath, err && err.message ? err.message : err);
        }
    }
}

convert().catch(e => { console.error(e); process.exit(1); });

// Render Mermaid .mmd files to SVG using mermaid + jsdom (no Puppeteer)
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

async function render() {
    const assetsDir = path.join(__dirname, '..', 'presentation', 'assets');
    const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.mmd'));
    if (!files.length) {
        console.error('No .mmd files found in', assetsDir);
        process.exit(1);
    }

    // set up a DOM for mermaid
    const dom = new JSDOM('<!doctype html><html><body></body></html>');
    const win = dom.window;
    // copy window globals into Node global so mermaid/d3 can access them
    // expose window/document/navigator to the Node global and globalThis
    global.window = win;
    global.document = win.document;
    global.navigator = win.navigator;
    globalThis.window = win;
    globalThis.document = win.document;
    globalThis.navigator = win.navigator;
    // copy other properties from window to both global and globalThis (safe for rendering)
    Object.getOwnPropertyNames(win).forEach((p) => {
        if (typeof global[p] === 'undefined') {
            try { global[p] = win[p]; } catch (e) { /* ignore */ }
        }
        if (typeof globalThis[p] === 'undefined') {
            try { globalThis[p] = win[p]; } catch (e) { /* ignore */ }
        }
    });

    // import mermaid (default export)
    const mermaid = require('mermaid').default;

    // initialize mermaid
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' });

    for (const f of files) {
        const filePath = path.join(assetsDir, f);
        const code = fs.readFileSync(filePath, 'utf8');
        const id = 'm' + Math.random().toString(36).slice(2, 9);
        try {
            const svg = await new Promise((resolve, reject) => {
                mermaid.mermaidAPI.render(id, code, (svgCode) => resolve(svgCode), document.body);
            });
            const outName = f.replace(/\.mmd$/, '.svg');
            const outPath = path.join(assetsDir, outName);
            fs.writeFileSync(outPath, svg, 'utf8');
            console.log('Wrote', outPath);
        } catch (err) {
            console.error('Failed to render', f, err && err.message ? err.message : err);
        }
    }
}

render().catch(err => { console.error(err); process.exit(1); });

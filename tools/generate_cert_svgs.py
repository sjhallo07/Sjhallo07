#!/usr/bin/env python3
import json
from pathlib import Path
from html import escape

repo = Path('/workspaces/Sjhallo07')
meta_file = repo / 'docs' / 'certs' / 'metadata.json'
assets_dir = repo / 'docs' / 'assets' / 'certs'

meta = json.loads(meta_file.read_text(encoding='utf-8'))

for entry in meta:
    id = entry.get('id') or entry['title'].lower().replace(' ','-')
    safe_title = entry.get('title','').strip()
    thumb_path = assets_dir / f'thumb-{id}.svg'
    large_path = assets_dir / f'large-{id}.svg'

    # Create thumb SVG (200x140)
    txt = escape(safe_title)
    thumb_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="200" height="140" viewBox="0 0 200 140">
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0" stop-color="#7c3aed"/>
      <stop offset="1" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" rx="10" fill="url(#g)" />
  <g fill="#fff" font-family="Arial, Helvetica, sans-serif">
    <text x="12" y="48" font-size="14" font-weight="700">{txt}</text>
  </g>
</svg>'''
    thumb_path.write_text(thumb_svg, encoding='utf-8')

    # Create large SVG (1200x800)
    large_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <rect width="100%" height="100%" fill="#0b1226" />
  <text x="36" y="120" fill="#fff" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="700">{txt}</text>
  <rect x="36" y="160" width="1128" height="520" rx="8" fill="#fff" opacity="0.04" />
  <text x="36" y="720" fill="#94a3b8" font-family="Arial, Helvetica, sans-serif" font-size="20">{escape(entry.get('description',''))}</text>
</svg>'''
    large_path.write_text(large_svg, encoding='utf-8')

    # Update metadata image and add large field
    entry['image'] = f"./assets/certs/thumb-{id}.svg"
    entry['large'] = f"./assets/certs/large-{id}.svg"

# write back
meta_file.write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding='utf-8')
print('Generated', len(meta), 'SVG thumbnails and updated metadata.json')

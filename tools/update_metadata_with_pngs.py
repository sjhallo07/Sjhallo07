#!/usr/bin/env python3
import json
from pathlib import Path

repo = Path('/workspaces/Sjhallo07')
meta_file = repo / 'docs' / 'certs' / 'metadata.json'
assets_dir = repo / 'docs' / 'assets' / 'certs'

meta = json.loads(meta_file.read_text(encoding='utf-8'))
changed = False
for entry in meta:
    pdf = entry.get('pdf','')
    if not pdf:
        continue
    fname = Path(pdf).name
    id = entry.get('id')
    thumb_png = assets_dir / f'thumb-{id}.png'
    large_png = assets_dir / f'large-{id}.png'
    if thumb_png.exists():
        entry['image'] = f'./assets/certs/{thumb_png.name}'
        changed = True
    if large_png.exists():
        entry['large'] = f'./assets/certs/{large_png.name}'
        changed = True

if changed:
    meta_file.write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding='utf-8')
    print('Updated metadata.json with PNG paths')
else:
    print('No PNG thumbnails found to update metadata.json')

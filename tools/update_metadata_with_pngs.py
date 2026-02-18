#!/usr/bin/env python3
import json
from pathlib import Path
from urllib.parse import unquote
import re


def sanitize_filename(name: str) -> str:
    # remove extension
    base = re.sub(r"\.[^.]*$", "", name)
    # replace non-alnum, dot, underscore, dash with '-'
    s = re.sub(r"[^A-Za-z0-9._-]", "-", base)
    return s.lower()


repo = Path('/workspaces/Sjhallo07')
meta_file = repo / 'docs' / 'certs' / 'metadata.json'
assets_dir = repo / 'docs' / 'assets' / 'certs'

meta = json.loads(meta_file.read_text(encoding='utf-8'))
changed = False
for entry in meta:
    pdf = entry.get('pdf', '')
    if not pdf:
        continue
    # attempt id-based match first
    id = entry.get('id')
    candidates = []
    if id:
        candidates.append((f'thumb-{id}.png', f'large-{id}.png'))

    # also attempt to derive from original pdf filename (unquote percent-encoding)
    fname = unquote(Path(pdf).name)
    sanitized = sanitize_filename(fname)
    candidates.append((f'thumb-{sanitized}.png', f'large-{sanitized}.png'))

    found_thumb = None
    found_large = None
    for thumb_name, large_name in candidates:
        thumb_png = assets_dir / thumb_name
        large_png = assets_dir / large_name
        if not found_thumb and thumb_png.exists():
            found_thumb = thumb_name
        if not found_large and large_png.exists():
            found_large = large_name
        if found_thumb and found_large:
            break

    if found_thumb:
        entry['image'] = f'./assets/certs/{found_thumb}'
        changed = True
    if found_large:
        entry['large'] = f'./assets/certs/{found_large}'
        changed = True

if changed:
    meta_file.write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding='utf-8')
    print('Updated metadata.json with PNG paths')
else:
    print('No PNG thumbnails found to update metadata.json')

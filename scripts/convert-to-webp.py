#!/usr/bin/env python3
"""Convert PNG/JPG images under public/ to WebP, in place (deletes originals)."""

import sys
from pathlib import Path

from PIL import Image

PUBLIC_DIR = Path(__file__).resolve().parent.parent / "public"
SOURCE_EXTS = {".png", ".jpg", ".jpeg"}
QUALITY = 82
MAX_DIMENSION = 2400  # downscale huge source images; site never displays larger


def convert(path: Path) -> Path:
    img = Image.open(path)

    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA" if "A" in img.getbands() else "RGB")

    if max(img.size) > MAX_DIMENSION:
        img.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.LANCZOS)

    dest = path.with_suffix(".webp")
    img.save(dest, "WEBP", quality=QUALITY, method=6)
    return dest


def main() -> None:
    if not PUBLIC_DIR.exists():
        print(f"public/ not found at {PUBLIC_DIR}", file=sys.stderr)
        sys.exit(1)

    targets = [p for p in PUBLIC_DIR.rglob("*") if p.suffix.lower() in SOURCE_EXTS]

    if not targets:
        print("No PNG/JPG images found under public/.")
        return

    total_before = 0
    total_after = 0

    for src in sorted(targets):
        before = src.stat().st_size
        dest = convert(src)
        after = dest.stat().st_size
        total_before += before
        total_after += after

        rel_src = src.relative_to(PUBLIC_DIR)
        rel_dest = dest.relative_to(PUBLIC_DIR)
        print(f"{rel_src}  ({before / 1024:.0f} KB) -> {rel_dest}  ({after / 1024:.0f} KB)")

        src.unlink()

    print()
    print(f"Total: {total_before / 1024 / 1024:.1f} MB -> {total_after / 1024 / 1024:.1f} MB")


if __name__ == "__main__":
    main()

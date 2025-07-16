#!/usr/bin/env python3

import os
import sys
import argparse
import subprocess
from pathlib import Path

def convert_webp(input_files, output_dir, quality=80):
    os.makedirs(output_dir, exist_ok=True)

    for input_path in input_files:
        input_path = Path(input_path)
        if not input_path.exists() or input_path.suffix.lower() not in ['.jpg', '.jpeg', '.png']:
            print(f"Skipped unsupported or missing file: {input_path}")
            continue
        output_path = Path(output_dir) / (input_path.stem + ".webp")

        command = [
            "ffmpeg",
            "-y",
            "-i", str(input_path),
            "-compression_level", "6",
            "-qscale", str(quality),
            str(output_path)
        ]

        print(f"→→{input_path} to {output_path}.")
        subprocess.run(command, check=True)

    print("Process finnished.")

def main():
    parser = argparse.ArgumentParser(description="Convert JPG/PNG images to WEBP format using FFmpeg.")
    parser.add_argument("input", nargs='+', help="Input image file(s) to convert.")
    parser.add_argument("-o", "--output", default="converted_webp", help="Output directory for WebP files.")
    parser.add_argument("--quality", type=int, default=80, help="WebP quality (1-100, default: 80). Lower is smaller file size.")

    args = parser.parse_args()
    convert_webp(args.input, args.output, args.quality)

if __name__ == "__main__":
    main()
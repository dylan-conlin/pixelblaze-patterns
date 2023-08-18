import io
import os
import fnmatch
import json
import re
import sys

def extract_source_code(indir, outdir):
    """
    Extract source code from .epe files and save them as .js files.

    Args:
    - indir: Directory containing .epe files
    - outdir: Directory where .js files will be saved
    """
    for epe_filename in fnmatch.filter(os.listdir(indir), "*.epe"):
        print(f"Extracting source from {epe_filename}")

        with io.open(os.path.join(indir, epe_filename), 'r', 4096, 'utf-8-sig') as epe:
            program = json.load(epe)
            src_filename = re.sub(".epe$", ".js", epe_filename)

            with io.open(os.path.join(outdir, src_filename), 'w') as sourcecode:
                sourcecode.write(program['sources']['main'])

if __name__ == "__main__":
    # Check if the input and output directories are passed as arguments
    if len(sys.argv) < 3:
        print("Usage: extract_src.py <input_directory> <output_directory>")
        sys.exit(1)

    indir = sys.argv[1]
    outdir = sys.argv[2]

    extract_source_code(indir, outdir)

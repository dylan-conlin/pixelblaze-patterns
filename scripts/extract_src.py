import io, os, fnmatch, json, re, sys

# Check if the Pixelblaze name is passed as an argument
if len(sys.argv) < 2:
    print("Usage: extract_src.py <pixelblaze_name>")
    sys.exit(1)

pixelblaze_name = sys.argv[1]

indir = sys.argv[1]
outdir = sys.argv[2]

for epe_filename in fnmatch.filter(os.listdir(indir), "*.epe"):
    print("Extracting source from " + epe_filename)
    with io.open(os.path.join(indir, epe_filename), 'r', 4096, 'utf-8-sig') as epe:
        program = json.load(epe)
        src_filename = re.sub(".epe$", "", epe_filename) + ".js"
        with io.open(os.path.join(outdir, src_filename), 'w') as sourcecode:
            sourcecode.write(program['sources']['main'])

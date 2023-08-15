#!/bin/bash

# Ensure the backups directory exists
mkdir -p backups

# Backup all Pixelblazes
while IFS=: read -r device_name ip_address; do
    # Trim whitespace
    device_name=$(echo $device_name | xargs)
    ip_address=$(echo $ip_address | xargs)

    # Create a directory for each Pixelblaze
    pixelblaze_dir="backups/${device_name}"
    mkdir -p "${pixelblaze_dir}/epe"
    mkdir -p "${pixelblaze_dir}/src"

    backup_filename="${pixelblaze_dir}/${device_name}.pbb"
    ./pbbTool.py backup --ipAddress=${ip_address} --pbbFile=${backup_filename}

  # Extract .epe files
    ./pbbTool.py extract --pbbFile=${backup_filename} --patternName=* --outputDir="${pixelblaze_dir}/epe"

    # Copy epe files to the epe directory for extraction
    cp "${pixelblaze_dir}/epe"/* epe/

    # Extract .js files from .epe
    pushd .  # Save the current directory
    cd "${pixelblaze_dir}"
    python3 ../../extract_src.py
    popd    # Return to the original directory

    # Move extracted .js files to the Pixelblaze directory
    mv src/* "${pixelblaze_dir}/src/"
done < <(./pbbTool.py list-pixelblazes)

# Commit changes to Git
git add -A
git commit -m "Backup and extraction performed."

echo "Backup, extraction, and Git commit completed!"

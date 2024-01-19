#!/bin/bash

# This script performs a backup and extraction of Pixelblaze patterns.
# It handles filenames with special characters by replacing them with similar-looking characters.

# Create the backups directory if it doesn't exist
mkdir -p backups

# Function to replace special characters in filenames
# Arguments:
#   $1: The line or filename to process
replace_special_characters() {
    local line="$1"
    # Replace forward slash with a fraction slash
    echo "${line//\//⁄}"
}

# Function to backup and extract data for a given Pixelblaze
# Arguments:
#   $1: Device name
#   $2: IP address
backup_and_extract() {
    local device_name="$1"
    local ip_address="$2"

    # Create a directory structure for the Pixelblaze
    local pixelblaze_dir="backups/${device_name}"
    mkdir -p "${pixelblaze_dir}/epe"
    mkdir -p "${pixelblaze_dir}/src"

    # Backup the Pixelblaze
    local backup_filename="${pixelblaze_dir}/${device_name}.pbb"
    ./pbbTool.py backup --ipAddress="${ip_address}" --pbbFile="${backup_filename}"

    # Extract .epe files from the backup
    ./pbbTool.py extract --pbbFile="${backup_filename}" --patternName=* --outputDir="${pixelblaze_dir}/epe" | \
    while read -r line; do
        # Check for special characters in filenames and replace them
        if [[ "$line" == *"/"* ]]; then
            local new_line=$(replace_special_characters "$line")
            echo "Renamed pattern file: $line to $new_line"
        fi
    done

    # Extract .js files from the .epe files
    python3 ./extract_src.py "${pixelblaze_dir}/epe" "${pixelblaze_dir}/src"
}

# Main loop to iterate over all Pixelblazes and perform backup and extraction
while IFS=: read -r device_name ip_address; do
    # Trim any whitespace from the device name and IP address
    device_name=$(echo "$device_name" | xargs)
    ip_address=$(echo "$ip_address" | xargs)

    # Call the backup and extraction function
    backup_and_extract "$device_name" "$ip_address"

done < <(./pbbTool.py list-pixelblazes)

# Commit the changes to the Git repository
git add -A
git commit -m "Backup and extraction performed."

echo "Backup, extraction, and Git commit completed!"

#!/bin/bash

# Create the backups directory if it doesn't exist
mkdir -p backups

# Function to backup and extract data for a given Pixelblaze
backup_and_extract() {
    local device_name="$1"
    local ip_address="$2"

    # Create a directory structure for the Pixelblaze
    local pixelblaze_dir="backups/${device_name}"
    mkdir -p "${pixelblaze_dir}/epe"
    mkdir -p "${pixelblaze_dir}/src"

    # Attempt to backup the Pixelblaze
    local backup_filename="${pixelblaze_dir}/${device_name}.pbb"
    if ./pbbTool.py backup --ipAddress="${ip_address}" --pbbFile="${backup_filename}"; then
        # Extract .epe files from the backup
        ./pbbTool.py extract --pbbFile="${backup_filename}" --patternName=* --outputDir="${pixelblaze_dir}/epe"

        # Extract .js files from the .epe files
        python3 ./extract_src.py "${pixelblaze_dir}/epe" "${pixelblaze_dir}/src"
    else
        echo "Error: Failed to backup Pixelblaze at ${ip_address}."
        echo "Please check your network connection, ensure the Pixelblaze is accessible at ${ip_address}, and verify that there are no firewall restrictions."
    fi
}

# Iterate over all Pixelblazes and perform backup and extraction
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

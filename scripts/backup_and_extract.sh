#!/bin/bash

# Backup all Pixelblazes
while IFS=: read -r device_name ip_address; do
    # Trim whitespace
    device_name=$(echo $device_name | xargs)
    ip_address=$(echo $ip_address | xargs)

    backup_filename="backups/${device_name}.pbb"
    ./pbbTool.py backup --ipAddress=${ip_address} --pbbFile=${backup_filename}
done < <(./pbbTool.py list-pixelblazes)

# Clear the epe directory and extract new .epe files
rm -rf epe
mkdir -p epe
for pbb_file in backups/*.pbb; do
    ./pbbTool.py extract --pbbFile=${pbb_file} --patternName=* --outputDir=epe
done

# Clear the src directory and use extract_src.py to extract .js files
rm -rf src
mkdir -p src
python3 extract_src.py

# Commit changes to Git
git add -A
git commit -m "Backup and extraction performed."

echo "Backup, extraction, and Git commit completed!"

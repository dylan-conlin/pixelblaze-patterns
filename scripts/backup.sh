#!/usr/bin/env sh

python pbbTool.py backup --ipAddress=192.168.1.24 --pbbFile=cowboy.pbb

python pbbTool.py extract --pbbFile cowboy.pbb --patternName "*" --outputDir "../epe"

# delete the contents of ../src
rm -rf ../src/*

python extract_src.py

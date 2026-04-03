@echo off
setlocal enabledelayedexpansion

set "BASE_DIR=C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app"

mkdir "!BASE_DIR!\public" 2>nul
type nul > "!BASE_DIR!\public\.gitkeep"

mkdir "!BASE_DIR!\src\types" 2>nul
type nul > "!BASE_DIR!\src\types\.gitkeep"

mkdir "!BASE_DIR!\src\context" 2>nul
type nul > "!BASE_DIR!\src\context\.gitkeep"

mkdir "!BASE_DIR!\src\hooks" 2>nul
type nul > "!BASE_DIR!\src\hooks\.gitkeep"

mkdir "!BASE_DIR!\src\utils" 2>nul
type nul > "!BASE_DIR!\src\utils\.gitkeep"

mkdir "!BASE_DIR!\src\components" 2>nul
type nul > "!BASE_DIR!\src\components\.gitkeep"

mkdir "!BASE_DIR!\src\pages" 2>nul
type nul > "!BASE_DIR!\src\pages\.gitkeep"

mkdir "!BASE_DIR!\src\styles" 2>nul
type nul > "!BASE_DIR!\src\styles\.gitkeep"

echo Directories created successfully

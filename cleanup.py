#!/usr/bin/env python3
import os
import shutil
from pathlib import Path

repo_root = r'C:\Users\rafae\Documents\Respositories\travel-baggage-checker'
os.chdir(repo_root)

# Files to delete from root
root_files = [
    "verify_dirs.py",
    "create-all-directories.js",
    "create-directories.js",
    "create-dirs.ps1",
    "create-trip-dirs.js",
    "create_all_dirs.py",
    "create_dirs.bat",
    "create_dirs.ps1",
    "create_dirs.py",
    "create_dirs_now.py",
    "make_dirs.bat",
    "make_dirs.py",
    "mcp_dir_creator.py",
    "mkdirs.go",
    "mkdirs.py",
    "mkdirs_go.go",
    "run-all-tests.bat",
    "run-all-tests.ps1",
    "run_7_methods.py",
    "run_setup.ps1",
    "setup-dirs.js",
    "setup_trip_app.py",
    "setup_trip_manager.py",
    "test_mkdir_method2.py",
    "build_app.py",
]

# Files/dirs to delete from trip-manager-app
trip_app_deletions = [
    "trip-manager-app\\.env.development",
    "trip-manager-app\\.gitignore",
    "trip-manager-app\\tsconfig.json",
    "trip-manager-app\\package.json",
    "trip-manager-app\\src\\App.tsx",
    "trip-manager-app\\src\\index.tsx",
    "trip-manager-app\\src\\reportWebVitals.ts",
    "trip-manager-app\\src\\setupTests.ts",
    "trip-manager-app\\src\\.test",
    "trip-manager-app\\public\\.test",
    "trip-manager-app\\e2e",
    "trip-manager-app\\src\\__tests__",
]

print("=" * 60)
print("TASK 1: LISTING DIRECTORIES (BEFORE CLEANUP)")
print("=" * 60)

# List all directories
dirs = []
for root, dirnames, filenames in os.walk(repo_root):
    for dirname in sorted(dirnames):
        full_path = os.path.join(root, dirname)
        rel_path = os.path.relpath(full_path, repo_root)
        dirs.append(rel_path)

for d in sorted(dirs):
    print(d)

print("\n" + "=" * 60)
print("DELETING TEMP FILES FROM ROOT")
print("=" * 60)

for fname in root_files:
    fpath = os.path.join(repo_root, fname)
    if os.path.exists(fpath):
        os.remove(fpath)
        print(f"✓ Deleted: {fname}")
    else:
        print(f"✗ Not found: {fname}")

print("\n" + "=" * 60)
print("DELETING FILES/DIRS FROM trip-manager-app")
print("=" * 60)

for item in trip_app_deletions:
    ipath = os.path.join(repo_root, item)
    if os.path.isdir(ipath):
        shutil.rmtree(ipath)
        print(f"✓ Deleted directory: {item}")
    elif os.path.isfile(ipath):
        os.remove(ipath)
        print(f"✓ Deleted file: {item}")
    else:
        print(f"✗ Not found: {item}")

print("\n" + "=" * 60)
print("TASK 2: LISTING DIRECTORIES (AFTER CLEANUP)")
print("=" * 60)

# List all directories again
dirs = []
for root, dirnames, filenames in os.walk(repo_root):
    for dirname in sorted(dirnames):
        full_path = os.path.join(root, dirname)
        rel_path = os.path.relpath(full_path, repo_root)
        dirs.append(rel_path)

for d in sorted(dirs):
    print(d)

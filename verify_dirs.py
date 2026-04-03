#!/usr/bin/env python3
"""
Verification script: Check if all 3 directories exist.
"""
import os

BASE = r"C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app\src"
TARGETS = {
    "hooks": os.path.join(BASE, "hooks"),
    "components": os.path.join(BASE, "components"),
    "context": os.path.join(BASE, "context"),
}

print("=" * 70)
print("FINAL VERIFICATION - Directory Existence Check")
print("=" * 70)
print()

all_exist = True
for name, path in TARGETS.items():
    exists = os.path.isdir(path)
    mark = "✓" if exists else "✗"
    status = "EXISTS" if exists else "MISSING"
    print(f"{mark} {name:15} : {status}")
    print(f"  Path: {path}")
    if exists:
        contents = os.listdir(path)
        print(f"  Contents: {contents}")
    print()
    if not exists:
        all_exist = False

print("=" * 70)
if all_exist:
    print("✓ SUCCESS: All 3 directories exist!")
else:
    print("✗ FAILED: Some directories are missing!")
print("=" * 70)

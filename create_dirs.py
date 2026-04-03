#!/usr/bin/env python3
import os
import sys

paths = [
    r'C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app\src\hooks',
    r'C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app\src\components',
    r'C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app\src\context',
]

print("Attempting to create directories...")
for path in paths:
    try:
        os.makedirs(path, exist_ok=True)
        print(f"✓ Created: {path}")
    except Exception as e:
        print(f"✗ Error creating {path}: {e}")
        sys.exit(1)

print("\nVerifying directories...")
for path in paths:
    if os.path.isdir(path):
        print(f"✓ Verified: {path}")
    else:
        print(f"✗ Not found: {path}")

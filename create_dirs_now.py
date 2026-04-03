#!/usr/bin/env python3
"""Create all required directories for trip-manager-app"""

import os
from pathlib import Path

base = r"C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app"

directories = [
    base,
    os.path.join(base, "public"),
    os.path.join(base, "src"),
    os.path.join(base, "src", "types"),
    os.path.join(base, "src", "utils"),
    os.path.join(base, "src", "hooks"),
    os.path.join(base, "src", "context"),
    os.path.join(base, "src", "components"),
    os.path.join(base, "src", "pages"),
    os.path.join(base, "src", "styles"),
    os.path.join(base, "src", "__tests__"),
    os.path.join(base, "e2e"),
]

print("Creating directories...")
for directory in directories:
    try:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"✓ Created: {directory}")
    except Exception as e:
        print(f"✗ Failed to create {directory}: {e}")

print("\nVerifying directories...")
all_exist = True
for directory in directories:
    if os.path.exists(directory) and os.path.isdir(directory):
        print(f"✓ Verified: {directory}")
    else:
        print(f"✗ Missing: {directory}")
        all_exist = False

if all_exist:
    print("\n✓ All directories created successfully!")
    exit(0)
else:
    print("\n✗ Some directories failed verification")
    exit(1)

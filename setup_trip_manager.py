#!/usr/bin/env python3
"""Create directory structure for trip-manager-app"""

from pathlib import Path

base_path = Path(r'C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app')

# Define all directories to create
directories = [
    'public',
    'src/types',
    'src/context',
    'src/hooks',
    'src/utils',
    'src/components',
    'src/pages',
    'src/styles'
]

# Create each directory and add .gitkeep file
for dir_path in directories:
    full_path = base_path / dir_path
    full_path.mkdir(parents=True, exist_ok=True)
    gitkeep_file = full_path / '.gitkeep'
    gitkeep_file.touch()
    print(f'Created: {dir_path}/.gitkeep')

print('\nDirectory structure created successfully!')

import os
from pathlib import Path

# Create the directory structure
base = r'C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app'

dirs = [
    'public',
    'src/types',
    'src/context',
    'src/hooks',
    'src/utils',
    'src/components',
    'src/pages',
    'src/styles'
]

for d in dirs:
    path = os.path.join(base, d)
    os.makedirs(path, exist_ok=True)
    # Create .gitkeep
    gitkeep = os.path.join(path, '.gitkeep')
    open(gitkeep, 'a').close()
    print(f'✓ {d}')

print('\nAll directories created!')

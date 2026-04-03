import os

base = r'C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app'
dirs = [
    'public',
    'src/types',
    'src/context',
    'src/hooks',
    'src/utils',
    'src/components',
    'src/pages',
    'src/styles',
]
for d in dirs:
    path = os.path.join(base, d.replace('/', os.sep))
    os.makedirs(path, exist_ok=True)
    open(os.path.join(path, '.gitkeep'), 'w').close()

print("Directory tree:")
for root, subdirs, files in os.walk(base):
    level = root.replace(base, '').count(os.sep)
    indent = '  ' * level
    print(f'{indent}{os.path.basename(root)}/')
    for f in files:
        print(f'{indent}  {f}')

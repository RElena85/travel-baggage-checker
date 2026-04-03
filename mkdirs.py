import os
dirs = [
    r"trip-manager-app\public",
    r"trip-manager-app\src\types",
    r"trip-manager-app\src\context",
    r"trip-manager-app\src\hooks",
    r"trip-manager-app\src\utils",
    r"trip-manager-app\src\components",
    r"trip-manager-app\src\pages",
    r"trip-manager-app\src\styles",
]
base = r"C:\Users\rafae\Documents\Respositories\travel-baggage-checker"
for d in dirs:
    path = os.path.join(base, d)
    os.makedirs(path, exist_ok=True)
    open(os.path.join(path, ".gitkeep"), "w").close()
    print("created", path)

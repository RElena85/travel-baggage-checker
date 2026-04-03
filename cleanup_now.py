import os
import shutil

BASE = r"C:\Users\rafae\Documents\Respositories\travel-baggage-checker"

root_files = [
    "build_app.py", "cleanup.py", "create-all-directories.js", "create-directories.js",
    "create-dirs.ps1", "create-trip-dirs.js", "create_all_dirs.py", "create_dirs.bat",
    "create_dirs.ps1", "create_dirs.py", "create_dirs_now.py", "create_trip_dirs.py",
    "make_dirs.bat", "make_dirs.py", "mcp_dir_creator.py", "mkdirs.go", "mkdirs.py",
    "mkdirs_go.go", "run-all-tests.bat", "run-all-tests.ps1", "run_7_methods.py",
    "run_setup.ps1", "setup-dirs.js", "setup_trip_app.py", "setup_trip_manager.py",
    "test_mkdir_method2.py", "verify_dirs.py",
]

root_dirs = ["app"]

trip_files = [".env.development", ".gitignore", ".test", "package.json", "tsconfig.json"]
trip_dirs  = ["e2e", ".test"]

src_files = [".test", "App.tsx", "App.test.tsx", "index.tsx", "reportWebVitals.ts", "setupTests.ts"]
src_dirs  = ["__tests__", ".test"]

deleted, skipped = [], []

def remove_file(path):
    if os.path.isfile(path):
        os.remove(path)
        deleted.append(path)
    else:
        skipped.append(path)

def remove_dir(path):
    if os.path.isdir(path):
        shutil.rmtree(path)
        deleted.append(path + "\\")
    else:
        skipped.append(path)

for f in root_files:
    remove_file(os.path.join(BASE, f))
for d in root_dirs:
    remove_dir(os.path.join(BASE, d))

trip = os.path.join(BASE, "trip-manager-app")
for f in trip_files:
    remove_file(os.path.join(trip, f))
for d in trip_dirs:
    remove_dir(os.path.join(trip, d))

src = os.path.join(trip, "src")
for f in src_files:
    remove_file(os.path.join(src, f))
for d in src_dirs:
    remove_dir(os.path.join(src, d))

print("=== DELETED ===")
for p in deleted:
    print(" ", p)

print("\n=== NOT FOUND (skipped) ===")
for p in skipped:
    print(" ", p)

print("\n=== REMAINING TREE (before self-deletion) ===")
for root, dirs, files in os.walk(BASE):
    dirs[:] = [d for d in dirs if d not in ('.git', 'node_modules')]
    level = root.replace(BASE, '').count(os.sep)
    indent = '  ' * level
    print(f"{indent}{os.path.basename(root)}/")
    for f in files:
        print(f"{'  ' * (level+1)}{f}")

# Self-delete this script last
_self = os.path.abspath(__file__)
print(f"\nDeleting self: {_self}")
os.remove(_self)
print("Cleanup complete.")

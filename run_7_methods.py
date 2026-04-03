#!/usr/bin/env python
"""
Runs all 7 directory-creation methods independently and reports results.
Each method gets a clean slate (dirs removed beforehand).
"""
import os
import subprocess
import shutil
import sys

BASE   = r"C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app\src"
REPO   = r"C:\Users\rafae\Documents\Respositories\travel-baggage-checker"
HOOKS      = os.path.join(BASE, "hooks")
COMPONENTS = os.path.join(BASE, "components")
CONTEXT    = os.path.join(BASE, "context")
TARGETS    = [HOOKS, COMPONENTS, CONTEXT]

def cleanup():
    for d in TARGETS:
        if os.path.isdir(d):
            shutil.rmtree(d)

def verify():
    missing = [d for d in TARGETS if not os.path.isdir(d)]
    if not missing:
        print("  Verify : ALL 3 directories exist")
        return True
    for d in missing:
        print(f"  Verify : MISSING -> {d}")
    return False

def run(cmd, shell=False):
    try:
        r = subprocess.run(
            cmd, shell=shell, capture_output=True, text=True, timeout=30
        )
        return r.returncode, r.stdout + r.stderr
    except Exception as e:
        return -1, str(e)

results = {}

# ── METHOD 1: PowerShell New-Item ────────────────────────────────────────────
print("\n=== METHOD 1: PowerShell New-Item ===")
cleanup()
code, out = run(
    ["powershell", "-NoProfile", "-Command",
     f'New-Item -ItemType Directory -Force -Path "{HOOKS}"; '
     f'New-Item -ItemType Directory -Force -Path "{COMPONENTS}"; '
     f'New-Item -ItemType Directory -Force -Path "{CONTEXT}"'],
)
ok = verify()
results["Method 1 (PowerShell New-Item)"] = "SUCCESS" if ok else f"FAILED (exit={code})"
print(f"  Result : {results['Method 1 (PowerShell New-Item)']}")
if out.strip():
    for line in out.strip().splitlines()[:6]:
        print(f"    {line}")

# ── METHOD 2: Python os.makedirs one-liner ────────────────────────────────────
print("\n=== METHOD 2: Python os.makedirs one-liner ===")
cleanup()
one_liner = (
    "import os; "
    "[os.makedirs(r'" + BASE.replace("\\", "\\\\") + "\\\\'  + d, exist_ok=True) "
    "for d in ['hooks','components','context']]"
)
code, out = run(["python", "-c", one_liner])
ok = verify()
results["Method 2 (Python one-liner)"] = "SUCCESS" if ok else f"FAILED (exit={code}: {out[:120]})"
print(f"  Result : {results['Method 2 (Python one-liner)']}")

# ── METHOD 3: Python script create_all_dirs.py ───────────────────────────────
print("\n=== METHOD 3: Python script create_all_dirs.py ===")
cleanup()
script3 = os.path.join(REPO, "create_all_dirs.py")
code, out = run(["python", script3])
ok = verify()
results["Method 3 (create_all_dirs.py)"] = "SUCCESS" if ok else f"FAILED (exit={code})"
print(f"  Result : {results['Method 3 (create_all_dirs.py)']}")
for line in out.strip().splitlines():
    if any(x in line for x in ["hooks", "components", "context", "SUCCESS", "FAILED"]):
        print(f"    {line}")

# ── METHOD 4: Node.js fs.mkdirSync ───────────────────────────────────────────
print("\n=== METHOD 4: Node.js fs.mkdirSync ===")
cleanup()
errors = []
for target in TARGETS:
    fwd = target.replace("\\", "/")
    c, o = run(["node", "-e", f"require('fs').mkdirSync('{fwd}',{{recursive:true}})"])
    if c != 0:
        errors.append(f"{os.path.basename(target)}: {o[:80]}")
ok = verify()
results["Method 4 (Node.js fs.mkdirSync)"] = "SUCCESS" if ok else f"FAILED ({'; '.join(errors)})"
print(f"  Result : {results['Method 4 (Node.js fs.mkdirSync)']}")

# ── METHOD 5: Python script mkdirs.py ────────────────────────────────────────
print("\n=== METHOD 5: Python script mkdirs.py ===")
cleanup()
script5 = os.path.join(REPO, "mkdirs.py")
code, out = run(["python", script5])
ok = verify()
results["Method 5 (mkdirs.py)"] = "SUCCESS" if ok else f"FAILED (exit={code})"
print(f"  Result : {results['Method 5 (mkdirs.py)']}")
for line in out.strip().splitlines():
    print(f"    {line}")

# ── METHOD 6: cmd.exe mkdir ───────────────────────────────────────────────────
print("\n=== METHOD 6: cmd.exe mkdir ===")
cleanup()
errors6 = []
for target in TARGETS:
    c, o = run(f'mkdir "{target}"', shell=True)
    if c != 0:
        errors6.append(f"{os.path.basename(target)}: {o.strip()[:80]}")
ok = verify()
results["Method 6 (cmd mkdir)"] = "SUCCESS" if ok else f"FAILED ({'; '.join(errors6)})"
print(f"  Result : {results['Method 6 (cmd mkdir)']}")

# ── METHOD 7: cmd.exe md ──────────────────────────────────────────────────────
print("\n=== METHOD 7: cmd.exe md ===")
cleanup()
errors7 = []
for target in TARGETS:
    c, o = run(["cmd", "/c", "md", target])
    if c != 0:
        errors7.append(f"{os.path.basename(target)}: {o.strip()[:80]}")
ok = verify()
results["Method 7 (cmd md)"] = "SUCCESS" if ok else f"FAILED ({'; '.join(errors7)})"
print(f"  Result : {results['Method 7 (cmd md)']}")

# ── FINAL VERIFICATION ────────────────────────────────────────────────────────
print("\n=== FINAL VERIFICATION ===")
for d in TARGETS:
    name = os.path.basename(d)
    exists = os.path.isdir(d)
    mark = "✓" if exists else "✗"
    print(f"  {mark} {name}: {exists}")

print("\n=== SUMMARY ===")
all_ok = True
for method, result in results.items():
    mark = "✓" if result == "SUCCESS" else "✗"
    print(f"  {mark} {method}: {result}")
    if result != "SUCCESS":
        all_ok = False

print()
if all_ok:
    print("All 7 methods succeeded.")
else:
    print("Some methods failed — see details above.")

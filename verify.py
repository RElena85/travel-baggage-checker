#!/usr/bin/env python3
"""
TripPacker — Full Verification Runner
Runs the complete test suite: unit tests + E2E + build check.

Usage (from repo root):
    python verify.py            # run everything
    python verify.py --unit     # unit tests only
    python verify.py --e2e      # E2E only
    python verify.py --build    # build check only
"""
import os
import subprocess
import sys
import time

# ── config ────────────────────────────────────────────────────────────────────
REPO_ROOT = os.path.dirname(os.path.abspath(__file__))
APP_DIR   = os.path.join(REPO_ROOT, "trip-manager-app")

# ── helpers ───────────────────────────────────────────────────────────────────
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"
RESET  = "\033[0m"
BOLD   = "\033[1m"

def banner(text):
    width = 60
    print(f"\n{'=' * width}")
    print(f"  {BOLD}{CYAN}{text}{RESET}")
    print(f"{'=' * width}")

def ok(msg):   print(f"{GREEN}✓{RESET}  {msg}")
def fail(msg): print(f"{RED}✗{RESET}  {msg}")
def info(msg): print(f"{YELLOW}→{RESET}  {msg}")

def run(cmd, cwd=None, timeout=300, env=None):
    start = time.time()
    result = subprocess.run(
        cmd, cwd=cwd or APP_DIR,
        capture_output=True, text=True,
        timeout=timeout, env=env
    )
    elapsed = time.time() - start
    return result, elapsed

# ── steps ─────────────────────────────────────────────────────────────────────
results = {}

def step_generate_e2e():
    banner("STEP 1 — Generate E2E test files")
    script = os.path.join(APP_DIR, "create_e2e_tests.py")
    if not os.path.exists(script):
        fail("create_e2e_tests.py not found — skipping E2E generation")
        results["e2e_gen"] = "skip"
        return
    info("Running create_e2e_tests.py …")
    r, t = run(["python", script], cwd=APP_DIR, timeout=30)
    if r.returncode == 0:
        ok(f"E2E files generated ({t:.1f}s)")
        results["e2e_gen"] = "pass"
    else:
        fail(f"E2E generation failed ({t:.1f}s)")
        print(r.stderr[-1000:])
        results["e2e_gen"] = "fail"

def step_npm_install():
    banner("STEP 2 — npm install (ensure dependencies)")
    info("Installing packages (may take a moment) …")
    r, t = run(["npm", "install"], cwd=APP_DIR, timeout=180)
    if r.returncode == 0:
        ok(f"npm install OK ({t:.1f}s)")
        results["npm_install"] = "pass"
    else:
        fail(f"npm install failed ({t:.1f}s)")
        print(r.stderr[-1500:])
        results["npm_install"] = "fail"

def step_playwright_install():
    banner("STEP 3 — Install Playwright browser (Chromium)")
    info("Installing Chromium …")
    r, t = run(["npx", "playwright", "install", "chromium"], cwd=APP_DIR, timeout=180)
    if r.returncode == 0:
        ok(f"Playwright Chromium ready ({t:.1f}s)")
        results["pw_install"] = "pass"
    else:
        fail(f"Playwright install failed ({t:.1f}s)")
        print(r.stderr[-1000:])
        results["pw_install"] = "fail"

def step_unit_tests():
    banner("STEP 4 — Unit tests (Jest + React Testing Library)")
    info("Running npm test …")
    env = {**os.environ, "CI": "true"}
    r, t = run(
        ["npm", "test", "--", "--watchAll=false", "--forceExit", "--ci"],
        cwd=APP_DIR, timeout=180, env=env
    )
    # React scripts prints test results to stderr
    output = r.stdout + r.stderr
    if r.returncode == 0:
        ok(f"All unit tests passed ({t:.1f}s)")
        results["unit"] = "pass"
    else:
        fail(f"Unit tests failed ({t:.1f}s)")
    # Always print last 2000 chars so results are visible
    print(output[-2000:] if len(output) > 2000 else output)
    if r.returncode != 0:
        results["unit"] = "fail"

def step_e2e_tests():
    banner("STEP 5 — E2E tests (Playwright)")
    e2e_dir = os.path.join(APP_DIR, "e2e")
    if not os.path.isdir(e2e_dir) or not any(
        f.endswith(".spec.ts") for f in os.listdir(e2e_dir)
    ):
        info("e2e/ directory empty — skipping (run Step 1 first)")
        results["e2e"] = "skip"
        return
    info("Running playwright test …")
    r, t = run(["npx", "playwright", "test"], cwd=APP_DIR, timeout=300)
    output = r.stdout + r.stderr
    if r.returncode == 0:
        ok(f"All E2E tests passed ({t:.1f}s)")
        results["e2e"] = "pass"
    else:
        fail(f"E2E tests failed ({t:.1f}s)")
        results["e2e"] = "fail"
    print(output[-2500:] if len(output) > 2500 else output)

def step_build():
    banner("STEP 6 — Production build check")
    info("Running npm run build …")
    env = {**os.environ, "CI": "false"}   # CI=false suppresses warning-as-error
    r, t = run(["npm", "run", "build"], cwd=APP_DIR, timeout=300, env=env)
    if r.returncode == 0:
        ok(f"Build succeeded ({t:.1f}s)")
        results["build"] = "pass"
    else:
        fail(f"Build failed ({t:.1f}s)")
        print((r.stdout + r.stderr)[-2000:])
        results["build"] = "fail"

def summary():
    banner("SUMMARY")
    labels = {
        "e2e_gen":     "E2E file generation",
        "npm_install": "npm install",
        "pw_install":  "Playwright install",
        "unit":        "Unit tests",
        "e2e":         "E2E tests",
        "build":       "Production build",
    }
    passed = failed = skipped = 0
    for key, label in labels.items():
        status = results.get(key, "skip")
        if status == "pass":
            ok(label); passed += 1
        elif status == "fail":
            fail(label); failed += 1
        else:
            print(f"{YELLOW}–{RESET}  {label} (skipped)")
            skipped += 1
    print(f"\n{BOLD}Result: {passed} passed · {failed} failed · {skipped} skipped{RESET}")
    if failed:
        print(f"{RED}❌ Verification FAILED{RESET}")
        sys.exit(1)
    else:
        print(f"{GREEN}✅ Verification PASSED{RESET}")

# ── entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    args = sys.argv[1:]
    run_all    = not args
    run_unit   = run_all or "--unit"  in args
    run_e2e    = run_all or "--e2e"   in args
    run_build  = run_all or "--build" in args

    print(f"\n{BOLD}{CYAN}TripPacker — Verification Runner{RESET}")
    print(f"App dir: {APP_DIR}\n")

    if run_all or run_e2e:
        step_generate_e2e()
        step_npm_install()
        step_playwright_install()

    if run_unit:
        if not (run_all or run_e2e):
            step_npm_install()
        step_unit_tests()

    if run_e2e:
        step_e2e_tests()

    if run_build:
        if not (run_all or run_unit or run_e2e):
            step_npm_install()
        step_build()

    if run_all:
        step_e2e_tests()
        step_build()

    summary()

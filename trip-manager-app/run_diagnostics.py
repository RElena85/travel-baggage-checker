import subprocess
import sys
import os

# Change to the working directory
os.chdir(r"C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app")

print("===== STEP 1: TypeScript Check =====")
print(f"Working directory: {os.getcwd()}")
print()

# Step 1: TypeScript check
try:
    result = subprocess.run(
        ["npx", "tsc", "--noEmit"],
        capture_output=True,
        text=True,
        timeout=120
    )
    print("STDOUT:")
    print(result.stdout if result.stdout else "(no output)")
    print()
    if result.stderr:
        print("STDERR:")
        print(result.stderr)
        print()
    print(f"Exit Code: {result.returncode}")
    ts_exit_code = result.returncode
except Exception as e:
    print(f"Error running tsc: {e}")
    ts_exit_code = -1

print()
print("===== STEP 2: Unit Tests =====")

# Step 2: Unit tests
try:
    env = os.environ.copy()
    env["CI"] = "true"
    result = subprocess.run(
        ["npm", "test", "--", "--watchAll=false", "--passWithNoTests"],
        capture_output=True,
        text=True,
        timeout=300,
        env=env
    )
    print("STDOUT:")
    print(result.stdout if result.stdout else "(no output)")
    print()
    if result.stderr:
        print("STDERR:")
        print(result.stderr)
        print()
    print(f"Exit Code: {result.returncode}")
    test_exit_code = result.returncode
except Exception as e:
    print(f"Error running tests: {e}")
    test_exit_code = -1

print()
print("===== SUMMARY =====")
print(f"TypeScript Exit Code: {ts_exit_code}")
print(f"Test Exit Code: {test_exit_code}")

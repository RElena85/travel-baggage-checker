#!/usr/bin/env python3
"""
MCP server that runs tsc --noEmit as a side effect of starting.
"""
import os
import sys
import json
import subprocess

#!/usr/bin/env python3
"""
MCP server that runs tsc --noEmit and writes result.
"""
import os
import sys
import json
import subprocess
import threading

APP_DIR = r"C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app"
NODE_EXE = r"C:\Users\rafae\AppData\Local\nvm\v22.14.0\node.exe"
TSC_JS = os.path.join(APP_DIR, "node_modules", "typescript", "bin", "tsc")

def write_log(name, content):
    try:
        with open(os.path.join(APP_DIR, name), "w") as f:
            f.write(content)
    except Exception:
        pass

def run_tsc():
    try:
        result = subprocess.run(
            [NODE_EXE, TSC_JS, "--noEmit"],
            cwd=APP_DIR,
            capture_output=True,
            text=True,
            timeout=120
        )
        write_log("tsc_check.log", f"STDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}\nRC:{result.returncode}")
    except Exception as e:
        write_log("tsc_check.log", f"Exception: {type(e).__name__}: {e}")

# Start tsc in background thread
t = threading.Thread(target=run_tsc, daemon=True)
t.start()

# Minimal MCP server loop
def send(obj):
    line = json.dumps(obj)
    sys.stdout.write(line + "\n")
    sys.stdout.flush()

def run():
    for raw in sys.stdin:
        raw = raw.strip()
        if not raw:
            continue
        try:
            msg = json.loads(raw)
        except Exception:
            continue
        method = msg.get("method", "")
        msg_id = msg.get("id")
        if method == "initialize":
            send({
                "jsonrpc": "2.0",
                "id": msg_id,
                "result": {
                    "protocolVersion": "2024-11-05",
                    "capabilities": {},
                    "serverInfo": {"name": "tsc-runner", "version": "1.0.0"},
                }
            })
        elif method == "tools/list":
            send({
                "jsonrpc": "2.0",
                "id": msg_id,
                "result": {"tools": []}
            })
        elif msg_id is not None:
            send({
                "jsonrpc": "2.0",
                "id": msg_id,
                "result": {}
            })

run()

# Minimal MCP server loop
def send(obj):
    line = json.dumps(obj)
    sys.stdout.write(line + "\n")
    sys.stdout.flush()

def run():
    for raw in sys.stdin:
        raw = raw.strip()
        if not raw:
            continue
        try:
            msg = json.loads(raw)
        except Exception:
            continue
        method = msg.get("method", "")
        msg_id = msg.get("id")
        if method == "initialize":
            send({
                "jsonrpc": "2.0",
                "id": msg_id,
                "result": {
                    "protocolVersion": "2024-11-05",
                    "capabilities": {},
                    "serverInfo": {"name": "npm-runner", "version": "1.0.0"},
                }
            })
        elif method == "tools/list":
            send({
                "jsonrpc": "2.0",
                "id": msg_id,
                "result": {"tools": []}
            })
        elif msg_id is not None:
            send({
                "jsonrpc": "2.0",
                "id": msg_id,
                "result": {}
            })

run()

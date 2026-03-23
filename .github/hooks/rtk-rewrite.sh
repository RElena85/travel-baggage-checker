#!/usr/bin/env bash
# RTK token proxy hook for VS Code Copilot (Linux/macOS)
# Fires on PreToolUse — intercepts run_in_terminal tool calls and rewrites
# commands to rtk equivalents before they execute.
# Docs: https://github.com/rtk-ai/rtk

INPUT=$(cat)

TOOL_NAME=$(printf '%s' "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_name',''))" 2>/dev/null)
if [ "$TOOL_NAME" != "run_in_terminal" ]; then exit 0; fi

COMMAND=$(printf '%s' "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('command',''))" 2>/dev/null)
if [ -z "$COMMAND" ]; then exit 0; fi

REWRITTEN=$(rtk rewrite "$COMMAND" 2>/dev/null)
if [ $? -ne 0 ] || [ -z "$REWRITTEN" ] || [ "$REWRITTEN" = "$COMMAND" ]; then exit 0; fi

python3 -c "
import sys, json
rewritten = sys.argv[1]
print(json.dumps({
    'hookSpecificOutput': {
        'hookEventName': 'PreToolUse',
        'updatedInput': {'command': rewritten}
    }
}))
" "$REWRITTEN"
exit 0

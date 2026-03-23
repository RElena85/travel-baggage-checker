# RTK token proxy hook for VS Code Copilot (Windows)
# Fires on PreToolUse — intercepts run_in_terminal tool calls and rewrites
# commands to rtk equivalents before they execute.
# Docs: https://github.com/rtk-ai/rtk

$inputJson = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($inputJson)) { exit 0 }

try {
    $data = $inputJson | ConvertFrom-Json -ErrorAction Stop
} catch {
    exit 0
}

# Only intercept terminal command tool calls
if ($data.tool_name -ne "run_in_terminal") { exit 0 }
$command = $data.tool_input.command
if ([string]::IsNullOrWhiteSpace($command)) { exit 0 }

# Ask RTK to rewrite the command
$rewritten = (& rtk rewrite $command 2>$null).Trim()
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrEmpty($rewritten) -or $rewritten -eq $command) {
    exit 0
}

# Return the rewritten command as updatedInput
@{
    hookSpecificOutput = @{
        hookEventName = "PreToolUse"
        updatedInput  = @{
            command = $rewritten
        }
    }
} | ConvertTo-Json -Compress
exit 0

# Reports

Agent output files are saved here after each task.

## Filename Format

`YYYY-MM-DD_<type>.md`

## Type Registry

| Type | Used by | Contents |
|------|---------|---------|
| `implementation` | frontend-engineer | Files changed, test results, what was done |
| `platform` | platform-engineer | Build output, deploy result, config changes |
| `decision` | lead | Decision log entry (mirrors `.squad/decisions.md` entry) |
| `synthesis` | lead | Multi-agent session wrap-up linking all files produced |

If a file for the same date already exists, append `_v2`, `_v3` etc.

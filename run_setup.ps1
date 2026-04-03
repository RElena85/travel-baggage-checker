$base = 'C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app'
$dirs = @(
    'public',
    'src/types',
    'src/context',
    'src/hooks',
    'src/utils',
    'src/components',
    'src/pages',
    'src/styles'
)

foreach ($d in $dirs) {
    $path = Join-Path $base ($d -replace '/', '\')
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
    }
    New-Item -Path (Join-Path $path '.gitkeep') -ItemType File -Force | Out-Null
}

Write-Host "Directory tree:"
Get-ChildItem -Path $base -Recurse -Force | ForEach-Object {
    $level = ($_.FullName -replace [regex]::Escape($base), '' -split '\' | Measure-Object).Count - 1
    $indent = '  ' * $level
    if ($_.PSIsContainer) {
        Write-Host "$indent$($_.Name)/"
    } else {
        Write-Host "$indent  $($_.Name)"
    }
}

Write-Host "`n=== DIRECTORY VERIFICATION ==="
Get-ChildItem -Path $base -Recurse -Force

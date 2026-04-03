$base = "C:\Users\rafae\Documents\Respositories\travel-baggage-checker"
$dirs = @(
    "trip-manager-app\public",
    "trip-manager-app\src\types",
    "trip-manager-app\src\context",
    "trip-manager-app\src\hooks",
    "trip-manager-app\src\utils",
    "trip-manager-app\src\components",
    "trip-manager-app\src\pages",
    "trip-manager-app\src\styles"
)

foreach ($dir in $dirs) {
    $fullPath = Join-Path $base $dir
    New-Item -ItemType Directory -Force -Path $fullPath | Out-Null
    New-Item -ItemType File -Path (Join-Path $fullPath ".gitkeep") -Force | Out-Null
    Write-Host "Created: $dir"
}

Write-Host "`nVerifying directories and .gitkeep files..."
foreach ($dir in $dirs) {
    $fullPath = Join-Path $base $dir
    $gitkeep = Join-Path $fullPath ".gitkeep"
    $dirExists = Test-Path $fullPath
    $gitkeepExists = Test-Path $gitkeep
    Write-Host "$dir - Dir: $dirExists, .gitkeep: $gitkeepExists"
}

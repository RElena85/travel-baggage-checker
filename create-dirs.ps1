$base = "C:\Users\rafae\Documents\Respositories\travel-baggage-checker\trip-manager-app"

# Create directories
$directories = @(
    "$base\public",
    "$base\src\types",
    "$base\src\context",
    "$base\src\hooks",
    "$base\src\utils",
    "$base\src\components",
    "$base\src\pages",
    "$base\src\styles"
)

foreach ($dir in $directories) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    New-Item -ItemType File -Path "$dir\.gitkeep" -Force | Out-Null
    Write-Host "Created: $dir with .gitkeep"
}

Write-Host "`nDirectory structure verification:"
Get-ChildItem -Path $base -Recurse -Force | Select-Object FullName | ForEach-Object {
    $_.FullName.Replace($base, ".")
}

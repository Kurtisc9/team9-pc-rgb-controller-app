$ErrorActionPreference = 'SilentlyContinue'

$programRoots = @(
  $env:ProgramFiles,
  ${env:ProgramFiles(x86)},
  $env:LocalAppData,
  $env:ProgramData,
  'C:\Program Files',
  'C:\Program Files (x86)',
  'C:\ProgramData'
) | Where-Object { $_ } | Select-Object -Unique

$lconnectPaths = @(
  foreach ($root in $programRoots) {
    Join-Path $root 'L-Connect 3'
    Join-Path $root 'LIAN LI\L-Connect 3'
    Join-Path $root 'L-Connect 3\L-Connect 3.exe'
    Join-Path $root 'L-Connect 3\LConnectSystem.exe'
  }
) | Where-Object { Test-Path $_ } | Select-Object -Unique

$armouryPaths = @(
  foreach ($root in $programRoots) {
    Join-Path $root 'ASUS\Armoury Crate Service'
    Join-Path $root 'ASUS\ARMOURY CRATE Service'
  }
) | Where-Object { Test-Path $_ } | Select-Object -Unique

$processes = Get-Process | Select-Object -ExpandProperty ProcessName | Sort-Object -Unique
$displays = Get-CimInstance Win32_DesktopMonitor | Select-Object Name, PNPDeviceID

$report = [PSCustomObject]@{
  generatedAt = (Get-Date).ToString('o')
  platform = 'win32'
  lConnectPaths = $lconnectPaths
  armouryPaths = $armouryPaths
  processes = $processes
  displays = $displays
}

$outputDir = Join-Path $env:USERPROFILE 'Documents\Team9Diagnostics'
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
$outputPath = Join-Path $outputDir ("team9-backend-diagnostics-{0}.json" -f (Get-Date -Format 'yyyy-MM-dd-HH-mm-ss'))
$report | ConvertTo-Json -Depth 6 | Set-Content -Path $outputPath -Encoding UTF8

Write-Host "Team9 diagnostics saved to: $outputPath"

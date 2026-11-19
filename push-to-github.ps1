$ErrorActionPreference = "Stop"

$repoUrl = "https://github.com/AsahiShan/SupJav-Pake-AdBlock.git"
$sourceDir = $PSScriptRoot
$workDir = Join-Path $env:TEMP ("SupJav-Pake-AdBlock-" + [guid]::NewGuid().ToString("N"))

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "Git for Windows is not installed. Install it from https://git-scm.com/download/win, then rerun this script."
}

Write-Host "Cloning target repository..."
git clone $repoUrl $workDir
if ($LASTEXITCODE -ne 0) { throw "git clone failed." }

$branch = (git -C $workDir branch --show-current).Trim()
if ([string]::IsNullOrWhiteSpace($branch)) {
    git -C $workDir checkout --orphan main
    if ($LASTEXITCODE -ne 0) { throw "Could not create the main branch." }
} elseif ($branch -ne "main") {
    git -C $workDir switch main
    if ($LASTEXITCODE -ne 0) { throw "Could not switch to main." }
}

Write-Host "Copying project files..."
Get-ChildItem -LiteralPath $sourceDir -Force |
    Where-Object { $_.Name -ne ".git" } |
    ForEach-Object {
        Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $workDir $_.Name) -Recurse -Force
    }

git -C $workDir add -A
if ($LASTEXITCODE -ne 0) { throw "git add failed." }

$changes = git -C $workDir status --porcelain
if ([string]::IsNullOrWhiteSpace(($changes -join ""))) {
    Write-Host "No changes to push; the repository already has these files."
    exit 0
}

$userName = (git config --global user.name 2>$null)
if ([string]::IsNullOrWhiteSpace($userName)) {
    $userName = Read-Host "Enter your Git commit name"
}
$userEmail = (git config --global user.email 2>$null)
if ([string]::IsNullOrWhiteSpace($userEmail)) {
    $userEmail = Read-Host "Enter your Git commit email"
}
git -C $workDir config user.name $userName
git -C $workDir config user.email $userEmail

git -C $workDir commit -m "Initialize SupJav Windows build project"
if ($LASTEXITCODE -ne 0) { throw "git commit failed." }

git -C $workDir push -u origin main
if ($LASTEXITCODE -ne 0) { throw "git push failed. Check GitHub sign-in and repository write access." }

Write-Host ""
Write-Host "Project files pushed successfully."
Write-Host "Open https://github.com/AsahiShan/SupJav-Pake-AdBlock/actions to watch the Windows build."
Write-Host "Temporary clone: $workDir"

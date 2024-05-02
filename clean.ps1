# Used to clean up all of the build output and dependency directories by deleting them

Write-Host "Cleaning output & dependency directories..." -ForegroundColor Cyan;
$cwd = Get-Location;

# # Remove the '.next' folder
# Write-Host "   Removing the '.next' folder..." -ForegroundColor DarkGray;

# $nextDirPath = "$cwd/.next";
# if (Test-Path -Path $nextDirPath) {
#     Remove-Item -Path $nextDirPath -Force -Recurse - -Confirm:$false;
# } else {
#     Write-Host "   The '.next' folder does not exist." -ForegroundColor DarkGray;
# }

# Remove the 'node_modules' folder
Write-Host "   Removing the 'node_modules' folder..." -ForegroundColor DarkGray;

$nodeModulesDirPath = "$cwd/node_modules";
if (Test-Path -Path $nodeModulesDirPath) {
    Remove-Item -Path $nodeModulesDirPath -Force -Recurse -Confirm:$false;
} else {
    Write-Host "   The 'node_modules' folder does not exist." -ForegroundColor DarkGray;
}

# # Remove the 'out' folder
# Write-Host "   Removing the 'out' folder..." -ForegroundColor DarkGray;

# $outDirPath = "$cwd/out";
# if (Test-Path -Path $outDirPath) {
#     Remove-Item -Path $outDirPath -Force -Recurse -Confirm:$false;
# } else {
#     Write-Host "   The 'out' folder does not exist." -ForegroundColor DarkGray;
# }

Write-Host "Everything Clean!" -ForegroundColor DarkGreen;

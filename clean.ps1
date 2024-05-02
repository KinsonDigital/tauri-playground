# Used to clean up all of the build output and dependency directories by deleting them


# Remove the '.next' folder
Write-Host "Removing the '.next' folder..." -ForegroundColor DarkGray;
# Get-ChildItem -Path "./.next" | Remove-Item -Recurse -Force;
Remove-Item -Path "./.next" -Force -Recurse;

# Remove the 'node_modules' folder
Write-Host "Removing the 'node_modules' folder..." -ForegroundColor DarkGray;
# Get-ChildItem -Path "./node_modules" | Remove-Item -Recurse -Force;
Remove-Item -Path "./node_modules" -Force -Recurse;

# Remove the 'out' folder
Write-Host "Removing the 'out' folder..." -ForegroundColor DarkGray;
# Get-ChildItem -Path "./out" | Remove-Item -Recurse -Force;
Remove-Item -Path "./out" -Force -Recurse;

Write-Host "Everything Clean!" -ForegroundColor DarkGreen;

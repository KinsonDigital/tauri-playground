$cwd = Get-Location;

$cleanScriptPath = "$cwd/clean.ps1";

Invoke-Expression -Command $cleanScriptPath;

npm.cmd ci;

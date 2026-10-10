param([string]$Root, [string]$Framework, [string]$Course, [string]$CourseName)
Set-Location $PSScriptRoot
$arguments = @('start')
if ($Root) { $arguments += @('--root', $Root) }
if ($Framework) { $arguments += @('--framework', $Framework) }
if ($Course) { $arguments += @('--course', $Course) }
if ($CourseName) { $arguments += @('--course-name', $CourseName) }
& python (Join-Path $PSScriptRoot 'tools/local/dev-server/manage_server.py') @arguments
exit $LASTEXITCODE

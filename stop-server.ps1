Set-Location $PSScriptRoot
python (Join-Path $PSScriptRoot 'tools/local/dev-server/manage_server.py') stop
exit $LASTEXITCODE

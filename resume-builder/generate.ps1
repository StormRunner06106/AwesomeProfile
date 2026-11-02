param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$GeneratorArguments
)

$ErrorActionPreference = 'Stop'
& node (Join-Path $PSScriptRoot 'generate.mjs') @GeneratorArguments
exit $LASTEXITCODE

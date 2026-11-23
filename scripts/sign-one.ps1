# Sign a single .exe with the GlobalSign EV cert on SafeNet eToken.
# Called by scripts/electron-builder-sign.js for every binary electron-builder
# wants signed during build. SafeNet caches PIN after the first file so the
# operator only sees one dialog per build session.

param([Parameter(Mandatory=$true)][string]$ExePath)

$ErrorActionPreference = "Stop"

$Thumbprint   = "95C24A6F4DF23EB44330A9C379F92EF855846B23"
$TimestampSrv = "http://timestamp.globalsign.com/tsa/r6advanced1"
$Description  = "inSCADA Viewer"
$DescUrl      = "https://www.inscada.com"

$signtool = Get-ChildItem "C:\Program Files (x86)\Windows Kits\10\bin" -Recurse -Filter signtool.exe -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -match "\\x64\\" } |
    Sort-Object FullName -Descending |
    Select-Object -First 1 -ExpandProperty FullName
if (-not $signtool) { throw "signtool.exe not found." }

& $signtool sign /sha1 $Thumbprint /fd SHA256 /tr $TimestampSrv /td SHA256 /d $Description /du $DescUrl $ExePath
if ($LASTEXITCODE -ne 0) { throw "Signing failed for $ExePath" }

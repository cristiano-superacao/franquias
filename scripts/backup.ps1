Param(
    [string]$ConnectionString = $Env:DATABASE_URL
)

if (-not $ConnectionString) {
    Write-Error "DATABASE_URL não definido. Use 'railway variables set DATABASE_URL=...' ou defina no ambiente."
    exit 1
}

# Verifica pg_dump
$pgDump = Get-Command pg_dump -ErrorAction SilentlyContinue
if (-not $pgDump) {
    Write-Error "pg_dump não encontrado. Instale o PostgreSQL client (https://www.postgresql.org/download/windows/)."
    exit 1
}

# Pasta de saída com data
$stamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$outDir = Join-Path $PWD "backups/$stamp"
New-Item -ItemType Directory -Path $outDir -Force | Out-Null

# Função para dump por schema
function Dump-Schema($schema) {
    $file = Join-Path $outDir "${schema}.sql"
    Write-Host "Backup schema '$schema' -> $file"
    pg_dump --schema=$schema --file=$file $ConnectionString
}

Dump-Schema "franquias"
Dump-Schema "caixa"
Dump-Schema "metas"
Dump-Schema "public"

Write-Host "Backups concluídos em $outDir" -ForegroundColor Green

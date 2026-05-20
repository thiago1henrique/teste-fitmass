# Downloads Brazilian state flag SVGs from Wikimedia Commons into public/flags/br-states/
# Run from the fitmass-site root: pwsh scripts/download-state-flags.ps1

$states = [ordered]@{
  ac = 'Bandeira_do_Acre.svg'
  al = 'Bandeira_de_Alagoas.svg'
  ap = 'Bandeira_do_Amapá.svg'
  am = 'Bandeira_do_Amazonas.svg'
  ba = 'Bandeira_da_Bahia.svg'
  ce = 'Bandeira_do_Ceará.svg'
  df = 'Bandeira_do_Distrito_Federal_(Brasil).svg'
  es = 'Bandeira_do_Espírito_Santo.svg'
  go = 'Bandeira_de_Goiás.svg'
  ma = 'Bandeira_do_Maranhão.svg'
  mt = 'Bandeira_de_Mato_Grosso.svg'
  ms = 'Bandeira_de_Mato_Grosso_do_Sul.svg'
  mg = 'Bandeira_de_Minas_Gerais.svg'
  pa = 'Bandeira_do_Pará.svg'
  pb = 'Bandeira_da_Paraíba.svg'
  pr = 'Bandeira_do_Paraná.svg'
  pe = 'Bandeira_de_Pernambuco.svg'
  pi = 'Bandeira_do_Piauí.svg'
  rj = 'Bandeira_do_estado_do_Rio_de_Janeiro.svg'
  rn = 'Bandeira_do_Rio_Grande_do_Norte.svg'
  rs = 'Bandeira_do_Rio_Grande_do_Sul.svg'
  ro = 'Bandeira_de_Rondônia.svg'
  rr = 'Bandeira_de_Roraima.svg'
  sc = 'Bandeira_de_Santa_Catarina.svg'
  sp = 'Bandeira_do_estado_de_São_Paulo.svg'
  se = 'Bandeira_de_Sergipe.svg'
  to = 'Bandeira_do_Tocantins.svg'
}

$outDir = Join-Path $PSScriptRoot '..\public\flags\br-states'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$ua   = 'FitmassApp/1.0 (flag-downloader; contact@fitmass.com.br)'
$ok   = 0
$fail = 0

foreach ($entry in $states.GetEnumerator()) {
  $uf      = $entry.Key
  $file    = $entry.Value
  $url     = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + $file
  $outFile = Join-Path $outDir "$uf.svg"

  $attempt = 0
  $done    = $false

  while (-not $done -and $attempt -lt 3) {
    $attempt++
    try {
      Invoke-WebRequest -Uri $url -OutFile $outFile -UserAgent $ua -ErrorAction Stop
      Write-Host "  [ok] $uf" -ForegroundColor Green
      $ok++
      $done = $true
    } catch {
      if ($attempt -lt 3) {
        Write-Host "  [retry $attempt] $uf..." -ForegroundColor Yellow
        Start-Sleep -Seconds (3 * $attempt)
      } else {
        Write-Host "  [FAIL] $uf — $_" -ForegroundColor Red
        $fail++
        $done = $true
      }
    }
  }

  Start-Sleep -Milliseconds 800
}

Write-Host "`nFinalizado: $ok ok, $fail falhas"
if ($fail -gt 0) {
  Write-Host "Para as falhas, abra https://commons.wikimedia.org e busque manualmente 'Bandeira [estado]'." -ForegroundColor Yellow
}

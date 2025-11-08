Param(
  [Parameter(Mandatory=$true, Position=0)]
  [string[]]$Paths
)

$ErrorActionPreference = 'Stop'

$map = [ordered]@{
  'm��dulo' = 'módulo'
  'm��dulos' = 'módulos'
  'InteligǦncia' = 'Inteligência'
  'Intelig�ncia' = 'Inteligência'
  'conteǧdo' = 'conteúdo'
  'conte�do' = 'conteúdo'
  'Conteǧdo' = 'Conteúdo'
  'Conte�do' = 'Conteúdo'
  'In��cio' = 'Início'
  'Come��ar' = 'Começar'
  'prǭtico' = 'prático'
  'prǭticos' = 'práticos'
  'aplicǭveis' = 'aplicáveis'
  'indǧstria' = 'indústria'
  'cria��ǜo' = 'criação'
  'cria��o' = 'criação'
  'avan��adas' = 'avançadas'
  'avan��ada' = 'avançada'
  'vocǦ' = 'você'
  'VocǦ' = 'Você'
  'estǭ' = 'está'
  'estarǭ' = 'estará'
  'empresa/carreira serǭ' = 'empresa/carreira será'
  'questǜo' = 'questão'
  'Nǜo' = 'Não'
  'nǜo' = 'não'
  'neg��cios' = 'negócios'
  'estratǸgico' = 'estratégico'
  'tǸcnicos' = 'técnicos'
  'TǸcnico' = 'Técnico'
  'dispon��veis' = 'disponíveis'
  'execu��ǜo' = 'execução'
  'aplica����es' = 'aplicações'
  'licen��a' = 'licença'
  'Licen��a' = 'Licença'
  'Contribui����es' = 'Contribuições'
  'Descri��ǜo' = 'Descrição'
  'Descri��o' = 'Descrição'
  'Visǜo' = 'Visão'
  'dura��ǜo' = 'duração'
  'Dura��ǜo' = 'Duração'
  't�cnicas' = 'técnicas'
  't�cnico' = 'técnico'
  'atǸ' = 'até'
  ' Ǹ ' = ' é '
}

foreach ($path in $Paths) {
  if (-not (Test-Path $path)) { Write-Host "Ignorando (não encontrado): $path"; continue }
  $raw = Get-Content -Raw -LiteralPath $path
  $orig = $raw
  foreach ($k in $map.Keys) {
    $raw = $raw -replace [Regex]::Escape($k), [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $map[$k] }
  }
  if ($raw -ne $orig) {
    [IO.File]::WriteAllText((Resolve-Path $path), $raw, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "Corrigido: $path"
  } else {
    Write-Host "Sem mudanças: $path"
  }
}


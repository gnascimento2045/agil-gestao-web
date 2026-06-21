param(
  [string]$SitemapUrl = "https://agilgestao.com/sitemap.xml"
)

$searchers = @(
  "https://www.google.com/ping?sitemap=$([System.Web.HttpUtility]::UrlEncode($SitemapUrl))",
  "https://bing.com/webmaster/ping.aspx?siteMap=$([System.Web.HttpUtility]::UrlEncode($SitemapUrl))"
)

Write-Host "=== Push Sitemap para Google e Bing ===" -ForegroundColor Cyan
Write-Host "Sitemap: $SitemapUrl`n" -ForegroundColor Gray

foreach ($url in $searchers) {
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    Write-Host "[OK] $($url.Split('/')[2]) - Status: $($response.StatusCode)" -ForegroundColor Green
  } catch {
    Write-Host "[ERRO] $($url.Split('/')[2]) - $_" -ForegroundColor Red
  }
}

Write-Host "`n=== Instrucoes Google Search Console ===" -ForegroundColor Yellow
Write-Host "1. Acesse https://search.google.com/search-console" -ForegroundColor White
Write-Host "2. Adicione/verifique o dominio: agilgestao.com" -ForegroundColor White
Write-Host "3. Em 'Inspecionar URL', cole cada pagina:" -ForegroundColor White
Write-Host "   - https://agilgestao.com/" -ForegroundColor Gray
Write-Host "   - https://agilgestao.com/login" -ForegroundColor Gray
Write-Host "   - https://agilgestao.com/privacidade" -ForegroundColor Gray
Write-Host "4. Clique em 'Solicitar indexacao'" -ForegroundColor White
Write-Host "`nOu envie manualmente o sitemap:" -ForegroundColor Yellow
Write-Host "Google Search Console > Sitemaps > Adicionar: sitemap.xml" -ForegroundColor White

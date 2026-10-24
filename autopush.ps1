# Auto-push watcher for Mesage AI Website
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Mesage AI Auto-Push Watcher Running    " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Monitoring folder for file changes..." -ForegroundColor White
Write-Host "Press Ctrl+C anytime to stop.`n" -ForegroundColor Yellow

while ($true) {
    Start-Sleep -Seconds 3
    $status = git status --porcelain
    if ($status) {
        $time = Get-Date -Format "HH:mm:ss"
        Write-Host "[$time] Detected changes:" -ForegroundColor Yellow
        $status | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
        
        Write-Host "[$time] Staging & committing..." -ForegroundColor White
        git add -A
        $commitMsg = "Auto update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        git commit -m "$commitMsg" --quiet
        
        Write-Host "[$time] Pushing to GitHub (origin main)..." -ForegroundColor White
        git push origin main
        
        Write-Host "[$time] Done! Synced with GitHub.`n" -ForegroundColor Green
    }
}

# ==============================================================================
# E-Commerce Microservices Platform - Windows Stop Script
# ==============================================================================
# Stops all Docker containers and/or running native Java/Node processes.
# ==============================================================================

Write-Host "Stopping Aura E-Commerce Platform services..." -ForegroundColor Yellow

# 1. Stop Docker Compose containers if running
try {
    docker compose down
    Write-Host "Docker containers stopped." -ForegroundColor Green
} catch {
    Write-Host "Docker compose down skipped (Docker may not be running)." -ForegroundColor Gray
}

# 2. Stop native processes on known microservice ports if needed
$ports = @(8080, 8081, 8082, 8083, 8084, 8085, 8086, 5173)
foreach ($port in $ports) {
    try {
        $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        foreach ($c in $connections) {
            $processId = $c.OwningProcess
            if ($processId -gt 0) {
                Write-Host "Terminating process $processId listening on port $port..." -ForegroundColor Yellow
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            }
        }
    } catch {
        # ignore
    }
}

Write-Host "All services stopped." -ForegroundColor Green

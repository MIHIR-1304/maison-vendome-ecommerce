# ==============================================================================
# Maison Vendôme E-Commerce Platform - Windows Start Script
# ==============================================================================

param(
    [switch]$Native
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   MAISON VENDOME LUXURY E-COMMERCE - SYSTEM STARTUP      " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$javaHome = "C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
$mavenBin = "C:\Users\mihir\tools\apache-maven-3.9.9\bin"
$env:JAVA_HOME = $javaHome
$env:Path = $javaHome + "\bin;" + $mavenBin + ";" + $env:Path

Write-Host "Checking Java 21 environment..." -ForegroundColor Yellow
& java.exe -version

$rootPath = $PSScriptRoot
if (-not $rootPath) {
    $rootPath = (Get-Item -Path ".").FullName
} else {
    $rootPath = (Get-Item -Path "$rootPath\..").FullName
}

$services = @(
    @{ Name = "user-service"; Port = 8081 },
    @{ Name = "product-service"; Port = 8082 },
    @{ Name = "cart-service"; Port = 8083 },
    @{ Name = "order-service"; Port = 8084 },
    @{ Name = "payment-service"; Port = 8085 },
    @{ Name = "notification-service"; Port = 8086 }
)

foreach ($s in $services) {
    $svcName = $s.Name
    $svcPort = $s.Port
    Write-Host "Starting $svcName on port $svcPort..." -ForegroundColor Cyan
    $serviceDir = Join-Path $rootPath "services\$svcName"
    $runCmd = "Set-Location '$serviceDir'; `$env:JAVA_HOME='$javaHome'; `$env:Path='$javaHome\bin;$mavenBin;`$env:Path'; `$env:SPRING_PROFILES_ACTIVE='local'; Write-Host 'Starting $svcName...' -ForegroundColor Green; mvn.cmd spring-boot:run"
    Start-Process powershell.exe -ArgumentList @("-NoExit", "-Command", $runCmd)
}

Write-Host "Starting React Frontend on port 5173..." -ForegroundColor Cyan
$frontendDir = Join-Path $rootPath "frontend"
$frontendCmd = "Set-Location '$frontendDir'; Write-Host 'Starting Vite Frontend Dev Server...' -ForegroundColor Green; npm.cmd run dev -- --host 0.0.0.0 --port 5173"
Start-Process powershell.exe -ArgumentList @("-NoExit", "-Command", $frontendCmd)

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "All 6 Microservices and Frontend dev server started!" -ForegroundColor Green
Write-Host "Frontend Storefront:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "User Service:         http://localhost:8081" -ForegroundColor Gray
Write-Host "Product Service:      http://localhost:8082" -ForegroundColor Gray
Write-Host "Cart Service:         http://localhost:8083" -ForegroundColor Gray
Write-Host "Order Service:        http://localhost:8084" -ForegroundColor Gray
Write-Host "Payment Service:      http://localhost:8085" -ForegroundColor Gray
Write-Host "Notification Service: http://localhost:8086" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Green

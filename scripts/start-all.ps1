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
    $runCmd = "cd 'services/$svcName'; `$env:JAVA_HOME='$javaHome'; `$env:Path='$javaHome\bin;$mavenBin;`$env:Path'; `$env:SPRING_PROFILES_ACTIVE='local'; mvn.cmd spring-boot:run"
    Start-Process powershell.exe -ArgumentList @("-NoExit", "-Command", $runCmd)
}

Write-Host "Starting React Frontend on port 5173..." -ForegroundColor Cyan
$frontendCmd = "cd 'frontend'; npm.cmd run dev -- --host 0.0.0.0 --port 5173"
Start-Process powershell.exe -ArgumentList @("-NoExit", "-Command", $frontendCmd)

Write-Host "`nAll service processes spawned in native mode." -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan

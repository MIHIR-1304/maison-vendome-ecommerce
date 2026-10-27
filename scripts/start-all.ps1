# ==============================================================================
# E-Commerce Microservices Platform - Windows Start Script
# ==============================================================================
# Starts all services either via Docker Compose or native Windows processes.
# Usage:
#   .\scripts\start-all.ps1          # Starts full stack with Docker Compose
#   .\scripts\start-all.ps1 -Native  # Starts frontend & backend natively
# ==============================================================================

param(
    [switch]$Native
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   AURA LUXURY E-COMMERCE PLATFORM - SYSTEM STARTUP       " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not $Native) {
    Write-Host "[1/2] Checking Docker daemon status..." -ForegroundColor Yellow
    try {
        docker info | Out-Null
        Write-Host "Docker is running." -ForegroundColor Green
    } catch {
        Write-Warning "Docker is not running or not found in PATH."
        Write-Host "Falling back to native mode or start Docker Desktop and re-run." -ForegroundColor Yellow
        $Native = $true
    }
}

if (-not $Native) {
    Write-Host "[2/2] Starting all 6 microservices + gateway + database via Docker Compose..." -ForegroundColor Yellow
    docker compose up -d --build
    Write-Host "`nAll containers started successfully!" -ForegroundColor Green
    Write-Host "Gateway / API:  http://localhost:8080" -ForegroundColor Cyan
    Write-Host "Storefront:     http://localhost:5173" -ForegroundColor Cyan
    Write-Host "Swagger Docs:   http://localhost:8080/swagger-ui.html" -ForegroundColor Cyan
    exit 0
}

# Native start mode
Write-Host "`nStarting services in Native Windows Mode..." -ForegroundColor Yellow

# Ensure Java 21 and Maven are in PATH
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
$env:Path = "$env:JAVA_HOME\bin;C:\Users\mihir\tools\apache-maven-3.9.9\bin;$env:Path"

# Verify JDK 21
java -version

# Start PostgreSQL if container is running
try {
    docker compose up -d postgres
    Write-Host "PostgreSQL multi-database started on port 5432." -ForegroundColor Green
} catch {
    Write-Warning "Could not start PostgreSQL via Docker. Ensure local PostgreSQL is running on port 5432."
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
    Write-Host "Starting $($s.Name) on port $($s.Port)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'services/$($s.Name)'; `$env:JAVA_HOME='$($env:JAVA_HOME)'; `$env:Path='$($env:Path)'; mvn.cmd spring-boot:run"
}

Write-Host "Starting React Frontend on port 5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'frontend'; npm.cmd run dev"

Write-Host "`nAll service processes spawned in native mode." -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan

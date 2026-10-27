# ==============================================================================
# End-to-End Automated Integration Test Suite for Aura Microservices
# ==============================================================================
# Validates the full customer lifecycle against the API Gateway (port 8080)
# ==============================================================================

param(
    [string]$GatewayUrl = "http://localhost:8080"
)

$ErrorActionPreference = "Stop"

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " RUNNING E2E API INTEGRATION TESTS AGAINST: $GatewayUrl" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

$passed = 0
$failed = 0

function Assert-Test([string]$name, [scriptblock]$action) {
    Write-Host -NoNewline "Testing: $name ... "
    try {
        & $action
        Write-Host "[PASSED]" -ForegroundColor Green
        $global:passed++
    } catch {
        Write-Host "[FAILED]" -ForegroundColor Red
        Write-Host "  Error: $_" -ForegroundColor Red
        $global:failed++
    }
}

# 1. Product Service - Catalogue & Categories
$testProductId = $null
Assert-Test "Fetch Product Categories" {
    $res = Invoke-RestMethod -Uri "$GatewayUrl/api/categories" -Method Get
    if ($res.Count -lt 1) { throw "Expected at least 1 category, got $($res.Count)" }
}

Assert-Test "Fetch Product Catalogue" {
    $res = Invoke-RestMethod -Uri "$GatewayUrl/api/products?page=0&size=10" -Method Get
    if ($res.content.Count -lt 1) { throw "Expected products in catalogue" }
    $global:testProductId = $res.content[0].id
    if (-not $global:testProductId) { throw "Failed to get first product ID" }
}

# 2. User Service - Registration, Login, and Me
$uniqueEmail = "e2e_user_$(Get-Random)@example.com"
$token = $null
$userId = $null

Assert-Test "Register New Customer" {
    $body = @{
        email = $uniqueEmail
        password = "Password123!"
        fullName = "Test Integration User"
        phoneNumber = "+1-555-0199"
    } | ConvertTo-Json

    $res = Invoke-RestMethod -Uri "$GatewayUrl/api/users/register" -Method Post -Body $body -ContentType "application/json"
    if (-not $res.token) { throw "No JWT token returned from registration" }
    $global:token = $res.token
    $global:userId = $res.user.id
}

$headers = @{}
Assert-Test "Access Profile (GET /api/users/me)" {
    $global:headers = @{ "Authorization" = "Bearer $global:token" }
    $res = Invoke-RestMethod -Uri "$GatewayUrl/api/users/me" -Method Get -Headers $global:headers
    if ($res.email -ne $uniqueEmail) { throw "Profile email mismatch: $($res.email)" }
}

# 3. Shopping Cart - Add and Retrieve
Assert-Test "Add Item to Shopping Cart" {
    $body = @{
        productId = $global:testProductId
        quantity = 2
    } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$GatewayUrl/api/cart/items" -Method Post -Headers $global:headers -Body $body -ContentType "application/json"
    if ($res.items.Count -lt 1) { throw "Item was not added to cart" }
}

Assert-Test "Retrieve Shopping Cart" {
    $res = Invoke-RestMethod -Uri "$GatewayUrl/api/cart" -Method Get -Headers $global:headers
    if ($res.items.Count -lt 1) { throw "Cart is empty" }
    if ($res.subtotal -le 0) { throw "Cart subtotal should be > 0" }
}

# 4. Order Checkout
$orderId = $null
Assert-Test "Order Checkout (Server-side price & inventory lock)" {
    $body = @{
        shippingAddress = "742 Evergreen Terrace"
        city = "Springfield"
        postalCode = "97477"
        country = "United States"
    } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$GatewayUrl/api/orders/checkout" -Method Post -Headers $global:headers -Body $body -ContentType "application/json"
    if (-not $res.id) { throw "Checkout did not return an order ID" }
    if ($res.status -ne "PENDING_PAYMENT") { throw "Order status should be PENDING_PAYMENT, got $($res.status)" }
    $global:orderId = $res.id
}

# 5. Payment Session & Mock Processing
$sessionId = $null
Assert-Test "Initiate Payment Checkout Session" {
    $body = @{
        orderId = $global:orderId
        successUrl = "http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}"
        cancelUrl = "http://localhost:5173/payment/cancel?order_id=$global:orderId"
    } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$GatewayUrl/api/payments/checkout-session" -Method Post -Headers $global:headers -Body $body -ContentType "application/json"
    if (-not $res.sessionId) { throw "No checkout session ID returned" }
    $global:sessionId = $res.sessionId
}

Assert-Test "Complete Payment (Mock/Stripe Webhook Handshake)" {
    $res = Invoke-RestMethod -Uri "$GatewayUrl/api/payments/mock-complete/$global:sessionId" -Method Post
    if ($res.status -ne "PAID") { throw "Expected PAID status, got $($res.status)" }
}

# 6. Verify Order Status Updated to PAID
Assert-Test "Verify Order Status is PAID" {
    $res = Invoke-RestMethod -Uri "$GatewayUrl/api/orders/$global:orderId" -Method Get -Headers $global:headers
    if ($res.status -ne "PAID") { throw "Expected order status PAID after payment, got $($res.status)" }
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " SUMMARY: $passed Passed, $failed Failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "========================================================`n" -ForegroundColor Cyan

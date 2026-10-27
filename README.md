# Maison Vendôme Luxury — Production Microservices E-Commerce Platform

A production-grade, distributed e-commerce web platform engineered with **Java 21**, **Spring Boot 3.3.5**, **PostgreSQL 16**, **Docker Compose**, **NGINX**, and a modern **React 18 + Vite + Tailwind CSS** frontend.

Designed with clean service boundaries, strict per-service database ownership, atomic inventory reservation to eliminate race conditions, dual-mode payment integration (official Stripe Checkout API + local test Mock Provider), and automated CI/CD workflows.

---

## 1. Architectural Highlights

- **Single API Gateway:** NGINX handles SSL/TLS termination, CORS headers, unified path routing (`/api/*`), request rate management, and upstream health proxying on port `8080`.
- **Database-Per-Service Isolation:** Each stateful microservice (`user-service`, `product-service`, `cart-service`, `order-service`, `payment-service`, `notification-service`) connects strictly to its own dedicated PostgreSQL database via Flyway versioned migrations.
- **Race Condition Prevention:** Stock reservation uses atomic database-level conditional updates (`UPDATE products SET stock = stock - q WHERE id = :id AND stock >= q`) paired with automatic compensating releases on failure or cancellation.
- **Dual Payment Processor:** Seamlessly connects to **Stripe Checkout** when `STRIPE_API_KEY` is provided; automatically falls back to an interactive **Mock Payment Provider** during offline or local development with complete webhook idempotency.
- **Responsive Modern Storefront:** Built with React 18, Vite, Tailwind CSS, and Lucide React featuring 16 dedicated views, category filters, real-time search, cart drawer, checkout modal, order tracker, and an administrative control panel.

---

## 2. Technology Stack

| Domain | Technology / Library |
|---|---|
| **Backend Framework** | Java 21, Spring Boot 3.3.5 (Spring Web, Spring Data JPA, Spring Security, Spring Validation) |
| **Authentication** | Stateless JWT (JJWT `0.12.6`), BCrypt password hashing, Spring Security 6 filter chain |
| **Database** | PostgreSQL 16 (6 isolated schema databases), Flyway migrations |
| **API Gateway** | NGINX (Alpine-based reverse proxy with path rewrites and CORS handling) |
| **Payments** | Official Stripe Java SDK (`v26.1.0`) with HMAC-SHA256 webhook signature verification |
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, React Router v6, Axios, Lucide React |
| **Containers & CI** | Multi-stage Dockerfiles, Docker Compose, GitHub Actions CI workflow |
| **Documentation** | Springdoc OpenAPI 3.0 / Swagger UI (`v2.6.0`) |

---

## 3. Microservices & Port Matrix

| Service Name | Internal Port | Gateway Route Prefix | Description |
|---|---|---|---|
| **NGINX API Gateway** | `8080` | `/*` | Single external reverse proxy entrypoint |
| **Frontend (Vite/Nginx)** | `5173` / `80` | `/` | Luxury storefront & admin portal |
| **User Service** | `8081` | `/api/users/**` | Customer auth, JWT minting, profile management |
| **Product Service** | `8082` | `/api/products/**`, `/api/categories/**` | Catalogue, categories, search, atomic stock reservation |
| **Cart Service** | `8083` | `/api/cart/**` | Persistent customer cart, server-side subtotal validation |
| **Order Service** | `8084` | `/api/orders/**` | Price recalculation, stock reservation, order lifecycle |
| **Payment Service** | `8085` | `/api/payments/**` | Stripe session creation, webhook processing, mock mode |
| **Notification Service** | `8086` | `/api/notifications/**` | Idempotent event ingestion, audit records, email logger |
| **PostgreSQL 16** | `5432` | *(Internal)* | Multi-tenant DB cluster with 6 dedicated databases |

---

## 4. Default Seed Credentials

Upon startup, the database is automatically seeded with default accounts:

| Role | Email Address | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@aurastore.com` | `Admin123!` | Full catalogue mutations, inventory edits, order state overrides |
| **Customer** | `customer@aurastore.com` | `Customer123!` | Browse, add to cart, checkout, payment simulation, order history |

> *Tip: The Login page includes one-click convenience buttons to populate either credential set instantly.*

---

## 5. Getting Started on Windows

### Prerequisites
1. **Docker Desktop for Windows** (with WSL 2 backend recommended).
2. For native development (optional):
   - **Java 21 JDK** (e.g. Eclipse Temurin 21)
   - **Apache Maven 3.9+**
   - **Node.js 20+**

### Method A: One-Command Docker Deployment (Recommended)

1. Clone or navigate to the repository directory:
   ```powershell
   cd "c:\MyFolder\New folder\Focus\PROJECTS\E-Commerce"
   ```

2. Copy the sample environment file:
   ```powershell
   Copy-Item .env.example .env
   ```

3. Build and launch all 8 containers:
   ```powershell
   docker compose up -d --build
   ```

4. Verify container statuses:
   ```powershell
   docker compose ps
   ```

5. Access the applications:
   - **Storefront Web App:** [http://localhost:5173](http://localhost:5173) (or [http://localhost:8080](http://localhost:8080))
   - **API Gateway:** [http://localhost:8080](http://localhost:8080)
   - **API Documentation:** [http://localhost:8080/api/products/swagger-ui/index.html](http://localhost:8080/api/products/swagger-ui/index.html)

---

### Method B: Native Windows Execution (Without Docker)

If you prefer to run services natively on Windows:

1. Launch the automated Windows startup script:
   ```powershell
   .\scripts\start-all.ps1 -Native
   ```
   *This initializes PostgreSQL via Docker, spawns each Spring Boot service in a dedicated console window, and starts the Vite development server.*

2. To shut down all services cleanly:
   ```powershell
   .\scripts\stop-all.ps1
   ```

---

## 6. End-to-End Verification & Testing

### Running Backend Unit & Integration Tests
Execute the entire Maven test suite across all 6 microservices:
```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
$env:Path = "$env:JAVA_HOME\bin;C:\Users\mihir\tools\apache-maven-3.9.9\bin;$env:Path"
mvn test
```

### Running Frontend Architecture & Unit Tests
```powershell
cd frontend
npm.cmd test
npm.cmd run build
```

### Running Automated End-to-End API Test Script
Once the gateway is active, run the end-to-end integration test:
```powershell
.\scripts\test-e2e.ps1
```
This tests:
1. Product & category catalogue querying
2. Unique user registration & profile retrieval (`GET /api/users/me`)
3. Adding items to cart & price calculation
4. Order checkout with atomic stock reservation
5. Payment checkout session generation
6. Payment mock confirmation & webhook ingestion
7. Order status verification transition to `PAID`

---

## 7. Configuration Reference (`.env`)

| Variable | Default Value | Purpose |
|---|---|---|
| `POSTGRES_USER` | `postgres` | Superuser for PostgreSQL initialization |
| `POSTGRES_PASSWORD` | `postgres` | Database superuser password |
| `JWT_SECRET` | *(64-char hex key)* | HMAC-SHA256 secret for signing customer tokens |
| `STRIPE_API_KEY` | *(empty / sk_test_...)* | Official Stripe secret key. If left blank, mock mode activates. |
| `STRIPE_WEBHOOK_SECRET` | *(empty / whsec_...)* | Stripe webhook signature signing secret |
| `VITE_API_BASE_URL` | `http://localhost:8080` | Client-side Gateway URL |

---

## 8. Frontend Navigation Directory

| View | Route | Features |
|---|---|---|
| **Home** | `/` | Hero section, category spotlights, featured products, value props |
| **Catalogue** | `/products` | Category filters, real-time search, price sorting, stock badges |
| **Product Details** | `/products/:id` | Image gallery, stock indicator, quantity selector, add-to-cart |
| **Authentication** | `/login`, `/register` | Form validation, password rules, one-click demo credentials |
| **Cart Drawer / Page** | `/cart` | Real-time line item recalculation, quantity adjustment, remove item |
| **Checkout** | `/checkout` | Shipping form, order breakdown, interactive mock payment modal |
| **Payment Status** | `/payment/success`, `/payment/cancel` | Verified payment polling, confirmation screen, return link |
| **Customer Portal** | `/account`, `/orders`, `/orders/:id` | Order history, itemized snapshots, live order tracking |
| **Admin Portal** | `/admin`, `/admin/products`, `/admin/orders` | Inventory updates, new product creation, order status management |

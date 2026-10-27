# Architecture & Design Specification
## Aura Luxury E-Commerce Platform

---

### 1. High-Level System Architecture

Aura E-Commerce follows a production-grade, distributed **Microservices Architecture**. All external HTTP traffic flows through an **NGINX API Gateway** operating as a single reverse proxy entrypoint on port `8080`. Stateful microservices own their private PostgreSQL databases, enforcing strict database isolation with zero cross-database queries.

```mermaid
flowchart TD
    Client["Client (Browser / React 18 SPA :5173)"]
    Gateway["NGINX API Gateway (:8080)"]

    subgraph Backend Services
        UserService["User Service (:8081)"]
        ProductService["Product Catalogue Service (:8082)"]
        CartService["Shopping Cart Service (:8083)"]
        OrderService["Order Service (:8084)"]
        PaymentService["Payment Service (:8085)"]
        NotificationService["Notification Service (:8086)"]
    end

    subgraph PostgreSQL 16 Isolated Databases
        DB_User[("ecommerce_user")]
        DB_Product[("ecommerce_product")]
        DB_Cart[("ecommerce_cart")]
        DB_Order[("ecommerce_order")]
        DB_Payment[("ecommerce_payment")]
        DB_Notification[("ecommerce_notification")]
    end

    ExternalStripe["Stripe Checkout API (Test Mode)"]

    Client -->|REST / JSON| Gateway
    Gateway -->|/api/users| UserService
    Gateway -->|/api/products, /api/categories| ProductService
    Gateway -->|/api/cart| CartService
    Gateway -->|/api/orders| OrderService
    Gateway -->|/api/payments| PaymentService
    Gateway -->|/api/notifications| NotificationService

    UserService --> DB_User
    ProductService --> DB_Product
    CartService --> DB_Cart
    OrderService --> DB_Order
    PaymentService --> DB_Payment
    NotificationService --> DB_Notification

    OrderService -.->|Reserve / Release Stock| ProductService
    OrderService -.->|Get & Clear Cart| CartService
    OrderService -.->|Order Created / Cancelled Event| NotificationService
    PaymentService -.->|Stripe Session / Webhook| ExternalStripe
    PaymentService -.->|Update Status: PAID / FAILED| OrderService
    PaymentService -.->|Payment Confirmed Event| NotificationService
```

---

### 2. Service Responsibilities & Boundary Definition

| Microservice | Port | Database | Primary Responsibilities |
|---|---|---|---|
| **User Service** | `8081` | `ecommerce_user` | Customer registration, BCrypt password hashing, JWT minting & validation, profile management, role-based authorization (`CUSTOMER`, `ADMIN`). |
| **Product Service** | `8082` | `ecommerce_product` | Catalogue management, category hierarchies, search, pagination, stock tracking, atomic database-level inventory reservations and compensations. |
| **Cart Service** | `8083` | `ecommerce_cart` | Persistent shopping carts per user, item additions/updates/deletions, server-side calculated totals, product existence validation. |
| **Order Service** | `8084` | `ecommerce_order` | Multi-service checkout orchestration, recalculating trusted prices, creating immutable purchase snapshots, managing order state transitions, triggering inventory compensations on failure. |
| **Payment Service** | `8085` | `ecommerce_payment` | Stripe Checkout session creation, cryptographically verified webhook processing (`STRIPE_WEBHOOK_SECRET`), idempotent transaction logging, local mock payment mode for testing. |
| **Notification Service** | `8086` | `ecommerce_notification` | Ingests asynchronous domain events (`ORDER_CREATED`, `PAYMENT_CONFIRMED`, `PAYMENT_FAILED`, `ORDER_SHIPPED`), deduplicates notifications, logs formatted audit records. |

---

### 3. Concurrency Safety & Atomic Inventory Reservation

To prevent overselling stock during high-traffic checkout events (e.g., flash sales), the platform utilizes **Atomic Conditional Database Updates** directly at the PostgreSQL row level rather than in-memory locks or naive read-then-write updates.

#### Atomic Reservation Query:
```sql
UPDATE products
SET stock_quantity = stock_quantity - :quantity,
    updated_at = :now
WHERE id = :id AND stock_quantity >= :quantity;
```
If the affected row count is `0`, the service recognizes that stock was exhausted between item selection and checkout, immediately rolling back the order and returning an `INSUFFICIENT_STOCK` conflict response (HTTP 409).

#### Compensating Release Action:
When an order expires, is canceled, or payment processing fails, the Order Service executes a compensating rollback on the Product Service:
```sql
UPDATE products
SET stock_quantity = stock_quantity + :quantity,
    updated_at = :now
WHERE id = :id;
```

---

### 4. End-to-End Checkout & Payment Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer / Browser
    participant Gateway as API Gateway (:8080)
    participant Cart as Cart Service (:8083)
    participant Order as Order Service (:8084)
    participant Product as Product Service (:8082)
    participant Payment as Payment Service (:8085)
    participant Stripe as Stripe / Mock Provider
    participant Notif as Notification Service (:8086)

    Customer->>Gateway: POST /api/orders/checkout (Shipping details)
    Gateway->>Order: Forward with JWT
    Order->>Cart: GET /api/cart (User items)
    Cart-->>Order: Cart items snapshot
    Order->>Product: Batch fetch current products & prices
    Product-->>Order: Authoritative prices & stock
    Order->>Order: Recalculate trusted total & validate stock
    Order->>Product: POST /api/products/reserve-batch (Atomic stock reservation)
    Product-->>Order: 200 OK (Reserved)
    Order->>Order: Save Order (Status: PENDING_PAYMENT)
    Order->>Notif: POST /api/notifications/events (ORDER_CREATED)
    Order-->>Customer: OrderDTO (id, total, status: PENDING_PAYMENT)

    Customer->>Gateway: POST /api/payments/checkout-session (orderId)
    Gateway->>Payment: Forward request
    Payment->>Order: GET /api/orders/{id} (Validate state & amount)
    Order-->>Payment: Order details
    alt Stripe Key Configured
        Payment->>Stripe: stripe.checkout.Session.create(...)
        Stripe-->>Payment: Session (id, url)
    else Mock Mode Active
        Payment->>Payment: Generate mock session (provider: MOCK_PROVIDER)
    end
    Payment-->>Customer: PaymentSessionDTO (sessionId, checkoutUrl)

    Customer->>Stripe: Complete payment on Stripe hosted page (or Mock Modal)
    Stripe->>Gateway: POST /api/payments/webhook (checkout.session.completed)
    Gateway->>Payment: Forward webhook payload & Stripe-Signature
    Payment->>Payment: Verify signature & check event idempotency
    Payment->>Payment: Record payment (Status: COMPLETED)
    Payment->>Order: PATCH /api/orders/{id}/status (PAID)
    Order->>Cart: DELETE /api/cart (Clear items after confirmed payment)
    Payment->>Notif: POST /api/notifications/events (PAYMENT_CONFIRMED)
    Payment-->>Stripe: 200 OK

    Customer->>Gateway: GET /api/orders/{id}
    Gateway->>Order: Forward request
    Order-->>Customer: OrderDTO (Status: PAID)
```

---

### 5. API Gateway Path Routing Matrix

All client requests target `http://localhost:8080`. NGINX strips CORS headers, validates payloads up to 20MB, injects `X-Forwarded-*` headers, and routes explicitly:

| Route Prefix | Upstream Target Service | Target Internal URL |
|---|---|---|
| `/api/users/**` | User Service | `http://user-service:8081/api/users/**` |
| `/api/products/**` | Product Service | `http://product-service:8082/api/products/**` |
| `/api/categories/**` | Product Service | `http://product-service:8082/api/categories/**` |
| `/api/cart/**` | Cart Service | `http://cart-service:8083/api/cart/**` |
| `/api/orders/**` | Order Service | `http://order-service:8084/api/orders/**` |
| `/api/payments/**` | Payment Service | `http://payment-service:8085/api/payments/**` |
| `/api/notifications/**` | Notification Service | `http://notification-service:8086/api/notifications/**` |
| `/` (Fallback) | Frontend (Nginx/Vite) | `http://frontend:80` |

---

### 6. Interactive API Documentation (OpenAPI / Swagger UI)

Every microservice exposes an interactive OpenAPI specification and Swagger UI:

- **User Service:** `http://localhost:8080/api/users/swagger-ui/index.html` (or port `8081`)
- **Product Service:** `http://localhost:8080/api/products/swagger-ui/index.html` (or port `8082`)
- **Cart Service:** `http://localhost:8080/api/cart/swagger-ui/index.html` (or port `8083`)
- **Order Service:** `http://localhost:8080/api/orders/swagger-ui/index.html` (or port `8084`)
- **Payment Service:** `http://localhost:8080/api/payments/swagger-ui/index.html` (or port `8085`)
- **Notification Service:** `http://localhost:8080/api/notifications/swagger-ui/index.html` (or port `8086`)

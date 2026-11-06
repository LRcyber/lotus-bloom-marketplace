Online Store

An online sales platform featuring a product catalog, retail and wholesale pricing, order management, and future ERP integration.

## 🎯 Objective

To develop an e-commerce application that includes:

- Product catalog and viewing.
- Customer registration and authentication.
- Approval process for wholesale customers.
- Differentiated pricing for retail and wholesale.
- Shopping cart, checkout, and order tracking.
- Administrative dashboard.
- Future integration with the "LJ Sistemas" ERP.
- Automation via n8n and notifications via WhatsApp.

## 🛠️ Technologies

- **Frontend:** React, TypeScript, and Vite.
- **Backend:** Supabase.
- **Database:** PostgreSQL.
- **Authentication and Security:** Supabase Auth and Row-Level Security (RLS).
- **Development:** Lovable.
- **Future Integrations:** LJ Sistemas REST API, n8n, and WhatsApp.

## 🏗️ Architecture

Supabase will serve as the primary backend, handling the database, authentication, storage, and server-side functions.

The architecture will be modular, separating the frontend, business logic, data persistence, administration, and external integrations.

## 👥 User Profiles

- **Retail:** Access to the catalog, retail pricing, and orders.
- **Wholesale:** Access to wholesale pricing, granted following administrative approval.
- **Administrator:** Management of customers, registration approvals, and order control.

### Pricing Rules

Each product may have both a `retail_price` and a `wholesale_price`.

The catalog is shared across all user profiles. The price displayed depends on the customer's profile and—for wholesale users—their registration status.

Prices that are null or equal to zero must be displayed as **"Price upon request."** ## 📦 Products and Orders

Products must support unique identification, pricing, inventory levels, images, and mechanisms for future synchronization with the ERP system.

The order workflow will be:

**Catalog → Product → Cart → Checkout → Order → Administration**

Order statuses will be managed by the administrative team:

- Received
- Confirmed
- In preparation
- Out for delivery
- Delivered

## 🔗 Future Integrations

### LJ Sistemas
- Synchronization of products and inventory.
- Transmission of sales data to the ERP.
- Logging and error handling.
- Prevention of duplicate sales.

The API uses REST/JSON and JWT authentication. This integration is not to be implemented at this stage.

### n8n and WhatsApp
- Automations and scheduled tasks.
- Order notifications.
- Operational monitoring.

n8n must not be a mandatory dependency for critical system operations.

## 🔐 Security

- Use RLS (Row-Level Security) to protect data within Supabase.
- Restrict customer access to their own orders only.
- Secure administrative routes and operations.
- Prevent unauthorized customers from accessing wholesale pricing.
- Keep ERP credentials and tokens exclusively on the backend, using Secrets or environment variables.

## 🗄️ Database Modeling

The proposed structure must include:

`profiles`, `customers`, `wholesale_customers`, `categories`, `products`, `orders`, `order_items`, `addresses`, `integration_logs`, `sync_control`, and `product_images`.

The database design must incorporate normalization, foreign keys, indexes, constraints, and RLS policies.

## 🚧 Project Status

**Current stage:** Architectural analysis and technical planning.

Before implementing new features, it is necessary to analyze the existing structure and document:

- Current architecture, components, and routes. - Database, relationships, and RLS (Row-Level Security) policies.
- Authentication and backend functions.
- Conflicts, dependencies, and technical risks.
- Required changes and components to be preserved.
- Recommended implementation order.

**At this stage, do not execute migrations, install dependencies, or modify any code.**

Any missing information should be marked as *Pending definition* or *Pending confirmation*.

## 🔗 Links

- **Application:** [LojaVirtual](https://lotus-bloom-marketplace.lovable.app)

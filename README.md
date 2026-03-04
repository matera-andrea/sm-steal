# sm-steal (HeatLab) - Specialized E-commerce & Listing Platform

## Overview

sm-steal is a high-performance e-commerce and listing platform developed with Next.js 15, specifically engineered for the high-end sneaker and collectible market. The application serves as a comprehensive digital catalog and administrative suite, facilitating the bridge between online product discovery and personalized transactional flows via secure communication channels.

The project demonstrates a modern full-stack architecture focusing on speed, scalability, and type safety, leveraging the latest features of the Next.js App Router and the React 19 ecosystem.

---

## Technical Stack

### Frontend

- **Framework:** Next.js 15 (App Router) with Turbopack for optimized development cycles.
- **State Management:** TanStack Query (React Query) v5 for server-state synchronization and caching.
- **Styling:** Tailwind CSS v4 (PostCSS) utilizing modern CSS-in-JS patterns.
- **Form Management:** React Hook Form with Zod for rigorous schema-based validation.
- **UI Components:** Headless UI for accessible interactive elements and Lucide for iconography.

### Backend & Infrastructure

- **Authentication:** Clerk (Middleware-guarded sessions and role-based access control).
- **Database:** PostgreSQL with Prisma ORM for type-safe database operations.
- **Storage:** Cloudflare R2 (S3-compatible) for distributed media storage.
- **Security & Performance:** Upstash Redis for edge-based rate limiting.
- **Analytics:** Vercel Analytics for privacy-focused telemetry.
- **Deployment:** Vercel (Edge-ready configuration).

---

## Key Features

### Dynamic Catalog Engine

The core of the application is a sophisticated filtering system that allows users to query products by brand, model, sizing (IT/US/UK), condition, and price range. The system utilizes Prisma's relational mapping to perform efficient complex queries across multiple tables (Brands, SneakerModels, Items, Listings).

### Integrated Administrative Dashboard

A secure, role-protected admin environment for catalog management, featuring:

- Full CRUD operations for brands and sneaker models.
- Advanced listing manager with support for multiple price/size variants per item.
- Drag-and-drop media gallery for product photos.
- Real-time stock and status toggling.

### Edge-Based Security Layer

A custom middleware implementation handles:

- **Rate Limiting:** IP-based limiting via Upstash Redis to prevent API abuse.
- **Mutating Request Protection:** Enforcement of CSRF/Origin checks for all non-GET requests.
- **Role-Based Routing:** Strict validation of Clerk sessions against internal admin identifiers.

### Media Optimization & Proxying

The application includes a specialized image proxying route (`/api/external/proxy-image`) that handles:

- Fetching and serving images from external sources (StockX, imgix, R2) while maintaining strict CORS compliance.
- Content-type validation and header optimization.
- Reducing client-side network overhead by centralizing image requests.

---

## Architecture and Patterns

### Data Validation

Type safety is enforced from the edge to the database. Zod schemas are centralized in `app/lib/validation/` and shared between:

1. Client-side form validation.
2. API route input parsing.
3. Database transaction logic.

### Server Components by Default

Following Next.js 15 best practices, the application maximizes the use of Server Components to minimize client-side JavaScript, utilizing Client Components only for interactive elements like the product filters and the administrative dashboard.

### Transactional Integrity

All complex operations (such as bulk listing imports or multi-variant updates) are wrapped in Prisma Transactions (`prisma.$transaction`) to ensure database consistency and atomicity.

---

## Local Development

### Prerequisites

- Node.js 20 or higher.
- A PostgreSQL database instance.
- Clerk Account for authentication keys.
- Cloudflare R2 Bucket for media storage.
- Upstash Redis instance for rate limiting.

### Environment Configuration

Create a `.env` file in the root directory:

```bash
DATABASE_URL="postgresql://..."
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."

R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="..."
R2_PUBLIC_URL="..."

UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."

ADMIN_ID="user_..."
DEV_ID="user_..."
```

### Installation

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

---

## Compliance and Data Protection

The application is built with GDPR and Italian consumer law (Codice del Consumo) in mind. It implements:

- Strict PII separation through Clerk's managed authentication.
- Transparent data flow for Extra-EU transfers (USA-based sub-processors).
- Standardized error handling for user privacy and security.

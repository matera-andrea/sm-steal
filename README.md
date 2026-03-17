# 1. sm-steal: E-commerce & Inventory Management System

An e-commerce platform and Content Management System (CMS) designed for streetwear inventory management. The system employs React Query for client-side state caching to minimize Time-to-First-Byte (TTFB) and utilizes Prisma to enforce strict transactional integrity on the server.

## 2. System Architecture & Data Flow

*   **Frontend Data Fetching:** Client components retrieve stateful data (e.g., inventory counts, dynamic pricing) via `@tanstack/react-query`, utilizing `staleTime` configuration to reduce redundant network requests.
*   **Authentication & Access Control:** Edge middleware utilizes Clerk for JWT verification. Mutating API routes (POST, PUT, DELETE) implement a custom `checkAdmin()` utility to enforce role-based access control prior to execution.
*   **Database Interactions:** Node.js API routes interface with a PostgreSQL database via the Prisma ORM. Operations requiring multi-table mutations (e.g., concurrent inventory decrementing) are executed within `prisma.$transaction([])` blocks to guarantee ACID compliance.
*   **Media Pipeline:** Image assets are uploaded to a Cloudflare R2 bucket via `@aws-sdk/client-s3`. To mitigate CORS restrictions and obfuscate the origin bucket, external media requests are proxied through a dedicated Next.js API route (`/api/external/proxy-image`).

## 3. Key Engineering Decisions

*   **Decoupling Client State from Server Runtimes via React Query & Server Components:**
    Instead of relying strictly on Server-Side Rendering (SSR) for the entire data payload, the initial UI shell and static product data are rendered via React Server Components (RSC). Dynamic state (e.g., user wishlists, stock availability) is managed by `@tanstack/react-query` on the client. *Trade-off:* This architecture increases the initial client JavaScript bundle size due to the React Query library, but decreases server compute overhead for subsequent client-side navigation and reduces data staleness.
*   **Implementation of Custom Image Proxying vs. Direct Client Access:**
    Media assets stored in Cloudflare R2 are served through a Next.js proxy route rather than direct bucket URLs. *Trade-off:* Proxying introduces additional latency overhead compared to direct edge bucket access. However, this approach centralizes CORS policy management on the server, prevents exposure of the R2 bucket URL, and enables the Next.js `Image` component to perform WebP conversion and caching.
*   **Strict Type Synchronization across API Boundaries:**
    The system implements a unified type validation pipeline using Zod. Data schemas (e.g., `listing.schema.ts`) are inferred (`z.infer<typeof schema>`) and mapped directly to Prisma's generated types. *Trade-off:* This requires significant boilerplate during initial model definition, but eliminates runtime type mismatch errors between the client payload, API boundary, and database schema, enforcing data integrity for the CMS.

## 4. Tech Stack

*   **Frontend:** Next.js 15.1 (App Router), React 19, Tailwind CSS v4, `@headlessui/react`, `@dnd-kit/core`
*   **Backend:** Node.js, Next.js API Routes, Zod, Clerk
*   **Infrastructure / Cloud:** PostgreSQL, Prisma ORM (v6), Cloudflare R2, Upstash Redis
*   **Tools:** Turbopack, ESLint, TypeScript

## 5. Deployment & CI/CD

The application is deployed to the Vercel Edge Network, utilizing serverless functions for API endpoints. The PostgreSQL database is hosted externally, with connections managed via Prisma's connection pooling. Static assets are distributed via Vercel's Edge CDN.

## 6. Local Setup & Development

```bash
git clone https://github.com/matera-andrea/sm-steal
cd sm-steal
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma generate
npm run dev
```
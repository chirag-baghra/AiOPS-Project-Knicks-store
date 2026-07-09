# NY Knicks Team Store

> Official team store for the New York Knicks — authentic jerseys, Jordans, basketballs, hoodies, and tees.
> A full-stack microservices e-commerce platform built with React, Node.js/TypeScript, PostgreSQL, and Docker.

![NY Knicks](https://img.shields.io/badge/NY%20Knicks-006BB6?style=flat-square&labelColor=006BB6&color=F58426)
![React](https://img.shields.io/badge/React-19-blue?logo=react&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?logo=typescript&style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js&style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql&style=flat-square)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker&style=flat-square)

---

## What's in here

This is the **NY Knicks team store** — a production-shaped e-commerce stack with five
microservices behind an API gateway, a React/MUI storefront, and a fully dockerized
observability stack.

| Layer | Tech |
|---|---|
| **Frontend** | React 19 + TypeScript + MUI (Knicks blue/orange theme) + Oswald font |
| **API Gateway** | Node.js + http-proxy-middleware |
| **Microservices** | `auth`, `product-service`, `order-service`, `orders`, `user-service` (Express + TypeScript) |
| **Databases** | 4 PostgreSQL databases — `knicks_auth`, `knicks_products`, `knicks_orders`, `knicks_users` |
| **Observability** | Prometheus + Grafana with pre-wired dashboards |
| **Container orchestration** | Docker Compose, single `docker compose up -d --build` |

The product catalog is basketball-only: **12 products** across **5 categories**
(Basketballs, Shoes, T-Shirts, Hoodies, Jerseys). Every product has its own
real photo (sourced from Unsplash).

---

## Project layout

```
ny-knicks-store/
├── docker-compose.yml              # 10 services, one Postgres with 4 DBs
├── .env.example                    # Root env template
├── health-check.sh                 # Stack health probe
├── package.json                    # Root workspace + scripts
│
├── backend/
│   └── services/
│       ├── auth/                   # JWT auth service (3002)
│       ├── gateway/                # API gateway (3001)
│       ├── product-service/        # Catalog service (3003)
│       ├── order-service/          # Cart-to-order pipeline (3004)
│       ├── orders/                 # Order history (3005)
│       └── user-service/           # User profile (3006)
│
├── database/
│   ├── init/
│   │   ├── 10-create-databases.sh  # Creates knicks_auth/products/orders/users
│   │   └── 20-init-schema.sql      # Schema + 12-product seed
│   ├── quick-seed.sql              # Standalone reseed
│   ├── setup.sh                    # Local (non-Docker) setup helper
│   └── README.md
│
├── frontend/                       # React storefront (port 3000)
│   ├── src/                        # TSX components, pages, contexts
│   ├── public/
│   │   ├── product-images/         # 12 basketball product JPEGs + placeholder
│   │   ├── index.html              # Knicks-themed title, theme-color, Oswald+Inter
│   │   └── manifest.json
│   ├── package.json
│   └── nginx.conf
│
├── prometheus/                     # Prometheus scrape config
├── grafana/                        # Pre-built dashboards
├── public/                         # Standalone mock-service images
└── shared/                         # Cross-service types
```

---

## Quickstart (Docker — recommended)

### Prerequisites
- Docker 20+ and Docker Compose v2
- Node.js 20+ (only needed if you want to run services outside Docker for debugging)

### 1. Clone and start
```bash
git clone <your-repo-url> ny-knicks-store
cd ny-knicks-store
docker compose down -v          # wipe any prior state
docker compose up -d --build    # build + start all 10 services
```

First boot takes ~2 minutes (npm installs, Postgres init, multi-service build).
Postgres healthchecks gate the dependent services, so everything comes up in order.

### 2. Verify
```bash
# Gateway health
curl http://localhost:3001/health

# Frontend serves the Knicks page
curl -I http://localhost:3000

# Products via the gateway
curl "http://localhost:3001/api/products?page=1&limit=12" | jq
```

### 3. Open the store
- **Storefront**: <http://localhost:3000>
- **Grafana**: <http://localhost:3007> (admin / admin)
- **Prometheus**: <http://localhost:9090>

### 4. Rebuild the frontend after source changes
The `frontend` container serves from `frontend/build/`, so the build output must
be on disk before nginx can serve it.

```bash
cd frontend
npm install
npm run build
cd ..
docker compose restart frontend
```

---

## Seeded data

| Resource | Count | Notes |
|---|---|---|
| **Products** | 12 | 3 basketballs, 4 shoes, 2 tees, 2 hoodies, 1 jersey |
| **Categories** | 5 | Basketballs, Shoes, T-Shirts, Hoodies, Jerseys |
| **Users** | 2 | `admin@knicks.com` / `customer@knicks.com` (passwords in seed) |
| **Product images** | 13 | 12 unique + 1 placeholder, all from Unsplash |

### Product catalog

| Category | Product | Price | Brand |
|---|---|---|---|
| Basketballs | Spalding NBA Official Game Ball | $200 | Spalding |
| Basketballs | Wilson Evolution Indoor | $65 | Wilson |
| Basketballs | Spalding Streetball Outdoor | $30 | Spalding |
| Shoes | Air Jordan 1 Retro High OG "Royal" | $220 | Jordan |
| Shoes | Air Jordan 4 "Bred" | $215 | Jordan |
| Shoes | Nike Air Force 1 '07 | $130 | Nike |
| Shoes | Adidas Harden Vol. 7 | $160 | Adidas |
| Jerseys | NY Knicks "Statement Edition" Jersey | $130 | Nike |
| T-Shirts | NY Knicks "Association Edition" Tee | $40 | Nike |
| T-Shirts | NY Knicks Big Logo Tee | $45 | Nike |
| Hoodies | NY Knicks Courtside Hoodie | $110 | Nike |
| Hoodies | Jordan Dri-FIT Pullover Hoodie | $95 | Jordan |

---

## API surface

The gateway at `http://localhost:3001` proxies to all services.

| Path | Method | Service | Description |
|---|---|---|---|
| `/health` | GET | gateway | Liveness probe |
| `/api/auth/register` | POST | auth | Create account |
| `/api/auth/login` | POST | auth | JWT login |
| `/api/products` | GET | product-service | List products (paginated, filterable) |
| `/api/products/:id` | GET | product-service | Single product detail |
| `/api/orders` | GET/POST | order-service | Cart → order pipeline |
| `/api/orders/history` | GET | orders | Order history per user |
| `/api/users/me` | GET | user-service | Current user profile |

---

## Architecture

```
                          ┌──────────────────────┐
                          │  Frontend (nginx)    │   :3000
                          │  React + MUI + TS    │
                          └──────────┬───────────┘
                                     │
                          ┌──────────▼───────────┐
                          │  API Gateway         │   :3001
                          │  http-proxy-mw       │
                          └──┬─────┬──────┬─────┬─┘
                             │     │      │     │
                ┌────────────┘     │      │     └────────────┐
                ▼                  ▼      ▼                  ▼
        ┌─────────────┐   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
        │ auth        │   │ product-     │  │ order-       │  │ user-        │
        │ :3002       │   │ service      │  │ service      │  │ service      │
        │             │   │ :3003        │  │ :3004        │  │ :3006        │
        └──────┬──────┘   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
               │                 │                 │                 │
               ▼                 ▼                 ▼                 ▼
        ┌─────────────┐  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │ knicks_auth │  │ knicks_      │ │ knicks_      │ │ knicks_      │
        │             │  │ products     │ │ orders       │ │ users        │
        └─────────────┘  └──────────────┘ └──────────────┘ └──────────────┘
                  ▲
                  │
            ┌─────┴──────┐
            │ PostgreSQL │  :5432 (single container, 4 databases)
            └────────────┘

  Observability:
    Prometheus (:9090) scrapes all services
    Grafana (:3007) ships with a pre-built Knicks dashboard
```

---

## Local development (without Docker)

Useful for fast iteration on a single service.

```bash
# Postgres only
docker compose up postgres -d

# Run the product service in dev mode
cd backend/services/product-service
npm install
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/knicks_products npm run dev
```

The frontend has its own dev server:
```bash
cd frontend
npm install
npm start          # http://localhost:3000, proxies /api -> :3001
```

---

## Customization

- **Theme**: edit `frontend/src/App.tsx` (palette + typography) and `frontend/src/components/Layout/Layout.tsx` (header)
- **New product**: add a row to `database/init/20-init-schema.sql`, drop a JPEG into `frontend/public/product-images/`, then add a `WHEN` clause to the `CASE` block in `backend/services/product-service/src/routes/products.ts`
- **New category**: update `frontend/src/pages/Products/Products.tsx` (filter arrays), add a `INSERT` into `categories` in the init SQL
- **Service ports**: `docker-compose.yml` (top of file maps 3000-3007)

---

## Project history

This project was originally a girls' fashion Knicks demo and was rebranded
end-to-end into the NY Knicks team store. The rebrand touched ~60 files:

- Frontend theme, layout, copy, and product images
- Backend CASE blocks (one image per product)
- All SQL seed files and Docker compose
- Database names (`knicks_*` prefix)
- Container names (`knicks-*` prefix)
- Health check, env templates, root metadata

The original fashion assets were removed and replaced with real basketball
product photography.

---

## License

This is a demo project for educational and portfolio use. Product names,
team references, and brand mentions are for demonstration only and are
the property of their respective owners.

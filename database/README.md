# NY Knicks Store E-Commerce Database Setup Plan

## Overview
Database setup for the official NY Knicks team store e-commerce platform with a focused basketball product catalog (jerseys, Jordans, basketballs, hoodies, and tees) and optimized performance.

## Database Architecture

### Core Tables
- **Users & Profiles**: Customer authentication and extended profile management
- **Products**: Basketball gear, footwear, and apparel with detailed attributes
- **Categories**: Top-level product organization (Basketballs, Shoes, T-Shirts, Hoodies, Jerseys)
- **Product Images**: Image paths served by the image service
- **Product Variants**: Size options (US 7-14 for shoes, S-XXL for apparel) with inventory tracking
- **Orders & Order Items**: Complete order management system
- **Product Reviews**: Customer ratings and feedback system

### Key Features
- UUID primary keys for scalability
- Comprehensive indexing strategy
- Foreign key constraints for data integrity
- Optimized views for common queries
- Inventory management with low stock alerts
- SEO optimization fields
- JSONB support for flexible data storage

## Product Catalog Strategy

### Basketball Categories
1. **Basketballs** (Spalding NBA, Wilson Evolution, streetballs)
2. **Shoes** (Air Jordans, Nike Air Force 1, Adidas Harden Vol.)
3. **Jerseys** (NY Knicks Statement, Association, Icon editions)
4. **T-Shirts** (Association Tee, Big Logo Tee, courtside tees)
5. **Hoodies** (Courtside, Jordan Dri-FIT, fan pullovers)

### Realistic Pricing Strategy
- **Entry**: $29-$59 (tees, basic basketballs)
- **Mid-Range**: $89-$179 (hoodies, signature basketballs)
- **Premium**: $179-$249 (jerseys, AF1)
- **Flagship**: $220-$300 (Air Jordans, signature editions)

### Premium Product Details
- **Materials**: Dri-FIT polyester, premium leather uppers, composite leather covers
- **Brands**: Jordan, Nike, Adidas, Spalding, Wilson
- **Sizing**: US 7-14 for shoes, S/M/L/XL/XXL for apparel
- **Licensing**: Officially NBA-licensed, swingman and statement editions
- **SEO Optimization**: Meta titles, descriptions, search-friendly URLs

## Data Seeding Strategy

### Sample Product Catalog (12 Basketball Items)
- 3 Basketballs (Spalding NBA, Wilson Evolution, Spalding Streetball)
- 4 Shoes (Air Jordan 1 Royal, Air Jordan 4 Bred, Nike Air Force 1, Adidas Harden Vol 7)
- 2 T-Shirts (NY Knicks Association Tee, Big Logo Tee)
- 2 Hoodies (NY Knicks Courtside, Jordan Dri-FIT)
- 1 Jersey (NY Knicks Statement)

### Realistic Product Variants
- **Shoes**: US 7-14 (1-3 units per size)
- **Apparel**: S-XXL sizing (1-5 units per size)
- **Basketballs**: One-size with standard inventories
- **Jerseys**: S/M/L/XL/XXL

### Product Images Strategy
- One primary image per product, served by the image service
- Lifestyle imagery where applicable
- Authentic product photography (Unsplash / official)

### Customer Reviews
- 4-5 star ratings with detailed feedback
- Mix of verified purchase reviews
- Realistic commentary on fit, quality, and on-court feel

## Performance Optimization

### Indexing Strategy
- **Single column indexes**: Frequently queried fields (email, status, created_at)
- **Composite indexes**: Common query patterns (category + status, user + order date)
- **Partial indexes**: Specific conditions (low stock, featured products)
- **Functional indexes**: Text search and computed values
- **JSONB indexes**: Flexible attribute searching

### Database Views
- **Product Summary**: Aggregated product data with ratings
- **Order Summary**: Customer order overview
- Optimized for dashboard and reporting queries

### Constraints & Validation
- Check constraints for business rules (positive prices, non-negative inventory)
- Unique constraints for SKUs and slugs
- Foreign key relationships for data integrity

## Setup Instructions

### 1. Database Creation (via Docker init)
The Docker Compose setup creates the 4 databases on first boot:
```sql
CREATE DATABASE knicks_auth;
CREATE DATABASE knicks_products;
CREATE DATABASE knicks_orders;
CREATE DATABASE knicks_users;
```
These are created by `database/init/10-create-databases.sh` (mounted to
`/docker-entrypoint-initdb.d/`). Schemas and seed data are loaded by
`database/init/20-init-schema.sql` immediately after.

### 2. Local Setup (without Docker)
```bash
psql -d knicks_auth -f init/20-init-schema.sql
psql -d knicks_products -f init/20-init-schema.sql
psql -d knicks_orders -f init/20-init-schema.sql
psql -d knicks_users -f init/20-init-schema.sql
```

### 3. Verification
```sql
-- Check data integrity
SELECT COUNT(*) FROM knicks_products.products;
SELECT COUNT(*) FROM knicks_products.categories;
```

## Expected Results

### Product Statistics
- **12 Products**: Complete basketball team-store catalog
- **60+ Variants**: Comprehensive sizing options
- **2 Customer Reviews** (admin and customer seed users)

### Price Range Distribution
- Average product price: $130
- Total catalog value: ~$1,560
- Flagship Air Jordans and premium basketballs included

### Inventory Management
- Low stock tracking enabled
- Realistic inventory levels (8-50 units per variant)

## Microservices Integration

### Service Compatibility
- **Product Service**: Complete catalog management
- **Order Service**: Full order processing workflow
- **User Service**: Profile and authentication integration
- **Auth Service**: Customer accounts (admin@knicks.com / customer@knicks.com)

### API Support
- RESTful endpoints for all operations
- Pagination and filtering support
- Search optimization for frontend

This setup powers the official NY Knicks team store with authentic basketball product data, optimized performance, and enterprise-ready architecture.
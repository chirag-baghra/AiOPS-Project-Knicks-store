-- Database initialization script for NY Knicks Basketball Store
-- This file will be executed when PostgreSQL container starts

-- ============================================================
-- AUTH DB
-- ============================================================
\c knicks_auth

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@knicks.com', '$2a$10$placeholder_hash', 'Admin', 'User', 'admin'),
('customer@knicks.com', '$2a$10$placeholder_hash', 'Mike', 'Knicks', 'customer');

-- ============================================================
-- PRODUCTS DB
-- ============================================================
\c knicks_products

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    description TEXT,
    short_description TEXT,
    sku VARCHAR(100),
    brand VARCHAR(100),
    category_id UUID REFERENCES categories(id),
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2),
    materials TEXT,
    care_instructions TEXT,
    inventory_quantity INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (id, name, description) VALUES
('10000000-0000-0000-0000-000000000001', 'Basketballs', 'Official NBA, indoor, and outdoor basketballs'),
('10000000-0000-0000-0000-000000000002', 'Shoes', 'Air Jordans, Nike, Adidas, and performance sneakers'),
('10000000-0000-0000-0000-000000000003', 'T-Shirts', 'Official NY Knicks tees and basketball graphic shirts'),
('10000000-0000-0000-0000-000000000004', 'Hoodies', 'Knicks hoodies, Jordan pullovers, and warmups'),
('10000000-0000-0000-0000-000000000005', 'Jerseys', 'Authentic and replica NY Knicks jerseys');

INSERT INTO products (id, name, slug, description, short_description, sku, brand, category_id, price, compare_price, inventory_quantity, is_featured) VALUES
(gen_random_uuid(), 'Air Jordan 1 Retro High OG "Royal"', 'air-jordan-1-retro-high-og-royal',
'Iconic Air Jordan 1 in the classic "Royal" colorway. Premium leather upper, encapsulated Air-Sole unit, and rubber outsole.', 'Air Jordan 1 Retro High OG Royal', 'AJ1-ROYAL', 'Jordan',
'10000000-0000-0000-0000-000000000002', 220.00, 250.00, 35, true),

(gen_random_uuid(), 'Air Jordan 4 "Bred"', 'air-jordan-4-bred',
'The Air Jordan 4 "Bred" returns with mesh side panels, visible Air sole, and the iconic "Nike Air" heel branding.', 'Air Jordan 4 Bred Reissue', 'AJ4-BRED', 'Jordan',
'10000000-0000-0000-0000-000000000002', 215.00, 240.00, 30, true),

(gen_random_uuid(), 'Nike Air Force 1 ''07', 'nike-air-force-1-07',
'The radiance lives on in the Nike Air Force 1 ''07. Crisp leather, classic AF1 silhouette, and a court-ready sole.', 'Nike Air Force 1 Low White', 'AF1-07-WHT', 'Nike',
'10000000-0000-0000-0000-000000000002', 130.00, 140.00, 50, false),

(gen_random_uuid(), 'Adidas Harden Vol. 7', 'adidas-harden-vol-7',
'James Harden''s signature shoe. Boost cushioning, Lightstrike midsole, and a herringbone outsole for quick cuts.', 'Adidas Harden Vol 7 Signature', 'AH7-BLK', 'Adidas',
'10000000-0000-0000-0000-000000000002', 160.00, 180.00, 22, false),

(gen_random_uuid(), 'Spalding NBA Official Game Ball', 'spalding-nba-official-game-ball',
'This is the ball: the official NBA game ball. Full-grain leather, eight-panel design, and the NBA logo you see on TV every night.', 'Spalding NBA Official Game Ball', 'SP-NBA-OFF', 'Spalding',
'10000000-0000-0000-0000-000000000001', 200.00, 220.00, 18, true),

(gen_random_uuid(), 'Wilson Evolution Indoor Basketball', 'wilson-evolution-indoor-basketball',
'The #1 indoor ball in America. Microfiber composite cover, cushion core, and unbeatable grip on hardwood.', 'Wilson Evolution Indoor', 'WL-EVO', 'Wilson',
'10000000-0000-0000-0000-000000000001', 65.00, 75.00, 40, true),

(gen_random_uuid(), 'NY Knicks "Statement Edition" Jersey', 'ny-knicks-statement-edition-jersey',
'Rep the orange and blue. Nike Dri-FIT Statement Edition replica jersey with Knicks wordmark and player number.', 'NY Knicks Statement Jersey', 'JERSEY-STMT', 'Nike',
'10000000-0000-0000-0000-000000000005', 130.00, 140.00, 25, true),

(gen_random_uuid(), 'NY Knicks "Association Edition" T-Shirt', 'ny-knicks-association-edition-t-shirt',
'Lightweight cotton tee with the classic Knicks "Association" wordmark. Soft hand feel and relaxed fit.', 'NY Knicks Association Tee', 'TEE-ASSOC', 'Nike',
'10000000-0000-0000-0000-000000000003', 40.00, 45.00, 60, true),

(gen_random_uuid(), 'NY Knicks Courtside Hoodie', 'ny-knicks-courtside-hoodie',
'Heavyweight French Terry hoodie in Knicks blue with orange accents. Embroidered Knicks logo at chest.', 'NY Knicks Courtside Hoodie', 'HOOD-COURT', 'Nike',
'10000000-0000-0000-0000-000000000004', 110.00, 130.00, 28, true),

(gen_random_uuid(), 'NY Knicks Big Logo Tee', 'ny-knicks-big-logo-tee',
'Classic fit tee with the giant Knicks wordmark across the chest. Pre-shrunk cotton for everyday wear.', 'NY Knicks Big Logo Tee', 'TEE-BIG', 'Nike',
'10000000-0000-0000-0000-000000000003', 45.00, 50.00, 70, false),

(gen_random_uuid(), 'Jordan Dri-FIT Pullover Hoodie', 'jordan-dri-fit-pullover-hoodie',
'Dri-FIT pullover hoodie with the Jumpman. Brushed-back fleece, kangaroo pocket, and ribbed cuffs.', 'Jordan Dri-FIT Pullover', 'HOOD-JDMN', 'Jordan',
'10000000-0000-0000-0000-000000000004', 95.00, 110.00, 32, false),

(gen_random_uuid(), 'Spalding Streetball Outdoor Ball', 'spalding-streetball-outdoor-ball',
'Built for blacktop. Durable rubber cover, deep channels for grip, and ready for the roughest outdoor courts.', 'Spalding Streetball Outdoor', 'SP-STREET', 'Spalding',
'10000000-0000-0000-0000-000000000001', 30.00, 35.00, 55, false);

-- ============================================================
-- ORDERS DB
-- ============================================================
\c knicks_orders

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

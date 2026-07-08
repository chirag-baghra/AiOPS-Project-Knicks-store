-- Simple product seeding with proper UUIDs and working images
-- For NY Knicks Basketball Store

-- Add the catalog (12 products across 5 categories)
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

-- Add images for these products (Unsplash-hosted basketball photos)
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
SELECT
    p.id,
    CASE
        WHEN p.sku = 'AJ1-ROYAL' THEN 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'
        WHEN p.sku = 'AJ4-BRED'  THEN 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80'
        WHEN p.sku = 'AF1-07-WHT' THEN 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80'
        WHEN p.sku = 'AH7-BLK'   THEN 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80'
        WHEN p.sku = 'SP-NBA-OFF' THEN 'https://images.unsplash.com/photo-1518614368389-d3a4f5f7e1bc?w=800&q=80'
        WHEN p.sku = 'WL-EVO'    THEN 'https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?w=800&q=80'
        WHEN p.sku = 'JERSEY-STMT' THEN 'https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?w=800&q=80'
        WHEN p.sku = 'TEE-ASSOC' THEN 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'
        WHEN p.sku = 'HOOD-COURT' THEN 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80'
        WHEN p.sku = 'TEE-BIG'   THEN 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'
        WHEN p.sku = 'HOOD-JDMN' THEN 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80'
        WHEN p.sku = 'SP-STREET' THEN 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80'
    END,
    p.name || ' - Main image',
    true,
    1
FROM products p
WHERE p.sku IN ('AJ1-ROYAL','AJ4-BRED','AF1-07-WHT','AH7-BLK','SP-NBA-OFF','WL-EVO',
                'JERSEY-STMT','TEE-ASSOC','HOOD-COURT','TEE-BIG','HOOD-JDMN','SP-STREET');

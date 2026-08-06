"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const connection_1 = require("../database/connection");
const router = express_1.default.Router();
exports.productRoutes = router;
router.get('/', async (req, res) => {
    try {
        const { page = '1', limit = '12', sortBy = 'created_at', category, search, minPrice, maxPrice } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;
        let whereClause = 'WHERE 1=1';
        const filterParams = [];
        let paramIndex = 1;
        if (category) {
            whereClause += ` AND c.name = $${paramIndex}`;
            filterParams.push(category);
            paramIndex++;
        }
        if (search) {
            whereClause += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex + 1})`;
            filterParams.push(`%${search}%`, `%${search}%`);
            paramIndex += 2;
        }
        if (minPrice) {
            whereClause += ` AND p.price >= $${paramIndex}`;
            filterParams.push(minPrice);
            paramIndex++;
        }
        if (maxPrice) {
            whereClause += ` AND p.price <= $${paramIndex}`;
            filterParams.push(maxPrice);
            paramIndex++;
        }
        const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c 
      ON p.category_id = c.id
      ${whereClause}
    `;
        const productsQuery = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.compare_price,
        p.brand,
        p.inventory_quantity,
        p.is_featured,
        p.created_at,
        p.updated_at,

        COALESCE(c.name,'Uncategorized') as category,

        CASE
          WHEN p.name ILIKE '%jordan 1%royal%' 
            OR p.name ILIKE '%air jordan 1%' 
            THEN '/product-images/air-jordan-1-royal.jpg'

          WHEN p.name ILIKE '%jordan 4%bred%'
            OR p.name ILIKE '%air jordan 4%'
            THEN '/product-images/air-jordan-4-bred.jpg'

          WHEN p.name ILIKE '%air force%'
            THEN '/product-images/nike-air-force-1.jpg'

          WHEN p.name ILIKE '%harden%'
            THEN '/product-images/adidas-harden-vol-7.jpg'

          WHEN p.name ILIKE '%spalding%nba%'
            THEN '/product-images/spalding-nba-official.jpg'

          WHEN p.name ILIKE '%wilson%'
            THEN '/product-images/wilson-evolution.jpg'

          WHEN p.name ILIKE '%spalding%streetball%'
            THEN '/product-images/spalding-streetball.jpg'

          WHEN p.name ILIKE '%statement%'
            OR p.name ILIKE '%jersey%'
            THEN '/product-images/knicks-statement-jersey.jpg'

          WHEN p.name ILIKE '%association%'
            THEN '/product-images/knicks-association-tee.jpg'

          WHEN p.name ILIKE '%big logo%'
            THEN '/product-images/knicks-big-logo-tee.jpg'

          WHEN p.name ILIKE '%courtside%'
            THEN '/product-images/knicks-courtside-hoodie.jpg'

          WHEN p.name ILIKE '%dri-fit%'
            OR p.name ILIKE '%dri fit%'
            THEN '/product-images/jordan-dri-fit-hoodie.jpg'

          WHEN p.name ILIKE '%hoodie%'
            OR p.name ILIKE '%pullover%'
            THEN '/product-images/knicks-courtside-hoodie.jpg'

          WHEN p.name ILIKE '%t-shirt%'
            OR p.name ILIKE '%tee%'
            OR p.name ILIKE '%shirt%'
            THEN '/product-images/knicks-big-logo-tee.jpg'

          ELSE '/product-images/placeholder.jpg'

        END AS image_url

      FROM products p

      LEFT JOIN categories c
      ON p.category_id = c.id

      ${whereClause}

      ORDER BY p.${sortBy}

      LIMIT $${paramIndex}
      OFFSET $${paramIndex + 1}
    `;
        const allParams = [
            ...filterParams,
            limitNum,
            offset
        ];
        const [countResult, productsResult] = await Promise.all([
            (0, connection_1.query)(countQuery, filterParams),
            (0, connection_1.query)(productsQuery, allParams)
        ]);
        const total = parseInt(countResult.rows[0].total);
        res.json({
            success: true,
            data: {
                products: productsResult.rows,
                pagination: {
                    currentPage: pageNum,
                    totalPages: Math.ceil(total / limitNum),
                    total,
                    hasNext: pageNum < Math.ceil(total / limitNum),
                    hasPrev: pageNum > 1
                }
            }
        });
    }
    catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get products',
            details: error.message
        });
    }
});
/*
 IMPORTANT:
 categories route MUST be before /:id
*/
router.get('/categories', async (req, res) => {
    try {
        const result = await (0, connection_1.query)(`
      SELECT
        c.id,
        c.name,
        c.description,
        c.image_url,
        COUNT(p.id)::int AS product_count

      FROM categories c

      LEFT JOIN products p
      ON c.id = p.category_id

      GROUP BY
        c.id,
        c.name,
        c.description,
        c.image_url

      ORDER BY c.name
    `);
        const response = {
            success: true,
            data: result.rows
        };
        res.json(response);
    }
    catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get categories'
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Prevent invalid UUID values like:
        // /products/categories
        // /products/test
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid product id'
            });
        }
        const result = await (0, connection_1.query)(`

      SELECT

        p.id,
        p.name,
        p.description,
        p.price,
        p.compare_price,
        p.brand,
        p.inventory_quantity,
        p.is_featured,
        p.created_at,
        p.updated_at,

        COALESCE(c.name,'Uncategorized') AS category,


        CASE

          WHEN p.name ILIKE '%jordan 1%royal%'
            OR p.name ILIKE '%air jordan 1%'
            THEN '/product-images/air-jordan-1-royal.jpg'


          WHEN p.name ILIKE '%jordan 4%bred%'
            OR p.name ILIKE '%air jordan 4%'
            THEN '/product-images/air-jordan-4-bred.jpg'


          WHEN p.name ILIKE '%air force%'
            THEN '/product-images/nike-air-force-1.jpg'


          WHEN p.name ILIKE '%harden%'
            THEN '/product-images/adidas-harden-vol-7.jpg'


          WHEN p.name ILIKE '%spalding%nba%'
            THEN '/product-images/spalding-nba-official.jpg'


          WHEN p.name ILIKE '%wilson%'
            THEN '/product-images/wilson-evolution.jpg'


          WHEN p.name ILIKE '%spalding%streetball%'
            THEN '/product-images/spalding-streetball.jpg'


          WHEN p.name ILIKE '%statement%'
            OR p.name ILIKE '%jersey%'
            THEN '/product-images/knicks-statement-jersey.jpg'


          WHEN p.name ILIKE '%association%'
            THEN '/product-images/knicks-association-tee.jpg'


          WHEN p.name ILIKE '%big logo%'
            THEN '/product-images/knicks-big-logo-tee.jpg'


          WHEN p.name ILIKE '%courtside%'
            THEN '/product-images/knicks-courtside-hoodie.jpg'


          WHEN p.name ILIKE '%dri-fit%'
            OR p.name ILIKE '%dri fit%'
            THEN '/product-images/jordan-dri-fit-hoodie.jpg'


          WHEN p.name ILIKE '%hoodie%'
            OR p.name ILIKE '%pullover%'
            THEN '/product-images/knicks-courtside-hoodie.jpg'


          WHEN p.name ILIKE '%t-shirt%'
            OR p.name ILIKE '%tee%'
            OR p.name ILIKE '%shirt%'
            THEN '/product-images/knicks-big-logo-tee.jpg'


          ELSE '/product-images/placeholder.jpg'


        END AS image_url


      FROM products p


      LEFT JOIN categories c
      ON p.category_id = c.id


      WHERE p.id = $1


    `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        res.json({
            success: true,
            data: result.rows[0]
        });
    }
    catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get product',
            details: error.message
        });
    }
});
//# sourceMappingURL=products.js.map
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Serve static images from public directory
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Mock products data with proper image URLs
const mockProducts = [
  {
    id: '1',
    name: 'Air Jordan 1 Retro High OG "Royal"',
    description: 'Iconic Air Jordan 1 in the classic Royal colorway. Premium leather upper, encapsulated Air-Sole unit, and rubber outsole.',
    price: 220.00,
    image_url: '/images/air-jordan-1.jpg',
    category: 'Shoes',
    inventory: 35,
    rating: 4.9,
    reviewCount: 28,
    isNew: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Air Jordan 4 "Bred"',
    description: 'The Air Jordan 4 Bred returns with mesh side panels, visible Air sole, and the iconic Nike Air heel branding.',
    price: 215.00,
    image_url: '/images/air-jordan-4.jpg',
    category: 'Shoes',
    inventory: 30,
    rating: 4.8,
    reviewCount: 22,
    isNew: true,
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z'
  },
  {
    id: '3',
    name: "Nike Air Force 1 '07",
    description: 'The radiance lives on in the Nike Air Force 1 07. Crisp leather, classic AF1 silhouette, and a court-ready sole.',
    price: 130.00,
    image_url: '/images/air-force-1.jpg',
    category: 'Shoes',
    inventory: 50,
    rating: 4.7,
    reviewCount: 41,
    isNew: false,
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T10:00:00Z'
  },
  {
    id: '4',
    name: 'Adidas Harden Vol. 7',
    description: "James Harden's signature shoe. Boost cushioning, Lightstrike midsole, and a herringbone outsole for quick cuts.",
    price: 160.00,
    image_url: '/images/harden-vol-7.jpg',
    category: 'Shoes',
    inventory: 22,
    rating: 4.6,
    reviewCount: 17,
    isNew: false,
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z'
  },
  {
    id: '5',
    name: 'Spalding NBA Official Game Ball',
    description: 'This is the ball: the official NBA game ball. Full-grain leather, eight-panel design, and the NBA logo you see on TV every night.',
    price: 200.00,
    image_url: '/images/spalding-nba.jpg',
    category: 'Basketballs',
    inventory: 18,
    rating: 5.0,
    reviewCount: 33,
    isNew: true,
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-01-11T10:00:00Z'
  },
  {
    id: '6',
    name: 'Wilson Evolution Indoor Basketball',
    description: 'The #1 indoor ball in America. Microfiber composite cover, cushion core, and unbeatable grip on hardwood.',
    price: 65.00,
    image_url: '/images/wilson-evolution.jpg',
    category: 'Basketballs',
    inventory: 40,
    rating: 4.9,
    reviewCount: 52,
    isNew: true,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z'
  },
  {
    id: '7',
    name: 'NY Knicks "Statement Edition" Jersey',
    description: 'Rep the orange and blue. Nike Dri-FIT Statement Edition replica jersey with Knicks wordmark and player number.',
    price: 130.00,
    image_url: '/images/knicks-jersey.jpg',
    category: 'Jerseys',
    inventory: 25,
    rating: 4.8,
    reviewCount: 19,
    isNew: true,
    created_at: '2024-01-09T10:00:00Z',
    updated_at: '2024-01-09T10:00:00Z'
  },
  {
    id: '8',
    name: 'NY Knicks "Association Edition" T-Shirt',
    description: 'Lightweight cotton tee with the classic Knicks Association wordmark. Soft hand feel and relaxed fit.',
    price: 40.00,
    image_url: '/images/knicks-tee.jpg',
    category: 'T-Shirts',
    inventory: 60,
    rating: 4.7,
    reviewCount: 36,
    isNew: true,
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-08T10:00:00Z'
  },
  {
    id: '9',
    name: 'NY Knicks Courtside Hoodie',
    description: 'Heavyweight French Terry hoodie in Knicks blue with orange accents. Embroidered Knicks logo at chest.',
    price: 110.00,
    image_url: '/images/knicks-hoodie.jpg',
    category: 'Hoodies',
    inventory: 28,
    rating: 4.9,
    reviewCount: 24,
    isNew: true,
    created_at: '2024-01-07T10:00:00Z',
    updated_at: '2024-01-07T10:00:00Z'
  },
  {
    id: '10',
    name: 'NY Knicks Big Logo Tee',
    description: 'Classic fit tee with the giant Knicks wordmark across the chest. Pre-shrunk cotton for everyday wear.',
    price: 45.00,
    image_url: '/images/knicks-big-tee.jpg',
    category: 'T-Shirts',
    inventory: 70,
    rating: 4.6,
    reviewCount: 28,
    isNew: false,
    created_at: '2024-01-06T10:00:00Z',
    updated_at: '2024-01-06T10:00:00Z'
  },
  {
    id: '11',
    name: 'Jordan Dri-FIT Pullover Hoodie',
    description: 'Dri-FIT pullover hoodie with the Jumpman. Brushed-back fleece, kangaroo pocket, and ribbed cuffs.',
    price: 95.00,
    image_url: '/images/jordan-hoodie.jpg',
    category: 'Hoodies',
    inventory: 32,
    rating: 4.8,
    reviewCount: 21,
    isNew: false,
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z'
  },
  {
    id: '12',
    name: 'Spalding Streetball Outdoor Ball',
    description: 'Built for blacktop. Durable rubber cover, deep channels for grip, and ready for the roughest outdoor courts.',
    price: 30.00,
    image_url: '/images/spalding-street.jpg',
    category: 'Basketballs',
    inventory: 55,
    rating: 4.7,
    reviewCount: 44,
    isNew: false,
    created_at: '2024-01-04T10:00:00Z',
    updated_at: '2024-01-04T10:00:00Z'
  }
];

app.get('/products', (req, res) => {
  const { page = '1', limit = '12', category, search, sortBy } = req.query;
  
  let filteredProducts = [...mockProducts];
  
  // Apply filters
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  if (search) {
    const searchLower = search.toString().toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.category.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply sorting
  if (sortBy) {
    switch (sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'created_at':
        filteredProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }
  }
  
  const pageNum = parseInt(String(page));
  const limitNum = parseInt(String(limit));
  const offset = (pageNum - 1) * limitNum;
  
  const paginatedProducts = filteredProducts.slice(offset, offset + limitNum);
  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / limitNum);
  
  res.json({
    success: true,
    data: {
      products: paginatedProducts,
      pagination: {
        currentPage: pageNum,
        totalPages,
        total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    }
  });
});

app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = mockProducts.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  
  res.json({ success: true, data: product });
});

app.get('/categories', (req, res) => {
  const categories = [
    { id: '1', name: 'Basketballs', description: 'Official NBA, indoor, and outdoor basketballs', image_url: '/images/spalding-nba.jpg', product_count: 3 },
    { id: '2', name: 'Shoes',       description: 'Air Jordans, Nike, Adidas, and performance sneakers', image_url: '/images/air-jordan-1.jpg', product_count: 4 },
    { id: '3', name: 'T-Shirts',    description: 'Official NY Knicks tees and basketball graphic shirts', image_url: '/images/knicks-tee.jpg', product_count: 2 },
    { id: '4', name: 'Hoodies',     description: 'Knicks hoodies, Jordan pullovers, and warmups', image_url: '/images/knicks-hoodie.jpg', product_count: 2 },
    { id: '5', name: 'Jerseys',     description: 'Authentic and replica NY Knicks jerseys', image_url: '/images/knicks-jersey.jpg', product_count: 1 }
  ];
  
  res.json({ success: true, data: categories });
});

app.get('/health', (req, res) => {
  res.json({ status: 'Product service is healthy', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Mock Products service running on port ${PORT}`);
  console.log(`Serving images from: ${path.join(__dirname, 'public')}`);
});
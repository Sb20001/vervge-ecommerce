import bcrypt from 'bcryptjs';
import { db, nextId } from './db.js';

const products = [
  {
    name: 'Fieldwork Canvas Tote',
    description: 'Heavyweight 16oz canvas tote with leather straps and an interior pocket. Built to carry everything, every day.',
    price: 48,
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600',
    stock: 34,
  },
  {
    name: 'Ridgeline Wool Overshirt',
    description: 'Brushed wool-blend overshirt with a boxy fit, corozo buttons, and a felted collar for cold mornings.',
    price: 128,
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600',
    stock: 21,
  },
  {
    name: 'Basin Ceramic Mug Set',
    description: 'Set of two hand-thrown stoneware mugs with a matte glaze. Dishwasher and microwave safe.',
    price: 36,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600',
    stock: 50,
  },
  {
    name: 'Trailhead Merino Beanie',
    description: 'Fine-gauge merino wool beanie, naturally moisture-wicking and itch-free, in five earth tones.',
    price: 32,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600',
    stock: 60,
  },
  {
    name: 'Harbor Waxed Backpack',
    description: 'Waxed cotton backpack with a padded 15-inch laptop sleeve and roll-top closure.',
    price: 165,
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
    stock: 18,
  },
  {
    name: 'Meridian Linen Shirt',
    description: 'Lightweight European linen shirt with a relaxed cut, garment-washed for a lived-in feel.',
    price: 89,
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600',
    stock: 27,
  },
  {
    name: 'Quarry Cast Iron Skillet',
    description: '10-inch pre-seasoned cast iron skillet, sand-cast for an ultra-smooth cooking surface.',
    price: 54,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600',
    stock: 40,
  },
  {
    name: 'Lowland Cork Yoga Mat',
    description: 'Natural cork and recycled rubber yoga mat with a non-slip textured surface.',
    price: 72,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600',
    stock: 33,
  },
];

async function seed() {
  db.data.products = [];
  db.data.users = [];
  db.data.orders = [];

  for (const p of products) {
    db.data.products.push({ id: nextId('products'), ...p, createdAt: new Date().toISOString() });
  }

  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  db.data.users.push({
    id: nextId('users'),
    name: 'Store Admin',
    email: 'admin@verve.shop',
    passwordHash: adminPasswordHash,
    role: 'admin',
    createdAt: new Date().toISOString(),
  });

  await db.write();
  console.log(`Seeded ${products.length} products and 1 admin user.`);
  console.log('Admin login -> email: admin@verve.shop  password: admin123');
}

seed();

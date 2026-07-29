import { Router } from 'express';
import { db, nextId } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/products?category=&search=&sort=
router.get('/', (req, res) => {
  let items = [...db.data.products];
  const { category, search, sort } = req.query;

  if (category && category !== 'all') {
    items = items.filter((p) => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }
  if (sort === 'price-asc') items.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') items.sort((a, b) => b.price - a.price);
  if (sort === 'newest') items.sort((a, b) => b.id - a.id);

  res.json(items);
});

router.get('/categories', (req, res) => {
  const categories = [...new Set(db.data.products.map((p) => p.category))];
  res.json(categories);
});

router.get('/:id', (req, res) => {
  const product = db.data.products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { name, description, price, category, image, stock } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'name, price and category are required' });
  }
  const product = {
    id: nextId('products'),
    name,
    description: description || '',
    price: Number(price),
    category,
    image: image || '',
    stock: stock !== undefined ? Number(stock) : 0,
    createdAt: new Date().toISOString(),
  };
  db.data.products.push(product);
  await db.write();
  res.status(201).json(product);
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const idx = db.data.products.findIndex((p) => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  const updated = { ...db.data.products[idx], ...req.body, id: db.data.products[idx].id };
  db.data.products[idx] = updated;
  await db.write();
  res.json(updated);
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const idx = db.data.products.findIndex((p) => p.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  db.data.products.splice(idx, 1);
  await db.write();
  res.status(204).end();
});

export default router;

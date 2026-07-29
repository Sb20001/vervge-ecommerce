import { Router } from 'express';
import { db, nextId } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Create an order from cart items
router.post('/', requireAuth, async (req, res) => {
  const { items, shippingAddress } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must include at least one item' });
  }
  if (!shippingAddress || !shippingAddress.line1 || !shippingAddress.city) {
    return res.status(400).json({ error: 'A shipping address is required' });
  }

  let total = 0;
  const orderItems = [];
  for (const item of items) {
    const product = db.data.products.find((p) => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ error: `Product ${item.productId} not found` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `Not enough stock for ${product.name}` });
    }
    total += product.price * item.quantity;
    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.image,
    });
  }

  // decrement stock
  for (const item of items) {
    const product = db.data.products.find((p) => p.id === item.productId);
    product.stock -= item.quantity;
  }

  const order = {
    id: nextId('orders'),
    userId: req.user.id,
    items: orderItems,
    total: Math.round(total * 100) / 100,
    shippingAddress,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  db.data.orders.push(order);
  await db.write();
  res.status(201).json(order);
});

// Get current user's orders
router.get('/my', requireAuth, (req, res) => {
  const orders = db.data.orders
    .filter((o) => o.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(orders);
});

router.get('/my/:id', requireAuth, (req, res) => {
  const order = db.data.orders.find(
    (o) => o.id === Number(req.params.id) && o.userId === req.user.id
  );
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// Admin: all orders
router.get('/', requireAuth, requireAdmin, (req, res) => {
  const orders = [...db.data.orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json(orders);
});

router.put('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const order = db.data.orders.find((o) => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const { status } = req.body;
  const valid = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!valid.includes(status)) {
    return res.status(400).json({ error: `status must be one of ${valid.join(', ')}` });
  }
  order.status = status;
  await db.write();
  res.json(order);
});

export default router;

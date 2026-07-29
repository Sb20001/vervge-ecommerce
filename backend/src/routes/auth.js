import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db, nextId } from '../db.js';
import { signToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  const existing = db.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with that email already exists' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: nextId('users'),
    name,
    email,
    passwordHash,
    role: email.toLowerCase() === 'admin@verve.shop' ? 'admin' : 'customer',
    createdAt: new Date().toISOString(),
  };
  db.data.users.push(user);
  await db.write();

  const token = signToken(user);
  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }
  const user = db.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = signToken(user);
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

export default router;

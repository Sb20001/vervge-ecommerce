import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'verve-backend' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Verve backend running on http://localhost:${PORT}`);
});

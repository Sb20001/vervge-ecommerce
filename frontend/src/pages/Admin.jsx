import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Trash2, Pencil } from 'lucide-react';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../features/products/productsSlice';
import { fetchAllOrders, updateOrderStatus } from '../features/orders/ordersSlice';

const emptyForm = { name: '', description: '', price: '', category: 'Apparel', image: '', stock: '' };
const STATUSES = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function Admin() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const products = useSelector((s) => s.products.items);
  const orders = useSelector((s) => s.orders.allOrders);
  const [tab, setTab] = useState('products');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    if (editingId) {
      await dispatch(updateProduct({ id: editingId, changes: payload }));
    } else {
      await dispatch(createProduct(payload));
    }
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, image: p.image, stock: p.stock });
    setTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-4xl text-ink">Admin dashboard</h1>

      <div className="mt-6 flex gap-2 border-b border-line">
        {['products', 'orders'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 font-mono text-xs uppercase tracking-widest ${
              tab === t ? 'border-b-2 border-ink text-ink' : 'text-ink/40'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <div className="mt-8 grid gap-10 md:grid-cols-3">
          <form onSubmit={handleSubmit} className="space-y-3 border border-line p-6">
            <h2 className="font-mono text-xs uppercase tracking-widest text-ink/60">
              {editingId ? `Edit product #${editingId}` : 'Add new product'}
            </h2>
            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-line bg-transparent px-3 py-2 font-body text-sm focus:border-ink focus:outline-none"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full border border-line bg-transparent px-3 py-2 font-body text-sm focus:border-ink focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-line bg-transparent px-3 py-2 font-body text-sm focus:border-ink focus:outline-none"
              />
              <input
                required
                type="number"
                min="0"
                placeholder="Stock"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full border border-line bg-transparent px-3 py-2 font-body text-sm focus:border-ink focus:outline-none"
              />
            </div>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-line bg-transparent px-3 py-2 font-body text-sm focus:border-ink focus:outline-none"
            >
              {['Apparel', 'Bags', 'Home', 'Accessories'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              placeholder="Image URL"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full border border-line bg-transparent px-3 py-2 font-body text-sm focus:border-ink focus:outline-none"
            />
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 border border-ink bg-ink py-2.5 font-mono text-xs uppercase tracking-widest text-paper hover:bg-transparent hover:text-ink"
              >
                {editingId ? 'Save changes' : 'Add product'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setForm(emptyForm); }}
                  className="border border-line px-4 font-mono text-xs uppercase tracking-widest text-ink/60"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="md:col-span-2">
            <div className="divide-y divide-line">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-4 py-3">
                  <img src={p.image} alt={p.name} className="h-14 w-12 object-cover bg-line/40" />
                  <div className="flex-1">
                    <p className="font-body text-sm text-ink">{p.name}</p>
                    <p className="font-mono text-xs text-ink/50">${p.price} · {p.stock} in stock</p>
                  </div>
                  <button onClick={() => startEdit(p)} className="text-ink/50 hover:text-ink" aria-label="Edit">
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => dispatch(deleteProduct(p.id))}
                    className="text-ink/50 hover:text-clay"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="mt-8 space-y-4">
          {orders.length === 0 && <p className="font-body text-ink/50">No orders yet.</p>}
          {orders.map((order) => (
            <div key={order.id} className="border border-line p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-xs uppercase tracking-wide text-ink/50">
                  Order #{order.id} · User {order.userId} · {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <select
                  value={order.status}
                  onChange={(e) => dispatch(updateOrderStatus({ id: order.id, status: e.target.value }))}
                  className="border border-line bg-transparent px-2 py-1 font-mono text-xs uppercase tracking-wide focus:border-ink focus:outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="mt-3 space-y-1">
                {order.items.map((i) => (
                  <div key={i.productId} className="flex justify-between font-body text-sm text-ink/80">
                    <span>{i.name} × {i.quantity}</span>
                    <span className="font-mono">${(i.price * i.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between font-medium text-ink">
                <span>Total</span>
                <span className="font-mono">${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

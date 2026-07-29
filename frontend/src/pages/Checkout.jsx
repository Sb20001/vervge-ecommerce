import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../features/orders/ordersSlice';
import { clearCart } from '../features/cart/cartSlice';

export default function Checkout() {
  const items = useSelector((s) => s.cart.items);
  const status = useSelector((s) => s.orders.status);
  const error = useSelector((s) => s.orders.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({ line1: '', city: '', postalCode: '', country: '' });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 8;
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(placeOrder({ items, shippingAddress: address }));
    if (placeOrder.fulfilled.match(result)) {
      dispatch(clearCart());
      navigate(`/order-confirmation/${result.payload.id}`);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24 text-center font-body text-ink/50">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-4xl text-ink">Checkout</h1>

      <div className="mt-10 grid gap-12 md:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-4 md:col-span-2">
          <h2 className="font-mono text-xs uppercase tracking-widest text-ink/60">Shipping address</h2>
          <div>
            <label className="font-mono text-xs uppercase tracking-wide text-ink/60">Address</label>
            <input
              required
              value={address.line1}
              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
              className="mt-1 w-full border border-line bg-transparent px-3 py-2.5 font-body text-sm focus:border-ink focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-xs uppercase tracking-wide text-ink/60">City</label>
              <input
                required
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="mt-1 w-full border border-line bg-transparent px-3 py-2.5 font-body text-sm focus:border-ink focus:outline-none"
              />
            </div>
            <div>
              <label className="font-mono text-xs uppercase tracking-wide text-ink/60">Postal code</label>
              <input
                value={address.postalCode}
                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                className="mt-1 w-full border border-line bg-transparent px-3 py-2.5 font-body text-sm focus:border-ink focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-wide text-ink/60">Country</label>
            <input
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
              className="mt-1 w-full border border-line bg-transparent px-3 py-2.5 font-body text-sm focus:border-ink focus:outline-none"
            />
          </div>

          {error && <p className="font-body text-sm text-clay">{error}</p>}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="mt-4 w-full border border-ink bg-ink py-3 font-mono text-xs uppercase tracking-widest text-paper transition hover:bg-transparent hover:text-ink disabled:opacity-50 md:w-auto md:px-8"
          >
            {status === 'loading' ? 'Placing order…' : 'Place order'}
          </button>
        </form>

        <div className="h-fit border border-line p-6">
          <h2 className="font-mono text-xs uppercase tracking-widest text-ink/60">Order summary</h2>
          <div className="mt-4 space-y-3">
            {items.map((i) => (
              <div key={i.productId} className="flex justify-between font-body text-sm text-ink/80">
                <span>{i.name} × {i.quantity}</span>
                <span className="font-mono">${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-line pt-4 font-body text-sm">
            <div className="flex justify-between text-ink/70">
              <span>Subtotal</span>
              <span className="font-mono">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-ink/70">
              <span>Shipping</span>
              <span className="font-mono">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-medium text-ink">
              <span>Total</span>
              <span className="font-mono">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

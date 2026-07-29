import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, X } from 'lucide-react';
import { updateQuantity, removeFromCart } from '../features/cart/cartSlice';

export default function Cart() {
  const items = useSelector((s) => s.cart.items);
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-ink">Your cart is empty</h1>
        <p className="mt-3 font-body text-ink/60">Nothing here yet — go find something worth keeping.</p>
        <Link
          to="/shop"
          className="mt-6 inline-block border border-ink px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-ink hover:text-paper"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-4xl text-ink">Your cart</h1>

      <div className="mt-10 grid gap-12 md:grid-cols-3">
        <div className="divide-y divide-line md:col-span-2">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-5 py-6">
              <div className="h-28 w-24 flex-shrink-0 overflow-hidden bg-line/40">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-body text-sm font-medium text-ink">{item.name}</h3>
                    <p className="mt-1 font-mono text-sm text-ink/60">${item.price}</p>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item.productId))}
                    className="h-fit text-ink/40 hover:text-clay"
                    aria-label="Remove item"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex items-center border border-line w-fit">
                  <button
                    onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}
                    className="p-2 text-ink/60 hover:text-ink"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center font-mono text-xs">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                    className="p-2 text-ink/60 hover:text-ink"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit border border-line p-6">
          <div className="flex justify-between font-body text-sm text-ink/70">
            <span>Subtotal</span>
            <span className="font-mono">${subtotal.toFixed(2)}</span>
          </div>
          <p className="mt-2 font-mono text-xs text-ink/40">Shipping and taxes calculated at checkout.</p>
          <button
            onClick={() => navigate(user ? '/checkout' : '/login?next=/checkout')}
            className="mt-6 w-full border border-ink bg-ink py-3 font-mono text-xs uppercase tracking-widest text-paper transition hover:bg-transparent hover:text-ink"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

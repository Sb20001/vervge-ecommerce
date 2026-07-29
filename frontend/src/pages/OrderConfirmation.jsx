import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Check } from 'lucide-react';

export default function OrderConfirmation() {
  const { id } = useParams();
  const lastOrder = useSelector((s) => s.orders.lastOrder);

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-moss/15">
        <Check className="text-moss-dark" size={26} />
      </div>
      <h1 className="mt-6 font-display text-3xl text-ink">Order confirmed</h1>
      <p className="mt-3 font-body text-ink/60">
        Thanks for your order — confirmation <span className="font-mono">#{id}</span> is on its way.
      </p>

      {lastOrder && (
        <div className="mt-8 border border-line p-6 text-left">
          <div className="space-y-2">
            {lastOrder.items.map((i) => (
              <div key={i.productId} className="flex justify-between font-body text-sm text-ink/80">
                <span>{i.name} × {i.quantity}</span>
                <span className="font-mono">${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-line pt-4 font-medium text-ink">
            <span>Total</span>
            <span className="font-mono">${lastOrder.total.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="mt-10 flex justify-center gap-4">
        <Link to="/shop" className="border border-ink px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-ink hover:text-paper">
          Continue shopping
        </Link>
        <Link to="/orders" className="border border-line px-6 py-3 font-mono text-xs uppercase tracking-widest text-ink/70 hover:border-ink hover:text-ink">
          View orders
        </Link>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../features/orders/ordersSlice';

const statusColor = {
  confirmed: 'text-moss-dark bg-moss/10',
  processing: 'text-gold bg-gold/10',
  shipped: 'text-clay bg-clay/10',
  delivered: 'text-moss-dark bg-moss/10',
  cancelled: 'text-ink/50 bg-line/40',
};

export default function MyOrders() {
  const dispatch = useDispatch();
  const orders = useSelector((s) => s.orders.myOrders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-4xl text-ink">Your orders</h1>

      {orders.length === 0 && (
        <p className="mt-8 font-body text-ink/50">You haven't placed any orders yet.</p>
      )}

      <div className="mt-8 space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border border-line p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-wide text-ink/50">
                  Order #{order.id} · {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`font-mono text-[11px] uppercase tracking-wide px-2 py-1 ${statusColor[order.status] || ''}`}>
                {order.status}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {order.items.map((i) => (
                <div key={i.productId} className="flex justify-between font-body text-sm text-ink/80">
                  <span>{i.name} × {i.quantity}</span>
                  <span className="font-mono">${(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-line pt-4 font-medium text-ink">
              <span>Total</span>
              <span className="font-mono">${order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

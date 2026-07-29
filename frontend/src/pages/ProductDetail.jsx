import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../features/products/productsSlice';
import { addToCart } from '../features/cart/cartSlice';
import { Minus, Plus } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector((s) => s.products.selected);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    dispatch(fetchProduct(id));
    setAdded(false);
    setQty(1);
  }, [dispatch, id]);

  if (!product || String(product.id) !== id) {
    return <div className="mx-auto max-w-6xl px-6 py-24 text-center font-body text-ink/50">Loading…</div>;
  }

  const handleAdd = () => {
    dispatch(addToCart({ product, quantity: qty }));
    setAdded(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="aspect-[4/5] overflow-hidden bg-line/40">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="md:pt-4">
          <p className="font-mono text-xs uppercase tracking-widest text-clay">{product.category}</p>
          <h1 className="mt-2 font-display text-4xl text-ink">{product.name}</h1>
          <p className="mt-4 font-mono text-2xl text-ink">${product.price}</p>
          <p className="mt-6 max-w-md font-body leading-relaxed text-ink/70">{product.description}</p>

          <p className="mt-6 font-mono text-xs uppercase tracking-wide text-ink/50">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>

          {product.stock > 0 && (
            <>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center border border-line">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="p-3 text-ink/60 hover:text-ink"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-mono text-sm">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="p-3 text-ink/60 hover:text-ink"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex-1 border border-ink bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition hover:bg-transparent hover:text-ink"
                >
                  Add to cart
                </button>
              </div>

              {added && (
                <div className="mt-4 flex items-center justify-between border border-moss/40 bg-moss/10 px-4 py-3">
                  <span className="font-body text-sm text-moss-dark">Added to your cart.</span>
                  <button
                    onClick={() => navigate('/cart')}
                    className="font-mono text-xs uppercase tracking-wide text-moss-dark underline underline-offset-2"
                  >
                    View cart
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

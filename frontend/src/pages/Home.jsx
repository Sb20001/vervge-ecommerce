import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../features/products/productsSlice';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.products.items);
  const status = useSelector((s) => s.products.status);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-14 md:pt-20">
        <div className="grid gap-10 md:grid-cols-5 md:gap-6">
          <div className="md:col-span-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay">Autumn Collection · No. 04</p>
            <h1 className="mt-4 font-display text-5xl font-medium leading-[1.05] text-ink md:text-7xl">
              Things worth
              <br />
              keeping.
            </h1>
            <p className="mt-6 max-w-md font-body text-base leading-relaxed text-ink/70">
              Verve makes considered goods for daily life — built from real materials,
              designed to be used for years, not seasons.
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-flex items-center border border-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-ink transition hover:bg-ink hover:text-paper"
            >
              Shop the collection
            </Link>
          </div>
          <div className="relative md:col-span-2">
            <div className="aspect-[3/4] overflow-hidden bg-moss/20">
              <img
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800"
                alt="Verve studio still life"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden w-40 rotate-[-3deg] border border-line bg-paper p-3 font-mono text-[11px] leading-snug text-ink/70 shadow-sm md:block">
              Made to be repaired, not replaced.
            </div>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-8 flex items-end justify-between border-b border-line pb-4">
          <h2 className="font-display text-2xl text-ink">New arrivals</h2>
          <Link to="/shop" className="font-mono text-xs uppercase tracking-widest text-ink/60 hover:text-ink">
            View all →
          </Link>
        </div>

        {status === 'loading' && <p className="font-body text-ink/50">Loading products…</p>}

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {items.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

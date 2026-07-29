import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../features/products/productsSlice';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['all', 'Apparel', 'Bags', 'Home', 'Accessories'];

export default function Shop() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.products.items);
  const status = useSelector((s) => s.products.status);
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || '';
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchProducts({ category, sort, search: search || undefined }));
  }, [dispatch, category, sort, search]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-4xl text-ink">Shop all</h1>

      <div className="mt-8 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setSearchParams((p) => { p.set('category', c); return p; })}
              className={`font-mono text-xs uppercase tracking-wide px-3 py-1.5 border transition ${
                category === c ? 'border-ink bg-ink text-paper' : 'border-line text-ink/60 hover:border-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-line bg-transparent px-3 py-1.5 font-body text-sm text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none"
          />
          <select
            value={sort}
            onChange={(e) => setSearchParams((p) => { p.set('sort', e.target.value); return p; })}
            className="border border-line bg-transparent px-3 py-1.5 font-mono text-xs uppercase text-ink/70 focus:border-ink focus:outline-none"
          >
            <option value="">Sort</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {status === 'loading' && <p className="mt-10 font-body text-ink/50">Loading…</p>}
      {status === 'succeeded' && items.length === 0 && (
        <p className="mt-10 font-body text-ink/50">No products match your search.</p>
      )}

      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

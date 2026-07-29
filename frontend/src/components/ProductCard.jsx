import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-line/40">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/60">
            <span className="font-mono text-xs uppercase tracking-widest text-paper">Sold out</span>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-body text-sm font-medium text-ink">{product.name}</h3>
          <p className="mt-0.5 font-mono text-xs uppercase tracking-wide text-ink/50">{product.category}</p>
        </div>
        <span className="font-mono text-sm text-ink">${product.price}</span>
      </div>
    </Link>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, User, LogOut, ShieldCheck } from 'lucide-react';
import { logout } from '../features/auth/authSlice';

export default function Navbar() {
  const cartCount = useSelector((s) => s.cart.items.reduce((sum, i) => sum + i.quantity, 0));
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight text-ink">
          Verve<span className="text-clay">.</span>
        </Link>

        <nav className="hidden items-center gap-8 font-body text-sm uppercase tracking-wide text-ink/70 md:flex">
          <Link to="/shop" className="transition hover:text-ink">Shop</Link>
          <Link to="/shop?category=Apparel" className="transition hover:text-ink">Apparel</Link>
          <Link to="/shop?category=Home" className="transition hover:text-ink">Home</Link>
          {user && (
            <Link to="/orders" className="transition hover:text-ink">Orders</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="flex items-center gap-1 text-clay transition hover:text-clay/80">
              <ShieldCheck size={15} /> Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-5">
          {user ? (
            <button
              onClick={() => { dispatch(logout()); navigate('/'); }}
              className="flex items-center gap-1.5 text-sm text-ink/70 transition hover:text-ink"
              title="Log out"
            >
              <User size={18} />
              <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              <LogOut size={14} />
            </button>
          ) : (
            <Link to="/login" className="flex items-center gap-1.5 text-sm text-ink/70 transition hover:text-ink">
              <User size={18} />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
          )}

          <Link to="/cart" className="relative flex items-center text-ink transition hover:text-clay">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-clay px-1 font-mono text-[10px] font-medium text-paper">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

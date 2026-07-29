import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import MyOrders from './pages/MyOrders';
import Admin from './pages/Admin';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <footer className="border-t border-line px-6 py-8">
        <p className="mx-auto max-w-6xl font-mono text-xs uppercase tracking-widest text-ink/40">
          Verve — considered goods for daily life.
        </p>
      </footer>
    </div>
  );
}

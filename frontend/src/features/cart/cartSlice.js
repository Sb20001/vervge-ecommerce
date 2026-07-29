import { createSlice } from '@reduxjs/toolkit';

const stored = localStorage.getItem('verve_cart');
const initialState = {
  items: stored ? JSON.parse(stored) : [], // { productId, name, price, image, quantity, stock }
};

function persist(items) {
  localStorage.setItem('verve_cart', JSON.stringify(items));
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.productId === product.id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.stock);
      } else {
        state.items.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          quantity: Math.min(quantity, product.stock),
        });
      }
      persist(state.items);
    },
    updateQuantity(state, action) {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.stock));
      }
      persist(state.items);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      persist(state.items);
    },
    clearCart(state) {
      state.items = [];
      persist(state.items);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

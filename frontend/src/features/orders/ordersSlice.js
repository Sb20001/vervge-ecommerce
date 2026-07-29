import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

export const placeOrder = createAsyncThunk(
  'orders/place',
  async ({ items, shippingAddress }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Could not place order');
    }
  }
);

export const fetchMyOrders = createAsyncThunk('orders/fetchMine', async () => {
  const { data } = await api.get('/orders/my');
  return data;
});

export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async () => {
  const { data } = await api.get('/orders');
  return data;
});

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Could not update order');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    myOrders: [],
    allOrders: [],
    lastOrder: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearLastOrder(state) {
      state.lastOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastOrder = action.payload;
        state.myOrders.unshift(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myOrders = action.payload;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.allOrders.findIndex((o) => o.id === action.payload.id);
        if (idx !== -1) state.allOrders[idx] = action.payload;
      });
  },
});

export const { clearLastOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

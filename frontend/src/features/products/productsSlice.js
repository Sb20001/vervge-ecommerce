import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params = {}) => {
  const { data } = await api.get('/products', { params });
  return data;
});

export const fetchProduct = createAsyncThunk('products/fetchOne', async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
});

export const createProduct = createAsyncThunk('products/create', async (product, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/products', product);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Could not create product');
  }
});

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, changes }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/products/${id}`, changes);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Could not update product');
    }
  }
);

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/products/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Could not delete product');
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    selected: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export default productsSlice.reducer;

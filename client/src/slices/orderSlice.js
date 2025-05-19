import Axios from '../axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getUserOrders = createAsyncThunk(
  '/getUserOrders',
  async ({ page = 1, perPage = 10, status = null }, { rejectWithValue }) => {
    try {
      let url = `/orders/?page=${page}&per_page=${perPage}`;
      if (status) url += `&status=${status}`;
      const { data } = await Axios.get(url);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getOrders = createAsyncThunk(
  '/getOrders',
  async ({ page = 1, perPage = 20, status = null }, { rejectWithValue }) => {
    try {
      let url = `/orders/admin?page=${page}&per_page=${perPage}`;
      if (status) url += `&status=${status}`;
      const { data } = await Axios.get(url);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getOrder = createAsyncThunk(
  '/getOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get(`/orders/${orderId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getGuestOrder = createAsyncThunk(
    '/getGuestOrder',
    async ({ orderId, email }, { rejectWithValue }) => {
      try {
        const { data } = await Axios.get(`/orders/guest/${orderId}?email=${email}`);
        return data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  );

export const createOrder = createAsyncThunk(
  '/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post(`/orders/`, orderData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  '/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post(`/orders/${orderId}/cancel`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const payOrder = createAsyncThunk(
    '/payOrder',
    async ({ orderId, orderData }, { rejectWithValue }) => {
      try {
        const { data } = await Axios.put(`/orders/${orderId}/pay`, orderData);
        return data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  );

export const updateOrder = createAsyncThunk(
  '/updateOrder',
  async ({ orderId, orderData }, { rejectWithValue }) => {
    try {
      const { data } = await Axios.put(`/orders/admin/${orderId}`, orderData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    order: null,
    orders: [],
    count: 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    resetCurrentPage: (state) => {
      state.currentPage = 1;
    },
    clearOrderMessages: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.count = action.payload.count;
        state.totalPages = action.payload.total_pages;
        state.currentPage = action.payload.page;
        state.loading = false;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.count = action.payload.count;
        state.totalPages = action.payload.total_pages;
        state.currentPage = action.payload.page;
        state.loading = false;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.order = action.payload.order;
        state.loading = false;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getGuestOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getGuestOrder.fulfilled, (state, action) => {
        state.order = action.payload.order;
        state.loading = false;
      })
      .addCase(getGuestOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.order = action.payload.order;
        state.loading = false;
        state.success = action.payload.message;
        state.orders.push(action.payload.order);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.order = action.payload.order;
        state.loading = false;
        state.success = action.payload.message;
        const index = state.orders.findIndex(order => order.id === action.payload.order.id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(payOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.order = action.payload.order;
        state.loading = false;
        state.success = action.payload.message;
        const index = state.orders.findIndex(order => order.id === action.payload.order.id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.order = action.payload.order;
        state.loading = false;
        state.success = action.payload.message;
        const index = state.orders.findIndex(order => order.id === action.payload.order.id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCurrentPage, clearOrderMessages } = orderSlice.actions;
export default orderSlice.reducer;
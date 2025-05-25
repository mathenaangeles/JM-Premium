import Axios from '../axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getPayments = createAsyncThunk(
  '/getPayments',
  async ({ page = 1, perPage = 10, userId = null, status = null, paymentMethod = null }, { rejectWithValue }) => {
    try {
      let url = `/payments/admin?page=${page}&per_page=${perPage}`;
      if (userId) url += `&user_id=${userId}`;
      if (status) url += `&status=${status}`;
      if (paymentMethod) url += `&payment_method=${paymentMethod}`;
      const { data } = await Axios.get(url);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getPayment = createAsyncThunk(
  '/getPayment',
  async (paymentId, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get(`/payments/${paymentId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const processPayment = createAsyncThunk(
  '/processPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post(`/payments/`, paymentData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    payment: null,
    payments: [],
    count: 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    clearPaymentMessages: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getPayments.fulfilled, (state, action) => {
        state.payments = action.payload.payments;
        state.count = action.payload.count;
        state.totalPages = action.payload.total_pages;
        state.currentPage = action.payload.page;
        state.loading = false;
      })
      .addCase(getPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getPayment.fulfilled, (state, action) => {
        state.payment = action.payload.payment;
        state.loading = false;
      })
      .addCase(getPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.payment = action.payload.payment;
        state.loading = false;
        state.success = action.payload.message;
        state.payments.push(action.payload.payment);
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearPaymentMessages } = paymentSlice.actions;
export default paymentSlice.reducer;
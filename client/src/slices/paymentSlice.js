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

export const getUserPayments = createAsyncThunk(
  '/getUserPayments',
  async ({ page = 1, perPage = 10, status = null, paymentMethod = null }, { rejectWithValue }) => {
    try {
      let url = `/payments/my-payments?page=${page}&per_page=${perPage}`;
      if (status) url += `&status=${status}`;
      if (paymentMethod) url += `&payment_method=${paymentMethod}`;
      const { data } = await Axios.get(url);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createPaymentRequest = createAsyncThunk(
  '/createPaymentRequest',
  async (paymentData, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post('/payments/create-payment-request', paymentData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const checkPaymentStatus = createAsyncThunk(
  '/checkPaymentStatus',
  async (paymentId, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get(`/payments/status/${paymentId}`);
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
    actions: null,
    xenditStatus: null,
    xenditResponse: null,
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    clearPaymentMessages: (state) => {
      state.success = null;
      state.error = null;
    },
    clearPaymentActions: (state) => {
      state.actions = null;
      state.xenditStatus = null;
      state.xenditResponse = null;
    },
    setPaymentFromOrder: (state, action) => {
      const { payment, checkout_url } = action.payload;
      state.payment = payment;
      state.xenditResponse = { checkout_url };
    }
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
      .addCase(getUserPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getUserPayments.fulfilled, (state, action) => {
        state.payments = action.payload.payments;
        state.count = action.payload.count;
        state.totalPages = action.payload.total_pages;
        state.currentPage = action.payload.page;
        state.loading = false;
      })
      .addCase(getUserPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPaymentRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.actions = null;
        state.xenditStatus = null;
        state.xenditResponse = null;
      })
      .addCase(createPaymentRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload.payment;
        state.actions = action.payload.actions;
        state.xenditStatus = action.payload.xendit_status;
        state.xenditResponse = action.payload.xendit_response;
        state.success = action.payload.message;
        if (state.payments.length > 0) {
          state.payments.unshift(action.payload.payment);
        }
      })
      .addCase(createPaymentRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkPaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(checkPaymentStatus.fulfilled, (state, action) => {
        state.payment = action.payload.payment;
        state.xenditStatus = action.payload.xendit_status;
        state.loading = false;
        state.success = action.payload.message;
        const index = state.payments.findIndex(payment => payment.id === action.payload.payment.id);
        if (index !== -1) {
          state.payments[index] = action.payload.payment;
        }
      })
      .addCase(checkPaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPaymentMessages, clearPaymentActions, setPaymentFromOrder } = paymentSlice.actions;
export default paymentSlice.reducer;
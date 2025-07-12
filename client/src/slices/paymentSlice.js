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
  'payment/getUserPayments',
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

export const createInvoice = createAsyncThunk(
  'payment/createInvoice',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post('/payments/create-invoice', invoiceData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createVirtualAccount = createAsyncThunk(
  'payment/createVirtualAccount',
  async (virtualAccountData, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post('/payments/create-virtual-account', virtualAccountData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const checkPaymentStatus = createAsyncThunk(
  'payment/checkPaymentStatus',
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
    loading: false,
    success: null,
    error: null,
    invoice: null,
    virtualAccount: null,
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
      .addCase(getUserPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getUserPayments.fulfilled, (state, action) => {
        state.userPayments = action.payload.payments;
        state.userPaymentsCount = action.payload.count;
        state.userPaymentsTotalPages = action.payload.total_pages;
        state.userPaymentsCurrentPage = action.payload.page;
        state.loading = false;
      })
      .addCase(getUserPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.invoice = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.payment = action.payload.payment;
        state.invoice = action.payload.payment.invoice_url;
        state.loading = false;
        state.success = action.payload.message;
        if (state.payments.length > 0) {
          state.payments.unshift(action.payload.payment);
        }
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createVirtualAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.virtualAccount = null;
      })
      .addCase(createVirtualAccount.fulfilled, (state, action) => {
        state.payment = action.payload.payment;
        state.virtualAccount = {
          accountNumber: action.payload.account_number,
          bankCode: action.payload.bank_code,
        };
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(createVirtualAccount.rejected, (state, action) => {
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
        state.loading = false;
        state.success = action.payload.message;
        const index = state.payments.findIndex(payment => payment.id === action.payload.payment.id);
        if (index !== -1) {
          state.payments[index] = action.payload.payment;
        };
      })
      .addCase(checkPaymentStatus.rejected, (state, action) => {
        state.checking = false;
        state.error = action.payload;
      })
  },
});

export const { clearPaymentMessages } = paymentSlice.actions;
export default paymentSlice.reducer;
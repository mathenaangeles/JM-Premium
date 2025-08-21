import Axios from '../axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getSubscriptions = createAsyncThunk(
  '/getSubscriptions',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get('/subscriptions/');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getSubscription = createAsyncThunk(
  '/getSubscription',
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get(`/subscriptions/${email}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const subscribe = createAsyncThunk(
  '/subscribe',
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post('/subscriptions/subscribe', { email });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const unsubscribe = createAsyncThunk(
  '/unsubscribe',
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post('/subscriptions/unsubscribe', { email });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    subscription: null,
    subscriptions: [],
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    clearSubscriptionMessages: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getSubscriptions.fulfilled, (state, action) => {
        state.subscriptions = action.payload.subscriptions;
        state.loading = false;
      })
      .addCase(getSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getSubscription.fulfilled, (state, action) => {
        state.subscription = action.payload.subscription;
        state.loading = false;
      })
      .addCase(getSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(subscribe.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(subscribe.fulfilled, (state, action) => {
        state.subscription = action.payload.subscription;
        state.loading = false;
        state.success = action.payload.message;
        const exists = state.subscriptions.find(sub => sub.email === action.payload.subscription.email);
        if (!exists) {
          state.subscriptions.push(action.payload.subscription);
        }
      })
      .addCase(subscribe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(unsubscribe.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(unsubscribe.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        const index = state.subscriptions.findIndex(sub => sub.email === action.payload.subscription.email);
        if (index !== -1) {
          state.subscriptions[index] = action.payload.subscription;
        }
        if (state.subscription && state.subscription.email === action.payload.subscription.email) {
          state.subscription = action.payload.subscription;
        }
      })
      .addCase(unsubscribe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubscriptionMessages } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
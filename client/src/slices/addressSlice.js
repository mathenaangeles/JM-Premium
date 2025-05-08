import Axios from '../axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const createAddress = createAsyncThunk(
  '/createAddress',
  async ( addressData, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post(`/addresses/`, addressData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getUserAddresses = createAsyncThunk(
    '/getUserAddresses',
    async ( _, { rejectWithValue }) => {
      try {
        const { data } = await Axios.get(`/addresses/`);
        return data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.error || err.message);
      }
    }
  );
  

export const updateAddress = createAsyncThunk(
  '/updateAddress',
  async ( {addressId, addressData}, { rejectWithValue }) => {
    try {
      const { data } = await Axios.put(`/addresses/${addressId}`, addressData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  '/deleteAddress',
  async ( {addressId}, { rejectWithValue }) => {
    try {
      const { data } = await Axios.delete(`/addresses/${addressId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    address: null,
    addresses: [],
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    clearAddressMessages: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(createAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(createAddress.fulfilled, (state, action) => {
      state.address = action.payload.address;
      state.addresses.push(action.payload.address);
      state.loading = false;
      state.success = action.payload.message;
    })
    .addCase(createAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(getUserAddresses.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(getUserAddresses.fulfilled, (state, action) => {
      state.addresses = action.payload;
      state.loading = false;
    })
    .addCase(getUserAddresses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(updateAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(updateAddress.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      state.address = action.payload.address;
      const index = state.addresses.findIndex((address) => address.id === action.payload.address.id);
      if (index !== -1) {
        state.addresses[index] = action.payload.address;
      }
    })
    .addCase(updateAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(deleteAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(deleteAddress.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      state.addresses = state.addresses.filter((address) => address.id !== action.payload.id);
      if (state.address && state.address.id === action.payload.id) {
        state.address = null;
      }
    })
    .addCase(deleteAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    
  },
});

export const { clearAddressMessages } = addressSlice.actions;
export default addressSlice.reducer;
import Axios from '../axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const register = createAsyncThunk(
  'register',
  async ( userData, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post(`/users/register`, userData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const login = createAsyncThunk(
  '/login',
  async ( userData, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post(`/users/login`, userData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getProfile = createAsyncThunk(
  '/getProfile',
  async ( _, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get(`/users/profile`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  '/updateProfile',
  async ( userData, { rejectWithValue }) => {
    try {
      const { data } = await Axios.put(`/users/profile`, userData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  '/changePassword',
  async ( passwordData, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post(`/users/change-password`, passwordData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  '/refreshToken',
  async ( _, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post(`/users/refresh`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const getUsers = createAsyncThunk(
  '/getUsers',
  async ( { page = 1, perPage = 10, search, isAdmin } , { rejectWithValue }) => {
    try {
      let url = `/users/admin/all?page=${page}&per_page=${perPage}`;
      if (search) url += `&search=${search}`;
      if (isAdmin !== undefined) url += `&is_admin=${isAdmin}`;
      const { data } = await Axios.get(url);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  '/updateUser',
  async ( {userId, userData}, { rejectWithValue }) => {
    try {
      const { data } = await Axios.put(`/users/admin/${userId}`, userData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  '/deleteUser',
  async ( {userId}, { rejectWithValue }) => {
    try {
      const { data } = await Axios.delete(`/users/admin/${userId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const logout = createAsyncThunk(
    '/logout',
    async ( _, { rejectWithValue }) => {
      try {
        const { data } = await Axios.post(`/users/logout`);
        return data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    users: [],
    count: 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(register.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.users.push(action.payload.user);
      state.loading = false;
    })
    .addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.loading = false;
    })
    .addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(getProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(getProfile.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.loading = false;
    })
    .addCase(getProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(updateProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(updateProfile.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.loading = false;
      state.success = action.payload.message;
      const index = state.users.findIndex((user) => user.id === action.payload.user.id);
      if (index !== -1) {
        state.users[index] = action.payload.user;
      }
    })
    .addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(changePassword.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(changePassword.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
    })
    .addCase(changePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(refreshToken.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(refreshToken.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
    })
    .addCase(refreshToken.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(getUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(getUsers.fulfilled, (state, action) => {
      state.users = action.payload.users;
      state.count = action.payload.count;
      state.totalPages = action.payload.total_pages;
      state.currentPage = action.payload.page;
      state.loading = false;
    })
    .addCase(getUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const index = state.users.findIndex((user) => user.id === action.payload.user.id);
      if (index !== -1) {
        state.users[index] = action.payload.user;
      }
    })
    .addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(deleteUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      state.users = state.users.filter((user) => user.id !== action.payload.id);
    })
    .addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    
    .addCase(logout.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(logout.fulfilled, (state, action) => {
      state.user = null;
      state.loading = false;
      state.success = action.payload.message;
    })
    .addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearMessages } = userSlice.actions;
export default userSlice.reducer;
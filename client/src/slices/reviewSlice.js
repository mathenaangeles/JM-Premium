import Axios from '../axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getReviews = createAsyncThunk(
  '/getReviews',
  async ({ productId = null, userId = null, page = 1, perPage = 10, approved = null, verified = null }, { rejectWithValue }) => {
    try {
      let url = `/reviews/?page=${page}&per_page=${perPage}`;
      if (productId) url += `&product_id=${productId}`;
      if (userId) url += `&user_id=${userId}`;
      if (approved !== null) url += `&approved=${approved}`;
      if (verified !== null) url += `&verified=${verified}`;
      const { data } = await Axios.get(url);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getReview = createAsyncThunk(
  '/getReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get(`/reviews/${reviewId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createReview = createAsyncThunk(
  '/createReview',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post(`/reviews/product/${productId}`, reviewData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateReview = createAsyncThunk(
  '/updateReview',
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const { data } = await Axios.put(`/reviews/${reviewId}`, reviewData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  '/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      const { data } = await Axios.delete(`/reviews/${reviewId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    review: null,
    reviews: [],
    count: 0,
    totalPages: 0,
    currentPage: 1,
    ratingCounts: {},
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    clearReviewMessages: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.reviews = action.payload.reviews;
        state.count = action.payload.count;
        state.ratingCounts = action.payload.rating_counts || {};
        state.totalPages = action.payload.total_pages;
        state.currentPage = action.payload.page;
        state.loading = false;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getReview.fulfilled, (state, action) => {
        state.review = action.payload.review;
        state.loading = false;
      })
      .addCase(getReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.review = action.payload.review;
        state.loading = false;
        state.success = action.payload.message;
        state.reviews.push(action.payload.review);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.review = action.payload.review;
        state.loading = false;
        state.success = action.payload.message;
        const index = state.reviews.findIndex(review => review.id === action.payload.review.id);
        if (index !== -1) {
          state.reviews[index] = action.payload.review;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.reviews = state.reviews.filter(review => review.id !== action.payload.id);
        if (state.review && state.review.id === action.payload.id) {
          state.review = null;
        }
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearReviewMessages } = reviewSlice.actions;
export default reviewSlice.reducer;
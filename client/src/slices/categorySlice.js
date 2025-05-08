import Axios from '../axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getCategories = createAsyncThunk(
    '/getCategories',
    async ( { tree = false }, { rejectWithValue }) => {
      try {
        let url = `/categories/?tree=${tree}`;
        const { data } = await Axios.get(url);
        return data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.error || err.message);
      }
    }
);

export const getRootCategories = createAsyncThunk(
    '/getRootCategories',
    async ( _, { rejectWithValue }) => {
      try {
        const { data } = await Axios.get(`/categories/root`);
        return data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    }
);

export const getCategory = createAsyncThunk(
    '/getCategory',
    async ({ categoryId, includeSubcategories = true }, { rejectWithValue }) => {
      try {
        const { data } = await Axios.get(`/categories/${categoryId}?include_subcategories=${includeSubcategories}`);
        return data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  );
  
export const getCategoryBySlug = createAsyncThunk(
    '/getCategoryBySlug',
    async ({ slug, includeSubcategories = true }, { rejectWithValue }) => {
        try {
        const { data } = await Axios.get(`/categories/slug/${slug}?include_subcategories=${includeSubcategories}`);
        return data;
        } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);
  
export const getCategoryBreadcrumbs = createAsyncThunk(
    '/getCategoryBreadcrumbs',
    async ({ categoryId }, { rejectWithValue }) => {
      try {
        const { data } = await Axios.get(`/categories/${categoryId}/breadcrumbs`);
        return data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    }
);

export const createCategory = createAsyncThunk(
    '/createCategory',
    async ( categoryData, { rejectWithValue }) => {
      try {
        const { data } = await Axios.post(`/categories/`, categoryData);
        return data;
      } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
    }
  );
  
export const updateCategory = createAsyncThunk(
  '/updateCategory',
  async ( {categoryId, categoryData}, { rejectWithValue }) => {
    try {
      const { data } = await Axios.put(`/categories/${categoryId}`, categoryData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  '/deleteCategory',
  async ( {categoryId}, { rejectWithValue }) => {
    try {
      const { data } = await Axios.delete(`/categories/${categoryId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const addCategoryImage = createAsyncThunk(
  '/addCategoryImage',
  async ({ categoryId, imageData }, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post(`/categories/${categoryId}/images`, imageData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteCategoryImage = createAsyncThunk(
  '/deleteCategoryImage',
  async ({ categoryId, imageId }, { rejectWithValue }) => {
    try {
      const { data } = await Axios.delete(`/categories/${categoryId}/images/${imageId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


const categorySlice = createSlice({
  name: 'category',
  initialState: {
    category: null,
    categories: [],
    breadcrumbs: [],
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    clearCategoryMessages: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
    })
    .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
        state.loading = false;
    })
    .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })

    .addCase(getRootCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
    })
    .addCase(getRootCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
        state.loading = false;
    })
    .addCase(getRootCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })

    .addCase(getCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
    })
    .addCase(getCategory.fulfilled, (state, action) => {
        state.category = action.payload.category;
        state.loading = false;
    })
    .addCase(getCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })

    .addCase(getCategoryBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
    })
    .addCase(getCategoryBySlug.fulfilled, (state, action) => {
        state.category = action.payload.category;
        state.loading = false;
    })
    .addCase(getCategoryBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })

    .addCase(getCategoryBreadcrumbs.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
    })
    .addCase(getCategoryBreadcrumbs.fulfilled, (state, action) => {
        state.breadcrumbs = action.payload.breadcrumbs;
        state.loading = false;
    })
    .addCase(getCategoryBreadcrumbs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })

    .addCase(createCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(createCategory.fulfilled, (state, action) => {
      state.category = action.payload.category;
      state.categories.push(action.payload.category);
      state.loading = false;
      state.success = action.payload.message;
    })
    .addCase(createCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(updateCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(updateCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      state.category = action.payload.category;
      const categoryIndex = state.categories.findIndex((category) => category.id === action.payload.category.id);
      if (categoryIndex !== -1) {
        state.categories[categoryIndex] = action.payload.category;
      }
    })
    .addCase(updateCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(deleteCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(deleteCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      state.categories = state.categories.filter((category) => category.id !== action.payload.id);
    })
    .addCase(deleteCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(addCategoryImage.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(addCategoryImage.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      state.category = action.payload.category;
      const categoryIndex = state.categories.findIndex((category) => category.id === action.payload.category.id);
      if (categoryIndex !== -1) {
        state.categories[categoryIndex] = action.payload.category;
      }
    })
    .addCase(addCategoryImage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    
    .addCase(deleteCategoryImage.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    })
    .addCase(deleteCategoryImage.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      state.category = action.payload.category;
      const categoryIndex = state.categories.findIndex((category) => category.id === action.payload.category.id);
      if (categoryIndex !== -1) {
        state.categories[categoryIndex] = action.payload.category;
      }
    })
    .addCase(deleteCategoryImage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
  },
});

export const { clearCategoryMessages } = categorySlice.actions;
export default categorySlice.reducer;
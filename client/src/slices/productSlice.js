import Axios from '../axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getProducts = createAsyncThunk(
  '/getProducts',
  async ({ page = 1, perPage = 10, search, categoryIds = [], isFeatured, isActive = true }, { rejectWithValue }) => {
    try {
      let url = `/products/?page=${page}&per_page=${perPage}`;
      if (search) url += `&search=${search}`;
      if (categoryIds.length > 0) {
        url += `&category_ids=${categoryIds.join(',')}`;
      }
      if (isFeatured !== undefined) url += `&is_featured=${isFeatured}`;
      if (isActive !== undefined) url += `&is_active=${isActive}`;
      const { data } = await Axios.get(url);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getProduct = createAsyncThunk(
  '/getProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get(`/products/${productId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getProductBySlug = createAsyncThunk(
  '/getProductBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get(`/products/slug/${slug}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  '/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post(`/products/`, productData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  '/updateProduct',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const { data } = await Axios.put(`/products/${productId}`, productData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  '/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await Axios.delete(`/products/${productId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createProductVariant = createAsyncThunk(
  '/createProductVariant',
  async ({ productId, variantData }, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post(`/products/${productId}/variants`, variantData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateProductVariant = createAsyncThunk(
  '/updateProductVariant',
  async ({ productId, variantId, variantData }, { rejectWithValue }) => {
    try {
      const { data } = await Axios.put(`/products/${productId}/variants/${variantId}`, variantData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteProductVariant = createAsyncThunk(
  '/deleteProductVariant',
  async ({ productId, variantId }, { rejectWithValue }) => {
    try {
      const { data } = await Axios.delete(`/products/${productId}/variants/${variantId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const addProductImage = createAsyncThunk(
  '/addProductImage',
  async ({ productId, imageData }, { rejectWithValue }) => {
    try {
      const { data } = await Axios.post(`/products/${productId}/images`, imageData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteProductImage = createAsyncThunk(
  '/deleteProductImage',
  async (imageId, { rejectWithValue }) => {
    try {
      const { data } = await Axios.delete(`/products/images/${imageId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    product: null,
    products: [],
    count: 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
    success: null,
    error: null,
    variants: [],
    variant: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.count = action.payload.count;
        state.totalPages = action.payload.total_pages;
        state.currentPage = action.payload.page;
        state.loading = false;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.product = action.payload.product;
        state.loading = false;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(getProductBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(getProductBySlug.fulfilled, (state, action) => {
        state.product = action.payload.product;
        state.loading = false;
      })
      .addCase(getProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.product = action.payload.product;
        state.loading = false;
        state.success = action.payload.message;
        state.products.push(action.payload.product);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.product = action.payload.product;
        state.loading = false;
        state.success = action.payload.message;
        const index = state.products.findIndex(product => product.id === action.payload.product.id);
        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.products = state.products.filter((product) => product.id !== action.payload.id);
        if (state.product && state.product.id === action.payload.id) {
          state.product = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(createProductVariant.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createProductVariant.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.variant = action.payload.variant;
        state.variants.push(action.payload.variant);
        state.product = action.payload.product
        const index = state.products.findIndex(product => product.id === action.payload.product.id);
        if (index !== -1) {
          state.products[index] = action.payload.product;
        }
      })
      .addCase(createProductVariant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(updateProductVariant.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateProductVariant.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.variant = action.payload.variant;
        state.product = action.payload.product;
        const productIndex = state.products.findIndex(product => product.id === action.payload.product.id);
        if (productIndex !== -1) {
            state.products[productIndex] = action.payload.product;
        }
        const variantIndex = state.variants.findIndex(v => v.id === action.payload.variant.id);
        if (variantIndex !== -1) {
        state.variants[variantIndex] = action.payload.variant;
        }
      })
      .addCase(updateProductVariant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(deleteProductVariant.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteProductVariant.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.product = action.payload.product;
        const productIndex = state.products.findIndex(product => product.id === action.payload.product.id);
        if (productIndex !== -1) {
            state.products[productIndex] = action.payload.product;
        }
        state.variants = state.variants.filter((variant) => variant.id !== action.payload.id);
        if (state.variant && state.variant.id === action.payload.id) {
          state.variant = null;
        }        
      })
      .addCase(deleteProductVariant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(addProductImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addProductImage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.product = action.payload.product;
        const productIndex = state.products.findIndex(product => product.id === action.payload.product.id);
        if (productIndex !== -1) {
            state.products[productIndex] = action.payload.product;
        }
      })
      .addCase(addProductImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(deleteProductImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteProductImage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.product = action.payload.product;
        const productIndex = state.products.findIndex(product => product.id === action.payload.product.id);
        if (productIndex !== -1) {
            state.products[productIndex] = action.payload.product;
        }
      })
      .addCase(deleteProductImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearProductState, setCurrentPage } = productSlice.actions;
export default productSlice.reducer;
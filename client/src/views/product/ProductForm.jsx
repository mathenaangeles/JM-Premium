import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import { InfoOutlined as InfoOutlinedIcon, Save as SaveIcon, Delete as DeleteIcon, Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { Snackbar, Chip, Tooltip, IconButton, InputLabel, FormControl, Select, Box, Grid, Paper, Typography, TextField, Button, FormControlLabel, Switch, MenuItem, CircularProgress, Alert, InputAdornment } from '@mui/material';

import { getCategories } from '../../slices/categorySlice';
import ImageUploader from '../../components/ImageUploader';
import RichTextEditor from '../../components/RichTextEditor';
import DeleteConfirmationModal from '../../components/DeleteConfirmation';
import { getProduct, createProduct, updateProduct, createProductVariant, updateProductVariant, deleteProductVariant, addProductImage, deleteProductImage, clearProductMessages } from '../../slices/productSlice';

const ProductForm = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories } = useSelector((state) => state.category);
  const { product, loading, error, success } = useSelector((state) => state.product);

  const [images, setImages] = useState([]);
  const [deleteDialogState, setDeleteDialogState] = useState({
    open: false,
    type: null,
    item: null,
    message: ''
  });
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    benefits: '',
    ingredients: '',
    instructions: '',
    is_featured: false,
    is_active: true,
    meta_title: '',
    meta_description: '',
    weight: 0,
    width: 0,
    height: 0,
    length: 0,
    option1_name: '',
    option2_name: '',
    option3_name: '',
    base_price: 0,
    sale_price: 0,
    stock: 0,
    category_id: '',
    variants: []
  });
  const [variantData, setVariantData] = useState({
    name: '',
    base_price: 0,
    sale_price: 0,
    stock: 0,
    option1_value: '',
    option2_value: '',
    option3_value: '',
    temp_id: `temp-${Date.now()}`,
  });
  const [variants, setVariants] = useState([]);
  const [currentVariant, setCurrentVariant] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      setSnackbarOpen(true);
    }
  }, [success]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    dispatch(clearProductMessages());
  };

  const editVariant = (variant) => {
    setCurrentVariant(variant);
    setVariantData({
      ...variant
    });
  };
  
  useEffect(() => {
    dispatch(getCategories({ tree: false }));
  }, [dispatch]);
  
  useEffect(() => {
    if (productId) {
      dispatch(getProduct(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (product && productId) {
      setProductData({
        name: product.name || '',
        description: product.description || '',
        benefits: product.benefits || '',
        ingredients: product.ingredients || '',
        instructions: product.instructions || '',
        is_featured: product.is_featured || false,
        is_active: product.is_active || true,
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
        weight: product.weight || 0,
        width: product.width || 0,
        height: product.height || 0,
        length: product.length || 0,
        option1_name: product.option1_name || '',
        option2_name: product.option2_name || '',
        option3_name: product.option3_name || '',
        base_price: product.base_price || 0,
        sale_price: product.sale_price || 0,
        stock: product.stock || 0,
        category_id: product.category_id || '',
      });
      if (product.variants && product.variants.length > 0) {
        setVariants(product.variants);
      }
      if (product.images) {
        setImages(product.images);
      }
    }
  }, [product, productId]);

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
        (['base_price', 'sale_price', 'weight', 'width', 'height', 'length', 'stock'].includes(name) 
        ? parseFloat(value) || 0 
        : value)
    }));
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setVariantData({
      ...variantData,
      [name]: ['base_price', 'sale_price', 'stock'].includes(name) 
              ? parseFloat(value) || 0
              : value
    });
  };

  const resetVariantForm = () => {
    setVariantData({
      name: '',
      base_price: 0,
      sale_price: 0,
      stock: 0,
      option1_value: '',
      option2_value: '',
      option3_value: '',
      temp_id: `temp-${Date.now()}`,
    });
  };

  const handleAddVariant = (e) => {
    e.preventDefault();
    if (productId && product) {
      dispatch(createProductVariant({
        productId: product.id,
        variantData: variantData
      }))
        .unwrap()
        .then(() => {
          resetVariantForm();
        });
    } else {
      setVariants(prev => [...prev, variantData]);
      resetVariantForm();
    }
  };

  const handleUpdateVariant = (e) => {
    e.preventDefault();
    if (!currentVariant) return;
    if (productId && product && currentVariant.id) {
      dispatch(updateProductVariant({
        productId: product.id,
        variantId: currentVariant.id,
        variantData: variantData
      }));
    } else {
      setVariants(prev =>
        prev.map(v => (v.temp_id === currentVariant.temp_id ? variantData : v))
      );
    }
    setCurrentVariant(null);
    resetVariantForm();
  };

  const cancelEdit = () => {
    setCurrentVariant(null);
    resetVariantForm();
  };

  const handleDeleteClick = (item, type) => {
    const message = type === 'variant' 
      ? 'Are you sure you want to delete this variant?' 
      : 'Are you sure you want to delete this image?';
    setDeleteDialogState({
      open: true,
      type,
      item,
      message
    });
  };

  const handleConfirmDelete = useCallback(() => {
    const { type, item } = deleteDialogState;
    if (type === 'variant') {
      if (productId && product) {
        dispatch(deleteProductVariant({
          productId: product.id,
          variantId: item.id
        }));
      } else {
        setVariants(prev => prev.filter(variant => variant.temp_id !== item.temp_id));
      }
    } else if (type === 'image') {
      if (item.id) {
        dispatch(deleteProductImage(item.id));
      } else {
        setImages(images.filter(img => img !== item));
      }
    }
    setDeleteDialogState({ open: false, type: null, item: null, message: '' });
  }, [deleteDialogState, dispatch, product, productId, images]);

  const handleCancelDelete = () => {
    setDeleteDialogState({ open: false, type: null, item: null, message: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {};
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== '' && value !== null) {
        formattedData[key] = value;
      }
    });
    if (!productId && variants.length > 0) {
      // eslint-disable-next-line no-unused-vars
      formattedData.variants = variants.map(({ temp_id, ...variant }) => variant);
    }
    if (productId) {
      dispatch(updateProduct({ productId, productData: formattedData }));
    } else {
      dispatch(createProduct(formattedData));
    }
  };

  const handleImageUpload = async (file, variantId = null) => {
    if (!file || !productId) return;
    const formData = new FormData();
    formData.append('file', file);
    dispatch(addProductImage({
      productId: product.id,
      variantId: variantId,
      imageData: formData
    }));
  };
  
  const handleImageDelete = (image) => {
    if (!product?.images || !productId || !image) return;
    dispatch(deleteProductImage({ productId: product.id, imageId: image.id }));
  };

  const variantSectionEnabled = Boolean(
    productData.option1_name || productData.option2_name || productData.option3_name
  );

  return (
    <Box sx={{ px: 4, py: 2, backgroundColor: "primary.main", color: "common.white" }}>
     {error || success ? (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={10000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
           <Alert
              onClose={handleCloseSnackbar}
              severity={error ? 'error' : 'success'}
              sx={{ width: '100%' }}
            >
              {error || success}
            </Alert>
        </Snackbar>
      ) : null}
      <Paper component="form" onSubmit={handleSubmit} elevation={3} sx={{ p: 4, my: 3 }}>
         <Box sx={{ position: 'relative', display: 'inline-block', mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0.5 }}>
            Product Information
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              bottom: -6,
              left: 0,
              height: '3px',
              width: '60px',
              bgcolor: 'primary.main',
              borderRadius: 2,
            }}
          />
        </Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          General Information
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="name"
              label="Product Name"
              value={productData.name}
              onChange={handleProductChange}
              required
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel id="product-category-label" shrink>Category</InputLabel>
              <Select
                labelId="product-category-label"
                id="category_id"
                name="category_id"
                value={
                  categories?.some(cat => cat.id === productData.category_id)
                    ? productData.category_id
                    : ''
                }
                onChange={handleProductChange}
                displayEmpty
                notched
                label="Category"
              >
                <MenuItem value="" disabled>
                  Select a category
                </MenuItem>
                {categories?.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" gutterBottom>
              Description
            </Typography>
            <Box sx={{ minHeight: 150 }}>
              <RichTextEditor
                value={productData.description}
                onChange={(value) =>
                  handleProductChange({ target: { name: 'description', value: value } })
                }
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" gutterBottom>
              Benefits
            </Typography>
            <Box>
              <RichTextEditor
                value={productData.benefits}
                onChange={(value) =>
                  handleProductChange({ target: { name: 'benefits', value: value } })
                }
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ my: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Ingredients
            </Typography>
            <Box>
              <RichTextEditor
                value={productData.ingredients}
                onChange={(value) =>
                  handleProductChange({ target: { name: 'ingredients', value: value } })
                }
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }} sx={{ my: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Instructions
            </Typography>
            <Box>
              <RichTextEditor
                value={productData.instructions}
                onChange={(value) =>
                  handleProductChange({ target: { name: 'instructions', value: value } })
                }
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="base_price"
              label="Base Price"
              value={productData.base_price}
              onChange={handleProductChange}
              fullWidth
              type="number"
              slotProps={{
                htmlInput: {
                  step: "0.01", 
                  min: "0"
                },
                input: {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="sale_price"
              label={
                <Box display="flex" alignItems="center">
                  Sale Price
                  <Tooltip title="Only add a sale price if this item is on sale.">
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
              value={productData.sale_price}
              onChange={handleProductChange}
              fullWidth
              type="number"
              slotProps={{
                htmlInput: {
                  step: "0.01", 
                  min: "0"
                },
                input: {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="stock"
              label="Stock"
              value={productData.stock}
              onChange={handleProductChange}
              fullWidth
              type="number"
              slotProps={{
                htmlInput: {
                  min: "0"
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="option1_name"
              label="Option 1 Name"
              value={productData.option1_name}
              onChange={handleProductChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="option2_name"
              label="Option 2 Name"
              value={productData.option2_name}
              onChange={handleProductChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              name="option3_name"
              label="Option 3 Name"
              value={productData.option3_name}
              onChange={handleProductChange}
              fullWidth
            />
          </Grid>  
        </Grid>
        <Typography variant="h5" sx={{ my: 3 }}>
          Search Engine Optimization 
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              name="meta_title"
              label="Meta Title"
              value={productData.meta_title}
              onChange={handleProductChange}
              fullWidth
              helperText={`${productData.meta_title.length}/60 characters recommended`}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              name="meta_description"
              label="Meta Description"
              value={productData.meta_description}
              onChange={handleProductChange}
              fullWidth
              multiline
              rows={3}
              helperText={`${productData.meta_description.length}/160 characters recommended`}
            />
          </Grid>
        </Grid>
        <Typography variant="h5" sx={{ my: 3 }}>
          Physical Dimensions
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              name="weight"
              label="Weight (kg)"
              value={productData.weight}
              onChange={handleProductChange}
              fullWidth
              type="number"
              slotProps={{
                htmlInput: {
                  step: "0.01", 
                  min: "0"
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            name="width"
            label="Width (cm)"
            value={productData.width}
            onChange={handleProductChange}
            fullWidth
            type="number"
            slotProps={{
              htmlInput: {
                step: "0.01", 
                min: "0"
              },
            }}
          />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              name="height"
              label="Height (cm)"
              value={productData.height}
              onChange={handleProductChange}
              fullWidth
              type="number"
              slotProps={{
                htmlInput: {
                  step: "0.01", 
                  min: "0"
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              name="length"
              label="Length (cm)"
              value={productData.length}
              onChange={handleProductChange}
              fullWidth
              type="number"
              slotProps={{
                htmlInput: {
                  step: "0.01", 
                  min: "0"
                },
              }}
            />
          </Grid>
         </Grid>
         <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ my: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <FormControlLabel
                control={
                  <Switch
                    name="is_active"
                    checked={productData.is_active}
                    onChange={handleProductChange}
                    color="primary"
                  />
                }
                label="Active Product"
              />
              <FormControlLabel
                control={
                  <Switch
                    name="is_featured"
                    checked={productData.is_featured}
                    onChange={handleProductChange}
                    color="secondary"
                  />
                }
                label="Featured Product"
              />
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            {productId ? (
              <>
                <ImageUploader
                  multiple={true}
                  maxImages={6}
                  existingImages={images}
                  validationRules={{
                    maxSize: 5 * 1024 * 1024,
                    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
                  }}
                  loading={loading}
                  disabled={loading}
                  onFileUpload={handleImageUpload} 
                  onFileDelete={(image) => {
                    handleImageDelete(image)
                  }}
                />
              </>
            ) : (
              <Alert severity="info">
                You need to save the product first before uploading images
              </Alert>
            )}
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mr: 1 }}
            startIcon={loading ? <CircularProgress size={20} /> : ''}
          >
            {productId ? 'Update Product' : 'Create Product'}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => navigate('/manage/products')}
          >
            Cancel
          </Button>
        </Box>  
      </Paper>

      <Paper component="form" onSubmit={handleSubmit} elevation={3} sx={{ p: 4, my: 3 }}>
      <Box sx={{ position: 'relative', display: 'inline-block', mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 0.5 }}>
            Product Variants
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              bottom: -6,
              left: 0,
              height: '3px',
              width: '60px',
              bgcolor: 'primary.main',
              borderRadius: 2,
            }}
          />
        </Box>
        {!variantSectionEnabled && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Define at least one option name above to create variants.
          </Alert>
        )}
        {variants.length > 0 ? (
          <Grid container spacing={2}>
            {variants.map((variant) => (
              <Grid size={{ xs: 12 }} key={variant.id}>
                <Grid container spacing={2} sx={{ 
                  backgroundColor: 'common.white', 
                  p: 3, 
                  borderRadius: 3,
                }}> 
                  <Grid size={{ xs: 12 }}>
                    <Chip label={`Variant ID: ${variant.id}`} sx={{backgroundColor: "primary.light", color: "secondary.main", fontWeight: 600}}/>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <Typography variant="h6">
                     {variant.name}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: 1, flexWrap: 'no-wrap' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => editVariant(variant)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteClick(variant, 'variant')}
                    >
                      Delete
                    </Button>
                  </Grid>
                  <Grid size={{ xs: 12}}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6, md : 3 }}>
                        <Typography variant="body2" color="secondary.main" fontWeight={600}>
                            Base Price
                        </Typography>
                        <Typography variant="body1">
                          {variant.base_price || 0}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md : 3 }}>
                        <Typography variant="body2" color="secondary.main" fontWeight={600}>
                          Sale Price
                        </Typography>
                        <Typography variant="body1">
                          {variant.sale_price || 0}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md : 3 }}>
                        <Typography variant="body2" color="secondary.main" fontWeight={600}>
                          Stock
                        </Typography>
                        <Typography variant="body1">
                          {variant.stock || 0}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {productData.option1_name && (
                    <Grid size={{ xs: 12, sm: 6, md : 3 }}>
                     <Typography variant="body2" color="secondary.main" fontWeight={600}>
                      {productData.option1_name}
                     </Typography>
                     <Typography variant="body1">
                       {variant.option1_value}
                     </Typography>                    
                     </Grid>
                  )}
                  {productData.option2_name && (
                    <Grid size={{ xs: 12, sm: 6, md : 3 }}>
                     <Typography variant="body2" color="secondary.main" fontWeight={600}>
                      {productData.option2_name}
                     </Typography>
                     <Typography variant="body1">
                       {variant.option2_value}
                     </Typography>
                   </Grid>
                  )}
                  {productData.option3_name && (
                    <Grid size={{ xs: 12, sm: 6, md : 3 }}>
                     <Typography variant="body2" color="secondary.main" fontWeight={600}>
                      {productData.option3_name}
                     </Typography>
                     <Typography variant="body1">
                       {variant.option3_name}
                     </Typography>
                   </Grid>
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: { xs: 3 },
              px: { xs: 2 },
              backgroundColor: 'grey.100',
              borderRadius: 2,
              border: '1px dashed #CCCCCC',
              my: 3
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No Variants Found
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
              This product has no variants.
            </Typography>
          </Box>
        )}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, my: 3 }}>
          <Typography variant="h5" sx={{ my: 3 }}>
            Variant Details
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                name="name"
                label="Variant Name"
                value={variantData.name}
                onChange={handleVariantChange}
                fullWidth
                size="small"
                disabled={!variantSectionEnabled}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="base_price"
                label="Base Price"
                value={variantData.base_price}
                onChange={handleVariantChange}
                fullWidth
                size="small"
                type="number"
                required
                disabled={!variantSectionEnabled}
                slotProps={{
                  htmlInput: {
                    step: "0.01", 
                    min: "0"
                  },
                  input: {
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="sale_price"
                label="Sale Price"
                value={variantData.sale_price}
                onChange={handleVariantChange}
                fullWidth
                size="small"
                type="number"
                disabled={!variantSectionEnabled}
                slotProps={{
                  htmlInput: {
                    step: "0.01", 
                    min: "0"
                  },
                  input: {
                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="stock"
                label="Stock"
                value={variantData.stock}
                onChange={handleVariantChange}
                fullWidth
                size="small"
                type="number"
                required
                disabled={!variantSectionEnabled}
                slotProps={{
                  htmlInput: {
                    min: "0"
                  },
                }}
              />
            </Grid>
            {productData.option1_name && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="option1_value"
                  label={productData.option1_name}
                  value={variantData.option1_value}
                  onChange={handleVariantChange}
                  fullWidth
                  size="small"
                />
              </Grid>
            )}
            {productData.option2_name && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="option2_value"
                  label={productData.option2_name}
                  value={variantData.option2_value}
                  onChange={handleVariantChange}
                  fullWidth
                  size="small"
                />
              </Grid>
            )}
            {productData.option3_name && (
              <Grid size={{ xs: 12  }}>
                <TextField
                  name="option3_value"
                  label={productData.option3_name}
                  value={variantData.option3_value}
                  onChange={handleVariantChange}
                  fullWidth
                  size="small"
                />
              </Grid>
            )}
            {currentVariant && (
              <Grid size={{ xs: 12  }}>
                <ImageUploader
                  multiple={false}
                  existingImages={currentVariant.images}
                  validationRules={{
                    maxSize: 5 * 1024 * 1024,
                    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
                  }}
                  loading={loading}
                  disabled={loading}
                  onFileUpload={(image) => handleImageUpload(image, currentVariant.id)}
                  onFileDelete={(image) => {handleImageDelete(image)}}
                />
              </Grid>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              {currentVariant ? (
                <>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={cancelEdit}
                    sx={{ mr: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleUpdateVariant}
                  >
                    Update Variant
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddVariant}
                  disabled={!variantSectionEnabled}
                >
                  Add Variant
                </Button>
              )}
            </Box>
          </Grid>
        </Paper>
      </Paper>
      <DeleteConfirmationModal
        open={deleteDialogState.open}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message={deleteDialogState.message}
      />
    </Box>
  );
};

export default ProductForm;
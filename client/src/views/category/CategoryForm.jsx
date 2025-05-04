import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Delete as DeleteIcon} from '@mui/icons-material';
import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography, Alert, CircularProgress } from '@mui/material';

import DeleteConfirmationModal from '../../components/DeleteConfirmation';
import { getCategories, createCategory, updateCategory, deleteCategory, getCategory, clearMessages } from '../../slices/categorySlice';

const CategoryForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categoryId } = useParams();  
  const { category, categories, error, loading, success } = useSelector((state) => state.category);
  
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
    parent_category_id: '',
  });

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    dispatch(getCategories({ tree: false }));
  }, [dispatch]);

  useEffect(() => {
    if (categoryId) {
      dispatch(getCategory({ categoryId }));
    }
  }, [categoryId, dispatch]);

  useEffect(() => {
    if (category && categoryId) {
      setCategoryData({
        name: category.name,
        description: category.description || '',
        parent_category_id: category.parent_category_id || '',
      });
    }
  }, [category, categoryId]);

  const handleChange = (e) => {
    setCategoryData({ ...categoryData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...categoryData,
      parent_category_id: categoryData.parent_category_id === '' ? null : categoryData.parent_category_id,
    };
    if (categoryId) {
      dispatch(updateCategory({ categoryId: category.id, categoryData: formattedData }))
    } else {
      dispatch(createCategory(formattedData))
      .unwrap()
      .then(
        navigate('/manage/categories/')
      )
    }
  };

  const openDeleteConfirmation = () => {
    setShowDeleteConfirmation(true); 
  };
  
  const handleDelete = () => {
    if (categoryId) {
      dispatch(deleteCategory({ categoryId: category.id }))
      .unwrap()
      .then(() => {
        navigate('/manage/categories');
      });
    }
  };

  return (
    <Box sx= {{ 
      minHeight: '100vh',
      bgcolor: 'secondary.main',
      p: 5,
      display: 'flex',
      justifyContent: 'center', 
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          width: '100%',
          maxWidth: 'md',
          p: { xs: 3, md: 5 },
          borderRadius: 5,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          {categoryId ? 'Edit Category' : 'Create Category'}
        </Typography>
        {error && (
          <Alert severity="error" onClose={() => dispatch(clearMessages())} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" onClose={() => dispatch(clearMessages())} sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              id="name"
              name="name"
              label="Name"
              value={categoryData.name}
              onChange={handleChange}
              required
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
            <TextField
              id="description"
              name="description"
              label="Description"
              value={categoryData.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
            <FormControl fullWidth>
              <InputLabel id="parent-category-label" shrink>Parent Category</InputLabel>
              <Select
                labelId="parent-category-label"
                id="parent_category_id"
                name="parent_category_id"
                value={categoryData.parent_category_id}
                onChange={handleChange}
                displayEmpty
                notched
                label="Parent Category"
              >
                <MenuItem value="">
                  None
                </MenuItem>
                {categories?.filter((category) => {
                  return category.id !== parseInt(categoryId) && 
                        !category.subcategories?.some(subcategory => subcategory.id === category.id);
                }).map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>If you select None, this category will be a root category.</FormHelperText>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" /> }
                sx={{ minWidth: 150 }}
              >
                {categoryId ? 'Update Category' : 'Create Category'}
              </Button>
              {categoryId && (
                <Button
                  type="button"
                  variant="contained"
                  color="error"
                  onClick={() => openDeleteConfirmation()}
                  disabled={loading}
                  startIcon={<DeleteIcon />}
                >
                  Delete Category
                </Button>
              )}
            </Box>

          </Stack>
        </Box>
      </Paper>

      <DeleteConfirmationModal
        open={showDeleteConfirmation}
        message={`Are you sure you want to delete ${category?.name || 'this category'}?`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirmation(false)}
      />
    </Box>
  );
};

export default CategoryForm;
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ViewList as ViewListIcon, AccountTree as AccountTreeIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon }  from '@mui/icons-material';
import { styled, Box, Button, Card, CardContent, CardMedia, CardActions, Container, Divider, Grid, Paper, Typography, Alert, ToggleButtonGroup, ToggleButton, Stack } from '@mui/material';

import DeleteConfirmationModal from '../../components/DeleteConfirmation';
import { getCategories, deleteCategory, clearMessages } from '../../slices/categorySlice';

const CategoryList = () => {
  const dispatch = useDispatch();

  const { categories, error } = useSelector(state => state.category);

  const [viewType, setViewType] = useState('list');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    if (viewType === 'list') {
      dispatch(getCategories({ tree: false }));
    } else {
      dispatch(getCategories({ tree: true }));
    }
  }, [dispatch, viewType]);

  const handleViewTypeChange = (_, newViewType) => {
    if (newViewType !== null) {
      setViewType(newViewType);
    }
  };

  const openDeleteConfirmation = (category) => {
    setCategoryToDelete(category); 
    setShowDeleteConfirmation(true); 
  };
  
  const handleDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory({ categoryId: categoryToDelete.id }));
      setShowDeleteConfirmation(false);
    }
  };

  const CategoryCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.01)',
      boxShadow: theme.shadows[4],
    },
  }));
  
  const CategoryCardContent = styled(CardContent)({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  });
  

  const renderCategoryItem = (category) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
      <CategoryCard>
        {category.image_url && (
          <CardMedia
            component="img"
            height="194"
            image={category.image_url}
            alt={category.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/api/placeholder/400/320';
            }}
          />
        )}
        <CategoryCardContent>
          <Link to={`/categories/${category.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              {category.name}
            </Typography>
            {category.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {category.description}
              </Typography>
            )}
            <Box sx={{ mt: 'auto' }}>
              <Typography variant="caption" color="text.secondary">
                {category.product_count || 0} Products
              </Typography>
            </Box>
          </Link>
        </CategoryCardContent>
        <CardActions>
          <Button 
            component={Link} 
            to={`/manage/categories/form/${category.id}`}
            variant="contained" 
            color="primary"
            startIcon={<EditIcon />}
            size="small"
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(category.id)}
            size="small"
          >
            Delete
          </Button>
        </CardActions>
      </CategoryCard>
    </Grid>
  );

  const renderCategoryTree = (category) => (
    <Box key={category.id} sx={{ mb: 2 }}>
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 1,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.01)',
            boxShadow: 4,
          },
        }}
      >
        <Link to={`/categories/${category.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            {category.name}
          </Typography>
          {category.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {category.description}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {category.product_count || 0} Products
          </Typography>
        </Link>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Button 
            component={Link} 
            to={`/manage/categories/form/${category.id}`}
            variant="outlined" 
            color="primary"
            startIcon={<EditIcon />}
            size="small"
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => openDeleteConfirmation(category)}
            size="small"
          >
            Delete
          </Button>
        </Stack>
      </Paper>
      {category.subcategories && category.subcategories.length > 0 && (
        <Box sx={{ pl: 3, ml: 2, borderLeft: '2px solid', borderColor: 'divider' }}>
          {category.subcategories.map(subcategory => renderCategoryTree(subcategory))}
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ p: 4 }}>
      {error && (
        <Alert severity="error" onClose={() => dispatch(clearMessages())} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      <Typography variant="h4" fontWeight={600} mb={3}>
        Manage Categories
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <ToggleButtonGroup
            value={viewType}
            exclusive
            onChange={handleViewTypeChange}
            aria-label="view type"
          >
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon sx={{ mr: 1 }} /> List View
            </ToggleButton>
            <ToggleButton value="tree" aria-label="tree view">
              <AccountTreeIcon sx={{ mr: 1 }} /> Tree View
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            component={Link}
            to="/manage/categories/form/"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            Add Category
          </Button>
        </Box>
      <Divider />
      </Box>

      {viewType === 'list' ? (
        <Grid container spacing={3}>
          {categories && categories.map(category => renderCategoryItem(category))}
          {categories && categories.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary">
                  No categories found
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      ) : (
        <Box>
          {categories && categories.map(category => renderCategoryTree(category))}
          {categories && categories.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary">
                No categories found
              </Typography>
            </Box>
          )}
        </Box>
      )}

      <DeleteConfirmationModal
        open={showDeleteConfirmation}
        message={`Are you sure you want to delete ${categoryToDelete?.name || 'this'}?`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirmation(false)}
      />
    </Box>
  );
};

export default CategoryList;

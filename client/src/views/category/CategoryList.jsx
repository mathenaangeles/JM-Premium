import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ImageNotSupportedOutlined as ImageNotSupportedOutlinedIcon, Inventory2Outlined as Inventory2OutlinedIcon, ViewList as ViewListIcon, AccountTree as AccountTreeIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon }  from '@mui/icons-material';
import { Chip, Box, Button, Card, CardContent, CardMedia, CardActions, Divider, Grid, Paper, Typography, Alert, ToggleButtonGroup, ToggleButton, Stack } from '@mui/material';

import DeleteConfirmationModal from '../../components/DeleteConfirmation';
import { getCategories, deleteCategory, clearCategoryMessages } from '../../slices/categorySlice';

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

  const renderCategoryItem = (category) => (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={category.id} sx={{ display: 'flex' }}>
      <Card sx={{ display: 'flex', flexDirection: 'column', width: 300 }}>
        {category.image?.url ? (
          <CardMedia
            component="img"
            height="160"
            image={category.image.url}
            alt={category.name}
            sx={{ objectFit: 'cover', backgroundColor: '#F5F5F5' }}
          />
        ) : (
          <Box
            height="160px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor="#F5F5F5"
            color="grey"
          >
            <ImageNotSupportedOutlinedIcon fontSize="large" />
          </Box>
        )}
        <CardContent>
          <Link to={`/categories/${category.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              {category.name}
            </Typography>
            {category.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {category.description}
              </Typography>
            )}
            <Box>
              <Chip
                icon={<Inventory2OutlinedIcon color='secondary'/>}
                label={`${category.product_count || 0} Products`}
                size="small"
                sx={{
                  bgcolor: 'rgba(151, 167, 99, 0.15)',
                  color: 'secondary.main',
                  p: 2,
                }}
              />
            </Box>
          </Link>
        </CardContent>
        <CardActions sx={{  mt: 'auto', justifyContent: 'flex-start',  px: 2, pb: 3 }}>
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
        </CardActions>
      </Card>
    </Grid>
  );

  const renderCategoryTree = (category) => (
    <Box key={category.id}>
      <Paper
        elevation={2}
        sx={{
          p: 2,
          my: 1,
        }}
      >
        <Link to={`/categories/${category.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              {category.name}
            </Typography>
            <Chip
              icon={<Inventory2OutlinedIcon color="secondary" />}
              label={`${category.product_count || 0} Products`}
              size="small"
              sx={{
                bgcolor: 'rgba(151, 167, 99, 0.15)',
                color: 'secondary.main',
                p: 2,
              }}
            />
          </Box>
          {category.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {category.description}
            </Typography>
          )}
        </Link>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
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
        <Box 
          sx={{ 
            pl: { xs: 2, sm: 4 }, 
            ml: { xs: 1, sm: 2 }, 
            borderLeft: 2, 
            borderColor: 'primary.main', 
            mt: 2 
          }}
        >
          {category.subcategories.map(subcategory => renderCategoryTree(subcategory))}
        </Box>
      )}
    </Box>
  );
  
  return (
    <Box sx={{ p: 4 }}>
      {error && (
        <Alert severity="error" onClose={() => dispatch(clearCategoryMessages())} sx={{ mb: 3 }}>
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
        <Grid container spacing={3} alignItems="stretch">
          {categories && categories.map(category => renderCategoryItem(category))}
          {categories && categories.length === 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', textAlign: 'center' }} >
              <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                <Typography variant="h5" color="text.primary" fontWeight={500}>
                  No categories found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  If this is not the expected result, please try refreshing the page.
                </Typography>
              </Box>
            </Box>
          )}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {categories && categories.map(category => renderCategoryTree(category))}
          {categories && categories.length === 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', textAlign: 'center' }} >
              <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                <Typography variant="h5" color="text.primary" fontWeight={500}>
                  No categories found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  If this is not the expected result, please try refreshing the page.
                </Typography>
              </Box>
            </Box>
          )}
        </Grid>
      )}
      <DeleteConfirmationModal
        open={showDeleteConfirmation}
        message={`Are you sure you want to delete ${categoryToDelete?.name || 'this category'}?`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirmation(false)}
      />
    </Box>
  );
};

export default CategoryList;

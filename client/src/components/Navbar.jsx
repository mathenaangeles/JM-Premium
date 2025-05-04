import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ListItemIcon, alpha, AppBar, Box, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Container, Drawer, List, ListItem, ListItemText, Divider, Avatar, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon, AccountCircle as AccountCircleIcon, KeyboardArrowDown as KeyboardArrowDownIcon, Close as CloseIcon, Person as PersonIcon, ShoppingBag as ShoppingBagIcon, Star as StarIcon, AdminPanelSettings as AdminPanelSettingsIcon, Logout as LogoutIcon, Category as CategoryIcon, Inventory as InventoryIcon, PeopleAlt as PeopleAltIcon, Receipt as ReceiptIcon, Payment as PaymentIcon, RateReview as RateReviewIcon, Home as HomeIcon } from '@mui/icons-material';

import Cart from '../views/Cart'; 
import { persistor } from '../store';
import { logout } from '../slices/userSlice';

const Navbar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user } = useSelector((state) => state.user);
  const { categories } = useSelector((state) => state.category);
  
  const [adminAnchorEl, setAdminAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const isAdminMenuOpen = Boolean(adminAnchorEl);
  const isAccountMenuOpen = Boolean(accountAnchorEl);
  const isCategoryMenuOpen = Boolean(categoryAnchorEl);

  const handleLogout = async () => {
    await persistor.purge();
    dispatch(logout());
    handleAccountMenuClose();
    navigate('/login');
  };

  const handleAdminMenuOpen = (event) => {
    setAdminAnchorEl(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminAnchorEl(null);
  };
  
  const handleAccountMenuOpen = (event) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountAnchorEl(null);
  };
  
  const handleCategoryMenuOpen = (event) => {
    setCategoryAnchorEl(event.currentTarget);
  };

  const handleCategoryMenuClose = () => {
    setCategoryAnchorEl(null);
  };
  
  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const menuPaperProps = {
    elevation: 2,
    sx: {
      overflow: 'visible',
      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
      mt: 1.5,
      borderRadius: 1,
      '& .MuiMenuItem-root': {
        px: 3,
        py: 1.5,
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.light, 0.1),
        },
      },
      '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        right: 14,
        width: 10,
        height: 10,
        bgcolor: 'background.paper',
        transform: 'translateY(-50%) rotate(45deg)',
        zIndex: 0,
      },
    },
  };

  const adminMenu = (
    <Menu
      anchorEl={adminAnchorEl}
      open={isAdminMenuOpen}
      onClose={handleAdminMenuClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      slotProps={menuPaperProps}
    >
      <MenuItem component={Link} to="/manage/users" onClick={handleAdminMenuClose}>
        <ListItemIcon>
          <PeopleAltIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText primary="Manage Users" />
      </MenuItem>
      <MenuItem component={Link} to="/manage/categories" onClick={handleAdminMenuClose}>
        <ListItemIcon>
          <CategoryIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText primary="Manage Categories" />
      </MenuItem>
      <MenuItem component={Link} to="/manage/products" onClick={handleAdminMenuClose}>
        <ListItemIcon>
          <InventoryIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText primary="Manage Products" />
      </MenuItem>
      <MenuItem component={Link} to="/orders/all" onClick={handleAdminMenuClose}>
        <ListItemIcon>
          <ReceiptIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText primary="Manage Orders" />
      </MenuItem>
      <MenuItem component={Link} to="/manage/payments" onClick={handleAdminMenuClose}>
        <ListItemIcon>
          <PaymentIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText primary="Manage Payments" />
      </MenuItem>
      <MenuItem component={Link} to="/reviews/all" onClick={handleAdminMenuClose}>
        <ListItemIcon>
          <RateReviewIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText primary="Manage Reviews" />
      </MenuItem>
    </Menu>
  );

  const accountMenu = (
    <Menu
      anchorEl={accountAnchorEl}
      open={isAccountMenuOpen}
      onClose={handleAccountMenuClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      slotProps={menuPaperProps}
    >
      <Box sx={{ px: 3, py: 1.5, display: 'flex', alignItems: 'center', mb: 1 }}>
        <Avatar 
          sx={{ 
            width: 32, 
            height: 32, 
            mr: 1.5, 
            bgcolor: 'primary.main' 
          }}
        >
          {user?.name?.charAt(0)}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {user?.name || 'Account'}
        </Typography>
      </Box>
      <Divider sx={{ mx: 2 }} />
      <MenuItem component={Link} to="/profile" onClick={handleAccountMenuClose}>
        <ListItemIcon>
          <PersonIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </MenuItem>
      <MenuItem component={Link} to={`/orders/all/${user?.id}`} onClick={handleAccountMenuClose}>
        <ListItemIcon>
          <ShoppingBagIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </MenuItem>
      <MenuItem component={Link} to={`/reviews/all/${user?.id}`} onClick={handleAccountMenuClose}>
        <ListItemIcon>
          <StarIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText primary="Reviews" />
      </MenuItem>
      <Divider sx={{ mx: 2 }} />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
      </MenuItem>
    </Menu>
  );

  const categoryMenu = (
    <Menu
      anchorEl={categoryAnchorEl}
      open={isCategoryMenuOpen}
      onClose={handleCategoryMenuClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      slotProps={{
        elevation: 2,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
          mt: 1.5,
          minWidth: 180,
          borderRadius: 1,
          '& .MuiMenuItem-root': {
            px: 3,
            py: 1.5,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.light, 0.1),
            },
          },
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: '50%',
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translate(-50%, -50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
    >
      {categories.map((category) => (
        <MenuItem 
          key={category.id} 
          component={Link} 
          to={`/categories/${category?.slug}`} 
          onClick={handleCategoryMenuClose}
        >
          {category.name}
        </MenuItem>
      ))}
    </Menu>
  );

  const mobileDrawer = (
    <Drawer
      anchor="right"
      open={mobileDrawerOpen}
      onClose={toggleMobileDrawer}
      PaperProps={{
        sx: {
          width: 280,
          borderRadius: '8px 0 0 8px',
          bgcolor: 'background.paper',
        }
      }}
    >
      <Box 
        sx={{ 
          width: '100%', 
          pt: 3, 
          pb: 2, 
          display: 'flex', 
          flexDirection: 'column'
        }} 
        role="presentation"
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>JM Premium</Typography>
          <IconButton onClick={toggleMobileDrawer} sx={{ color: 'text.primary' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 2, mb: 1, bgcolor: alpha(theme.palette.primary.light, 0.08) }}>
            <Avatar 
              sx={{ 
                mr: 2, 
                bgcolor: 'primary.main',
                width: 40,
                height: 40
              }}
            >
              {user.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            </Box>
          </Box>
        )}
        
        <Divider sx={{ mb: 1 }} />
        
        <List sx={{ px: 1 }}>
          <ListItem 
            button 
            component={Link} 
            to="/" 
            onClick={toggleMobileDrawer}
            sx={{ 
              borderRadius: 1,
              mb: 0.5,
              '&:hover': { bgcolor: alpha(theme.palette.primary.light, 0.1) }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <HomeIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Home" 
              slotProps={{ fontWeight: 500 }}
            />
          </ListItem>
          
          <ListItem 
            button 
            onClick={() => setCategoryAnchorEl(categoryAnchorEl ? null : document.getElementById('mobile-categories'))}
            id="mobile-categories"
            sx={{ 
              borderRadius: 1,
              mb: 0.5,
              '&:hover': { bgcolor: alpha(theme.palette.primary.light, 0.1) }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <CategoryIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Shop" 
              slotProps={{ fontWeight: 500 }}
            />
            <KeyboardArrowDownIcon 
              sx={{ 
                transform: categoryAnchorEl ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.3s'
              }} 
            />
          </ListItem>
          
          {Boolean(categoryAnchorEl) && (
            <Box sx={{ ml: 2, mb: 1 }}>
              {categories.map((category) => (
                <ListItem 
                  button 
                  key={category.id} 
                  component={Link} 
                  to={`/categories/${category?.slug}`} 
                  onClick={toggleMobileDrawer}
                  sx={{ 
                    pl: 5,
                    borderRadius: 1,
                    mb: 0.5,
                    '&:hover': { bgcolor: alpha(theme.palette.primary.light, 0.1) }
                  }}
                >
                  <ListItemText 
                    primary={category.name} 
                    sx={{ my: 0 }}
                    slotProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </Box>
          )}
          
          <Divider sx={{ my: 1.5 }} />
          
          {user ? (
            <>
              <ListItem 
                button 
                component={Link} 
                to="/profile" 
                onClick={toggleMobileDrawer}
                sx={{ 
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': { bgcolor: alpha(theme.palette.primary.light, 0.1) }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <PersonIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Profile" 
                  slotProps={{ fontWeight: 500 }}
                />
              </ListItem>
              
              <ListItem 
                button 
                component={Link} 
                to={`/orders/all/${user.id}`} 
                onClick={toggleMobileDrawer}
                sx={{ 
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': { bgcolor: alpha(theme.palette.primary.light, 0.1) }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <ShoppingBagIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Orders" 
                  slotProps={{ fontWeight: 500 }}
                />
              </ListItem>
              
              <ListItem 
                button 
                component={Link} 
                to={`/reviews/all/${user.id}`} 
                onClick={toggleMobileDrawer}
                sx={{ 
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': { bgcolor: alpha(theme.palette.primary.light, 0.1) }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <StarIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Reviews" 
                  slotProps={{ fontWeight: 500 }}
                />
              </ListItem>
              
              {user.is_admin && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <ListItem
                    button
                    onClick={() => setAdminAnchorEl(adminAnchorEl ? null : document.getElementById('mobile-admin'))}
                    id="mobile-admin"
                    sx={{ 
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': { bgcolor: alpha(theme.palette.primary.light, 0.1) }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <AdminPanelSettingsIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Admin" 
                      slotProps={{ fontWeight: 500 }}
                    />
                    <KeyboardArrowDownIcon 
                      sx={{ 
                        transform: adminAnchorEl ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s'
                      }} 
                    />
                  </ListItem>
                  
                  {Boolean(adminAnchorEl) && (
                    <Box sx={{ ml: 2, mb: 1 }}>
                      <ListItem 
                        button 
                        component={Link} 
                        to="/manage/users" 
                        onClick={toggleMobileDrawer}
                        sx={{ 
                          pl: 5,
                          borderRadius: 1,
                          mb: 0.5,
                          '&:hover': { bgcolor: alpha(theme.palette.primary.light, 0.1) }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <PeopleAltIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Manage Users"
                          slotProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                      
                      <ListItem 
                        button 
                        component={Link} 
                        to="/manage/categories" 
                        onClick={toggleMobileDrawer}
                        sx={{ 
                          pl: 5,
                          borderRadius: 1,
                          mb: 0.5,
                          '&:hover': { bgcolor: alpha(theme.palette.primary.light, 0.1) }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <CategoryIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Manage Categories"
                          slotProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                      
                      <ListItem 
                        button 
                        component={Link} 
                        to="/manage/products" 
                        onClick={toggleMobileDrawer}
                        sx={{ 
                          pl: 5,
                          borderRadius: 1,
                          mb: 0.5,
                          '&:hover': { bgcolor: alpha(theme.palette.primary.light, 0.1) }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <InventoryIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Manage Products"
                          slotProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                      
                      <ListItem 
                        button 
                        component={Link} 
                        to="/orders/all" 
                        onClick={toggleMobileDrawer}
                        sx={{ 
                          pl: 5,
                          borderRadius: 1,
                          mb: 0.5,
                          '&:hover': { bgcolor: alpha(theme.palette.primary.light, 0.1) }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <ReceiptIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Manage Orders"
                          slotProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                      
                      <ListItem 
                        button 
                        component={Link} 
                        to="/manage/payments" 
                        onClick={toggleMobileDrawer}
                        sx={{ 
                          pl: 5,
                          borderRadius: 1,
                          mb: 0.5,
                          '&:hover': { bgcolor: alpha(theme.palette.primary.light, 0.1) }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <PaymentIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Manage Payments"
                          slotProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                      
                      <ListItem 
                        button 
                        component={Link} 
                        to="/reviews/all" 
                        onClick={toggleMobileDrawer}
                        sx={{ 
                          pl: 5,
                          borderRadius: 1,
                          mb: 0.5,
                          '&:hover': { bgcolor: alpha(theme.palette.primary.light, 0.1) }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <RateReviewIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Manage Reviews"
                          slotProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    </Box>
                  )}
                </>
              )}
              
              <Divider sx={{ my: 1.5 }} />
              
              <ListItem 
                button 
                onClick={handleLogout}
                sx={{ 
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': { bgcolor: alpha(theme.palette.error.light, 0.1) }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LogoutIcon color="error" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Logout" 
                  sx={{ color: 'error.main' }}
                  slotProps={{ fontWeight: 500 }}
                />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem 
                button 
                component={Link} 
                to="/login" 
                onClick={toggleMobileDrawer}
                sx={{ 
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': { bgcolor: alpha(theme.palette.primary.light, 0.1) }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <PersonIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Login" 
                  slotProps={{ fontWeight: 500 }}
                />
              </ListItem>
              
              <ListItem 
                button 
                component={Link} 
                to="/register" 
                onClick={toggleMobileDrawer}
                sx={{ 
                  borderRadius: 1,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': { 
                    bgcolor: 'primary.dark'
                  }
                }}
              >
                <ListItemText 
                  primary="Register" 
                  sx={{ textAlign: 'center' }}
                  slotProps={{ fontWeight: 500 }}
                />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="static" 
        color="transparent" 
        elevation={0} 
        sx={{ 
          borderBottom: '1px solid', 
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar 
            disableGutters
            sx={{ 
              height: 70, 
              justifyContent: 'space-between'
            }}
          >
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                textDecoration: 'none',
                letterSpacing: 0.5,
                flexGrow: { xs: 1, md: 0 }
              }}
            >
              JM Premium
            </Typography>
            
            {!isMobile && (
              <>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    onClick={handleCategoryMenuOpen}
                    sx={{ 
                      my: 2, 
                      color: 'text.primary', 
                      display: 'flex', 
                      alignItems: 'center',
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: 'transparent',
                        color: 'primary.main'
                      }
                    }}
                    disableRipple
                  >
                    Shop
                  </Button>
                  {categoryMenu}
                </Box>
                
                <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
                  <Cart/>
                  {user ? (
                    <>
                      <IconButton
                        size="large"
                        onClick={handleAccountMenuOpen}
                        color="inherit"
                        sx={{ 
                          ml: 1.5,
                          border: isAccountMenuOpen ? '2px solid' : '1px solid',
                          borderColor: isAccountMenuOpen ? 'primary.main' : 'divider',
                          p: '6px',
                          transition: 'all 0.2s'
                        }}
                      >
                        {user.name ? (
                          <Avatar 
                            sx={{ 
                              width: 30, 
                              height: 30,
                              bgcolor: isAccountMenuOpen ? 'primary.main' : alpha(theme.palette.primary.main, 0.7),
                              fontSize: '0.875rem',
                              fontWeight: 500
                            }}
                          >
                            {user.name.charAt(0)}
                          </Avatar>
                        ) : (
                          <AccountCircleIcon 
                            sx={{ 
                              color: isAccountMenuOpen ? 'primary.main' : 'text.primary'
                            }} 
                          />
                        )}
                      </IconButton>
                      {accountMenu}
                      
                      {user.is_admin && (
                        <>
                          <Button
                            onClick={handleAdminMenuOpen}
                            sx={{ 
                              ml: 2, 
                              color: isAdminMenuOpen ? 'primary.main' : 'text.primary',
                              textTransform: 'none',
                              fontSize: '0.95rem',
                              fontWeight: 500,
                              borderRadius: 2,
                              px: 2,
                              py: 0.7,
                              border: '1px solid',
                              borderColor: isAdminMenuOpen ? 'primary.main' : 'divider',
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                borderColor: 'primary.main'
                              }
                            }}
                            startIcon={<AdminPanelSettingsIcon />}
                            endIcon={
                              <KeyboardArrowDownIcon 
                                sx={{ 
                                  transition: 'transform 0.3s',
                                  transform: isAdminMenuOpen ? 'rotate(180deg)' : 'rotate(0)'
                                }} 
                              />
                            }
                          >
                            Admin
                          </Button>
                          {adminMenu}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Button 
                        component={Link} 
                        to="/login" 
                        sx={{ 
                          ml: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                          fontSize: '0.95rem',
                          color: 'text.primary',
                          '&:hover': {
                            color: 'primary.main',
                            bgcolor: 'transparent'
                          }
                        }}
                        disableRipple
                      >
                        Login
                      </Button>
                      <Button 
                        component={Link} 
                        to="/register" 
                        variant="contained" 
                        sx={{ 
                          ml: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                          fontSize: '0.95rem',
                          boxShadow: 'none',
                          '&:hover': {
                            boxShadow: 'none',
                            bgcolor: 'primary.main'
                          }
                        }}
                      >
                        Register
                      </Button>
                    </>
                  )}
                </Box>
              </>
            )}
            
            {isMobile && (
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleMobileDrawer}
                sx={{ 
                  border: '1px solid',
                  borderColor: 'divider',
                  p: '8px'
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      {mobileDrawer}
    </>
  );
};

export default Navbar;
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect, useRef } from 'react';
import { CircularProgress, ListItemIcon, alpha, AppBar, Box, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Container, Drawer, List, ListItem, ListItemText, Divider, Avatar, useMediaQuery, useTheme } from '@mui/material';
import { Store as StoreIcon, LocalMall as LocalMallIcon, Menu as MenuIcon, AccountCircle as AccountCircleIcon, KeyboardArrowDown as KeyboardArrowDownIcon, Close as CloseIcon, Person as PersonIcon, ShoppingBag as ShoppingBagIcon, Star as StarIcon, AdminPanelSettings as AdminPanelSettingsIcon, Logout as LogoutIcon, Category as CategoryIcon, Inventory as InventoryIcon, PeopleAlt as PeopleAltIcon, Receipt as ReceiptIcon, Payment as PaymentIcon, RateReview as RateReviewIcon, Home as HomeIcon } from '@mui/icons-material';

import Cart from '../views/Cart'; 
import { persistor } from '../store';
import { logout } from '../slices/userSlice';
import { getCategoryTree } from '../slices/categorySlice';

const listItemHoverStyle = {
  '&:hover': {
    bgcolor: 'primary.main',
    '& .MuiTypography-root': {
      color: 'common.white',
    },
    '& .MuiListItemIcon-root, & .MuiSvgIcon-root': {
      color: 'common.white',
    },
    borderRadius: 2,
  },
};

const Navbar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user } = useSelector((state) => state.user);
  const { categoryTree } = useSelector((state) => state.category);
  
  const [menus, setMenus] = useState({
    admin: null,
    account: null,
    category: null,
    mobileDrawer: false,
    mobileCategories: null,
    mobileAdmin: null
  });

  const hoverTimeoutRef = useRef(null);
  const categoryButtonRef = useRef(null);

  const handleCategoryMouseEnter = () => {
    clearTimeout(hoverTimeoutRef.current);
    setMenus({ ...menus, category: categoryButtonRef.current });
  };

  const handleCategoryMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setMenus({ ...menus, category: null });
    }, 200);
  };

  useEffect(() => {
    dispatch(getCategoryTree());
  }, [dispatch]); 

  const isMenuOpen = {
    admin: Boolean(menus.admin),
    account: Boolean(menus.account),
    category: Boolean(menus.category)
  };

  const handleMenuOpen = (menuName) => (e) => {
    if (menuName === 'category' && categoryTree.length === 0) {
      dispatch(getCategoryTree());
    }
    setMenus({ ...menus, [menuName]: e.currentTarget });
  };

  const handleMenuClose = (menuName) => () => {
    setMenus({ ...menus, [menuName]: null });
  };

  const toggleMobileDrawer = () => {
    if (categoryTree.length === 0) {
      dispatch(getCategoryTree());
    }
    setMenus({ ...menus, mobileDrawer: !menus.mobileDrawer });
  };

  const handleLogout = async () => {
    await persistor.purge();
    dispatch(logout());
    handleMenuClose('account')();
    navigate('/login');
  };

  const adminMenuItems = [
    { icon: <PeopleAltIcon fontSize="small" color="primary" />, text: "Manage Users", path: "/manage/users" },
    { icon: <CategoryIcon fontSize="small" color="primary" />, text: "Manage Categories", path: "/manage/categories" },
    { icon: <InventoryIcon fontSize="small" color="primary" />, text: "Manage Products", path: "/manage/products" },
    { icon: <ReceiptIcon fontSize="small" color="primary" />, text: "Manage Orders", path: "/orders/all" },
    { icon: <PaymentIcon fontSize="small" color="primary" />, text: "Manage Payments", path: "/manage/payments" },
    { icon: <RateReviewIcon fontSize="small" color="primary" />, text: "Manage Reviews", path: "/reviews/all" }
  ];

  const adminMenu = (
    <Menu anchorEl={menus.admin} open={isMenuOpen.admin} onClose={handleMenuClose('admin')}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      slotProps={{
        paper: {
          sx: { 
            minWidth: '180px', 
            p: 1, 
            borderRadius: 2 
          },
        }
      }}
    >
      {adminMenuItems.map((item) => (
        <MenuItem key={item.path} component={Link} to={item.path} onClick={handleMenuClose('admin')} sx={{ ...listItemHoverStyle, m: 0.5 }}>
          <ListItemIcon>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.text} />
        </MenuItem>
      ))}
    </Menu>
  );

  const accountMenu = (
    <Menu
      anchorEl={menus.account}
      open={isMenuOpen.account}
      onClose={handleMenuClose('account')}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      slotProps={{
        paper: {
          sx: { 
            minWidth: '180px', 
            p: 1, 
            borderRadius: 2 
          },
        }
      }}
    >
      <MenuItem component={Link} to="/profile" onClick={handleMenuClose('account')} sx={{ ...listItemHoverStyle }}>
        <ListItemIcon>
          <PersonIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </MenuItem>
      <MenuItem component={Link} to={`/orders/all/${user?.id}`} onClick={handleMenuClose('account')} sx={{ ...listItemHoverStyle }}>
        <ListItemIcon>
          <LocalMallIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </MenuItem>
      <MenuItem component={Link} to={`/reviews/all/${user?.id}`} onClick={handleMenuClose('account')} sx={{ ...listItemHoverStyle }}>
        <ListItemIcon>
          <StarIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText primary="Reviews" />
      </MenuItem>
      <Divider/>
      <MenuItem onClick={handleLogout} 
      sx={{ 
        '&:hover': { bgcolor: alpha(theme.palette.error.light, 0.1), borderRadius: 2 }
      }}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText primary="Logout" sx={{ color: 'error.main' }}  />
      </MenuItem>
    </Menu>
  );

  const categoryMenu = (
    <Menu 
      anchorEl={menus.category} 
      open={Boolean(menus.category)} 
      onClose={handleMenuClose('category')}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transitionDuration={250}
      elevation={3}
      slotProps={{
        list: {
          onMouseEnter: handleCategoryMouseEnter,
          onMouseLeave: handleCategoryMouseLeave,
        },
        paper: {
          sx: { 
            minWidth: '450px',
            borderRadius: 1,
            m: 0.5,
            boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
            '& .MuiList-root': {
              padding: 0
            },
          },
          onMouseEnter: handleCategoryMouseEnter,
          onMouseLeave: handleCategoryMouseLeave,
        }
      }}
    >
      <Box sx={{ maxHeight: '600px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
        {categoryTree.length > 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'row',
            p: 1
          }}>
            {categoryTree.map((category) => (
              <Box 
                key={category.id} 
                sx={{ 
                  flex: 1,
                  borderRight: category.id !== categoryTree[categoryTree.length-1].id ? 
                    `1px solid ${theme.palette.divider}` : 'none',
                  px: 1
                }}
              >
                <MenuItem 
                  component={Link} 
                  to={`/categories/${category?.slug}`} 
                  onClick={handleMenuClose('category')}
                  sx={{ 
                    py: 1.2,
                    pl: 2,
                    mb: 1,
                    borderRadius: 2,
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText,
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {category.name}
                  </Typography>
                </MenuItem>
                {category.subcategories && category.subcategories.length > 0 && (
                  <Box sx={{ ml: 1 }}>
                    {category.subcategories.map(subcategory => (
                      <MenuItem 
                        key={subcategory.id}
                        component={Link} 
                        to={`/categories/${subcategory?.slug}`} 
                        onClick={handleMenuClose('category')}
                        sx={{ 
                          py: 0.8,
                          pl: 2,
                          mb: 0.5,
                          borderRadius: 2,
                          fontSize: '0.85rem',
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.light, 0.2),
                            color: theme.palette.primary.main,
                            '& .subcategory-text': {
                              fontWeight: 700
                            }
                          }
                        }}
                      >
                        <Typography className="subcategory-text"  variant="body2">
                          {subcategory.name}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        ) : (
          <MenuItem disabled sx={{ py: 3, justifyContent: 'center' }}>
            <CircularProgress size={20} sx={{ mr: 1.5, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Loading categories...
            </Typography>
          </MenuItem>
        )}
      </Box>
      <Divider />
      <MenuItem 
        component={Link} 
        to="/shop" 
        onClick={handleMenuClose('category')}
        sx={{ 
          py: 1.5,
          justifyContent: 'center',
          transition: 'all 0.15s ease',
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
          }
        }}
      >
        <StoreIcon fontSize="small" />
        <Typography variant="body2" sx={{ fontWeight: 600, ml: 1 }}>
          Browse All Categories
        </Typography>
      </MenuItem>
    </Menu>
  );

  const mobileDrawer = (
    <Drawer anchor="right" open={menus.mobileDrawer} onClose={toggleMobileDrawer}
      slotProps = {{
        paper: {
          sx: {
            width: 280,
            bgcolor: 'common.white',   
          }
        }
      }}
    >
      <Box role="presentation" sx={{ 
          width: '100%', 
          py: 2, 
          display: 'flex', 
          flexDirection: 'column'
        }} 
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, mb: 1 }}>
          <Typography variant="h6" color="secondary" sx={{ fontWeight: 600 }}>
            {user?.first_name ? `Hey, ${user.first_name}!` : 'Hey there!'}
          </Typography>
          <IconButton 
            onClick={toggleMobileDrawer} 
            sx={{ color: 'text.primary' }}
            aria-label="Close menu"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <List sx={{ px: 1 }}>
          <ListItem button component={Link} to="/" onClick={toggleMobileDrawer} sx={{ ...listItemHoverStyle, color: 'inherit', textDecoration: 'none', }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <HomeIcon color="secondary" />
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography color="secondary" fontWeight="bold">
                  Home
                </Typography>
              }
            />
          </ListItem>
          <ListItem id="mobile-categories" button 
            onClick={() => {
              if (categoryTree.length === 0) {
                dispatch(getCategoryTree());
              }
              const newState = menus.mobileCategories ? null : document.getElementById('mobile-categories');
              setMenus({ ...menus, mobileCategories: newState });
            }}
            aria-expanded={Boolean(menus.mobileCategories)}
            aria-controls="category-menu"
            sx = {{ ...listItemHoverStyle, }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <StoreIcon color="secondary" />
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography color="secondary" fontWeight="bold">
                  Shop
                </Typography>
              }
            />
            <KeyboardArrowDownIcon 
              sx={{ 
                transform: menus.mobileCategories ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.3s'
              }} 
            />
          </ListItem>
          {Boolean(menus.mobileCategories) && (
            <Box sx={{ ml: 2, mb: 1 }} id="category-menu">
              {categoryTree.length > 0 ? (
                categoryTree.map((category) => (
                  <React.Fragment key={category.id}>
                    <ListItem 
                      button 
                      component={Link} 
                      to={`/categories/${category?.slug}`} 
                      onClick={toggleMobileDrawer}
                      sx={{ 
                        color: 'inherit', 
                        textDecoration: 'none',
                        pl: 5,
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        ...listItemHoverStyle,
                      }}
                    >
                      <ListItemText 
                        primary={
                          <Typography variant="body2" color="secondary" fontWeight="bold">
                            {category.name}
                          </Typography>
                        }
                        sx={{ my: 0 }}
                      />
                    </ListItem>
                    {category.children && category.children.length > 0 && (
                      category.children.map(child => (
                        <ListItem 
                          button 
                          key={child.id} 
                          component={Link} 
                          to={`/categories/${child?.slug}`} 
                          onClick={toggleMobileDrawer}
                          sx={{ 
                            color: 'inherit', 
                            textDecoration: 'none',
                            pl: 7,
                            ...listItemHoverStyle,
                          }}
                        >
                          <ListItemText 
                            primary={
                              <Typography variant="body2" color="secondary">
                                {child.name}
                              </Typography>
                            }
                            sx={{ my: 0 }}
                          />
                        </ListItem>
                      ))
                    )}
                  </React.Fragment>
                ))
              ) : (
                <ListItem
                  sx={{
                    pl: 5,
                    py: 1.5,
                    bgcolor: 'grey.100',
                    borderRadius: 2,
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        color="grey.500"
                        fontStyle="italic"
                        fontWeight={500}
                      >
                        Loading categories...
                      </Typography>
                    }
                    disableTypography
                  />
                </ListItem>
              )}
            </Box>
          )}
          {user ? (
            <>
              <Divider sx={{ my: 2 }} />
              <ListItem button component={Link} to="/profile" onClick={toggleMobileDrawer} sx={{ ...listItemHoverStyle, color: 'inherit', textDecoration: 'none' }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <PersonIcon color="secondary" />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography color="secondary" fontWeight="bold">
                      Profile
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem button component={Link} to={`/orders/all/${user.id}`}  onClick={toggleMobileDrawer} sx={{ ...listItemHoverStyle, color: 'inherit', textDecoration: 'none' }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <ShoppingBagIcon color="secondary" />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography color="secondary" fontWeight="bold">
                      Orders
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem button component={Link} to={`/reviews/all/${user.id}`}  onClick={toggleMobileDrawer} sx={{ ...listItemHoverStyle, color: 'inherit', textDecoration: 'none' }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <StarIcon color="secondary" />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography color="secondary" fontWeight="bold">
                      Reviews
                    </Typography>
                  }
                />
              </ListItem>
              {user.is_admin && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <ListItem id="mobile-admin" button 
                    onClick={() => {
                      const newState = menus.mobileAdmin ? null : document.getElementById('mobile-admin');
                      setMenus({ ...menus, mobileAdmin: newState });
                    }}
                    aria-expanded={Boolean(menus.mobileAdmin)}
                    aria-controls="admin-menu"
                    sx={{ ...listItemHoverStyle, }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <AdminPanelSettingsIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography color="secondary" fontWeight="bold">
                          Admin
                        </Typography>
                      }
                    />
                    <KeyboardArrowDownIcon 
                      sx={{ 
                        transform: menus.mobileAdmin ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s'
                      }} 
                    />
                  </ListItem>
                  {Boolean(menus.mobileAdmin) && (
                    <Box sx={{ ml: 2, mb: 1 }} id="admin-menu">
                      {adminMenuItems.map((item) => (
                        <ListItem 
                          button 
                          key={item.path} 
                          component={Link} 
                          to={item.path} 
                          onClick={toggleMobileDrawer}
                          sx={{ 
                            color: 'inherit', 
                            textDecoration: 'none',
                            pl: 5,
                            ...listItemHoverStyle,
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {React.cloneElement(item.icon, { color: "secondary" })}
                          </ListItemIcon>
                          <ListItemText 
                            primary={
                              <Typography variant="body2" color="secondary" fontWeight="bold">
                                {item.text}
                              </Typography>
                            }
                            sx={{ my: 0 }}
                          />
                        </ListItem>
                      ))}
                    </Box>
                  )}
                </>
              )}
              <Divider sx={{ my: 2 }} />
              <ListItem 
                button 
                onClick={handleLogout}
                sx={{ 
                  '&:hover': { bgcolor: alpha(theme.palette.error.light, 0.1), borderRadius: 2 }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LogoutIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography color="error.main">
                      Logout
                    </Typography>
                  }
                />
              </ListItem>
            </>
          ) : (
            <Box sx={{ my: 2 }}>
              <ListItem  onClick={toggleMobileDrawer}>
                <Button 
                  fullWidth
                  component={Link} 
                  to="/login" 
                  variant="outlined"
                  color="secondary"
                >
                  Sign In
                </Button>
              </ListItem>
              <ListItem onClick={toggleMobileDrawer}>
                <Button 
                  fullWidth
                  component={Link} 
                  to="/register" 
                  variant="contained" 
                >
                  Join Now
                </Button>
              </ListItem>
            </Box>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{
          px: 3,
          borderBottom: '2px solid', 
          borderColor: 'common.black',
          backgroundColor: 'common.white',
          color: 'common.black',
        }}
      >
        <Toolbar disableGutters sx={{ height: 50, px: 2 }}>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            {isMobile ? (
              <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <Box
                  component="img"
                  src="/jm-black-logo.png"
                  alt="JM Premium Logo"
                  sx={{
                    height: { xs: 25, md: 40 },
                    mr: 1,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: 'common.black',
                    textDecoration: 'none',
                  }}
                >
                  JM Premium
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onMouseEnter={handleCategoryMouseEnter}
                onMouseLeave={handleCategoryMouseLeave}
                onClick={() => {
                  navigate('/shop');
                }}
              >
                <Button
                  ref={categoryButtonRef}
                  sx={{
                    color: isMenuOpen.category ? 'primary.main' : 'text.primary',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: 'primary.main',
                    },
                  }}
                  disableRipple
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen.category}
                >
                  Shop
                </Button>
                {categoryMenu}
              </Box>
            )}
          </Box>

          {!isMobile && (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                component={Link}
                to="/"
                sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
              >
                <Box
                  component="img"
                  src="/jm-black-logo.png"
                  alt="JM Premium Logo"
                  sx={{
                    height: { xs: 25, md: 40 },
                    mr: 1.5,
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: 'common.black',
                    textDecoration: 'none',
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                  }}
                >
                  JM Premium
                </Typography>
              </Box>
            </Box>
          )}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            {isMobile ? (
              <>
                <Cart />
                <IconButton size="large" edge="end" color="inherit" onClick={toggleMobileDrawer}>
                  <MenuIcon />
                </IconButton>
              </>
            ) : (
              <>
                <Cart />
                {user ? (
                  <>
                    <IconButton
                      size="large"
                      onClick={handleMenuOpen('account')}
                      color="inherit"
                      sx={{ p: 1 }}
                    >
                      <AccountCircleIcon
                        sx={{
                          color: isMenuOpen.account ? 'primary.main' : 'text.primary',
                        }}
                      />
                    </IconButton>
                    {accountMenu}
                    {user.is_admin && (
                      <>
                        <IconButton
                          size="large"
                          onClick={handleMenuOpen('admin')}
                          color="inherit"
                          sx={{ p: 1 }}
                        >
                          <AdminPanelSettingsIcon
                            sx={{
                              color: isMenuOpen.admin ? 'primary.main' : 'text.primary',
                            }}
                          />
                        </IconButton>
                        {adminMenu}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Button component={Link} to="/login" variant="outlined" color="secondary" sx={{ mx: 1 }}>
                      Sign In
                    </Button>
                    <Button component={Link} to="/register" variant="contained">
                      Join Now
                    </Button>
                  </>
                )}
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {mobileDrawer}
    </>
  );
};

export default Navbar;
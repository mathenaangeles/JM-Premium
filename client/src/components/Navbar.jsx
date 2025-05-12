import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ListItemIcon, alpha, AppBar, Box, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Container, Drawer, List, ListItem, ListItemText, Divider, Avatar, useMediaQuery, useTheme } from '@mui/material';
import { LocalMall as LocalMallIcon, Menu as MenuIcon, AccountCircle as AccountCircleIcon, KeyboardArrowDown as KeyboardArrowDownIcon, Close as CloseIcon, Person as PersonIcon, ShoppingBag as ShoppingBagIcon, Star as StarIcon, AdminPanelSettings as AdminPanelSettingsIcon, Logout as LogoutIcon, Category as CategoryIcon, Inventory as InventoryIcon, PeopleAlt as PeopleAltIcon, Receipt as ReceiptIcon, Payment as PaymentIcon, RateReview as RateReviewIcon, Home as HomeIcon } from '@mui/icons-material';

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
  
  const [menus, setMenus] = useState({
    admin: null,
    account: null,
    category: null,
    mobileDrawer: false
  });

  const isMenuOpen = {
    admin: Boolean(menus.admin),
    account: Boolean(menus.account),
    category: Boolean(menus.category)
  };

  const handleMenuOpen = (menuName) => (event) => {
    setMenus({ ...menus, [menuName]: event.currentTarget });
  };

  const handleMenuClose = (menuName) => () => {
    setMenus({ ...menus, [menuName]: null });
  };

  const toggleMobileDrawer = () => {
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
    >
      {adminMenuItems.map((item) => (
        <MenuItem key={item.path} component={Link} to={item.path} onClick={handleMenuClose('admin')}>
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
          sx: { minWidth: '150px' },
        }
      }}
    >
      <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center'}}>
        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
          {user?.first_name ? (<>Hey, {user.first_name}!</>) : (<>Your Account</>)}
        </Typography>
      </Box>    
      <Divider sx={{ my: 1 }}/>  
      <MenuItem component={Link} to="/profile" onClick={handleMenuClose('account')}>
        <ListItemIcon>
          <PersonIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </MenuItem>
      <MenuItem component={Link} to={`/orders/all/${user?.id}`} onClick={handleMenuClose('account')}>
        <ListItemIcon>
          <LocalMallIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </MenuItem>
      <MenuItem component={Link} to={`/reviews/all/${user?.id}`} onClick={handleMenuClose('account')}>
        <ListItemIcon>
          <StarIcon fontSize="small" color="primary" />
        </ListItemIcon>
        <ListItemText primary="Reviews" />
      </MenuItem>
      <Divider/>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
      </MenuItem>
    </Menu>
  );

  // Categories menu with dynamic content
  const categoryMenu = (
    <Menu
      anchorEl={menus.category}
      open={isMenuOpen.category}
      onClose={handleMenuClose('category')}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      {categories.map((category) => (
        <MenuItem 
          key={category.id} 
          component={Link} 
          to={`/categories/${category?.slug}`} 
          onClick={handleMenuClose('category')}
        >
          {category.name}
        </MenuItem>
      ))}
    </Menu>
  );

  // Mobile drawer with responsive navigation
  const mobileDrawer = (
    <Drawer
      anchor="right"
      open={menus.mobileDrawer}
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
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>JM Premium</Typography>
          <IconButton 
            onClick={toggleMobileDrawer} 
            sx={{ color: 'text.primary' }}
            aria-label="Close menu"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* User profile card if logged in */}
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 2, mb: 1, bgcolor: alpha(theme.palette.primary.light, 0.08) }}>
            <Avatar 
              sx={{ 
                mr: 2, 
                bgcolor: 'primary.main',
                width: 40,
                height: 40
              }}
              aria-label={user.name}
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
        
        {/* Navigation links */}
        <List sx={{ px: 1 }}>
          {/* Home link */}
          <ListItem 
            button 
            component={Link} 
            to="/" 
            onClick={toggleMobileDrawer}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <HomeIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Home" 
              slotProps={{ fontWeight: 500 }}
            />
          </ListItem>
          
          {/* Shop with categories dropdown */}
          <ListItem 
            button 
            onClick={() => {
              const newState = menus.mobileCategories ? null : document.getElementById('mobile-categories');
              setMenus({ ...menus, mobileCategories: newState });
            }}
            id="mobile-categories"
            aria-expanded={Boolean(menus.mobileCategories)}
            aria-controls="category-menu"
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
                transform: menus.mobileCategories ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.3s'
              }} 
            />
          </ListItem>
          
          {/* Category items when expanded */}
          {Boolean(menus.mobileCategories) && (
            <Box sx={{ ml: 2, mb: 1 }} id="category-menu">
              {categories.map((category) => (
                <ListItem 
                  button 
                  key={category.id} 
                  component={Link} 
                  to={`/categories/${category?.slug}`} 
                  onClick={toggleMobileDrawer}
                  sx={{ 
                    pl: 5,
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
          
          {/* User section */}
          {user ? (
            <>
              {/* User navigation items */}
              <ListItem 
                button 
                component={Link} 
                to="/profile" 
                onClick={toggleMobileDrawer}
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
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <StarIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Reviews" 
                  slotProps={{ fontWeight: 500 }}
                />
              </ListItem>
              
              {/* Admin section if user is admin */}
              {user.is_admin && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <ListItem
                    button
                    onClick={() => {
                      const newState = menus.mobileAdmin ? null : document.getElementById('mobile-admin');
                      setMenus({ ...menus, mobileAdmin: newState });
                    }}
                    id="mobile-admin"
                    aria-expanded={Boolean(menus.mobileAdmin)}
                    aria-controls="admin-menu"
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
                        transform: menus.mobileAdmin ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.3s'
                      }} 
                    />
                  </ListItem>
                  
                  {/* Admin menu items when expanded */}
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
                            pl: 5,
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {React.cloneElement(item.icon, { fontSize: "small" })}
                          </ListItemIcon>
                          <ListItemText 
                            primary={item.text}
                            slotProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </Box>
                  )}
                </>
              )}
              
              <Divider sx={{ my: 1.5 }} />
              
              {/* Logout button */}
              <ListItem 
                button 
                onClick={handleLogout}
                sx={{ 
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
              {/* Authentication options when not logged in */}
              <ListItem 
                button 
                component={Link} 
                to="/login" 
                onClick={toggleMobileDrawer}
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
        position="sticky" 
        elevation={0} 
        sx={{
          px: 3,
          py: 0.5,
          borderBottom: '2px solid', 
          borderColor: 'primary.main',
          backgroundColor: 'common.white',
          color: 'common.black',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar disableGutters sx={{ height: { xs: 50, md: 60 }, justifyContent: 'space-between' }} >
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Box component="img" src="/jm-black-logo.png" alt="JM Premium Logo"
              sx={{
                height: { xs: 32, md: 40 },
                mr: 1.5,
              }}
            />
            <Typography variant="h5"
              sx={{
                fontWeight: 600,
                color: 'common.black',
                textDecoration: 'none',
                fontSize: { xs: '1.2rem', md: '1.5rem' }
              }}
            >
              JM Premium
            </Typography>
          </Box>
          {!isMobile && (
            <>
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                <Button
                  onClick={handleMenuOpen('category')}
                  sx={{ 
                    my: 2, 
                    color: isMenuOpen.category ? 'primary.main' : 'text.primary', 
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
                  endIcon={
                    <KeyboardArrowDownIcon 
                      sx={{ 
                        transition: 'transform 0.3s',
                        transform: isMenuOpen.category ? 'rotate(180deg)' : 'rotate(0)'
                      }} 
                    />
                  }
                  disableRipple
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen.category}
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
                      onClick={handleMenuOpen('account')}
                      color="inherit"
                      sx={{ 
                        borderColor: isMenuOpen.account ? 'primary.main' : 'primary.main',
                        p: 1,
                      }}
                      aria-label="account menu"
                      aria-haspopup="true"
                      aria-expanded={isMenuOpen.account}
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
                            sx={{ 
                              borderColor: isMenuOpen.admin ? 'primary.main' : 'primary.main',
                              p: 1,
                            }}
                            aria-label="admin menu"
                            aria-haspopup="true"
                            aria-expanded={isMenuOpen.admin}
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
                    <Button 
                      component={Link} 
                      to="/login" 
                      variant="outlined"
                      color="secondary"
                      sx={{ mx: 1 }}
                    >
                      Sign In
                    </Button>
                    <Button 
                      component={Link} 
                      to="/register" 
                      variant="contained" 
                    >
                      Join Now
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}
          
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="Open menu"
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
      </AppBar>
      {mobileDrawer}
    </>
  );
};

export default Navbar;
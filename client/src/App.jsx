import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LinearProgress } from '@mui/material';
import { Route, Routes, useLocation } from 'react-router-dom';

import Home from './views/Home';
import Shop from './views/Shop';
import Login from './views/user/Login';
import Profile from './views/user/Profile';
import Register from './views/user/Register';
import UserList from './views/user/UserList';
import Checkout from './views/order/Checkout';
import RefundPolicy from './views/RefundPolicy';
import OrderList from './views/order/OrderList';
import PrivacyPolicy from './views/PrivacyPolicy';
import ReviewList from './views/review/ReviewList';
import TermsOfService from './views/TermsOfService';
import OrderDetails from './views/order/OrderDetail';
import ProductForm from './views/product/ProductForm';
import ProductList from './views/product/ProductList';
import PaymentList from './views/payment/PaymentList';
import CategoryForm from './views/category/CategoryForm';
import CategoryList from './views/category/CategoryList';
import ProductDetail from './views/product/ProductDetail';
import PaymentDetail from './views/payment/PaymentDetail';
import CategoryDetail from './views/category/CategoryDetail';

import Navbar from './components/Navbar';
import NotFound from './components/NotFound';
import AdminRoute from './components/AdminRouter';
import PrivateRoute from './components/PrivateRouter';
import AnnouncementBar from './components/AnnouncementBar';

function App() {
  const loading = useSelector((state) =>
    state.user.loading
  );
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location]);

  return (
    <div className="App">
      <AnnouncementBar 
        message="Free Shipping on all Philippine Domestic Orders"
      />
      <Navbar/>
      {loading && <LinearProgress />}
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          <Route path="/shop" element={<Shop/>}/>
          <Route path="/checkout" element={<Checkout/>}/>
          <Route path="/orders/:orderId?" element={<OrderDetails/>}/>
          <Route path="/products/:productSlug" element={<ProductDetail />}/>
          <Route path="/categories/:categorySlug" element={<CategoryDetail />}/>

          <Route path="/orders/all/:userId?" element={<PrivateRoute><OrderList/></PrivateRoute>}/>
          <Route path="/reviews/all/:userId?" element={<PrivateRoute><ReviewList/></PrivateRoute>}/>

          <Route path="/manage/users" element={<AdminRoute><UserList /></AdminRoute>} />
          <Route path="/manage/payments" element={<AdminRoute><PaymentList /></AdminRoute>} />
          <Route path="/manage/products" element={<AdminRoute><ProductList /></AdminRoute>} />
          <Route path="/manage/categories" element={<AdminRoute><CategoryList /></AdminRoute>} />
          <Route path="/manage/payments/:paymentId" element={<AdminRoute><PaymentDetail /></AdminRoute>} />
          <Route path="/manage/products/form/:productId?" element={<AdminRoute><ProductForm /></AdminRoute>} />
          <Route path="/manage/categories/form/:categoryId?" element={<AdminRoute><CategoryForm /></AdminRoute>} />

          <Route path="/refund-and-returns-policy" element={<RefundPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />

          
          <Route path="*" element={<NotFound/>}/>
      </Routes>
    </div>
  );
}

export default App;
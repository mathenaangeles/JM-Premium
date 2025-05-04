import { useSelector } from 'react-redux';
import { LinearProgress } from '@mui/material';
import { Route, Routes } from 'react-router-dom';

import Home from './views/Home';
import Shop from './views/Shop';
import Login from './views/user/Login';
import Profile from './views/user/Profile';
import Register from './views/user/Register';
import UserList from './views/user/UserList';
import Checkout from './views/order/Checkout';
import OrderList from './views/order/OrderList';
import ReviewList from './views/review/ReviewList';
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
import ReviewDetail from './views/review/ReviewDetail';

function App() {
  const loading = useSelector((state) =>
    state.user.loading
  );

  return (
    <div className="App">
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
          <Route path="/products/:slug" element={<ProductDetail />}/>
          <Route path="/categories/:slug" element={<CategoryDetail />}/>

          <Route path="/orders/all/:userId?" element={<PrivateRoute><OrderList/></PrivateRoute>}/>
          <Route path="/reviews/all/:userId?" element={<PrivateRoute><ReviewList/></PrivateRoute>}/>
          <Route path="/reviews/:reviewId?" element={<PrivateRoute><ReviewDetail /></PrivateRoute>}/>
          
          <Route path="/manage/users" element={<AdminRoute><UserList /></AdminRoute>} />
          <Route path="/manage/payments" element={<AdminRoute><PaymentList /></AdminRoute>} />
          <Route path="/manage/products" element={<AdminRoute><ProductList /></AdminRoute>} />
          <Route path="/manage/categories" element={<AdminRoute><CategoryList /></AdminRoute>} />
          <Route path="/manage/payments/:paymentId" element={<AdminRoute><PaymentDetail /></AdminRoute>} />
          <Route path="/manage/products/form/:productId?" element={<AdminRoute><ProductForm /></AdminRoute>} />
          <Route path="/manage/categories/form/:categoryId?" element={<AdminRoute><CategoryForm /></AdminRoute>} />
          
          <Route path="*" element={<NotFound/>}/>
      </Routes>
    </div>
  );
}

export default App;
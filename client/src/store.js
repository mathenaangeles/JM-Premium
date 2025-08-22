import storage from 'redux-persist/lib/storage'; 
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice'; 
import orderReducer from './slices/orderSlice';
import reviewReducer from './slices/reviewSlice';
import addressReducer from './slices/addressSlice';
import productReducer from './slices/productSlice';
import paymentReducer from './slices/paymentSlice';
import categoryReducer from './slices/categorySlice';
import authMiddleware from './middleware/authMiddleware';


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'address'],
};

const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
  order: orderReducer,
  review: reviewReducer,
  address: addressReducer,
  product: productReducer,
  payment: paymentReducer,
  category: categoryReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authMiddleware), 
  devTools: import.meta.env.MODE !== 'production',
});

export const persistor = persistStore(store);

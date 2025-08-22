import { persistor } from '../store';
import { clearAuth } from '../slices/userSlice';

const authMiddleware = (store) => (next) => (action) => {
  if (action.type.endsWith('/rejected')) {
    const error = action.payload;
    if (
      error?.toString()?.includes('401') || 
      error?.toLowerCase()?.includes('unauthorized')
    ) {
      store.dispatch(clearAuth());
      persistor.purge();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  }
  return next(action);
};

export default authMiddleware;

import React from 'react';
import { useSelector } from 'react-redux';

import NotFound from './NotFound';

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user); 
  if (!user || !user.is_admin) {
    return <NotFound/>;
  }
  return children;
};

export default AdminRoute;
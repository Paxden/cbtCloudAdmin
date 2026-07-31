/**
 * Public Route
 * Redirects authenticated users away from public pages
 */

import { Navigate } from 'react-router-dom';
import { tokenHelper } from '../utils/token'; // Fixed import

const PublicRoute = ({ children }) => {
  const isAuthenticated = tokenHelper.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
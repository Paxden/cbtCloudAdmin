import { useEffect, useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { usePermissions } from "../hooks/usePermissions";

const ProtectedRoute = ({ allowedRoles = [], requiredPermission = null }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, getCurrentUser, user } = useAuth();
  const { hasRole, hasPermission } = usePermissions();

  const hasFetched = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !user && !hasFetched.current && !isLoading) {
      hasFetched.current = true;
      getCurrentUser();
    }
  }, [isAuthenticated, user, isLoading, getCurrentUser]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return <Navigate to="/403" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

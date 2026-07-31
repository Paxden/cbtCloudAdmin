/**
 * App Button Component
 * Reusable button with loading state and permissions
 */

import { Button, CircularProgress } from "@mui/material";
import { usePermissions } from "../../../hooks/usePermissions";

const AppButton = ({
  children,
  loading = false,
  disabled = false,
  variant = "contained",
  color = "primary",
  size = "medium",
  startIcon,
  endIcon,
  fullWidth = false,
  onClick,
  type = "button",
  permission,
  role,
  sx = {},
  ...props
}) => {
  const { canAccess } = usePermissions();

  // Check permissions if required
  const hasAccess = permission || role ? canAccess({ permission, role }) : true;

  if (!hasAccess) {
    return null;
  }

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      startIcon={startIcon}
      endIcon={endIcon}
      fullWidth={fullWidth}
      onClick={onClick}
      type={type}
      sx={{
        textTransform: "none",
        fontWeight: 500,
        borderRadius: 1.5,
        ...sx,
      }}
      {...props}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : children}
    </Button>
  );
};

export default AppButton;

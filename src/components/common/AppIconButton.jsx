/* eslint-disable no-undef */
/**
 * App Icon Button Component
 * Reusable icon button with tooltip
 */

import { IconButton, Tooltip } from '@mui/material';

const AppIconButton = ({
  icon,
  tooltip,
  color = 'default',
  size = 'medium',
  onClick,
  disabled = false,
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

  const button = (
    <IconButton
      color={color}
      size={size}
      onClick={onClick}
      disabled={disabled}
      sx={sx}
      {...props}
    >
      {icon}
    </IconButton>
  );

  if (tooltip) {
    return <Tooltip title={tooltip}>{button}</Tooltip>;
  }

  return button;
};

export default AppIconButton;
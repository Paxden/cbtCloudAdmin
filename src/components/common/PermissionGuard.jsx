/**
 * Permission Guard Component
 * Conditionally renders children based on permissions
 */

import { usePermissions } from '../../hooks/usePermissions';

const PermissionGuard = ({
  children,
  permission,
  role,
  roles,
  fallback = null,
}) => {
  const { canAccess } = usePermissions();

  const hasAccess = canAccess({ permission, role, roles });

  if (!hasAccess) {
    return fallback;
  }

  return children;
};

export default PermissionGuard;
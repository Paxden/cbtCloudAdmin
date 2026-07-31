// hooks/useNavigation.js - FIXED
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  filterMenuItems,
  getBreadcrumbItems,
  getActiveMenuItem,
} from "../services/navigationService";
import { useAuth } from "./useAuth"; // ✅ Use useAuth instead of useSelector
import { MENU_ITEMS } from "../constants/navigation";

export const useNavigation = () => {
  const location = useLocation();
  const { user } = useAuth(); // ✅ This gets the user from the same source as Sidebar

  // console.log("🔍 useNavigation - user from useAuth:", user);

  const filteredMenu = useMemo(() => {
    return filterMenuItems(MENU_ITEMS, user);
  }, [user]);

  const breadcrumbs = useMemo(() => {
    return getBreadcrumbItems(location.pathname);
  }, [location.pathname]);

  const activeItem = useMemo(() => {
    return getActiveMenuItem(location.pathname);
  }, [location.pathname]);

  const isActivePath = (path) => {
    if (!path) return false;
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const isParentActive = (item) => {
    if (item.path && isActivePath(item.path)) return true;
    if (item.children) {
      return item.children.some((child) => isActivePath(child.path));
    }
    return false;
  };

  return {
    menu: filteredMenu,
    breadcrumbs,
    activeItem,
    isActivePath,
    isParentActive,
    currentPath: location.pathname,
  };
};

export default useNavigation;

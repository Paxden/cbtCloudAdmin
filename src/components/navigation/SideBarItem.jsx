/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * Sidebar Item Component
 * Individual navigation item with enhanced UX
 *
 * Key Improvements:
 * - Smooth animations and transitions
 * - Better visual feedback
 * - Tooltips for collapsed state
 * - Keyboard accessibility
 * - Professional active state (dark blue, not light)
 * - Proper contrast ratios
 * - Collapsible with animation
 */

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  Box,
  Typography,
  Tooltip,
  Badge,
  alpha,
  useTheme,
} from "@mui/material";
import { ExpandLess, ExpandMore, FiberManualRecord } from "@mui/icons-material";
import { useNavigation } from "../../hooks/useNavigation";

const SidebarItem = ({
  item,
  depth = 0,
  onClose,
  collapsed = false,
  isMobile = false,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { isActivePath, isParentActive } = useNavigation();
  const [open, setOpen] = useState(isParentActive(item));
  const [isHovering, setIsHovering] = useState(false);

  const hasChildren = item.children && item.children.length > 0;
  const isActive = isActivePath(item.path);
  const isParent = isParentActive(item);
  const isFooter = item.isFooter || false;

  // Auto-expand when active
  useEffect(() => {
    if (isParent || isActive) {
      setOpen(true);
    }
  }, [isParent, isActive]);

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    } else if (item.path) {
      navigate(item.path);
      if (onClose && isMobile) onClose();
    } else if (item.onClick) {
      item.onClick();
    }
  };

  // Get Icon component - safely
  const Icon = item.icon;

  // Determine if item should be rendered
  if (item.hidden) return null;

  // Tooltip content for collapsed mode
  const tooltipTitle = collapsed && !hasChildren ? item.title : "";

  // Render child items
  const renderChildren = () => {
    if (!hasChildren) return null;

    return (
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          {item.children.map((child) => (
            <SidebarItem
              key={child.id}
              item={child}
              depth={depth + 1}
              onClose={onClose}
              collapsed={collapsed}
              isMobile={isMobile}
            />
          ))}
        </List>
      </Collapse>
    );
  };

  // Main item render
  const renderItem = () => {
    const isSelected = isActive || (isParent && !hasChildren);

    // Base styles
    const getStyles = () => {
      const baseStyles = {
        pl: depth > 0 ? 3 + depth * 1.5 : collapsed ? 0.5 : 1.5,
        pr: collapsed ? 0.5 : 1.5,
        py: collapsed ? 1 : 0.75,
        borderRadius: 1,
        mx: collapsed ? 0.5 : 0.5,
        minHeight: collapsed ? 44 : 36,
        justifyContent: collapsed ? "center" : "flex-start",
        transition: theme.transitions.create(
          ["background-color", "color", "padding", "box-shadow"],
          {
            duration: theme.transitions.duration.shortest,
          },
        ),
        position: "relative",
      };

      // 🎯 FIXED: Professional active state - Dark blue background, white text
      if (isSelected && !isFooter) {
        return {
          ...baseStyles,
          "&.Mui-selected": {
            bgcolor: "primary.main",
            color: "white",
            "& .MuiListItemIcon-root": {
              color: "white",
            },
            "& .MuiTypography-root": {
              color: "white",
            },
            "& .MuiSvgIcon-root": {
              color: "white",
            },
          },
          "&.Mui-selected:hover": {
            bgcolor: "primary.dark",
          },
        };
      }

      // Footer items
      if (isFooter) {
        return {
          ...baseStyles,
          color: "text.secondary",
          "&:hover": {
            bgcolor: alpha(theme.palette.error.main, 0.04),
          },
          "&.logout:hover": {
            bgcolor: alpha(theme.palette.error.main, 0.08),
            color: "error.main",
            "& .MuiListItemIcon-root": {
              color: "error.main",
            },
          },
        };
      }

      // Default state - subtle hover
      return {
        ...baseStyles,
        color: "text.primary",
        "&:hover": {
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          transform: "translateX(2px)",
        },
        // Parent items with children get a subtle indicator
        ...(hasChildren && {
          "&::after": {
            content: '""',
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            width: 4,
            height: 4,
            borderRadius: "50%",
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
            display: collapsed ? "none" : "block",
          },
        }),
      };
    };

    // Determine if this is a logout item
    const isLogout =
      item.id === "logout" || item.title?.toLowerCase() === "logout";

    return (
      <Tooltip
        title={tooltipTitle}
        placement="right"
        disableHoverListener={!collapsed || hasChildren}
        arrow
      >
        <ListItemButton
          onClick={handleClick}
          selected={isSelected && !isFooter}
          disabled={item.disabled}
          sx={getStyles()}
          className={isLogout ? "logout" : ""}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          aria-current={isSelected ? "page" : undefined}
          role="menuitem"
        >
          {/* Icon */}
          {Icon && (
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 36 : 36,
                justifyContent: "center",
                color:
                  isSelected && !isFooter
                    ? "#ffffff"
                    : isFooter
                      ? isLogout
                        ? "inherit"
                        : "text.secondary"
                      : "text.secondary",
                transition: "color 0.2s",
              }}
            >
              <Icon fontSize={collapsed ? "medium" : "small"} />
            </ListItemIcon>
          )}

          {/* Text - hidden when collapsed */}
          {!collapsed && (
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  fontWeight={isSelected || isParent ? 600 : 400}
                  noWrap
                  sx={{
                    color:
                      isSelected && !isFooter
                        ? "#ffffff"
                        : isFooter
                          ? isLogout && isHovering
                            ? "error.main"
                            : "text.secondary"
                          : "text.primary",
                    transition: "color 0.2s",
                  }}
                >
                  {item.title}
                </Typography>
              }
              secondary={
                item.badge && (
                  <Box
                    component="span"
                    sx={{
                      ml: 1,
                      px: 0.5,
                      py: 0.25,
                      bgcolor: isSelected
                        ? "rgba(255,255,255,0.2)"
                        : "error.main",
                      color: isSelected ? "#ffffff" : "#ffffff",
                      borderRadius: 1,
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      minWidth: 16,
                      textAlign: "center",
                      display: "inline-block",
                    }}
                  >
                    {item.badge}
                  </Box>
                )
              }
              primaryTypographyProps={{
                component: "div",
              }}
            />
          )}

          {/* Expand/Collapse icon */}
          {hasChildren && !collapsed && (
            <Box
              sx={{
                ml: 1,
                color: isSelected ? "#ffffff" : "text.secondary",
                transition: "color 0.2s",
              }}
            >
              {open ? (
                <ExpandLess fontSize="small" />
              ) : (
                <ExpandMore fontSize="small" />
              )}
            </Box>
          )}

          {/* Active indicator for collapsed mode */}
          {collapsed && isSelected && !hasChildren && (
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                width: 3,
                height: 20,
                bgcolor: "#ffffff",
                borderRadius: "0 3px 3px 0",
                boxShadow: "0 0 8px rgba(255,255,255,0.3)",
              }}
            />
          )}
        </ListItemButton>
      </Tooltip>
    );
  };

  return (
    <Box
      sx={{
        position: "relative",
        "&:not(:last-child)": {
          mb: 0.5,
        },
      }}
    >
      {renderItem()}
      {hasChildren && !collapsed && renderChildren()}
    </Box>
  );
};

export default SidebarItem;

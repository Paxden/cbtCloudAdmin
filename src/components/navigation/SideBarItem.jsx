/**
 * Sidebar Item Component
 * Individual navigation item
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  Box,
  Typography,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useNavigation } from '../../hooks/useNavigation';

const SidebarItem = ({
  item,
  depth = 0,
  onClose,
}) => {
  const navigate = useNavigate();
  const { isActivePath, isParentActive } = useNavigation();
  const [open, setOpen] = useState(isParentActive(item));

  const hasChildren = item.children && item.children.length > 0;
  const isActive = isActivePath(item.path);
  const isParent = isParentActive(item);

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    } else if (item.path) {
      navigate(item.path);
      if (onClose) onClose();
    }
  };

  // Get Icon component - safely
  const Icon = item.icon;

  return (
    <Box>
      <ListItemButton
        onClick={handleClick}
        selected={isActive || (isParent && !hasChildren)}
        sx={{
          pl: depth > 0 ? 3 + depth * 1.5 : 1.5,
          pr: 1.5,
          py: 0.75,
          borderRadius: 1,
          mx: 0.5,
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            '& .MuiListItemIcon-root': {
              color: 'white',
            },
          },
          '&:hover': {
            backgroundColor: depth === 0 ? 'action.hover' : 'action.hover',
          },
        }}
      >
        {Icon && (
          <ListItemIcon
            sx={{
              minWidth: 36,
              color: isActive ? 'inherit' : 'text.secondary',
            }}
          >
            <Icon fontSize="small" />
          </ListItemIcon>
        )}
        <ListItemText
          primary={
            <Typography
              variant="body2"
              fontWeight={isActive || isParent ? 500 : 400}
              noWrap
            >
              {item.title}
            </Typography>
          }
        />
        {hasChildren && (
          <Box sx={{ ml: 1 }}>
            {open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </Box>
        )}
      </ListItemButton>

      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding>
            {item.children.map((child) => (
              <SidebarItem
                key={child.id}
                item={child}
                depth={depth + 1}
                onClose={onClose}
              />
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
};

export default SidebarItem;
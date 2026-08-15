/**
 * Filter Panel Component
 * Reusable filter panel with collapsible sections
 */

import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Collapse,
  Stack,
  Button,
  Divider,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const FilterPanel = ({
  children,
  title = 'Filters',
  onApply,
  onClear,
  onClose,
  defaultExpanded = true,
  showClear = true,
  showApply = true,
  applyText = 'Apply Filters',
  clearText = 'Clear All',
  sx = {},
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        ...sx,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon color="action" />
          <Typography variant="subtitle2" fontWeight={600}>
            {title}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            ({React.Children.count(children)} filters)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={handleToggle}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          {onClose && (
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Collapse in={expanded}>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            flexWrap="wrap"
            useFlexGap
          >
            {children}
          </Stack>

          {/* Actions */}
          {(showApply || showClear) && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                mt: 1,
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              {showClear && onClear && (
                <Button variant="outlined" onClick={onClear} size="small">
                  {clearText}
                </Button>
              )}
              {showApply && onApply && (
                <Button variant="contained" onClick={onApply} size="small">
                  {applyText}
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default FilterPanel;
/* eslint-disable no-unused-vars */
/**
 * SelectedCentresCard Component
 * Displays selected centres
 * 
 * Location: src/components/packages/SelectedCentresCard.jsx
 */

import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Grid
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const SelectedCentresCard = ({
  centres,
  onRemove,
  maxDisplay = 5
}) => {
  if (!centres || centres.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No centres selected
        </Typography>
      </Paper>
    );
  }

  const displayCentres = centres.slice(0, maxDisplay);
  const remaining = centres.length - maxDisplay;

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="subtitle2">
          Selected Centres ({centres.length})
        </Typography>
      </Box>

      <Box display="flex" gap={1} flexWrap="wrap">
        {displayCentres.map((centre) => (
          <Chip
            key={centre._id}
            label={centre.name || centre.centreName}
            icon={<LocationIcon />}
            onDelete={onRemove ? () => onRemove(centre._id) : undefined}
            size="small"
            color="primary"
            variant="outlined"
          />
        ))}
        {remaining > 0 && (
          <Chip
            label={`+${remaining} more`}
            size="small"
            variant="outlined"
            color="default"
          />
        )}
      </Box>
    </Paper>
  );
};

export default SelectedCentresCard;
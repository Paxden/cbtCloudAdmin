/* eslint-disable no-unused-vars */
/**
 * Readiness Checklist Component
 * Displays completion status for all requirements
 */

import React from 'react';
import {
  Paper,
  Typography,
  Stack,
  Chip,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as CompleteIcon,
  Cancel as MissingIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const ChecklistItem = ({ item }) => {
  const getStatusColor = () => {
    if (item.status === 'complete') return 'success';
    if (item.status === 'warning') return 'warning';
    if (item.status === 'missing') return 'error';
    return 'default';
  };

  const getStatusIcon = () => {
    if (item.status === 'complete') return <CompleteIcon color="success" />;
    if (item.status === 'warning') return <WarningIcon color="warning" />;
    if (item.status === 'missing') return <MissingIcon color="error" />;
    return <InfoIcon color="disabled" />;
  };

  const getStatusLabel = () => {
    if (item.status === 'complete') return 'Complete';
    if (item.status === 'warning') return 'Warning';
    if (item.status === 'missing') return 'Missing';
    return 'Unknown';
  };

  return (
    <ListItem sx={{ px: 0 }}>
      <ListItemIcon sx={{ minWidth: 36 }}>
        {getStatusIcon()}
      </ListItemIcon>
      <ListItemText
        primary={item.name}
        secondary={item.details || item.description}
        primaryTypographyProps={{
          sx: {
            textDecoration: item.status === 'complete' ? 'none' : 'none',
            fontWeight: item.status === 'missing' ? 600 : 400,
          },
        }}
      />
      <Chip
        label={getStatusLabel()}
        size="small"
        color={getStatusColor()}
        variant="outlined"
      />
    </ListItem>
  );
};

const ReadinessChecklist = ({ checklist, loading }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">Loading checklist...</Typography>
      </Paper>
    );
  }

  if (!checklist || !checklist.items || checklist.items.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">No checklist items available</Typography>
      </Paper>
    );
  }

  const completed = checklist.items.filter(i => i.status === 'complete').length;
  const total = checklist.items.length;
  const missing = checklist.items.filter(i => i.status === 'missing').length;

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Readiness Checklist
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip
            label={`${completed}/${total} Complete`}
            color="success"
            variant="outlined"
          />
          {missing > 0 && (
            <Chip
              label={`${missing} Missing`}
              color="error"
              variant="outlined"
            />
          )}
        </Stack>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <List disablePadding>
        {checklist.items.map((item, index) => (
          <React.Fragment key={item.id || index}>
            <ChecklistItem item={item} />
            {index < checklist.items.length - 1 && <Divider variant="inset" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default ReadinessChecklist;
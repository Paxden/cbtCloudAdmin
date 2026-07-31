/**
 * Validation Checklist Component
 * Displays all validation checks with status
 */

import React, { useState } from 'react';
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
  Collapse,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle as PassedIcon,
  Cancel as FailedIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

// ✅ Helper to safely get message as string
const getMessageString = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    // Check for nested message
    if (value.message) return getMessageString(value.message);
    if (value.error) return getMessageString(value.error);
    if (value.details) return getMessageString(value.details);
    // Otherwise stringify the object
    try {
      return JSON.stringify(value);
    } catch {
      return 'Invalid message format';
    }
  }
  return String(value);
};

// ✅ Helper to safely get category
const getCategoryString = (value) => {
  if (!value) return 'General';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    return value.name || value.category || 'General';
  }
  return String(value);
};

// ✅ Helper to safely get status
const getStatusString = (value) => {
  if (!value) return 'PENDING';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    return value.status || value.result || 'PENDING';
  }
  return String(value);
};

// ✅ Helper to safely get severity
const getSeverityString = (value) => {
  if (!value) return 'MEDIUM';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    return value.severity || value.severityLevel || 'MEDIUM';
  }
  return String(value);
};

// ✅ Helper to safely get recommendation
const getRecommendationString = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    return value.message || value.recommendation || null;
  }
  return null;
};

const ChecklistItem = ({ item, expanded, onToggle }) => {
  // ✅ Safely extract all values
  const status = getStatusString(item?.status || item);
  const category = getCategoryString(item?.category || item?.name || item);
  const message = getMessageString(item?.message || item);
  const severity = getSeverityString(item?.severity || item);
  const recommendation = getRecommendationString(item?.recommendation || item);
  const details = item?.details || item?.data || null;

  const getStatusColor = () => {
    const upperStatus = status.toUpperCase();
    if (upperStatus === 'PASSED') return 'success';
    if (upperStatus === 'WARNING') return 'warning';
    if (upperStatus === 'FAILED') return 'error';
    return 'default';
  };

  const getStatusIcon = () => {
    const upperStatus = status.toUpperCase();
    if (upperStatus === 'PASSED') return <PassedIcon color="success" />;
    if (upperStatus === 'WARNING') return <WarningIcon color="warning" />;
    if (upperStatus === 'FAILED') return <FailedIcon color="error" />;
    return <InfoIcon color="disabled" />;
  };

  const getStatusLabel = () => {
    const upperStatus = status.toUpperCase();
    if (upperStatus === 'PASSED') return 'Passed';
    if (upperStatus === 'WARNING') return 'Warning';
    if (upperStatus === 'FAILED') return 'Failed';
    return 'Pending';
  };

  const severityColor = () => {
    const upperSeverity = severity.toUpperCase();
    if (upperSeverity === 'CRITICAL') return 'error';
    if (upperSeverity === 'HIGH') return 'warning';
    if (upperSeverity === 'MEDIUM') return 'info';
    return 'default';
  };

  return (
    <>
      <ListItem
        sx={{
          px: 0,
          py: 1,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' },
          borderRadius: 1,
        }}
        onClick={onToggle}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          {getStatusIcon()}
        </ListItemIcon>
        <ListItemText
          primary={category}
          secondary={
            <Box>
              {/* ✅ Ensure message is a string */}
              <Typography variant="body2">{String(message)}</Typography>
              {details && typeof details === 'object' && (
                <Typography variant="caption" color="textSecondary" component="div">
                  Details: {JSON.stringify(details).substring(0, 100)}
                </Typography>
              )}
            </Box>
          }
          primaryTypographyProps={{
            sx: {
              fontWeight: status.toUpperCase() === 'FAILED' ? 600 : 400,
            },
          }}
        />
        <Stack direction="row" spacing={1} alignItems="center">
          {severity && (
            <Chip
              label={severity}
              size="small"
              color={severityColor()}
              variant="outlined"
            />
          )}
          <Chip
            label={getStatusLabel()}
            size="small"
            color={getStatusColor()}
            variant="outlined"
          />
          <IconButton size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Stack>
      </ListItem>

      <Collapse in={expanded}>
        <Box sx={{ pl: 4, pr: 2, pb: 1 }}>
          <Stack spacing={1}>
            {recommendation && (
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Recommendation:
                </Typography>
                <Typography variant="body2">{String(recommendation)}</Typography>
              </Box>
            )}
            {details && typeof details === 'object' && (
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Full Details:
                </Typography>
                <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(details, null, 2)}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Collapse>
    </>
  );
};

const ValidationChecklist = ({ items, loading, progress }) => {
  const [expandedItems, setExpandedItems] = useState({});

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">Loading validation checks...</Typography>
      </Paper>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">No validation checks available</Typography>
      </Paper>
    );
  }

  const toggleItem = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const passedCount = items.filter(i => getStatusString(i?.status || i).toUpperCase() === 'PASSED').length;
  const failedCount = items.filter(i => getStatusString(i?.status || i).toUpperCase() === 'FAILED').length;
  const warningCount = items.filter(i => getStatusString(i?.status || i).toUpperCase() === 'WARNING').length;
  const total = items.length;

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Validation Checklist
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip
            label={`${passedCount} Passed`}
            color="success"
            variant="outlined"
          />
          {warningCount > 0 && (
            <Chip
              label={`${warningCount} Warnings`}
              color="warning"
              variant="outlined"
            />
          )}
          {failedCount > 0 && (
            <Chip
              label={`${failedCount} Failed`}
              color="error"
              variant="outlined"
            />
          )}
          <Chip
            label={`${Math.round((passedCount / total) * 100)}% Complete`}
            color="info"
            variant="outlined"
          />
        </Stack>
      </Stack>

      {progress !== undefined && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            color={progress >= 90 ? 'success' : progress >= 70 ? 'warning' : 'error'}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      )}

      <Divider sx={{ mb: 2 }} />

      <List disablePadding>
        {items.map((item, index) => (
          <React.Fragment key={item._id || item.id || index}>
            <ChecklistItem
              item={item}
              expanded={expandedItems[index] || false}
              onToggle={() => toggleItem(index)}
            />
            {index < items.length - 1 && <Divider variant="inset" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default ValidationChecklist;
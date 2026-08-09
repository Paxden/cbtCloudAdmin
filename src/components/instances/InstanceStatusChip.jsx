/* eslint-disable no-unused-vars */
/**
 * InstanceStatusChip Component
 * Displays instance status with color coding and icons
 * 
 * Location: src/components/instances/InstanceStatusChip.jsx
 */

import React from 'react';
import { Chip, Box, Typography } from '@mui/material';
import {
  CheckCircle as ReadyIcon,
  Lock as LockedIcon,
  Archive as ArchivedIcon,
  Pending as CreatingIcon,
  Error as FailedIcon,
  HourglassEmpty as DraftIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const STATUS_CONFIG = {
  DRAFT: {
    label: 'Draft',
    color: '#6c757d',
    bgColor: '#e9ecef',
    icon: DraftIcon
  },
  CREATING: {
    label: 'Creating',
    color: '#0d6efd',
    bgColor: '#cfe2ff',
    icon: CreatingIcon
  },
  GENERATED: {
    label: 'Ready',
    color: '#198754',
    bgColor: '#d1e7dd',
    icon: ReadyIcon
  },
  LOCKED: {
    label: 'Locked',
    color: '#0dcaf0',
    bgColor: '#cff4fc',
    icon: LockedIcon
  },
  ARCHIVED: {
    label: 'Archived',
    color: '#6c757d',
    bgColor: '#e9ecef',
    icon: ArchivedIcon
  },
  FAILED: {
    label: 'Failed',
    color: '#dc3545',
    bgColor: '#f8d7da',
    icon: FailedIcon
  }
};

const StyledChip = styled(Chip)(({ theme, statuscolor, statusbgcolor }) => ({
  backgroundColor: statusbgcolor,
  color: statuscolor,
  fontWeight: 500,
  borderRadius: '6px',
  '& .MuiChip-icon': {
    color: statuscolor,
    fontSize: '1rem'
  },
  '&:hover': {
    backgroundColor: statusbgcolor,
    opacity: 0.8
  }
}));

const InstanceStatusChip = ({ status, size = 'medium', showLabel = true }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;
  const IconComponent = config.icon;

  if (!showLabel) {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: config.bgColor,
          color: config.color
        }}
      >
        <IconComponent fontSize={size === 'small' ? 'small' : 'medium'} />
      </Box>
    );
  }

  return (
    <StyledChip
      icon={<IconComponent />}
      label={config.label}
      size={size}
      statuscolor={config.color}
      statusbgcolor={config.bgColor}
      variant="filled"
    />
  );
};

export default InstanceStatusChip;
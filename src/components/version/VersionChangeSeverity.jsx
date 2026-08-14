/* eslint-disable no-unused-vars */
/**
 * VersionChangeSeverity
 * Displays change severity with appropriate colors
 * 
 * Location: src/components/version/VersionChangeSeverity.jsx
 */

import React from 'react';
import { Chip } from '@mui/material';
import {
  ChangeSeverity,
  ChangeSeverityColors,
} from '../../types/version.types';

const VersionChangeSeverity = ({ severity, size = 'small' }) => {
  const color = ChangeSeverityColors[severity] || '#9e9e9e';

  return (
    <Chip
      label={severity}
      size={size}
      sx={{
        bgcolor: color,
        color: 'white',
        fontWeight: 'bold',
      }}
    />
  );
};

export default VersionChangeSeverity;
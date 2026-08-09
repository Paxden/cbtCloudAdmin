/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/**
 * DownloadDetailsDrawer Component
 * Displays detailed download information
 * 
 * Location: src/components/packageDownloads/DownloadDetailsDrawer.jsx
 */

import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Tooltip,
  Skeleton,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Inventory as PackageIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import DownloadStatusChip from './DownloadStatusChip';

const DownloadDetailsDrawer = ({
  open,
  onClose,
  download,
  loading = false,
  onVerify,
  onRetry,
  canVerify = false,
  canRetry = false
}) => {
  const [expandedSections, setExpandedSections] = useState({
    packageInfo: true,
    downloadInfo: false,
    securityInfo: false,
    auditInfo: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 600 } }}>
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" width="70%" height={40} />
          <Skeleton variant="text" width="40%" height={30} />
          <Divider sx={{ my: 2 }} />
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 1 }} />
          ))}
        </Box>
      </Drawer>
    );
  }

  if (!download) {
    return (
      <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 600 } }}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">Download not found</Typography>
        </Box>
      </Drawer>
    );
  }

  const isCompleted = download.status === 'COMPLETED';
  const isFailed = download.status === 'FAILED';
  const isPending = download.status === 'PENDING';

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const renderPackageInfo = () => (
    <Accordion
      expanded={expandedSections.packageInfo}
      onChange={() => toggleSection('packageInfo')}
      sx={{ '&:before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          <PackageIcon color="primary" />
          <Typography variant="subtitle1">Package Information</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Package Name</Typography>
            <Typography variant="body2" fontWeight={500}>
              {download.packageName || download.package?.name || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Version</Typography>
            <Typography variant="body2">V{download.packageVersion || download.version || 1}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Centre</Typography>
            <Typography variant="body2">
              {download.centre?.name || download.centreName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">File Size</Typography>
            <Typography variant="body2">
              {download.fileSize ? `${(download.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">Package ID</Typography>
            <Typography variant="body2">
              {download.packageId || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  const renderDownloadInfo = () => (
    <Accordion
      expanded={expandedSections.downloadInfo}
      onChange={() => toggleSection('downloadInfo')}
      sx={{ '&:before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          <DownloadIcon color="primary" />
          <Typography variant="subtitle1">Download Information</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Status</Typography>
            <DownloadStatusChip status={download.status} size="small" />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Downloaded By</Typography>
            <Typography variant="body2">
              {download.downloadedBy?.name || download.downloadedBy || 'System'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Started</Typography>
            <Typography variant="body2">
              {new Date(download.startedAt || download.createdAt).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Completed</Typography>
            <Typography variant="body2">
              {download.completedAt ? new Date(download.completedAt).toLocaleString() : 'In Progress'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Duration</Typography>
            <Typography variant="body2">
              {formatDuration(download.duration)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Device</Typography>
            <Typography variant="body2">
              {download.deviceInfo || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">IP Address</Typography>
            <Typography variant="body2">
              {download.ipAddress || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  const renderSecurityInfo = () => (
    <Accordion
      expanded={expandedSections.securityInfo}
      onChange={() => toggleSection('securityInfo')}
      sx={{ '&:before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          <SecurityIcon color="primary" />
          <Typography variant="subtitle1">Security Information</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Checksum Verification</Typography>
            <Chip
              label={download.checksumVerified ? 'Verified' : 'Not Verified'}
              color={download.checksumVerified ? 'success' : 'error'}
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Signature Status</Typography>
            <Chip
              label={download.signatureValid ? 'Valid' : 'Invalid'}
              color={download.signatureValid ? 'success' : 'error'}
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Transfer Validation</Typography>
            <Chip
              label={download.transferValidated ? 'Validated' : 'Not Validated'}
              color={download.transferValidated ? 'success' : 'default'}
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Encryption</Typography>
            <Chip
              label={download.encrypted ? 'Encrypted' : 'Not Encrypted'}
              color={download.encrypted ? 'success' : 'default'}
              size="small"
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  const renderAuditInfo = () => (
    <Accordion
      expanded={expandedSections.auditInfo}
      onChange={() => toggleSection('auditInfo')}
      sx={{ '&:before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          <HistoryIcon color="primary" />
          <Typography variant="subtitle1">Audit Information</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Created By</Typography>
            <Typography variant="body2">
              {download.createdBy?.name || download.createdBy || 'System'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Created At</Typography>
            <Typography variant="body2">
              {new Date(download.createdAt).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Updated By</Typography>
            <Typography variant="body2">
              {download.updatedBy?.name || download.updatedBy || 'System'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Updated At</Typography>
            <Typography variant="body2">
              {new Date(download.updatedAt).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">Download ID</Typography>
            <Typography variant="body2" fontWeight={500}>
              {download._id}
            </Typography>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 600, maxWidth: '90vw' } }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6">
                Download Details
              </Typography>
              <DownloadStatusChip status={download.status} size="small" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {download.packageName || download.package?.name || 'Package'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {canVerify && isCompleted && (
          <Tooltip title="Verify download integrity">
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<CheckIcon />}
              onClick={() => onVerify(download._id)}
            >
              Verify
            </Button>
          </Tooltip>
        )}
        {canRetry && isFailed && (
          <Tooltip title="Retry download">
            <Button
              variant="outlined"
              color="warning"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={() => onRetry(download._id)}
            >
              Retry
            </Button>
          </Tooltip>
        )}
        {isCompleted && (
          <Chip label="Download Complete" color="success" size="small" />
        )}
        {isFailed && (
          <Chip label="Download Failed" color="error" size="small" />
        )}
      </Box>

      {/* Content */}
      <Box sx={{ p: 2, overflow: 'auto', flex: 1 }}>
        {renderPackageInfo()}
        {renderDownloadInfo()}
        {renderSecurityInfo()}
        {renderAuditInfo()}
      </Box>
    </Drawer>
  );
};

export default DownloadDetailsDrawer;
/* eslint-disable no-unused-vars */
/**
 * DistributionDetailsDrawer Component
 * Displays detailed distribution information
 * 
 * Location: src/components/packageDistribution/DistributionDetailsDrawer.jsx
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
  Paper,
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
  History as HistoryIcon,
  Send as SendIcon,
  Download as DownloadIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import DistributionStatusChip from './DistributionStatusChip';

const DistributionDetailsDrawer = ({
  open,
  onClose,
  distribution,
  loading = false,
  onRelease,
  onRevoke,
  canRelease = false,
  canRevoke = false
}) => {
  const [expandedSections, setExpandedSections] = useState({
    packageInfo: true,
    examInfo: false,
    centreInfo: false,
    distributionInfo: false,
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
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 1 }} />
          ))}
        </Box>
      </Drawer>
    );
  }

  if (!distribution) {
    return (
      <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 600 } }}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">Distribution not found</Typography>
        </Box>
      </Drawer>
    );
  }

  const isPending = distribution.status === 'PENDING' || distribution.status === 'APPROVED';
  const isRevoked = distribution.status === 'REVOKED';
  const isReleased = ['RELEASED', 'DOWNLOADED', 'RECEIVED'].includes(distribution.status);

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
              {distribution.packageName || distribution.package?.name || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Version</Typography>
            <Typography variant="body2">V{distribution.packageVersion || distribution.version || 1}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">CBTX Size</Typography>
            <Typography variant="body2">
              {distribution.fileSize ? `${(distribution.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Generated Date</Typography>
            <Typography variant="body2">
              {new Date(distribution.generatedAt || distribution.createdAt).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  const renderExamInfo = () => (
    <Accordion
      expanded={expandedSections.examInfo}
      onChange={() => toggleSection('examInfo')}
      sx={{ '&:before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          <SchoolIcon color="primary" />
          <Typography variant="subtitle1">Examination Information</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Examination</Typography>
            <Typography variant="body2">
              {distribution.examination?.name || distribution.examName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Instance</Typography>
            <Typography variant="body2">
              {distribution.instance?.instanceCode || distribution.instanceId || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Candidate Count</Typography>
            <Typography variant="body2">
              {distribution.candidateCount || 0}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Validation Status</Typography>
            <Chip
              label={distribution.validationStatus || 'Validated'}
              color={distribution.validationStatus === 'VALID' ? 'success' : 'warning'}
              size="small"
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  const renderCentreInfo = () => (
    <Accordion
      expanded={expandedSections.centreInfo}
      onChange={() => toggleSection('centreInfo')}
      sx={{ '&:before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          <LocationIcon color="primary" />
          <Typography variant="subtitle1">Centre Information</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Centre Name</Typography>
            <Typography variant="body2">
              {distribution.centre?.name || distribution.centreName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Centre Code</Typography>
            <Typography variant="body2">
              {distribution.centre?.code || distribution.centreCode || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Centre Manager</Typography>
            <Typography variant="body2">
              {distribution.centre?.manager?.name || distribution.centreManager || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Assigned Candidates</Typography>
            <Typography variant="body2">
              {distribution.assignedCandidates || 0}
            </Typography>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  const renderDistributionInfo = () => (
    <Accordion
      expanded={expandedSections.distributionInfo}
      onChange={() => toggleSection('distributionInfo')}
      sx={{ '&:before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          <SendIcon color="primary" />
          <Typography variant="subtitle1">Distribution Information</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Status</Typography>
            <DistributionStatusChip status={distribution.status} size="small" />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Released By</Typography>
            <Typography variant="body2">
              {distribution.releasedBy?.name || distribution.releasedBy || 'System'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Released Date</Typography>
            <Typography variant="body2">
              {new Date(distribution.releasedAt || distribution.createdAt).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Download Status</Typography>
            <Chip
              label={distribution.downloadCount > 0 ? `${distribution.downloadCount} downloads` : 'Not downloaded'}
              color={distribution.downloadCount > 0 ? 'success' : 'default'}
              size="small"
            />
          </Grid>
          {distribution.expiryDays && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">Expiry</Typography>
              <Typography variant="body2">
                Expires in {distribution.expiryDays} days
              </Typography>
            </Grid>
          )}
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
              {distribution.createdBy?.name || distribution.createdBy || 'System'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Created At</Typography>
            <Typography variant="body2">
              {new Date(distribution.createdAt).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Updated By</Typography>
            <Typography variant="body2">
              {distribution.updatedBy?.name || distribution.updatedBy || 'System'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Updated At</Typography>
            <Typography variant="body2">
              {new Date(distribution.updatedAt).toLocaleString()}
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
                Distribution Details
              </Typography>
              <DistributionStatusChip status={distribution.status} size="small" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {distribution.packageName || distribution.package?.name || 'Package'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {canRelease && isPending && !isRevoked && (
          <Tooltip title="Release this package">
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<SendIcon />}
              onClick={() => onRelease(distribution._id)}
            >
              Release Package
            </Button>
          </Tooltip>
        )}
        {canRevoke && isReleased && !isRevoked && (
          <Tooltip title="Revoke distribution">
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<CloseIcon />}
              onClick={() => onRevoke(distribution._id)}
            >
              Revoke
            </Button>
          </Tooltip>
        )}
        {isRevoked && (
          <Chip label="Revoked" color="default" size="small" />
        )}
        {isReleased && !isRevoked && (
          <Chip label="Active" color="success" size="small" />
        )}
      </Box>

      {/* Content */}
      <Box sx={{ p: 2, overflow: 'auto', flex: 1 }}>
        {renderPackageInfo()}
        {renderExamInfo()}
        {renderCentreInfo()}
        {renderDistributionInfo()}
        {renderAuditInfo()}
      </Box>
    </Drawer>
  );
};

export default DistributionDetailsDrawer;
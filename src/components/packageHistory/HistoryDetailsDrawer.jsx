/* eslint-disable no-unused-vars */
/**
 * HistoryDetailsDrawer Component
 * Displays detailed history/audit information
 * 
 * Location: src/components/packageHistory/HistoryDetailsDrawer.jsx
 */

import { useState } from 'react';
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
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Inventory as PackageIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  History as HistoryIcon,
  Security as SecurityIcon,
  Computer as ComputerIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import ActivityTypeChip from './ActivityTypeChip';
import ActivitySeverityChip from './ActivitySeverityChip';

const HistoryDetailsDrawer = ({
  open,
  onClose,
  history,
  loading = false,
  onViewTimeline,
  onViewPackage,
  onViewVersion
}) => {
  const [expandedSections, setExpandedSections] = useState({
    activityInfo: true,
    packageInfo: false,
    relatedObjects: false,
    technicalInfo: false
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

  if (!history) {
    return (
      <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 600 } }}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">History record not found</Typography>
        </Box>
      </Drawer>
    );
  }

  const renderActivityInfo = () => (
    <Accordion
      expanded={expandedSections.activityInfo}
      onChange={() => toggleSection('activityInfo')}
      sx={{ '&:before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          <InfoIcon color="primary" />
          <Typography variant="subtitle1">Activity Information</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">Activity</Typography>
            <ActivityTypeChip type={history.activityType} size="medium" />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Timestamp</Typography>
            <Typography variant="body2">
              {new Date(history.timestamp || history.createdAt).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Status</Typography>
            <Chip
              label={history.status || 'SUCCESS'}
              color={history.status === 'SUCCESS' ? 'success' : history.status === 'FAILED' ? 'error' : 'warning'}
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Severity</Typography>
            <ActivitySeverityChip severity={history.severity} size="small" />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Performed By</Typography>
            <Typography variant="body2">
              {history.performedBy?.name || history.performedBy || 'System'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">Description</Typography>
            <Typography variant="body2">
              {history.description || 'No description available'}
            </Typography>
          </Grid>
          {history.reason && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">Reason</Typography>
              <Typography variant="body2">
                {history.reason}
              </Typography>
            </Grid>
          )}
          {history.notes && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">Notes</Typography>
              <Typography variant="body2">
                {history.notes}
              </Typography>
            </Grid>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

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
            <Typography variant="caption" color="text.secondary">Package</Typography>
            <Typography variant="body2" fontWeight={500}>
              {history.packageName || history.package?.name || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Version</Typography>
            <Typography variant="body2">
              V{history.version || history.package?.version || 1}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Instance</Typography>
            <Typography variant="body2">
              {history.instance?.instanceCode || history.instanceId || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Centre</Typography>
            <Typography variant="body2">
              {history.centre?.name || history.centreName || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">Examination</Typography>
            <Typography variant="body2">
              {history.examination?.name || history.examName || 'N/A'}
            </Typography>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box display="flex" gap={1} sx={{ mt: 2 }}>
          {history.packageId && onViewPackage && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<PackageIcon />}
              onClick={() => onViewPackage(history.packageId)}
            >
              View Package
            </Button>
          )}
          {history.versionId && onViewVersion && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<HistoryIcon />}
              onClick={() => onViewVersion(history.versionId)}
            >
              View Version
            </Button>
          )}
          {history.packageId && onViewTimeline && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => onViewTimeline(history.packageId)}
            >
              View Timeline
            </Button>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );

  const renderRelatedObjects = () => (
    <Accordion
      expanded={expandedSections.relatedObjects}
      onChange={() => toggleSection('relatedObjects')}
      sx={{ '&:before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          <SchoolIcon color="primary" />
          <Typography variant="subtitle1">Related Objects</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {history.candidateCount !== undefined && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Candidate Count</Typography>
              <Typography variant="body2">{history.candidateCount}</Typography>
            </Grid>
          )}
          {history.questionCount !== undefined && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Question Count</Typography>
              <Typography variant="body2">{history.questionCount}</Typography>
            </Grid>
          )}
          {history.blueprintVersion && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Blueprint Version</Typography>
              <Typography variant="body2">{history.blueprintVersion}</Typography>
            </Grid>
          )}
          {history.configVersion && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Configuration Version</Typography>
              <Typography variant="body2">{history.configVersion}</Typography>
            </Grid>
          )}
          {history.distributionStatus && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Distribution Status</Typography>
              <Chip
                label={history.distributionStatus}
                size="small"
                color={history.distributionStatus === 'COMPLETED' ? 'success' : 'warning'}
              />
            </Grid>
          )}
          {history.downloadStatus && (
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">Download Status</Typography>
              <Chip
                label={history.downloadStatus}
                size="small"
                color={history.downloadStatus === 'COMPLETED' ? 'success' : 'warning'}
              />
            </Grid>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  const renderTechnicalInfo = () => (
    <Accordion
      expanded={expandedSections.technicalInfo}
      onChange={() => toggleSection('technicalInfo')}
      sx={{ '&:before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          <ComputerIcon color="primary" />
          <Typography variant="subtitle1">Technical Information</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">IP Address</Typography>
            <Typography variant="body2">
              {history.ipAddress || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">User Agent</Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
              {history.userAgent || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Source</Typography>
            <Typography variant="body2">
              {history.source || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary">Request ID</Typography>
            <Typography variant="body2" fontWeight={500}>
              {history.requestId || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">Session ID</Typography>
            <Typography variant="body2">
              {history.sessionId || 'N/A'}
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
                Audit Record Details
              </Typography>
              <ActivityTypeChip type={history.activityType} size="small" />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {new Date(history.timestamp || history.createdAt).toLocaleString()}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Status Banner */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box display="flex" gap={1} flexWrap="wrap">
          <Chip
            label={`Status: ${history.status || 'SUCCESS'}`}
            color={history.status === 'SUCCESS' ? 'success' : history.status === 'FAILED' ? 'error' : 'warning'}
            size="small"
          />
          <ActivitySeverityChip severity={history.severity} size="small" />
          {history.performedBy && (
            <Chip
              icon={<PersonIcon />}
              label={history.performedBy.name || history.performedBy}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2, overflow: 'auto', flex: 1 }}>
        {renderActivityInfo()}
        {renderPackageInfo()}
        {renderRelatedObjects()}
        {renderTechnicalInfo()}
      </Box>
    </Drawer>
  );
};

export default HistoryDetailsDrawer;
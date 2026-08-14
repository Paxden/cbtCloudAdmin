/* eslint-disable no-unused-vars */
/**
 * VersionDetailsDrawer
 * Drawer displaying detailed version information
 * 
 * Location: src/components/version/VersionDetailsDrawer.jsx
 */

import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Archive as ArchiveIcon,
  Pending as PendingIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  QuestionAnswer as QuestionIcon,
  Storage as StorageIcon,
  Fingerprint as FingerprintIcon,
} from '@mui/icons-material';
import { useVersion } from '../../hooks/useVersion';
import VersionStatusChip from './VersionStatusChip';
import VersionChangeSeverity from './VersionChangeSeverity';
import { ChangeTypeLabels, VersionStatus } from '../../types/version.types';

// Helper: Format file size
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// ✅ Helper: Extract string ID from object or string
const getStringId = (id) => {
  if (!id) return null;
  if (typeof id === 'string') return id;
  if (typeof id === 'object' && id._id) return id._id;
  if (typeof id === 'object' && id.id) return id.id;
  return String(id);
};

const VersionDetailsDrawer = ({
  open,
  onClose,
  versionId,
  packageId,
  onRefresh,
  loading = false,
}) => {
  // ✅ Extract string IDs
  const packageIdStr = getStringId(packageId);
  const versionIdStr = getStringId(versionId);

  const {
    data: version,
    loading: versionLoading,
    error,
    refetch,
  } = useVersion(packageIdStr, versionIdStr, {
    enabled: !!versionIdStr && !!packageIdStr && open,
  });

  const isLoading = loading || versionLoading;

  const handleRefresh = () => {
    refetch();
    if (onRefresh) onRefresh();
  };

  if (!open) return null;

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ py: 4 }}>
          <LinearProgress />
          <Typography sx={{ mt: 2, textAlign: 'center' }}>
            Loading version details...
          </Typography>
        </Box>
      );
    }

    if (error || !version) {
      return (
        <Alert 
          severity="warning" 
          sx={{ mt: 2 }}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={handleRefresh}
            >
              <RefreshIcon />
            </IconButton>
          }
        >
          {error?.message || 'Version not found'}
        </Alert>
      );
    }

    const isActive = version.status === VersionStatus.ACTIVE;
    const isRevoked = version.status === VersionStatus.REVOKED;
    const isArchived = version.status === VersionStatus.ARCHIVED;
    const isDraft = version.status === VersionStatus.DRAFT;
    const isGenerated = version.status === VersionStatus.GENERATED;

    return (
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {version.versionLabel}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                {version.versionCode}
              </Typography>
            </Box>
            <Tooltip title="Refresh">
              <IconButton size="small" onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
            <VersionStatusChip status={version.status} />
            <VersionChangeSeverity severity={version.severity} />
            <Chip
              label={`v${version.versionNumber}`}
              size="small"
              variant="outlined"
            />
            {version.versionHash && (
              <Chip
                icon={<FingerprintIcon />}
                label={version.versionHash.substring(0, 8)}
                size="small"
                variant="outlined"
                sx={{ fontFamily: 'monospace' }}
              />
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Change Info */}
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            Change Reason
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {version.changeReason || 'No reason provided'}
          </Typography>
          {version.changeDescription && (
            <>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }} color="text.secondary">
                Description
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {version.changeDescription}
              </Typography>
            </>
          )}
        </Paper>

        {/* Changes List */}
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Changes
            </Typography>
            <Chip
              label={`${version.changes?.length || 0} changes`}
              size="small"
              variant="outlined"
            />
          </Box>
          {version.changes && version.changes.length > 0 ? (
            <Stack spacing={1}>
              {version.changes.map((change, idx) => (
                <Box 
                  key={idx} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'grey.50',
                  }}
                >
                  <Chip
                    label={ChangeTypeLabels[change.type] || change.type}
                    size="small"
                    variant="outlined"
                    color={change.severity === 'CRITICAL' ? 'error' : 
                           change.severity === 'MAJOR' ? 'warning' : 
                           change.severity === 'MINOR' ? 'info' : 'default'}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {change.description}
                  </Typography>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 1 }}>
              No changes recorded for this version
            </Typography>
          )}
        </Paper>

        {/* Snapshot Details */}
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            Snapshot Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon fontSize="small" color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Candidates
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {version.metadata?.candidateCount || 0}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <QuestionIcon fontSize="small" color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Questions
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {version.metadata?.questionCount || 0}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StorageIcon fontSize="small" color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Package Size
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {version.metadata?.packageSize 
                      ? formatFileSize(version.metadata.packageSize)
                      : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon fontSize="small" color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Generated By
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {version.metadata?.generatedBy || version.audit?.generatedBy || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Status Timeline */}
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            Status Timeline
          </Typography>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  icon={<EditIcon />} 
                  label="Generated" 
                  size="small" 
                  variant="outlined"
                  color={isGenerated || isDraft || isActive ? 'primary' : 'default'}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                {version.timeline?.generatedAt || version.audit?.generatedAt
                  ? new Date(version.timeline?.generatedAt || version.audit?.generatedAt).toLocaleString()
                  : 'N/A'}
              </Typography>
            </Box>

            {version.timeline?.activatedAt && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    icon={<CheckCircleIcon />} 
                    label="Activated" 
                    size="small" 
                    variant="outlined"
                    color={isActive ? 'success' : 'default'}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {new Date(version.timeline.activatedAt).toLocaleString()}
                </Typography>
              </Box>
            )}

            {version.timeline?.archivedAt && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    icon={<ArchiveIcon />} 
                    label="Archived" 
                    size="small" 
                    variant="outlined"
                    color={isArchived ? 'warning' : 'default'}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {new Date(version.timeline.archivedAt).toLocaleString()}
                </Typography>
              </Box>
            )}

            {version.timeline?.revokedAt && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    icon={<CancelIcon />} 
                    label="Revoked" 
                    size="small" 
                    variant="outlined"
                    color={isRevoked ? 'error' : 'default'}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {new Date(version.timeline.revokedAt).toLocaleString()}
                </Typography>
              </Box>
            )}
          </Stack>

          {version.archiveReason && (
            <Box sx={{ mt: 2, p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
              <Typography variant="caption" color="warning.dark" display="block">
                <strong>Archive Reason:</strong> {version.archiveReason}
              </Typography>
            </Box>
          )}

          {version.revokeReason && (
            <Box sx={{ mt: 2, p: 1, bgcolor: 'error.light', borderRadius: 1 }}>
              <Typography variant="caption" color="error.dark" display="block">
                <strong>Revoke Reason:</strong> {version.revokeReason}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Parent Version Info */}
        {version.parentVersionId && (
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Parent Version
            </Typography>
            <Typography variant="body2">
              {version.parentVersionId?.versionLabel || version.parentVersionId}
            </Typography>
          </Paper>
        )}

        {/* Supersedes Info */}
        {version.supersedesVersion && (
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Supersedes
            </Typography>
            <Typography variant="body2">
              {version.supersedesVersion?.versionLabel || version.supersedesVersion}
            </Typography>
          </Paper>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Audit Info */}
        <Typography variant="caption" color="text.secondary" display="block">
          Created: {version.createdAt ? new Date(version.createdAt).toLocaleString() : 'N/A'}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Last Updated: {version.updatedAt ? new Date(version.updatedAt).toLocaleString() : 'N/A'}
        </Typography>
        {version.audit?.ipAddress && (
          <Typography variant="caption" color="text.secondary" display="block">
            IP: {version.audit.ipAddress}
          </Typography>
        )}
        {version.audit?.userAgent && (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ wordBreak: 'break-all' }}>
            User Agent: {version.audit.userAgent}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 480 },
          p: 3,
          maxHeight: '100vh',
          overflow: 'auto',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Version Details
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {renderContent()}
    </Drawer>
  );
};

export default VersionDetailsDrawer;
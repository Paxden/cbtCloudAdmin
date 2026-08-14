/* eslint-disable no-unused-vars */
/**
 * VersionList
 * Displays a list of package versions
 * 
 * Location: src/components/version/VersionList.jsx
 */

import  { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Typography,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Stack,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  CompareArrows as CompareIcon,
  CheckCircle as ActivateIcon,
  Archive as ArchiveIcon,
  Cancel as RevokeIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import VersionStatusChip from './VersionStatusChip';
import VersionChangeSeverity from './VersionChangeSeverity';
import { VersionStatus } from '../../types/version.types';

const VersionList = ({
  versions = [],
  total = 0,
  page = 0,
  limit = 10,
  loading = false,
  onPageChange,
  onRowsPerPageChange,
  onViewVersion,
  onCompareVersions,
  onActivate,
  onArchive,
  onRevoke,
  canActivate = true,
  canArchive = true,
  canRevoke = true,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const handleMenuOpen = (event, version) => {
    setAnchorEl(event.currentTarget);
    setSelectedVersion(version);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVersion(null);
  };

  const canActivateVersion = (status) => {
    return (status === VersionStatus.GENERATED || status === VersionStatus.DRAFT) && canActivate;
  };

  const canArchiveVersion = (status) => {
    return (status === VersionStatus.GENERATED || 
            status === VersionStatus.DRAFT || 
            status === VersionStatus.ACTIVE) && 
            status !== VersionStatus.ARCHIVED && 
            canArchive;
  };

  const canRevokeVersion = (status) => {
    return (status === VersionStatus.GENERATED || status === VersionStatus.DRAFT) && 
            status !== VersionStatus.REVOKED && 
            canRevoke;
  };

  if (loading && versions.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading versions...</Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Version</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Changes</TableCell>
              <TableCell align="right">Created</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {versions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No versions found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              versions.map((version) => (
                <TableRow key={version._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {version.versionLabel}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      v{version.versionNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {version.versionCode?.substring(0, 20)}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <VersionStatusChip status={version.status} />
                  </TableCell>
                  <TableCell>
                    <VersionChangeSeverity severity={version.severity} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${version.changes?.length || 0} changes`}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {version.timeline?.generatedAt || version.audit?.generatedAt
                      ? new Date(version.timeline?.generatedAt || version.audit?.generatedAt).toLocaleDateString()
                      : new Date(version.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => onViewVersion(version._id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="More Actions">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, version)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={limit}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedVersion && (
          <>
            <MenuItem onClick={() => {
              handleMenuClose();
              onViewVersion(selectedVersion._id);
            }}>
              <ListItemIcon>
                <VisibilityIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>View Details</ListItemText>
            </MenuItem>

            <MenuItem onClick={() => {
              handleMenuClose();
              onCompareVersions(selectedVersion._id);
            }}>
              <ListItemIcon>
                <CompareIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Compare</ListItemText>
            </MenuItem>

            {canActivateVersion(selectedVersion.status) && (
              <MenuItem onClick={() => {
                handleMenuClose();
                onActivate(selectedVersion._id);
              }}>
                <ListItemIcon>
                  <ActivateIcon fontSize="small" color="success" />
                </ListItemIcon>
                <ListItemText>Activate</ListItemText>
              </MenuItem>
            )}

            {canArchiveVersion(selectedVersion.status) && (
              <MenuItem onClick={() => {
                handleMenuClose();
                onArchive(selectedVersion._id);
              }}>
                <ListItemIcon>
                  <ArchiveIcon fontSize="small" color="warning" />
                </ListItemIcon>
                <ListItemText>Archive</ListItemText>
              </MenuItem>
            )}

            {canRevokeVersion(selectedVersion.status) && (
              <MenuItem onClick={() => {
                handleMenuClose();
                onRevoke(selectedVersion._id);
              }}>
                <ListItemIcon>
                  <RevokeIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Revoke</ListItemText>
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </Paper>
  );
};

export default VersionList;
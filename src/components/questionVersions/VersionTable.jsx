/**
 * Version Table Component
 * Displays version history with actions
 */

import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Paper,
  TablePagination,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Skeleton,
  Chip,
  Button,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  CompareArrows as CompareIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const VersionTable = ({
  versions,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  onView,
  onCompare,
  selectedVersions,
  onSelectVersion,
  canView,
}) => {
  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Version</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Change Summary</TableCell>
                <TableCell>Editor</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Changed Fields</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton width={40} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={120} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell align="right"><Skeleton width={100} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (!versions || versions.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <HistoryIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
        <Typography color="textSecondary">
          No versions found for this question.
        </Typography>
      </Paper>
    );
  }

  const handlePageChange = (event, newPage) => {
    onPageChange(newPage);
  };

  const handleLimitChange = (event) => {
    onLimitChange(parseInt(event.target.value, 10));
  };

  const handleSelectVersion = (versionNumber) => {
    if (onSelectVersion) {
      onSelectVersion(versionNumber);
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Tooltip title="Select for comparison">
                  <Typography variant="caption">Compare</Typography>
                </Tooltip>
              </TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Change Summary</TableCell>
              <TableCell>Editor</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Changed Fields</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {versions.map((version) => {
              const isSelected = selectedVersions?.includes(version.versionNumber);

              return (
                <TableRow
                  key={version.versionNumber}
                  hover
                  selected={isSelected}
                  sx={{
                    '&:hover': { bgcolor: 'action.hover' },
                    '&.Mui-selected': { bgcolor: 'action.selected' },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Tooltip title={isSelected ? 'Deselect for comparison' : 'Select for comparison'}>
                      <IconButton
                        size="small"
                        onClick={() => handleSelectVersion(version.versionNumber)}
                      >
                        <CompareIcon
                          fontSize="small"
                          color={isSelected ? 'primary' : 'action'}
                        />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{ fontFamily: 'monospace' }}
                    >
                      v{version.versionNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={version.status}
                      size="small"
                      color={
                        version.status === 'PUBLISHED' ? 'success' :
                        version.status === 'APPROVED' ? 'info' :
                        version.status === 'REJECTED' ? 'error' :
                        version.status === 'ARCHIVED' ? 'default' :
                        'warning'
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={version.changeSummary || 'No summary'}>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 150,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {version.changeSummary || 'No summary'}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {version.createdBy?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(version.createdAt), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={version.changedFields?.length || 0}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      {canView && (
                        <Tooltip title="View Version">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => onView(version)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {canView && selectedVersions?.length === 1 && version.versionNumber !== selectedVersions[0] && (
                        <Tooltip title="Compare with selected">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => onCompare(version.versionNumber)}
                          >
                            Compare
                          </Button>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 20, 50, 100]}
        component="div"
        count={total || 0}
        rowsPerPage={limit}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
      />
    </Paper>
  );
};

export default VersionTable;
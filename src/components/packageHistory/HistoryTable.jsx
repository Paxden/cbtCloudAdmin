/* eslint-disable no-undef */
/**
 * HistoryTable Component
 * Displays history in a data grid
 * 
 * Location: src/components/packageHistory/HistoryTable.jsx
 */

import {
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
  Box,
  Typography,
  Skeleton
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Timeline as TimelineIcon,
  History as HistoryIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import ActivityTypeChip from './ActivityTypeChip';
import ActivitySeverityChip from './ActivitySeverityChip';

const HistoryTable = ({
  history,
  total,
  page,
  limit,
  loading = false,
  onPageChange,
  onRowsPerPageChange,
  onViewDetails,
  onViewTimeline,
  onViewPackage,
  onViewVersion
}) => {
  const handlePageChange = (event, newPage) => {
    onPageChange(event, newPage);
  };

  const handleRowsPerPageChange = (event) => {
    onRowsPerPageChange(event);
  };

  // Skeleton rows for loading state
  if (loading) {
    return (
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['Timestamp', 'Activity', 'Package', 'Examination', 'Centre', 'Performed By', 'Status', 'Severity', 'Actions'].map((col) => (
                  <TableCell key={col}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(9)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton variant="text" width={j === 8 ? 120 : 80} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  // Empty state
  if (history.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No history records found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Try adjusting your filters or wait for activities to be logged
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Activity</TableCell>
              <TableCell>Package</TableCell>
              <TableCell>Examination</TableCell>
              <TableCell>Centre</TableCell>
              <TableCell>Performed By</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((record) => (
              <TableRow key={record._id} hover>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(record.timestamp || record.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(record.timestamp || record.createdAt).toLocaleTimeString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <ActivityTypeChip type={record.activityType} size="small" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {record.packageName || record.package?.name || 'N/A'}
                  </Typography>
                  {record.version && (
                    <Typography variant="caption" color="text.secondary">
                      V{record.version}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {record.examination?.name || record.examName || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {record.centre?.name || record.centreName || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {record.performedBy?.name || record.performedBy || 'System'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={record.status || 'SUCCESS'}
                    color={record.status === 'SUCCESS' ? 'success' : record.status === 'FAILED' ? 'error' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <ActivitySeverityChip severity={record.severity} size="small" />
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center" gap={0.5}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => onViewDetails(record._id)}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="View Timeline">
                      <IconButton
                        size="small"
                        onClick={() => onViewTimeline(record.packageId || record.package?._id)}
                      >
                        <TimelineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="View Package">
                      <IconButton
                        size="small"
                        onClick={() => onViewPackage(record.packageId || record.package?._id)}
                      >
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="View Version">
                      <IconButton
                        size="small"
                        onClick={() => onViewVersion(record.versionId)}
                      >
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        rowsPerPage={limit}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[10, 20, 50, 100]}
        labelRowsPerPage="Rows per page:"
      />
    </Paper>
  );
};

export default HistoryTable;
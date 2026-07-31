/**
 * Import History Table Component
 * Displays import history with actions
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
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import ImportStatusChip from './ImportStatusChip';
import { format } from 'date-fns';

const ImportHistoryTable = ({
  imports,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  onView,
  onDownload,
  onRefresh,
}) => {
  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>File Name</TableCell>
                <TableCell>File Type</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Imported</TableCell>
                <TableCell>Failed</TableCell>
                <TableCell>Warnings</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Uploaded By</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton width={120} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={40} /></TableCell>
                  <TableCell><Skeleton width={40} /></TableCell>
                  <TableCell><Skeleton width={40} /></TableCell>
                  <TableCell><Skeleton width={40} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell align="right"><Skeleton width={80} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (!imports || imports.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No imports found. Upload your first file to get started.
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

  const getSuccessRate = (item) => {
    if (item.totalRecords === 0) return 0;
    return Math.round((item.successfulRecords / item.totalRecords) * 100);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>File Type</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Imported</TableCell>
              <TableCell>Failed</TableCell>
              <TableCell>Warnings</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Uploaded By</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {imports.map((item) => {
              const successRate = getSuccessRate(item);

              return (
                <TableRow key={item._id} hover>
                  <TableCell>
                    <Tooltip title={item.fileName}>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 120,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.fileName}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.fileType?.toUpperCase() || 'Unknown'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{item.totalRecords || 0}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {item.successfulRecords || 0}
                      </Typography>
                      {successRate > 0 && (
                        <Chip
                          label={`${successRate}%`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {item.failedRecords > 0 ? (
                      <Typography color="error">{item.failedRecords}</Typography>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {item.warningRecords > 0 ? (
                      <Typography color="warning">{item.warningRecords}</Typography>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <ImportStatusChip status={item.status} size="small" />
                  </TableCell>
                  <TableCell>
                    {item.uploadedBy?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      <Tooltip title="View Details">
                        <IconButton size="small" color="info" onClick={() => onView(item)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {item.status === 'COMPLETED' && (
                        <Tooltip title="Download Report">
                          <IconButton size="small" color="primary" onClick={() => onDownload(item._id)}>
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      <Tooltip title="Refresh">
                        <IconButton size="small" color="info" onClick={() => onRefresh()}>
                          <RefreshIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
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

export default ImportHistoryTable;
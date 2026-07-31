/**
 * Import History Table Component
 * Displays previous import operations
 */

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
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const ImportHistoryTable = ({
  data,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  onViewDetails,
  onDownloadErrors,
}) => {
  const handlePageChange = (event, newPage) => {
    onPageChange(newPage);
  };

  const handleLimitChange = (event) => {
    onLimitChange(parseInt(event.target.value, 10));
  };

  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Examination</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Imported By</TableCell>
                <TableCell>Records</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {[...Array(6)].map((_, col) => (
                    <TableCell key={col}>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No import history found. Start importing candidates to see records here.
        </Typography>
      </Paper>
    );
  }

  // Helper function to safely get examination ID
  const getExaminationId = (item) => {
    if (!item.examinationId) return 'Unknown';
    if (typeof item.examinationId === 'string') return item.examinationId;
    if (typeof item.examinationId === 'object') {
      return item.examinationId._id || 'Unknown';
    }
    return 'Unknown';
  };

  // Helper function to safely get examination name
  const getExaminationName = (item) => {
    if (!item.examinationId) return 'Unknown';
    if (typeof item.examinationId === 'string') return item.examinationId;
    if (typeof item.examinationId === 'object') {
      return item.examinationId.name || item.examinationId._id || 'Unknown';
    }
    return 'Unknown';
  };

  // Helper function to safely get imported by name
  const getImportedByName = (item) => {
    if (!item.importedBy) return 'Unknown';
    if (typeof item.importedBy === 'string') return item.importedBy;
    if (typeof item.importedBy === 'object') {
      return item.importedBy.name || item.importedBy.email || 'Unknown';
    }
    return 'Unknown';
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Examination</TableCell>
              <TableCell>File</TableCell>
              <TableCell>Imported By</TableCell>
              <TableCell>Records</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => {
              // Safely extract data from both formats
              const importedBy = getImportedByName(item);
              const examName = getExaminationName(item);
              const examId = getExaminationId(item);
              const totalRecords = item.totalRecords || 0;
              const successfulRecords = item.successfulRecords || 0;
              const failedRecords = item.failedRecords || 0;
              
              // Get file type safely
              const fileType = item.fileType || 'Unknown';
              
              // Get status safely
              const status = item.status || 'Unknown';
              
              return (
                <TableRow key={item._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {examName}
                    </Typography>
                    {examId && examId !== 'Unknown' && (
                      <Typography variant="caption" color="textSecondary">
                        ID: {typeof examId === 'string' ? examId.substring(0, 8) : '...'}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{item.fileName || 'N/A'}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {fileType.toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>{importedBy}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        Total: {totalRecords}
                      </Typography>
                      <Typography variant="caption" color="success.main">
                        ✓ {successfulRecords}
                      </Typography>
                      {' '}
                      <Typography variant="caption" color="error.main">
                        ✗ {failedRecords}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={status}
                      size="small"
                      color={
                        status === 'COMPLETED' ? 'success' :
                        status === 'FAILED' ? 'error' :
                        status === 'PARTIAL' ? 'warning' :
                        status === 'PENDING' ? 'info' :
                        'default'
                      }
                      variant={status === 'COMPLETED' || status === 'FAILED' ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>
                    {item.createdAt ? format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => onViewDetails(item)}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {failedRecords > 0 && (
                      <Tooltip title="Download Error Report">
                        <IconButton size="small" onClick={() => onDownloadErrors(item)}>
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
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
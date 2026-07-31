/**
 * Import Preview Table Component
 * Displays preview of imported candidates
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
  Typography,
  Chip,
  Skeleton,
  Tooltip,
} from '@mui/material';
import { CheckCircle as ValidIcon, Error as ErrorIcon } from '@mui/icons-material';

const ImportPreviewTable = ({
  data,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}) => {
  const columns = [
    { id: 'rowNumber', label: 'Row', minWidth: 60 },
    { id: 'candidateNumber', label: 'Candidate Number', minWidth: 120 },
    { id: 'firstName', label: 'First Name', minWidth: 100 },
    { id: 'lastName', label: 'Last Name', minWidth: 100 },
    { id: 'email', label: 'Email', minWidth: 150 },
    { id: 'phone', label: 'Phone', minWidth: 120 },
    { id: 'department', label: 'Department', minWidth: 120 },
    { id: 'status', label: 'Status', minWidth: 100 },
  ];

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
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.id} style={{ minWidth: col.minWidth }}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {columns.map((col) => (
                    <TableCell key={col.id}>
                      <Skeleton variant="text" width="80%" />
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

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No preview data available. Upload a file to preview candidates.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.id} style={{ minWidth: col.minWidth }}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.rowNumber}
                hover
                sx={{
                  bgcolor: row.status === 'INVALID' ? 'error.lighter' : 'inherit',
                }}
              >
                <TableCell>{row.rowNumber}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {row.candidateNumber || '-'}
                  </Typography>
                </TableCell>
                <TableCell>{row.firstName || '-'}</TableCell>
                <TableCell>{row.lastName || '-'}</TableCell>
                <TableCell>{row.email || '-'}</TableCell>
                <TableCell>{row.phone || '-'}</TableCell>
                <TableCell>{row.department || '-'}</TableCell>
                <TableCell>
                  {row.status === 'VALID' ? (
                    <Tooltip title="Valid record">
                      <Chip
                        icon={<ValidIcon />}
                        label="Valid"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title={row.errorMessage || 'Invalid record'}>
                      <Chip
                        icon={<ErrorIcon />}
                        label="Invalid"
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
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

export default ImportPreviewTable;
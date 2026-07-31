/**
 * Import Error Table Component
 * Displays validation errors
 */

import {
  
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Skeleton,
} from '@mui/material';
import { Error as ErrorIcon, Warning as WarningIcon } from '@mui/icons-material';

const ImportErrorTable = ({ errors, loading }) => {
  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Row</TableCell>
                <TableCell>Candidate Number</TableCell>
                <TableCell>Field</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Severity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {[...Array(5)].map((_, col) => (
                    <TableCell key={col}>
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

  if (!errors || errors.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No errors found. All records are valid.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Row</TableCell>
              <TableCell>Candidate Number</TableCell>
              <TableCell>Field</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Severity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {errors.map((error, index) => (
              <TableRow key={index} hover>
                <TableCell>{error.row || '-'}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {error.candidateNumber || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={error.field || 'General'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{error.message}</TableCell>
                <TableCell>
                  <Chip
                    icon={error.severity === 'ERROR' ? <ErrorIcon /> : <WarningIcon />}
                    label={error.severity || 'ERROR'}
                    size="small"
                    color={error.severity === 'ERROR' ? 'error' : 'warning'}
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ImportErrorTable;
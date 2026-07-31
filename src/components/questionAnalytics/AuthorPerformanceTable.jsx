/**
 * Author Performance Table Component
 * Displays author metrics
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
  LinearProgress,
  Box,
} from '@mui/material';

const AuthorPerformanceTable = ({ data, loading }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Author Performance</Typography>
        <Skeleton variant="rectangular" height={200} />
      </Paper>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Author Performance</Typography>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">No author data available</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Author Performance</Typography>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Author</TableCell>
              <TableCell align="center">Created</TableCell>
              <TableCell align="center">Approved</TableCell>
              <TableCell align="center">Rejected</TableCell>
              <TableCell align="center">Pending</TableCell>
              <TableCell align="center">Approval Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((author) => (
              <TableRow key={author._id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {author.authorName || 'Unknown'}
                  </Typography>
                  {author.authorEmail && (
                    <Typography variant="caption" color="textSecondary" display="block">
                      {author.authorEmail}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center">{author.totalCreated || 0}</TableCell>
                <TableCell align="center">{author.approved || 0}</TableCell>
                <TableCell align="center">{author.rejected || 0}</TableCell>
                <TableCell align="center">{author.pending || 0}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={author.approvalRate || 0}
                      sx={{ width: 60, height: 8, borderRadius: 4 }}
                    />
                    <Chip
                      label={`${author.approvalRate || 0}%`}
                      size="small"
                      color={author.approvalRate >= 80 ? 'success' : author.approvalRate >= 50 ? 'warning' : 'error'}
                      variant="outlined"
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AuthorPerformanceTable;
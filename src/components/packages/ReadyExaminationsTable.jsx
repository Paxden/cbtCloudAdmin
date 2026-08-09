/* eslint-disable no-unused-vars */
/**
 * Ready Examinations Table Component
 * 
 * Displays validated examinations ready for packaging
 * This is the most important section of the dashboard
 * 
 * Props:
 * - data: Ready examinations data
 * - loading: Loading state
 * - error: Error state
 * - onViewExam: View examination handler
 * - onGeneratePackage: Generate package handler
 * - onPreview: Preview handler
 * 
 * Location: src/components/packages/ReadyExaminationsTable.jsx
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Skeleton,
  Button,
  Paper,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  AddBox as GenerateIcon,
  Preview as PreviewIcon,
  Verified as VerifiedIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';

const ReadyExaminationsTable = ({
  data = [],
  loading,
  error,
  onViewExam,
  onGeneratePackage,
  onPreview,
  pagination,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Card>
        <CardHeader title="Ready for Packaging" />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="rectangular" height={40} />
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader title="Ready for Packaging" />
        <CardContent>
          <Typography color="error">Failed to load ready examinations</Typography>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader title="Ready for Packaging" />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
            <VerifiedIcon sx={{ fontSize: 48, color: theme.palette.success.main, mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No examinations ready for packaging
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All validated examinations have been packaged or are still in validation
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Ready for Packaging"
        subheader={`${data.length} examination${data.length > 1 ? 's' : ''} ready for package generation`}
        action={
          <Button
            variant="outlined"
            size="small"
            startIcon={<VerifiedIcon />}
            onClick={() => onViewExam?.()}
          >
            View All
          </Button>
        }
      />
      <CardContent sx={{ p: 0 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Exam Name</TableCell>
                <TableCell>Exam Code</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Academic Year</TableCell>
                <TableCell>Validated Date</TableCell>
                <TableCell align="center">Candidates</TableCell>
                <TableCell align="center">Centres</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((exam) => (
                <TableRow key={exam._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {exam.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={exam.code}
                      variant="outlined"
                      sx={{ fontFamily: 'monospace' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {exam.category || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {exam.academicYear || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {dayjs(exam.validatedAt || exam.updatedAt).format('DD MMM YYYY')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      size="small"
                      label={exam.candidateCount || 0}
                      variant="outlined"
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      size="small"
                      label={exam.centreCount || 0}
                      variant="outlined"
                      color="secondary"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label="Validated"
                      color="success"
                      icon={<CheckCircleIcon />}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <Tooltip title="View Examination">
                        <IconButton
                          size="small"
                          onClick={() => onViewExam?.(exam._id)}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Generate Package">
                        <IconButton
                          size="small"
                          onClick={() => onGeneratePackage?.(exam._id)}
                          color="primary"
                        >
                          <GenerateIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Preview">
                        <IconButton
                          size="small"
                          onClick={() => onPreview?.(exam._id)}
                        >
                          <PreviewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {pagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={pagination.total || 0}
            rowsPerPage={pagination.rowsPerPage || 10}
            page={pagination.page || 0}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ReadyExaminationsTable;
/* eslint-disable no-unused-vars */
/**
 * CandidatePaperList
 * Table displaying candidate papers
 * 
 * Location: src/components/candidate-paper/CandidatePaperList.jsx
 */

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Archive as ArchiveIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { PaperStatus, PaperStatusLabels, PaperStatusColors } from '../../types/candidatePaper.types';

const CandidatePaperList = ({
  papers = [],
  total = 0,
  page = 0,
  limit = 10,
  loading = false,
  onPageChange,
  onRowsPerPageChange,
  onViewPaper,
  onArchivePaper,
  canArchive = true,
}) => {
  const getStatusChip = (status) => {
    const label = PaperStatusLabels[status] || status;
    const color = PaperStatusColors[status] || '#9e9e9e';
    
    let icon = null;
    if (status === PaperStatus.GENERATED || status === PaperStatus.ACTIVATED) {
      icon = <CheckCircleIcon />;
    } else if (status === PaperStatus.GENERATING) {
      icon = <PendingIcon />;
    } else if (status === PaperStatus.FAILED) {
      icon = <ErrorIcon />;
    }
    
    return (
      <Chip
        icon={icon}
        label={label}
        size="small"
        sx={{
          bgcolor: color,
          color: 'white',
          '& .MuiChip-icon': { color: 'white' },
        }}
      />
    );
  };

  const canArchivePaper = (status) => {
    return status !== PaperStatus.ARCHIVED && status !== PaperStatus.FAILED && canArchive;
  };

  if (loading && papers.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading papers...</Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Paper Code</TableCell>
              <TableCell>Candidate</TableCell>
              <TableCell>Centre</TableCell>
              <TableCell align="center">Questions</TableCell>
              <TableCell align="center">Marks</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Generated</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {papers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No candidate papers found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              papers.map((paper) => (
                <TableRow key={paper._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {paper.paperCode}
                    </Typography>
                  </TableCell>
                  <TableCell>{paper.candidateNumber}</TableCell>
                  <TableCell>{paper.centreCode}</TableCell>
                  <TableCell align="center">{paper.questionCount || 0}</TableCell>
                  <TableCell align="center">{paper.totalMarks || 0}</TableCell>
                  <TableCell>{getStatusChip(paper.status)}</TableCell>
                  <TableCell align="right">
                    {paper.generationMetadata?.completedAt 
                      ? new Date(paper.generationMetadata.completedAt).toLocaleDateString()
                      : new Date(paper.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => onViewPaper(paper._id)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    {canArchivePaper(paper.status) && (
                      <Tooltip title="Archive">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onArchivePaper(paper._id)}
                        >
                          <ArchiveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
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
    </Paper>
  );
};

export default CandidatePaperList;
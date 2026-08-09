/* eslint-disable no-unused-vars */
/**
 * CandidatePaperTable
 * Table displaying candidate papers with actions
 * 
 * Location: src/components/candidate-paper/CandidatePaperTable.jsx
 */

import React, { useState } from 'react';
import {
  Paper,
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
  Typography,
  Box,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Preview as PreviewIcon,
  Shuffle as ShuffleIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Archive as ArchiveIcon,
  MoreVert as MoreVertIcon,
  Lock as LockIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { PaperStatus, PaperStatusLabels, PaperStatusColors } from '../../types/candidatePaper.types';

const CandidatePaperTable = ({
  papers = [],
  total = 0,
  page = 0,
  limit = 10,
  loading = false,
  onPageChange,
  onRowsPerPageChange,
  onViewDetails,
  onPreview,
  onRandomization,
  onDownload,
  onValidate,
  onArchive,
  canValidate = true,
  canArchive = true,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(null);

  const handleMenuOpen = (event, paper) => {
    setAnchorEl(event.currentTarget);
    setSelectedPaper(paper);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPaper(null);
  };

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
    } else if (status === PaperStatus.ENCRYPTED) {
      icon = <LockIcon />;
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

  const canValidatePaper = (status) => {
    return status !== PaperStatus.ARCHIVED && status !== PaperStatus.FAILED && canValidate;
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
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => onViewDetails(paper._id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Preview">
                        <IconButton
                          size="small"
                          onClick={() => onPreview(paper._id)}
                        >
                          <PreviewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="More Actions">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, paper)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
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
        {selectedPaper && (
          <>
            <MenuItem onClick={() => {
              handleMenuClose();
              onViewDetails(selectedPaper._id);
            }}>
              <ListItemIcon>
                <VisibilityIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>View Details</ListItemText>
            </MenuItem>

            <MenuItem onClick={() => {
              handleMenuClose();
              onPreview(selectedPaper._id);
            }}>
              <ListItemIcon>
                <PreviewIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Preview</ListItemText>
            </MenuItem>

            <MenuItem onClick={() => {
              handleMenuClose();
              onRandomization(selectedPaper._id);
            }}>
              <ListItemIcon>
                <ShuffleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Randomization Summary</ListItemText>
            </MenuItem>

            <MenuItem onClick={() => {
              handleMenuClose();
              onDownload(selectedPaper._id);
            }}>
              <ListItemIcon>
                <DownloadIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Download Metadata</ListItemText>
            </MenuItem>

            {canValidatePaper(selectedPaper.status) && (
              <MenuItem onClick={() => {
                handleMenuClose();
                onValidate(selectedPaper._id);
              }}>
                <ListItemIcon>
                  <CheckCircleIcon fontSize="small" color="success" />
                </ListItemIcon>
                <ListItemText>Validate</ListItemText>
              </MenuItem>
            )}

            {canArchivePaper(selectedPaper.status) && (
              <MenuItem onClick={() => {
                handleMenuClose();
                onArchive(selectedPaper._id);
              }}>
                <ListItemIcon>
                  <ArchiveIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Archive</ListItemText>
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </Paper>
  );
};

export default CandidatePaperTable;
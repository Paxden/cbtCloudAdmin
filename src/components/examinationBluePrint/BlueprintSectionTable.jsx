/* eslint-disable no-unused-vars */
/**
 * Blueprint Section Table Component
 * Displays sections of a blueprint
 */

import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Chip,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

const BlueprintSectionTable = ({
  sections,
  loading,
  onEdit,
  onDelete,
  onView,
  canEdit,
  canDelete,
  isLocked,
}) => {
  const [actionMenu, setActionMenu] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const handleMenuOpen = (event, section) => {
    setActionMenu(event.currentTarget);
    setSelectedSection(section);
  };

  const handleMenuClose = () => {
    setActionMenu(null);
  };

  const handleAction = (action) => {
    handleMenuClose();
    if (selectedSection) {
      switch (action) {
        case 'view':
          onView(selectedSection);
          break;
        case 'edit':
          onEdit(selectedSection);
          break;
        case 'delete':
          onDelete(selectedSection);
          break;
        default:
          break;
      }
    }
  };

  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Section Name</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Topics</TableCell>
                <TableCell>Questions</TableCell>
                <TableCell>Marks</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(3)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton width={120} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell align="right"><Skeleton width={80} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (!sections || sections.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No sections defined. Add sections to build your examination blueprint.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Section Name</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Topics</TableCell>
                <TableCell>Questions</TableCell>
                <TableCell>Marks</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sections.map((section, index) => {
                const questionCount = section.questionCount || 0;
                const marksPerQuestion = section.marksPerQuestion || 0;
                const totalMarks = section.totalMarks || (questionCount * marksPerQuestion);

                const difficultySummary = section.difficultyDistribution?.map(d => 
                  `${d.difficulty}: ${d.percentage}%`
                ).join(', ') || 'N/A';

                return (
                  <TableRow key={section.sectionId || index} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {section.name || 'Untitled Section'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {section.subjectId?.name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {section.topicId?.name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {questionCount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {totalMarks} ({marksPerQuestion} each)
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={difficultySummary}>
                        <Box sx={{ minWidth: 80 }}>
                          <LinearProgress
                            variant="determinate"
                            value={100}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: 'divider',
                              '& .MuiLinearProgress-bar': {
                                background: `linear-gradient(to right, #4caf50, #ff9800, #f44336, #9c27b0)`,
                              },
                            }}
                          />
                          <Typography variant="caption" color="textSecondary">
                            {section.difficultyDistribution?.length || 0} levels
                          </Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="View">
                          <IconButton size="small" color="info" onClick={() => onView(section)}>
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {!isLocked && canEdit && (
                          <Tooltip title="Edit">
                            <IconButton size="small" color="primary" onClick={() => onEdit(section)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {!isLocked && canDelete && (
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => onDelete(section)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        {isLocked && (
                          <Tooltip title="Locked">
                            <IconButton size="small" disabled>
                              <LockIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenu}
        open={Boolean(actionMenu)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {selectedSection && (
          <>
            <MenuItem onClick={() => handleAction('view')}>
              <ListItemIcon><ViewIcon fontSize="small" /></ListItemIcon>
              <ListItemText>View Details</ListItemText>
            </MenuItem>
            {!isLocked && canEdit && (
              <MenuItem onClick={() => handleAction('edit')}>
                <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Edit Section</ListItemText>
              </MenuItem>
            )}
            {!isLocked && canDelete && (
              <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
                <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                <ListItemText>Delete Section</ListItemText>
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </>
  );
};

export default BlueprintSectionTable;
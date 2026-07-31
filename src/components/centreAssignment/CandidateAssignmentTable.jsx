/* eslint-disable no-unused-vars */
/**
 * Candidate Assignment Table Component
 * Displays candidates for assignment with location info
 */

import React, { useState } from "react";
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
  Stack,
  Checkbox,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Assignment as AssignIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  PersonAdd as AddIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import AssignmentStatusChip from "./AssignmentStatusChip";

const CandidateAssignmentTable = ({
  candidates,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  onView,
  onAssign,
  selectedRows,
  onSelectRows,
  canAssign,
  centres,
}) => {
  const [actionMenu, setActionMenu] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [assignMenu, setAssignMenu] = useState(null);

  const handleMenuOpen = (event, candidate) => {
    setActionMenu(event.currentTarget);
    setSelectedCandidate(candidate);
  };

  const handleMenuClose = () => {
    setActionMenu(null);
  };

  const handleAssignMenuOpen = (event) => {
    setAssignMenu(event.currentTarget);
  };

  const handleAssignMenuClose = () => {
    setAssignMenu(null);
  };

  const handleAction = (action) => {
    handleMenuClose();
    if (selectedCandidate) {
      switch (action) {
        case "view":
          onView(selectedCandidate);
          break;
        case "assign":
          onAssign(selectedCandidate);
          break;
        default:
          break;
      }
    }
  };

  const handleAssignToCentre = (centreId) => {
    handleAssignMenuClose();
    if (selectedCandidate) {
      onAssign(selectedCandidate, centreId);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const ids = candidates.map((c) => c._id);
      onSelectRows(ids);
    } else {
      onSelectRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      onSelectRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      onSelectRows([...selectedRows, id]);
    }
  };

  const handlePageChange = (event, newPage) => {
    onPageChange(newPage);
  };

  const handleLimitChange = (event) => {
    onLimitChange(parseInt(event.target.value, 10));
  };

  // Helper to get candidate location
  const getCandidateLocation = (candidate) => {
    const city = candidate.city || candidate.location?.city;
    const state = candidate.state || candidate.location?.state;
    if (city && state) return `${city}, ${state}`;
    if (city) return city;
    if (state) return state;
    return "N/A";
  };

  if (loading) {
    return (
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox disabled />
                </TableCell>
                <TableCell>Candidate Number</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Centre</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox">
                    <Checkbox disabled />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={120} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton width={100} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (!candidates || candidates.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography color="textSecondary">
          No candidates found. Import candidates or adjust your filters.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={
                      selectedRows.length === candidates.length &&
                      candidates.length > 0
                    }
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < candidates.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Candidate Number</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Centre</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {candidates.map((candidate) => {
                const isSelected = selectedRows.includes(candidate._id);
                const isAssigned =
                  candidate.assignedCentre || candidate.centreAssignment;
                const location = getCandidateLocation(candidate);

                return (
                  <TableRow
                    key={candidate._id}
                    hover
                    selected={isSelected}
                    sx={{
                      "&:hover": { bgcolor: "action.hover" },
                      opacity: isAssigned ? 0.8 : 1,
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectRow(candidate._id)}
                        disabled={isAssigned}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        fontFamily="monospace"
                      >
                        {candidate.candidateNumber || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {candidate.firstName} {candidate.lastName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {candidate.department || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          {location}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <AssignmentStatusChip
                        status={isAssigned ? "ACTIVE" : "PENDING"}
                      />
                    </TableCell>
                    <TableCell>
                      {isAssigned ? (
                        <Chip
                          label={
                            candidate.assignedCentre?.name ||
                            candidate.centreName ||
                            "Assigned"
                          }
                          size="small"
                          color="primary"
                          variant="outlined"
                          icon={<ActiveIcon />}
                        />
                      ) : (
                        <Chip
                          label="Unassigned"
                          size="small"
                          variant="outlined"
                          icon={<InactiveIcon />}
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="flex-end"
                      >
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => onView(candidate)}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {canAssign && !isAssigned && (
                          <Tooltip title="Assign">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={(e) => {
                                setSelectedCandidate(candidate);
                                handleAssignMenuOpen(e);
                              }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="More">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, candidate)}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
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

      {/* Assign to Centre Menu */}
      <Menu
        anchorEl={assignMenu}
        open={Boolean(assignMenu)}
        onClose={handleAssignMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem disabled>
          <ListItemText primary="Select Centre" />
        </MenuItem>
        <Divider />
        {centres && centres.length > 0 ? (
          centres.map((centre) => {
            const assigned =
              centre.assignedCandidates || centre.candidateCount || 0;
            const capacity = centre.capacity || 0;
            const available = capacity - assigned;
            const isFull = available <= 0;
            const location =
              centre.address?.city || centre.address?.state || "";

            return (
              <MenuItem
                key={centre._id}
                onClick={() => handleAssignToCentre(centre._id)}
                disabled={isFull}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <span>{centre.name}</span>
                      {location && (
                        <Typography variant="caption" color="textSecondary">
                          ({location})
                        </Typography>
                      )}
                    </Stack>
                  }
                  secondary={`${assigned}/${capacity} assigned (${Math.max(0, available)} available)`}
                />
                {isFull && <Chip label="Full" size="small" color="error" />}
                {!isFull && available < 5 && (
                  <Chip label="Limited" size="small" color="warning" />
                )}
              </MenuItem>
            );
          })
        ) : (
          <MenuItem disabled>
            <ListItemText primary="No centres available" />
          </MenuItem>
        )}
      </Menu>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenu}
        open={Boolean(actionMenu)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {selectedCandidate && (
          <>
            <MenuItem onClick={() => handleAction("view")}>
              <ListItemIcon>
                <ViewIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>View Details</ListItemText>
            </MenuItem>
            {canAssign && (
              <MenuItem onClick={() => handleAction("assign")}>
                <ListItemIcon>
                  <AssignIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Assign to Centre</ListItemText>
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </>
  );
};

export default CandidateAssignmentTable;

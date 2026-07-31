
/* eslint-disable no-unused-vars */
/**
 * Question Table Component
 * Displays questions with actions
 */

import { useState } from "react";
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
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  History as VersionIcon,
  Edit as EditIcon,
  Preview as PreviewIcon,
  ContentCopy as DuplicateIcon,
  Archive as ArchiveIcon,
  Restore as RestoreIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Send as SubmitIcon, // ✅ Add Submit Icon
} from "@mui/icons-material";
import QuestionStatusChip from "./QuestionStatusChip";
import { format } from "date-fns";

const QuestionTable = ({
  questions,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  onView,
  onEdit,
  onPreview,
  onVersionHistory,
  onDuplicate,
  onArchive,
  onRestore,
  onDelete,
  onSubmitReview, // ✅ Add submit handler
  onRefresh,
  onSelect,
  selected = [],
  canEdit,
  canDelete,
  canArchive,
  canRestore,
  canView,
  canSubmit, // ✅ Add canSubmit permission
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleMenuOpen = (event, question) => {
    setAnchorEl(event.currentTarget);
    setSelectedQuestion(question);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedQuestion(null);
  };

  const handleAction = (action) => {
    if (!selectedQuestion) return;
    action(selectedQuestion._id);
    handleMenuClose();
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
                <TableCell>Code</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Marks</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox">
                    <Skeleton variant="rectangular" width={20} height={20} />
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
                    <Skeleton width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={60} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={40} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={60} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton width={120} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography color="textSecondary">
          No questions found. Create your first question to get started.
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

  const handleSelectAll = (event) => {
    if (onSelect) {
      if (event.target.checked) {
        onSelect(questions.map((q) => q._id));
      } else {
        onSelect([]);
      }
    }
  };

  const handleSelectOne = (id) => {
    if (onSelect) {
      if (selected.includes(id)) {
        onSelect(selected.filter((s) => s !== id));
      } else {
        onSelect([...selected, id]);
      }
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {onSelect && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length < questions.length
                    }
                    checked={
                      questions.length > 0 &&
                      selected.length === questions.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              <TableCell>Code</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Marks</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((question) => {
              const isSelected = selected.includes(question._id);
              const isArchived = question.status === "ARCHIVED";
              const isDraft = question.status === "DRAFT";

              return (
                <TableRow
                  key={question._id}
                  hover
                  selected={isSelected}
                  sx={{
                    "&:hover": { bgcolor: "action.hover" },
                    "&.Mui-selected": { bgcolor: "action.selected" },
                  }}
                >
                  {onSelect && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectOne(question._id)}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                    >
                      {question.questionCode || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {question.questionText
                        ?.replace(/<[^>]*>/g, "")
                        .substring(0, 50) || "No title"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {question.questionTypeId?.name || "N/A"}
                  </TableCell>

                  <TableCell>{question.marks || 0}</TableCell>
                  <TableCell>
                    <QuestionStatusChip status={question.status} size="small" />
                  </TableCell>
                  <TableCell>{question.createdBy?.name || "Unknown"}</TableCell>
                  <TableCell>
                    {format(new Date(question.createdAt), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 0.5,
                        flexWrap: "wrap",
                      }}
                    >
                      {canView && (
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => onView(question)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {canView && (
                        <Tooltip title="Preview">
                          <IconButton
                            size="small"
                            color="default"
                            onClick={() => onPreview(question)}
                          >
                            <PreviewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {canEdit && !isArchived && (
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onEdit(question)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {/* ✅ Submit for Review Button */}
                      {canSubmit && isDraft && (
                        <Tooltip title="Submit for Review">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => onSubmitReview(question)}
                          >
                            <SubmitIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      <Tooltip title="Version History">
                        <IconButton
                          size="small"
                          color="default"
                          onClick={() => onVersionHistory(question)}
                        >
                          <VersionIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="More">
                        <IconButton
                          size="small"
                          color="default"
                          onClick={(e) => handleMenuOpen(e, question)}
                        >
                          <MoreVertIcon fontSize="small" />
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

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {canView && (
          <MenuItem onClick={() => handleAction(onPreview)}>
            <ListItemIcon>
              <PreviewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Preview</ListItemText>
          </MenuItem>
        )}
        {canEdit && (
          <MenuItem onClick={() => handleAction(onEdit)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => handleAction(onDuplicate)}>
          <ListItemIcon>
            <DuplicateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        {canSubmit && selectedQuestion?.status === "DRAFT" && (
          <MenuItem onClick={() => handleAction(onSubmitReview)}>
            <ListItemIcon>
              <SubmitIcon fontSize="small" color="warning" />
            </ListItemIcon>
            <ListItemText>Submit for Review</ListItemText>
          </MenuItem>
        )}
        {canArchive && selectedQuestion?.status !== "ARCHIVED" && (
          <MenuItem onClick={() => handleAction(onArchive)}>
            <ListItemIcon>
              <ArchiveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Archive</ListItemText>
          </MenuItem>
        )}
        {canRestore && selectedQuestion?.status === "ARCHIVED" && (
          <MenuItem onClick={() => handleAction(onRestore)}>
            <ListItemIcon>
              <RestoreIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Restore</ListItemText>
          </MenuItem>
        )}
        {canDelete && (
          <MenuItem
            onClick={() => handleAction(onDelete)}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete Permanently</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
};

export default QuestionTable;

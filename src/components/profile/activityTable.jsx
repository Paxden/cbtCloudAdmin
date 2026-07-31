/**
 * Activity Table Component
 * Displays user activity log
 */

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Skeleton,
  TablePagination,
} from "@mui/material";
import { format } from "date-fns";
import StatusChip from "../chips/StatusChip";

const ACTION_COLORS = {
  LOGIN: "info",
  LOGOUT: "default",
  PASSWORD_CHANGED: "warning",
  PROFILE_UPDATED: "primary",
  QUESTION_CREATED: "success",
  QUESTION_APPROVED: "success",
  QUESTION_REJECTED: "error",
  QUESTION_PUBLISHED: "success",
  BULK_IMPORT: "info",
  MEDIA_UPLOADED: "secondary",
};

const ActivityTable = ({
  activities,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}) => {
  if (loading) {
    return (
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>
                <TableCell>Module</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>IP Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={60} />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={60} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={120} />
                  </TableCell>
                  <TableCell>
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

  if (!activities || activities.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography color="textSecondary">No activities found</Typography>
      </Paper>
    );
  }

  const handlePageChange = (event, newPage) => {
    onPageChange(newPage);
  };

  const handleLimitChange = (event) => {
    onLimitChange(parseInt(event.target.value, 10));
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>IP Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id || activity._id} hover>
                <TableCell>
                  <Chip
                    label={activity.action}
                    size="small"
                    color={ACTION_COLORS[activity.action] || "default"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={activity.module}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {activity.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <StatusChip status={activity.status} size="small" />
                </TableCell>
                <TableCell>
                  {format(new Date(activity.createdAt), "dd/MM/yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {activity.ipAddress || "-"}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
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

export default ActivityTable;

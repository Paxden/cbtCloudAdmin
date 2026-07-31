/**
 * Media Table Component
 * Table view for media library
 */

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
  Avatar,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
  Archive as ArchiveIcon,
  Refresh as RefreshIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import MediaStatusChip from './MediaStatusChip';
import { format } from 'date-fns';

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const MediaTable = ({
  media,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
  onView,
  onEdit,
  onReplace,
  onArchive,
  onRestore,
  onDelete,
  canEdit,
  canDelete,
  canArchive,
  canRestore,
}) => {
  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Preview</TableCell>
                <TableCell>File Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Dimensions</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Uploaded By</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="circular" width={40} height={40} /></TableCell>
                  <TableCell><Skeleton width={120} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell align="right"><Skeleton width={120} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (!media || media.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No media found. Upload your first image to get started.
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

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Preview</TableCell>
              <TableCell>File Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Dimensions</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Uploaded By</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {media.map((item) => {
              const isArchived = item.status === 'DELETED' || item.deleted;

              return (
                <TableRow key={item._id} hover>
                  <TableCell>
                    <Avatar
                      src={item.fileUrl}
                      alt={item.originalName}
                      variant="rounded"
                      sx={{ width: 40, height: 40 }}
                    >
                      <ImageIcon />
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={item.originalName}>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 150,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.originalName}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {item.mimeType?.split('/')[1]?.toUpperCase() || 'Unknown'}
                  </TableCell>
                  <TableCell>{formatFileSize(item.fileSize)}</TableCell>
                  <TableCell>
                    {item.width && item.height ? `${item.width}×${item.height}` : '-'}
                  </TableCell>
                  <TableCell>
                    <MediaStatusChip status={item.status} size="small" />
                  </TableCell>
                  <TableCell>
                    {item.uploadedBy?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(item.createdAt), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      <Tooltip title="View">
                        <IconButton size="small" color="info" onClick={() => onView(item)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {canEdit && !isArchived && (
                        <>
                          <Tooltip title="Edit">
                            <IconButton size="small" color="primary" onClick={() => onEdit(item)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Replace">
                            <IconButton size="small" color="warning" onClick={() => onReplace(item)}>
                              <RefreshIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}

                      {canArchive && !isArchived && (
                        <Tooltip title="Archive">
                          <IconButton size="small" color="warning" onClick={() => onArchive(item._id)}>
                            <ArchiveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {canRestore && isArchived && (
                        <Tooltip title="Restore">
                          <IconButton size="small" color="success" onClick={() => onRestore(item._id)}>
                            <RestoreIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {canDelete && isArchived && (
                        <Tooltip title="Delete Permanently">
                          <IconButton size="small" color="error" onClick={() => onDelete(item._id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
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
    </Paper>
  );
};

export default MediaTable;
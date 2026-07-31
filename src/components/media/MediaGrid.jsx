/**
 * Media Grid Component
 * Grid view for media library
 */

import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Skeleton,
  Chip,
  Paper,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
  Archive as ArchiveIcon,
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

const MediaGrid = ({
  media,
  loading,
  onView,
  onEdit,
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
      <Grid container spacing={3}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!media || media.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <ImageIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
        <Typography color="textSecondary">
          No media found. Upload your first image to get started.
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {media.map((item) => {
        const isArchived = item.status === 'DELETED' || item.deleted;

        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              {/* Image Preview */}
              <Box
                sx={{
                  position: 'relative',
                  pt: '75%', // 4:3 aspect ratio
                  bgcolor: 'grey.100',
                  overflow: 'hidden',
                }}
              >
                {item.fileUrl ? (
                  <CardMedia
                    component="img"
                    image={item.fileUrl}
                    alt={item.altText || item.originalName}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                  </Box>
                )}

                {/* Status Badge */}
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <MediaStatusChip status={item.status} size="small" />
                </Box>
              </Box>

              {/* Content */}
              <CardContent sx={{ flexGrow: 1 }}>
                <Tooltip title={item.originalName}>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    noWrap
                    sx={{ mb: 0.5 }}
                  >
                    {item.originalName}
                  </Typography>
                </Tooltip>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                  <Chip
                    label={item.mimeType?.split('/')[1]?.toUpperCase() || 'Unknown'}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={formatFileSize(item.fileSize)}
                    size="small"
                    variant="outlined"
                  />
                </Box>
                {item.width && item.height && (
                  <Typography variant="caption" color="textSecondary">
                    {item.width} × {item.height}
                  </Typography>
                )}
                <Typography variant="caption" color="textSecondary" display="block">
                  Uploaded: {format(new Date(item.createdAt), 'dd/MM/yyyy')}
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block">
                  By: {item.uploadedBy?.name || 'Unknown'}
                </Typography>
              </CardContent>

              {/* Actions */}
              <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                <Tooltip title="View">
                  <IconButton size="small" color="info" onClick={() => onView(item)}>
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                {canEdit && !isArchived && (
                  <Tooltip title="Edit">
                    <IconButton size="small" color="primary" onClick={() => onEdit(item)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
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
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default MediaGrid;
/**
 * Resource Preview Dialog Component
 * Preview uploaded resources
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Description as TextIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const ResourcePreviewDialog = ({
  open,
  onClose,
  resource,
  loading,
}) => {
  if (!resource) return null;

  const getFileIcon = () => {
    const type = resource.fileType || resource.type;
    if (type === 'application/pdf') return <PdfIcon sx={{ fontSize: 64, color: 'error.main' }} />;
    if (type?.startsWith('image/')) return <ImageIcon sx={{ fontSize: 64, color: 'success.main' }} />;
    if (type?.startsWith('text/')) return <TextIcon sx={{ fontSize: 64, color: 'info.main' }} />;
    return <FileIcon sx={{ fontSize: 64, color: 'primary.main' }} />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = resource.fileType?.startsWith('image/') || resource.type?.startsWith('image/');
  const isPDF = resource.fileType === 'application/pdf' || resource.type === 'application/pdf';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            {getFileIcon()}
            <Typography variant="h6">{resource.name || resource.filename || 'Resource'}</Typography>
          </Stack>
          <Button size="small" onClick={onClose} startIcon={<CloseIcon />}>
            Close
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {/* Resource Info */}
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  label={resource.fileType || resource.type || 'Unknown'}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={formatFileSize(resource.fileSize || resource.size)}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={resource.createdAt ? format(new Date(resource.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                  size="small"
                  variant="outlined"
                />
                {resource.status && (
                  <Chip
                    label={resource.status}
                    size="small"
                    color={resource.status === 'Active' ? 'success' : 'default'}
                    variant="outlined"
                  />
                )}
              </Stack>
              {resource.description && (
                <Typography variant="body2" color="textSecondary">
                  {resource.description}
                </Typography>
              )}
            </Stack>

            {/* Preview Content */}
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 2,
                minHeight: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'action.hover',
              }}
            >
              {isImage && resource.url ? (
                <img
                  src={resource.url}
                  alt={resource.name || 'Resource'}
                  style={{
                    maxWidth: '100%',
                    maxHeight: 400,
                    objectFit: 'contain',
                  }}
                />
              ) : isPDF && resource.url ? (
                <iframe
                  src={resource.url}
                  title={resource.name || 'PDF Preview'}
                  style={{
                    width: '100%',
                    height: 400,
                    border: 'none',
                  }}
                />
              ) : (
                <Stack spacing={2} alignItems="center">
                  {getFileIcon()}
                  <Typography variant="body1" color="textSecondary">
                    Preview not available for this file type
                  </Typography>
                  {resource.url && (
                    <Button
                      variant="contained"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      Open in New Tab
                    </Button>
                  )}
                </Stack>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {resource.url && (
          <Button
            variant="contained"
            onClick={() => window.open(resource.url, '_blank')}
          >
            Download
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ResourcePreviewDialog;
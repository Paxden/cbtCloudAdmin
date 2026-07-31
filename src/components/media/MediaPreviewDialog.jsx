/**
 * Media Preview Dialog Component
 * Full preview of media with metadata
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import { Close as CloseIcon, Image as ImageIcon } from '@mui/icons-material';
import MediaStatusChip from './MediaStatusChip';
import { format } from 'date-fns';

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const MetadataRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
    <Typography variant="body2" color="textSecondary">
      {label}
    </Typography>
    <Typography variant="body2">{value || '-'}</Typography>
  </Box>
);

const MediaPreviewDialog = ({ open, media, onClose }) => {
  if (!media) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, maxHeight: '90vh' } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Media Preview</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Image */}
          <Box
            sx={{
              flex: 2,
              minHeight: 300,
              bgcolor: 'grey.100',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
            }}
          >
            {media.fileUrl ? (
              <img
                src={media.fileUrl}
                alt={media.altText || media.originalName}
                style={{
                  maxWidth: '100%',
                  maxHeight: 500,
                  objectFit: 'contain',
                  borderRadius: 8,
                }}
              />
            ) : (
              <ImageIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
            )}
          </Box>

          {/* Metadata */}
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              File Information
            </Typography>

            <Stack spacing={0.5}>
              <MetadataRow label="File Name" value={media.fileName} />
              <MetadataRow label="Original Name" value={media.originalName} />
              <MetadataRow label="File Type" value={media.mimeType} />
              <MetadataRow label="File Size" value={formatFileSize(media.fileSize)} />
              {media.width && media.height && (
                <MetadataRow label="Dimensions" value={`${media.width} × ${media.height}`} />
              )}
              <MetadataRow label="Alt Text" value={media.altText || '-'} />
              <MetadataRow label="Status" value={<MediaStatusChip status={media.status} size="small" />} />
              <MetadataRow label="Usage Count" value={media.usageCount || 0} />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Upload Information
            </Typography>

            <Stack spacing={0.5}>
              <MetadataRow label="Uploaded By" value={media.uploadedBy?.name || 'Unknown'} />
              <MetadataRow
                label="Uploaded Date"
                value={media.createdAt ? format(new Date(media.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
              />
              <MetadataRow
                label="Last Updated"
                value={media.updatedAt ? format(new Date(media.updatedAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
              />
            </Stack>

            {/* Actions */}
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              {media.fileUrl && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => window.open(media.fileUrl, '_blank')}
                >
                  Open in New Tab
                </Button>
              )}
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  navigator.clipboard?.writeText(media.fileUrl || '');
                }}
              >
                Copy URL
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MediaPreviewDialog;
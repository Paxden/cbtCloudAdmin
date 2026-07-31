/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Media Details Drawer Component
 * Edit media metadata
 */

import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import MediaStatusChip from './MediaStatusChip';
import { format } from 'date-fns';

const MediaDetailsDrawer = ({
  open,
  media,
  onClose,
  onUpdate,
  loading = false,
  error = null,
}) => {
  const [altText, setAltText] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (media) {
      setAltText(media.altText || '');
      setStatus(media.status || 'ACTIVE');
    }
  }, [media]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onUpdate(media._id, { altText, status });
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  if (!media) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          p: 3,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Edit Media
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Preview */}
      <Box
        sx={{
          mb: 3,
          bgcolor: 'grey.100',
          borderRadius: 2,
          p: 2,
          textAlign: 'center',
          minHeight: 150,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {media.fileUrl ? (
          <img
            src={media.fileUrl}
            alt={media.altText || media.originalName}
            style={{
              maxWidth: '100%',
              maxHeight: 200,
              objectFit: 'contain',
              borderRadius: 4,
            }}
          />
        ) : (
          <Typography color="textSecondary">No preview available</Typography>
        )}
      </Box>

      {/* File Info */}
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="caption" color="textSecondary">
          File Name
        </Typography>
        <Typography variant="body2">{media.fileName}</Typography>

        <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
          Original Name
        </Typography>
        <Typography variant="body2">{media.originalName}</Typography>

        <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
          Type
        </Typography>
        <Typography variant="body2">{media.mimeType}</Typography>

        <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
          Size
        </Typography>
        <Typography variant="body2">{(media.fileSize / 1024).toFixed(1)} KB</Typography>

        {media.width && media.height && (
          <>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
              Dimensions
            </Typography>
            <Typography variant="body2">{media.width} × {media.height}</Typography>
          </>
        )}

        <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
          Status
        </Typography>
        <Box>
          <MediaStatusChip status={media.status} size="small" />
        </Box>

        <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
          Usage Count
        </Typography>
        <Typography variant="body2">{media.usageCount || 0}</Typography>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Edit Fields */}
      <Stack spacing={2}>
        <TextField
          label="Alternative Text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          fullWidth
          multiline
          rows={2}
          placeholder="Describe the image for accessibility"
        />

        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          fullWidth
          SelectProps={{ native: true }}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          {media.status === 'DELETED' && <option value="DELETED">Deleted</option>}
        </TextField>
      </Stack>

      {/* Actions */}
      <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
        <Button variant="outlined" onClick={onClose} fullWidth>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting || loading}
          fullWidth
        >
          {isSubmitting ? <CircularProgress size={20} /> : 'Save Changes'}
        </Button>
      </Box>
    </Drawer>
  );
};

export default MediaDetailsDrawer;
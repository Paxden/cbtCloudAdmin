/**
 * Resource Upload Dialog Component
 * Dialog for uploading examination resources
 */

import  { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Alert,
  LinearProgress,
  TextField,
  Box,
} from '@mui/material';
import { CloudUpload as UploadIcon, InsertDriveFile as FileIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
  'text/plain': ['.txt'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ResourceUploadDialog = ({
  open,
  onClose,
  onUpload,
  uploading,
  uploadProgress,
}) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    onDropAccepted: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFile(file);
        setName(file.name);
        setError(null);
      }
    },
    onDropRejected: (rejections) => {
      const rejection = rejections[0];
      const errorMsg = rejection.errors[0]?.message || 'File rejected';
      setError(errorMsg);
    },
    disabled: uploading,
  });

  const handleUpload = () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    if (description) {
      formData.append('description', description);
    }

    onUpload(formData);
  };

  const handleClose = () => {
    if (!uploading) {
      setFile(null);
      setName('');
      setDescription('');
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <UploadIcon color="primary" />
          <Typography variant="h6">Upload Resource</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          {...getRootProps()}
          sx={{
            p: 3,
            textAlign: 'center',
            cursor: uploading ? 'default' : 'pointer',
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : isDragReject ? 'error.main' : 'divider',
            borderRadius: 2,
            bgcolor: isDragActive ? 'action.hover' : 'background.paper',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: uploading ? 'divider' : 'primary.main',
              bgcolor: uploading ? 'background.paper' : 'action.hover',
            },
          }}
        >
          <input {...getInputProps()} />

          {file ? (
            <Stack spacing={1} alignItems="center">
              <FileIcon sx={{ fontSize: 48, color: 'primary.main' }} />
              <Typography variant="subtitle1" fontWeight={500}>
                {file.name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {(file.size / 1024).toFixed(1)} KB • {file.type || 'Unknown type'}
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={1} alignItems="center">
              <UploadIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
              <Typography variant="subtitle1">
                {isDragActive ? 'Drop your file here' : 'Drag & drop a file here'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                or click to browse
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Supported: PDF, Images, Word, Text (Max 10MB)
              </Typography>
            </Stack>
          )}
        </Box>

        {uploading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress || 0} />
            <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
              Uploading... {uploadProgress || 0}%
            </Typography>
          </Box>
        )}

        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Resource Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            disabled={uploading}
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
            disabled={uploading}
            placeholder="Optional description of the resource"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!file || uploading}
          startIcon={<UploadIcon />}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResourceUploadDialog;
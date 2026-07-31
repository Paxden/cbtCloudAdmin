/* eslint-disable no-unused-vars */
/**
 * Candidate Upload Area Component
 * Drag and drop file upload area
 */

import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

// Support CSV, Excel, and JSON
const ACCEPTED_FILE_TYPES = {
  'text/csv': ['.csv'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/json': ['.json'],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const CandidateUploadArea = ({
  onFileUpload,
  file,
  uploading,
  uploadProgress,
  error,
  onRemoveFile,
}) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    onDrop: (acceptedFiles, fileRejections) => {
      console.log('📄 onDrop called with:', {
        acceptedFiles: acceptedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
        fileRejections: fileRejections.length
      });
      
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        const errorMsg = rejection.errors[0]?.message || 'File rejected';
        console.error('❌ File rejection:', errorMsg);
        // The error will be shown via the error prop
        return;
      }
      
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        console.log('📄 File dropped/accepted:', {
          name: file.name,
          size: file.size,
          type: file.type,
        });
        onFileUpload(file);
      }
    },
    onDropAccepted: (acceptedFiles) => {
      console.log('✅ onDropAccepted:', acceptedFiles.map(f => f.name));
      // This is called when files are accepted - but onDrop already handles it
    },
    onDropRejected: (fileRejections) => {
      console.log('❌ onDropRejected:', fileRejections);
      const rejection = fileRejections[0];
      const errorMsg = rejection.errors[0]?.message || 'File rejected';
      // The error will be shown via the error prop
    },
    disabled: uploading || !!file,
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    if (!file) return <FileIcon sx={{ fontSize: 48 }} />;
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'xlsx') {
      return <FileIcon sx={{ fontSize: 48, color: 'success.main' }} />;
    } else if (ext === 'csv') {
      return <FileIcon sx={{ fontSize: 48, color: 'info.main' }} />;
    } else if (ext === 'json') {
      return <FileIcon sx={{ fontSize: 48, color: 'warning.main' }} />;
    }
    return <FileIcon sx={{ fontSize: 48, color: 'info.main' }} />;
  };

  if (file) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderColor: 'success.main',
          bgcolor: 'success.lighter',
          borderStyle: 'dashed',
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          {getFileIcon()}

          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={500}>
              {file.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {formatFileSize(file.size)} • {file.type || 'Unknown type'}
            </Typography>

            {uploading && (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress
                  variant="determinate"
                  value={uploadProgress}
                  size={32}
                />
                <Typography variant="body2">
                  Uploading... {uploadProgress}%
                </Typography>
              </Box>
            )}

            {uploadProgress === 100 && (
              <Chip
                icon={<CheckCircleIcon />}
                label="Upload Complete"
                color="success"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Box>

          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={onRemoveFile}
            disabled={uploading}
          >
            Remove
          </Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      {...getRootProps()}
      variant="outlined"
      sx={{
        p: 4,
        textAlign: 'center',
        cursor: uploading ? 'default' : 'pointer',
        borderColor: isDragActive
          ? 'primary.main'
          : isDragReject
          ? 'error.main'
          : 'divider',
        borderStyle: 'dashed',
        borderWidth: 2,
        bgcolor: isDragActive ? 'action.hover' : 'background.paper',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: uploading ? 'divider' : 'primary.main',
          bgcolor: uploading ? 'background.paper' : 'action.hover',
        },
      }}
    >
      <input {...getInputProps()} />

      <UploadIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />

      <Typography variant="h6" gutterBottom>
        {isDragActive
          ? 'Drop your file here'
          : 'Drag & drop your candidate file'}
      </Typography>

      <Typography variant="body2" color="textSecondary" paragraph>
        or click to browse files
      </Typography>

      <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
        <Chip label=".xlsx" size="small" color="success" variant="outlined" />
        <Chip label=".csv" size="small" color="info" variant="outlined" />
        <Chip label=".json" size="small" color="warning" variant="outlined" />
        <Chip label="Max 10MB" size="small" variant="outlined" />
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {isDragReject && (
        <Alert severity="error" sx={{ mt: 2 }}>
          File type not supported. Please upload .csv, .xlsx, or .json files.
        </Alert>
      )}
    </Paper>
  );
};

export default CandidateUploadArea;
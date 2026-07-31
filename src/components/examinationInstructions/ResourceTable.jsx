/* eslint-disable no-unused-vars */
/**
 * Resource Table Component
 * Displays uploaded resources with actions
 */

import React from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Chip,
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  InsertDriveFile as FileIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Description as TextIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const getFileIcon = (fileType) => {
  if (fileType === 'application/pdf') return <PdfIcon color="error" />;
  if (fileType?.startsWith('image/')) return <ImageIcon color="success" />;
  if (fileType?.startsWith('text/')) return <TextIcon color="info" />;
  return <FileIcon color="primary" />;
};

const ResourceTable = ({
  resources,
  loading,
  onView,
  onDelete,
  onDownload,
  canDelete,
}) => {
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Uploaded</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(3)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton width={150} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton width={60} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell align="right"><Skeleton width={100} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (!resources || resources.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No resources uploaded. Upload resource files to support your examination.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Uploaded</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource._id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {getFileIcon(resource.fileType)}
                    <Typography variant="body2" fontWeight={500}>
                      {resource.name || resource.filename || 'Untitled'}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={resource.fileType?.split('/').pop() || 'Unknown'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  {formatFileSize(resource.fileSize || resource.size)}
                </TableCell>
                <TableCell>
                  {resource.createdAt ? format(new Date(resource.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={resource.status || 'Active'}
                    size="small"
                    color={resource.status === 'Active' ? 'success' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title="Preview">
                      <IconButton size="small" color="info" onClick={() => onView(resource)}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton size="small" color="primary" onClick={() => onDownload(resource)}>
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {canDelete && (
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => onDelete(resource)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ResourceTable;
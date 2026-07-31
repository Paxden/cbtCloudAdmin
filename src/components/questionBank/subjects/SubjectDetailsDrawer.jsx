/**
 * Subject Details Drawer Component
 * Displays subject details with topics and questions count
 */

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Grid,
  Skeleton,
  Stack,
  Paper,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import StatusChip from '../../chips/StatusChip';
import { format } from 'date-fns';

const InfoRow = ({ label, value, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="50%" />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
      <Typography variant="body2" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value || '-'}
      </Typography>
    </Box>
  );
};

const SubjectDetailsDrawer = ({
  open,
  subject,
  onClose,
  loading,
  stats,
}) => {
  if (!subject && !loading) {
    return null;
  }

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
          Subject Details
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {loading ? (
        <Box>
          <Skeleton variant="text" height={40} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="rectangular" height={100} sx={{ my: 2 }} />
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} variant="text" height={30} />
          ))}
        </Box>
      ) : (
        <Box>
          {/* Name & Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="h5" fontWeight={600}>
              {subject.name}
            </Typography>
            <StatusChip status={subject.status} size="medium" />
          </Box>

          {/* Code */}
          <Chip
            label={`Code: ${subject.code}`}
            size="small"
            variant="outlined"
            sx={{ fontFamily: 'monospace', mb: 2 }}
          />

          {/* Description */}
          {subject.description && (
            <Paper sx={{ p: 2, bgcolor: 'action.hover', mb: 3 }}>
              <Typography variant="body2">{subject.description}</Typography>
            </Paper>
          )}

          {/* Stats */}
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Statistics
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={600}>
                  {stats?.topics || 0}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Topics
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={600}>
                  {stats?.questions || 0}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Questions
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Information */}
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Information
          </Typography>

          <Stack spacing={0.5}>
            <InfoRow label="Category" value={subject.categoryId?.name || 'N/A'} />
            <InfoRow label="Created By" value={subject.createdBy?.name || 'Unknown'} />
            <InfoRow
              label="Created Date"
              value={subject.createdAt ? format(new Date(subject.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
            />
            <InfoRow
              label="Last Updated"
              value={subject.updatedAt ? format(new Date(subject.updatedAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
            />
            <InfoRow
              label="Last Updated By"
              value={subject.updatedBy?.name || 'N/A'}
            />
          </Stack>
        </Box>
      )}
    </Drawer>
  );
};

export default SubjectDetailsDrawer;
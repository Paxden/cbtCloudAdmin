/**
 * Category Details Drawer Component
 * Displays category details with subjects and questions count
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

const CategoryDetailsDrawer = ({
  open,
  category,
  onClose,
  loading,
  stats,
}) => {
  if (!category && !loading) {
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
          Category Details
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              {category.name}
            </Typography>
            <StatusChip status={category.status} size="medium" />
          </Box>

          {/* Description */}
          {category.description && (
            <Paper sx={{ p: 2, bgcolor: 'action.hover', mb: 3 }}>
              <Typography variant="body2">{category.description}</Typography>
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
                  {stats?.subjects || 0}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Subjects
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
            <InfoRow label="Category Code" value={category.code || 'N/A'} />
            <InfoRow label="Created By" value={category.createdBy?.name || 'Unknown'} />
            <InfoRow
              label="Created Date"
              value={category.createdAt ? format(new Date(category.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
            />
            <InfoRow
              label="Last Updated"
              value={category.updatedAt ? format(new Date(category.updatedAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
            />
            <InfoRow
              label="Last Updated By"
              value={category.updatedBy?.name || 'N/A'}
            />
          </Stack>

          {/* Tags */}
          {category.tags && category.tags.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {category.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Drawer>
  );
};

export default CategoryDetailsDrawer;
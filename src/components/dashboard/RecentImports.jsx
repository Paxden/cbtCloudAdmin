/**
 * Recent Imports Component
 * List of recent bulk imports
 */

import { Paper, Typography, List, ListItem, ListItemText, Chip, Box, Skeleton } from '@mui/material';
import { format } from 'date-fns';
import StatusChip from '../chips/StatusChip';

const RecentImports = ({ imports, loading, onViewAll }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 2, height: 400 }}>
        <Typography variant="h6" gutterBottom>
          Recent Imports
        </Typography>
        {[...Array(5)].map((_, index) => (
          <Box key={index} sx={{ py: 1 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </Box>
        ))}
      </Paper>
    );
  }

  if (!imports || imports.length === 0) {
    return (
      <Paper sx={{ p: 2, height: 400 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">Recent Imports</Typography>
          {onViewAll && (
            <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }} onClick={onViewAll}>
              View All
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <Typography color="textSecondary">No recent imports</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Recent Imports</Typography>
        {onViewAll && (
          <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }} onClick={onViewAll}>
            View All
          </Typography>
        )}
      </Box>
      <List sx={{ flex: 1, overflow: 'auto' }}>
        {imports.slice(0, 10).map((importItem) => (
          <ListItem key={importItem._id || importItem.id} divider>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {importItem.fileName || 'Import'}
                  </Typography>
                  <Chip label={importItem.fileType?.toUpperCase() || 'FILE'} size="small" variant="outlined" />
                  <StatusChip status={importItem.status} size="small" />
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    {importItem.importedRecords || 0} questions imported • By: {importItem.uploadedBy?.name || 'Unknown'}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {format(new Date(importItem.createdAt), 'dd/MM/yyyy HH:mm')}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default RecentImports;
/**
 * Version Metadata Card Component
 * Displays version metadata
 */

import { Paper, Typography, Stack, Chip, Divider, Box } from '@mui/material';
import { format } from 'date-fns';

const MetadataRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
    <Typography variant="body2" color="textSecondary">{label}</Typography>
    <Typography variant="body2">{value || '-'}</Typography>
  </Box>
);

const VersionMetadataCard = ({ version, loading }) => {
  if (loading || !version) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography>Loading metadata...</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Version {version.versionNumber || 0}
      </Typography>

      <Divider sx={{ mb: 1.5 }} />

      <Stack spacing={0.5}>
        <MetadataRow
          label="Status"
          value={<Chip label={version.status} size="small" color="primary" variant="outlined" />}
        />
        <MetadataRow label="Change Summary" value={version.changeSummary || 'No summary provided'} />
        <MetadataRow
          label="Created By"
          value={version.createdBy?.name || 'Unknown'}
        />
        <MetadataRow
          label="Created Date"
          value={version.createdAt ? format(new Date(version.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
        />
        <MetadataRow label="Changed Fields" value={version.changedFields?.length || 0} />
        {version.changedFields && version.changedFields.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
            {version.changedFields.map((field) => (
              <Chip key={field} label={field} size="small" variant="outlined" />
            ))}
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default VersionMetadataCard;
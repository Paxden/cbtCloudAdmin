/**
 * InstanceToolbar
 * Toolbar with actions for the instances page
 * 
 * Location: src/components/instances/InstanceToolbar.jsx
 */

import {
  Box,
  Button,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

const InstanceToolbar = ({
  onCreate,
  onRefresh,
  onExport,
  totalCount = 0,
  loading = false,
  filterCount = 0,
  canCreate = true,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6">
          All Instances
        </Typography>
        <Chip
          label={`${totalCount} total`}
          size="small"
          variant="outlined"
        />
        {filterCount > 0 && (
          <Chip
            icon={<FilterIcon />}
            label={`${filterCount} filters`}
            size="small"
            color="primary"
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Tooltip title="Refresh data">
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={loading}
            size="small"
          >
            Refresh
          </Button>
        </Tooltip>

        <Tooltip title="Export to CSV">
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={onExport}
            disabled={loading || totalCount === 0}
            size="small"
          >
            Export
          </Button>
        </Tooltip>

        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreate}
            disabled={loading}
            size="small"
          >
            Create Instance
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default InstanceToolbar;
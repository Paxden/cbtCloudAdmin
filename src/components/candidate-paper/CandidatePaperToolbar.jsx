/**
 * CandidatePaperToolbar
 * Toolbar with actions for the candidate papers page
 * 
 * Location: src/components/candidate-paper/CandidatePaperToolbar.jsx
 */

import {
  Box,
  Button,
  Typography,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const CandidatePaperToolbar = ({
  onRefresh,
  onExport,
  onGenerate,
  totalCount = 0,
  loading = false,
  filterCount = 0,
  canGenerate = true,
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
          All Papers
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
        {canGenerate && (
          <Tooltip title="Generate new candidate papers">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onGenerate}
              disabled={loading}
              size="small"
            >
              Generate Papers
            </Button>
          </Tooltip>
        )}

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
      </Box>
    </Box>
  );
};

export default CandidatePaperToolbar;
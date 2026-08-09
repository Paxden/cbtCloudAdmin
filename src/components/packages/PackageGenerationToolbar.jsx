/**
 * PackageGenerationToolbar Component
 * Top action buttons for package generator
 * 
 * Location: src/components/packages/PackageGenerationToolbar.jsx
 */

import {
  Box,
  Typography,
  Button,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Refresh as RefreshIcon,
  PlayArrow as GenerateIcon
} from '@mui/icons-material';

const PackageGenerationToolbar = ({
  onBack,
  onRefresh,
  onGenerate,
  loading = false,
  canGenerate = false,
  isReviewStep = false,
  title = 'Package Generator'
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        mb: 2
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        {onBack && (
          <Tooltip title="Go back">
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={onBack}
              disabled={loading}
            >
              Back
            </Button>
          </Tooltip>
        )}
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
      </Box>

      <Box display="flex" gap={1}>
        <Tooltip title="Refresh data">
          <Button
            variant="outlined"
            startIcon={<RefreshIcon className={loading ? 'spin' : ''} />}
            onClick={onRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Tooltip>

        {isReviewStep && (
          <Tooltip title={canGenerate ? 'Generate packages' : 'Please select an instance and centres'}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<GenerateIcon />}
              onClick={onGenerate}
              disabled={!canGenerate || loading}
            >
              Generate Packages
            </Button>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default PackageGenerationToolbar;
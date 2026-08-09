/**
 * DistributionToolbar Component
 * Top toolbar for package distribution
 * 
 * Location: src/components/packageDistribution/DistributionToolbar.jsx
 */

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Send as ReleaseIcon,
  FileDownload as ExportIcon,
  FilterList as FilterIcon,
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon
} from '@mui/icons-material';

const DistributionToolbar = ({
  onRefresh,
  onRelease,
  onExport,
  totalCount,
  loading = false,
  filterCount = 0,
  canRelease = false,
  selectedIds = []
}) => {
  const [exportAnchorEl, setExportAnchorEl] = React.useState(null);

  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const handleExport = (format) => {
    onExport(format);
    handleExportClose();
  };

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
      <Box>
        <Typography variant="h6" component="h2">
          Package Distribution
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {totalCount} packages found
        </Typography>
      </Box>

      <Box display="flex" gap={1} flexWrap="wrap">
        {canRelease && (
          <Tooltip title="Release selected packages">
            <Button
              variant="contained"
              color="primary"
              startIcon={<ReleaseIcon />}
              onClick={onRelease}
              disabled={loading || selectedIds.length === 0}
            >
              Release {selectedIds.length > 0 && `(${selectedIds.length})`}
            </Button>
          </Tooltip>
        )}

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

        <Tooltip title="Export report">
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={handleExportClick}
            disabled={loading || totalCount === 0}
          >
            Export
          </Button>
        </Tooltip>

        {filterCount > 0 && (
          <Badge badgeContent={filterCount} color="primary">
            <Button variant="outlined" startIcon={<FilterIcon />} disabled>
              Filters
            </Button>
          </Badge>
        )}
      </Box>

      {/* Export Menu */}
      <Menu
        anchorEl={exportAnchorEl}
        open={Boolean(exportAnchorEl)}
        onClose={handleExportClose}
      >
        <MenuItem onClick={() => handleExport('pdf')}>
          <ListItemIcon>
            <PdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as PDF</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('csv')}>
          <ListItemIcon>
            <CsvIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as CSV</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DistributionToolbar;
/**
 * ValidationToolbar Component
 * Top toolbar for package validation
 * 
 * Location: src/components/packageValidation/ValidationToolbar.jsx
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
  PlayArrow as RunIcon,
  FileDownload as ExportIcon,
  FilterList as FilterIcon,
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon
} from '@mui/icons-material';

const ValidationToolbar = ({
  onRefresh,
  onRunValidation,
  onExport,
  totalCount,
  loading = false,
  filterCount = 0,
  canRunValidation = false,
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
          Package Validation
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {totalCount} packages found
        </Typography>
      </Box>

      <Box display="flex" gap={1} flexWrap="wrap">
        {canRunValidation && (
          <Tooltip title="Run validation for selected packages">
            <Button
              variant="contained"
              color="primary"
              startIcon={<RunIcon />}
              onClick={onRunValidation}
              disabled={loading || selectedIds.length === 0}
            >
              Run Validation {selectedIds.length > 0 && `(${selectedIds.length})`}
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

export default ValidationToolbar;
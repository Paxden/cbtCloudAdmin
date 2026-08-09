/* eslint-disable no-undef */
/**
 * VersionToolbar Component
 * Top toolbar for package versions
 * 
 * Location: src/components/packageVersions/VersionToolbar.jsx
 */

import { Box, Typography, Button, Tooltip, Badge, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as RegenerateIcon,
  FileDownload as ExportIcon,
  FilterList as FilterIcon,
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon
} from '@mui/icons-material';

const VersionToolbar = ({
  onRefresh,
  onRegenerate,
  onExport,
  totalCount,
  loading = false,
  filterCount = 0,
  canRegenerate = false
}) => {
  const [exportAnchorEl, setExportAnchorEl] = useState(null);

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
          Package Versions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {totalCount} versions found
        </Typography>
      </Box>

      <Box display="flex" gap={1} flexWrap="wrap">
        {canRegenerate && (
          <Tooltip title="Regenerate package">
            <Button
              variant="contained"
              color="primary"
              startIcon={<RegenerateIcon />}
              onClick={onRegenerate}
              disabled={loading}
            >
              Regenerate
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

        <Tooltip title="Export version report">
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
        <MenuItem onClick={() => handleExport('csv')}>
          <ListItemIcon>
            <CsvIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('pdf')}>
          <ListItemIcon>
            <PdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as PDF</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default VersionToolbar;
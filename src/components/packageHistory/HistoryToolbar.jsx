/* eslint-disable no-undef */
/**
 * HistoryToolbar Component
 * Top toolbar for package history
 * 
 * Location: src/components/packageHistory/HistoryToolbar.jsx
 */

import { Box, Typography, Button, Tooltip, Badge, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  Refresh as RefreshIcon,
  FileDownload as ExportIcon,
  Print as PrintIcon,
  FilterList as FilterIcon,
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon
} from '@mui/icons-material';

const HistoryToolbar = ({
  onRefresh,
  onExport,
  onPrint,
  totalCount,
  loading = false,
  filterCount = 0,
  exporting = false,
  printing = false
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
          Package History & Audit Trail
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {totalCount} activities found
        </Typography>
      </Box>

      <Box display="flex" gap={1} flexWrap="wrap">
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

        <Tooltip title="Export audit report">
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={handleExportClick}
            disabled={loading || exporting || totalCount === 0}
          >
            Export
          </Button>
        </Tooltip>

        <Tooltip title="Print audit report">
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={onPrint}
            disabled={loading || printing || totalCount === 0}
          >
            Print
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

export default HistoryToolbar;
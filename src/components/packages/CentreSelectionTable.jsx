/**
 * CentreSelectionTable Component
 * Displays centres for selection
 * 
 * Location: src/components/packages/CentreSelectionTable.jsx
 */

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Box,
  Typography,
  Chip,
  Skeleton,
  Button,
  Tooltip
} from '@mui/material';
import {
  SelectAll as SelectAllIcon,
  Deselect as DeselectIcon
} from '@mui/icons-material';

const CentreSelectionTable = ({
  centres,
  loading = false,
  selectedIds,
  onToggle,
  onSelectAll,
  onDeselectAll
}) => {
  // Loading state
  if (loading) {
    return (
      <Paper>
        <Box sx={{ p: 2 }}>
          <Skeleton variant="text" width="30%" height={40} />
          <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
        </Box>
      </Paper>
    );
  }

  // Empty state
  if (centres.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No centres assigned to this instance
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Please select a different instance or ensure centres are assigned
        </Typography>
      </Paper>
    );
  }

  const allSelected = centres.every(c => selectedIds.includes(c._id));
  const someSelected = centres.some(c => selectedIds.includes(c._id));

  const handleSelectAll = () => {
    if (allSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  return (
    <Paper>
      {/* Toolbar */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1">
          {centres.length} Centres Available
        </Typography>
        <Box>
          <Tooltip title={allSelected ? 'Deselect All' : 'Select All'}>
            <Button
              size="small"
              startIcon={allSelected ? <DeselectIcon /> : <SelectAllIcon />}
              onClick={handleSelectAll}
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Centre</TableCell>
              <TableCell>Code</TableCell>
              <TableCell align="center">Allocated Candidates</TableCell>
              <TableCell align="center">Capacity</TableCell>
              <TableCell align="center">Remaining Slots</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {centres.map((centre) => {
              const isSelected = selectedIds.includes(centre._id);
              const remainingSlots = (centre.capacity || 0) - (centre.allocatedCandidates || 0);
              const isFull = remainingSlots <= 0;

              return (
                <TableRow
                  key={centre._id}
                  hover
                  selected={isSelected}
                  onClick={() => !isFull && onToggle(centre._id)}
                  sx={{ 
                    cursor: isFull ? 'not-allowed' : 'pointer',
                    opacity: isFull ? 0.6 : 1
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => onToggle(centre._id)}
                      disabled={isFull}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{centre.name || centre.centreName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{centre.code || centre.centreCode}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    {centre.allocatedCandidates || 0}
                  </TableCell>
                  <TableCell align="center">
                    {centre.capacity || 0}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={isFull ? 'Full' : remainingSlots}
                      color={isFull ? 'error' : 'success'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={centre.status || 'ACTIVE'}
                      color={centre.status === 'ACTIVE' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary">
          Selected: {selectedIds.length} of {centres.length} centres
        </Typography>
      </Box>
    </Paper>
  );
};

export default CentreSelectionTable;
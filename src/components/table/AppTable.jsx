/* eslint-disable no-unused-vars */
/**
 * App Table Component
 * Reusable table with sorting, pagination, and selection
 */

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Checkbox,
  Box,
  useTheme,
} from '@mui/material';

const AppTable = ({
  columns = [],
  data = [],
  loading = false,
  sortBy,
  sortDirection = 'asc',
  onSort,
  selected = [],
  onSelect,
  onSelectAll,
  selectable = false,
  emptyMessage = 'No data available',
  rowKey = 'id',
  onRowClick,
  stickyHeader = false,
  sx = {},
}) => {
  const theme = useTheme();

  const handleSort = (field) => {
    if (onSort) {
      const isAsc = sortBy === field && sortDirection === 'asc';
      onSort(field, isAsc ? 'desc' : 'asc');
    }
  };

  const handleSelectAll = (event) => {
    if (onSelectAll) {
      onSelectAll(event.target.checked);
    }
  };

  const handleSelect = (id) => {
    if (onSelect) {
      onSelect(id);
    }
  };

  const isSelected = (id) => {
    return selected.includes(id);
  };

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        ...sx,
      }}
    >
      <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
        <Table stickyHeader={stickyHeader}>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox" sx={{ bgcolor: 'background.paper' }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < data.length}
                    checked={data.length > 0 && selected.length === data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  sx={{
                    fontWeight: 600,
                    bgcolor: 'background.paper',
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    ...column.sx,
                  }}
                >
                  {column.sortable !== false ? (
                    <TableSortLabel
                      active={sortBy === column.field}
                      direction={sortBy === column.field ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.field)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Loading skeleton rows
              [...Array(5)].map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Box sx={{ width: 20, height: 20, bgcolor: 'grey.200', borderRadius: 1 }} />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.field}>
                      <Box
                        sx={{
                          height: 20,
                          bgcolor: 'grey.200',
                          borderRadius: 1,
                          width: col.width || '100%',
                          maxWidth: 200,
                        }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  align="center"
                  sx={{ py: 6 }}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                const rowId = row[rowKey] || row.id || row._id;
                const isItemSelected = isSelected(rowId);

                return (
                  <TableRow
                    key={rowId}
                    hover
                    selected={isItemSelected}
                    onClick={() => onRowClick && onRowClick(row)}
                    sx={{
                      cursor: onRowClick ? 'pointer' : 'default',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                      '&.Mui-selected': {
                        bgcolor: 'action.selected',
                      },
                    }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onChange={() => handleSelect(rowId)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell
                        key={col.field}
                        sx={{
                          minWidth: col.minWidth,
                          maxWidth: col.maxWidth,
                          ...col.sx,
                        }}
                      >
                        {col.render ? col.render(row) : row[col.field] ?? '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AppTable;
/**
 * App Pagination Component
 * Reusable pagination with page size selector
 */

import {
  TablePagination,
} from '@mui/material';

const AppPagination = ({
  count = 0,
  page = 0,
  rowsPerPage = 20,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 20, 50, 100],
  showFirstLastButtons = true,
  labelDisplayedRows = ({ from, to, count }) =>
    `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`,
  labelRowsPerPage = 'Rows per page:',
  sx = {},
}) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={rowsPerPageOptions}
      showFirstButton={showFirstLastButtons}
      showLastButton={showFirstLastButtons}
      labelDisplayedRows={labelDisplayedRows}
      labelRowsPerPage={labelRowsPerPage}
      sx={{
        borderTop: '1px solid',
        borderColor: 'divider',
        ...sx,
      }}
    />
  );
};

export default AppPagination;
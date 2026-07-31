/**
 * Media Search Component
 * Search bar for filtering media
 */

import { Box, Stack, Chip } from '@mui/material';
import AppSearchField from '../common/forms/AppSearchField';

const MediaSearch = ({
  searchTerm,
  setSearchTerm,
  onClear,
  placeholder = 'Search by file name or original name...',
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <AppSearchField
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={placeholder}
          fullWidth
          size="small"
        />
        {searchTerm && (
          <Chip
            label="Clear Search"
            onDelete={onClear || (() => setSearchTerm(''))}
            color="primary"
            variant="outlined"
            size="small"
          />
        )}
      </Stack>
    </Box>
  );
};

export default MediaSearch;
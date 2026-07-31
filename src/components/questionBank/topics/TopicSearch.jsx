/**
 * Topic Search Component
 * Search bar for filtering topics
 */

import { Box, Stack, Chip } from '@mui/material';
import AppSearchField from '../../common/forms/AppSearchField';

const TopicSearch = ({
  searchTerm,
  setSearchTerm,
  onClear,
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <AppSearchField
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search topics by name or description..."
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

export default TopicSearch;
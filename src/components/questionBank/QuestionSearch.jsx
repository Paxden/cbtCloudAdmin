/**
 * Question Search Component
 * Search bar for filtering questions
 */

import { Box, Stack, Chip } from '@mui/material';
import AppSearchField from '../common/forms/AppSearchField';

const QuestionSearch = ({
  searchTerm,
  setSearchTerm,
  onClear,
  placeholder = 'Search by code, text, or reference...',
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

export default QuestionSearch;
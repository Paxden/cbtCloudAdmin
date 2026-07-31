/**
 * Search Summary Component
 * Displays search results summary
 */

import {  Typography, Chip, Stack, Paper } from '@mui/material';

const SearchSummary = ({ total, page, limit, loading }) => {
  if (loading) {
    return null;
  }

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        mb: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1,
        bgcolor: 'action.hover',
      }}
    >
      <Typography variant="body2" color="textSecondary">
        {total === 0 ? (
          'No questions found'
        ) : (
          <>
            Showing {start}-{end} of {total} questions
          </>
        )}
      </Typography>

      <Stack direction="row" spacing={1}>
        <Chip
          label={`${total} results`}
          size="small"
          color="primary"
          variant="outlined"
        />
        <Chip
          label={`Page ${page} of ${Math.ceil(total / limit)}`}
          size="small"
          variant="outlined"
        />
      </Stack>
    </Paper>
  );
};

export default SearchSummary;
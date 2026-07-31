/**
 * No Search Results Component
 * Display when search returns no results
 */

import { Box, Typography, Button } from '@mui/material';
import { SearchOff as SearchOffIcon } from '@mui/icons-material';

const NoSearchResults = ({
  searchTerm,
  onClear,
  title = 'No results found',
  description = `We couldn't find any results matching your search.`,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 3,
        textAlign: 'center',
      }}
    >
      <SearchOffIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
      {searchTerm && onClear && (
        <Button variant="outlined" onClick={onClear}>
          Clear Search
        </Button>
      )}
    </Box>
  );
};

export default NoSearchResults;
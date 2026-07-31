/**
 * Search History Drawer Component
 * Displays recent search history
 */

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Stack,
} from '@mui/material';
import {
  Close as CloseIcon,
  History as HistoryIcon,
  ClearAll as ClearAllIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const SearchHistoryDrawer = ({
  open,
  history,
  onClose,
  onApplySearch,
  onClearHistory,
}) => {
  const getFilterSummary = (filters) => {
    const parts = [];
    if (filters.keyword) parts.push(`"${filters.keyword}"`);
    if (filters.categories?.length) parts.push(`${filters.categories.length} categories`);
    if (filters.subjects?.length) parts.push(`${filters.subjects.length} subjects`);
    if (filters.statuses?.length) parts.push(filters.statuses.join(', '));
    if (filters.difficulties?.length) parts.push(`${filters.difficulties.length} difficulties`);
    return parts.join(' • ') || 'No filters';
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          p: 2,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Search History
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body2" color="textSecondary">
          {history.length} searches
        </Typography>
        {history.length > 0 && (
          <Button
            size="small"
            color="error"
            startIcon={<ClearAllIcon />}
            onClick={onClearHistory}
          >
            Clear All
          </Button>
        )}
      </Box>

      {/* History List */}
      {history.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="textSecondary">
            No search history yet
          </Typography>
        </Box>
      ) : (
        <List sx={{ flex: 1, overflow: 'auto' }}>
          {history.map((item, index) => (
            <ListItem
              key={item.id || index}
              divider={index < history.length - 1}
              sx={{
                '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' },
                borderRadius: 1,
              }}
              onClick={() => onApplySearch(item.filters)}
            >
              <ListItemIcon>
                <SearchIcon color="action" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight={500} noWrap>
                      {item.filters.keyword || 'Advanced Search'}
                    </Typography>
                    <Chip
                      label={Object.keys(item.filters).filter(
                        (k) => item.filters[k] && item.filters[k] !== '' && item.filters[k] !== false
                      ).length}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="textSecondary">
                      {getFilterSummary(item.filters)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {item.timestamp ? format(new Date(item.timestamp), 'dd/MM/yyyy HH:mm') : 'Recently'}
                    </Typography>
                  </Stack>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Drawer>
  );
};

export default SearchHistoryDrawer;
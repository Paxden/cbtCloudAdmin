/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Advanced Question Search Page
 * Main page for advanced search and filtering
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import { History as HistoryIcon, Save as SaveIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import AdvancedSearchPanel from '../../components/questionSearch/AdvancedSearchPanel';
import SearchResultTable from '../../components/questionSearch/SearchResultTable';
import SearchSummary from '../../components/questionSearch/SearchSummary';
import FilterChips from '../../components/questionSearch/FilterChips';
import BulkActionToolbar from '../../components/questionSearch/BulkActionToolbar';
import SavedSearchDialog from '../../components/questionSearch/SavedSearchDialog';
import SearchHistoryDrawer from '../../components/questionSearch/SearchHistoryDrawer';
import * as searchService from '../../services/questionSearch/questionSearchService';

// Helper function to get user role
const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') return user.role.name || 'USER';
  return 'USER';
};

const AdvancedQuestionSearch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  // State
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({});
  const [selected, setSelected] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  // Dialog states
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Toast notifications
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load search history on mount
  useEffect(() => {
    const history = searchService.getSearchHistory();
    setSearchHistory(history);
  }, []);

  // Perform search
  const performSearch = useCallback(async (searchFilters, pageNum = page) => {
    setLoading(true);
    try {
      const params = {
        ...searchFilters,
        page: pageNum + 1,
        limit,
      };

      // EXAM_MANAGER can only see published questions
      if (userRole === 'EXAM_MANAGER') {
        params.status = 'PUBLISHED';
      }

      const response = await searchService.searchQuestions(params);
      setResults(response.data || []);
      setTotal(response.total || 0);

      // Add to history
      if (Object.keys(searchFilters).length > 0) {
        searchService.addToSearchHistory({ filters: searchFilters });
        const updatedHistory = searchService.getSearchHistory();
        setSearchHistory(updatedHistory);
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Search failed',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, userRole]);

  // Handle search
  const handleSearch = (newFilters) => {
    setPage(0);
    setFilters(newFilters);
    performSearch(newFilters, 0);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
    performSearch(filters, newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(0);
    performSearch(filters, 0);
  };

  // Handle filter chip removal
  const handleRemoveFilter = (key, value) => {
    const newFilters = { ...filters };
    if (Array.isArray(newFilters[key])) {
      newFilters[key] = newFilters[key].filter((item) => item !== value);
      if (newFilters[key].length === 0) {
        delete newFilters[key];
      }
    } else {
      delete newFilters[key];
    }
    setFilters(newFilters);
    performSearch(newFilters, 0);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSelected([]);
    performSearch({}, 0);
  };

  // Handle selection
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelected(results.map((r) => r._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  // Handle view/edit/duplicate
  const handleView = (question) => {
    navigate(`/question-bank/questions/${question._id}`);
  };

  const handleEdit = (question) => {
    navigate(`/question-bank/questions/${question._id}/edit`);
  };

  const handleDuplicate = (question) => {
    // Placeholder for duplicate action
    setToast({
      open: true,
      message: `Duplicating question ${question.questionCode}`,
      severity: 'success',
    });
  };

  // Handle save search
  const handleSaveSearch = async (data) => {
    setSaveLoading(true);
    setSaveError(null);
    try {
      const response = await searchService.saveSearch(data);
      if (response.success) {
        setToast({
          open: true,
          message: 'Search saved successfully',
          severity: 'success',
        });
        setSaveDialogOpen(false);
        // Refresh saved searches
        const saved = await searchService.getSavedSearches();
        setSavedSearches(saved.data || []);
      }
    } catch (error) {
      setSaveError(error.message || 'Failed to save search');
    } finally {
      setSaveLoading(false);
    }
  };

  // Bulk actions (placeholders for now)
  const handleBulkArchive = (ids) => {
    setToast({
      open: true,
      message: `Archiving ${ids.length} questions...`,
      severity: 'success',
    });
    setSelected([]);
  };

  const handleBulkSubmitReview = (ids) => {
    setToast({
      open: true,
      message: `Submitting ${ids.length} questions for review...`,
      severity: 'success',
    });
    setSelected([]);
  };

  const handleBulkPublish = (ids) => {
    setToast({
      open: true,
      message: `Publishing ${ids.length} questions...`,
      severity: 'success',
    });
    setSelected([]);
  };

  const handleBulkExport = (ids) => {
    setToast({
      open: true,
      message: `Exporting ${ids.length} questions...`,
      severity: 'success',
    });
  };

  // Handle history apply
  const handleApplyHistory = (historyFilters) => {
    setFilters(historyFilters);
    performSearch(historyFilters, 0);
    setHistoryDrawerOpen(false);
  };

  const handleClearHistory = () => {
    searchService.clearSearchHistory();
    setSearchHistory([]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Advanced Search"
        subtitle="Find questions with powerful filters and search capabilities"
        actions={
          <Stack direction="row" spacing={1}>
            <Tooltip title="Search History">
              <IconButton onClick={() => setHistoryDrawerOpen(true)}>
                <HistoryIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save Current Search">
              <IconButton
                onClick={() => setSaveDialogOpen(true)}
                disabled={Object.keys(filters).length === 0}
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        }
      />

      {/* Search Panel */}
      <AdvancedSearchPanel
        onSearch={handleSearch}
        onSaveSearch={() => setSaveDialogOpen(true)}
        loading={loading}
        initialFilters={filters}
      />

      {/* Filter Chips */}
      <FilterChips
        filters={filters}
        onRemove={handleRemoveFilter}
        onClearAll={handleClearFilters}
      />

      {/* Bulk Actions */}
      <BulkActionToolbar
        selected={selected}
        onClearSelection={() => setSelected([])}
        onArchive={handleBulkArchive}
        onSubmitReview={handleBulkSubmitReview}
        onPublish={handleBulkPublish}
        onExport={handleBulkExport}
        loading={loading}
      />

      {/* Search Summary */}
      <SearchSummary total={total} page={page + 1} limit={limit} loading={loading} />

      {/* Results Table */}
      <SearchResultTable
        results={results}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onView={handleView}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        selected={selected}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
      />

      {/* Save Search Dialog */}
      <SavedSearchDialog
        open={saveDialogOpen}
        onClose={() => {
          setSaveDialogOpen(false);
          setSaveError(null);
        }}
        onSave={handleSaveSearch}
        currentFilters={filters}
        loading={saveLoading}
        error={saveError}
      />

      {/* Search History Drawer */}
      <SearchHistoryDrawer
        open={historyDrawerOpen}
        history={searchHistory}
        onClose={() => setHistoryDrawerOpen(false)}
        onApplySearch={handleApplyHistory}
        onClearHistory={handleClearHistory}
      />

      {/* Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdvancedQuestionSearch;
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Assignment History Page
 * View history of centre assignments
 */

import  { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Button,
  Stack,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import AssignmentHistoryTable from '../../components/centreAssignment/AssignmentHistoryTable';
import * as centreAssignmentService from '../../services/centreAssignment/centreAssignmentService';
import * as examinationService from '../../services/examination/examinationService';

const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') {
    return user.role.name || user.role.role || 'USER';
  }
  return 'USER';
};

const AssignmentHistory = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const selectedExaminationId = searchParams.get('examinationId') || '';

  const canView = ['SUPER_ADMIN', 'TECH_ADMIN', 'EXAM_MANAGER'].includes(userRole);

  // State
  const [examinations, setExaminations] = useState([]);
  const [examinationsLoading, setExaminationsLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    centreId: '',
    assignedBy: '',
    dateFrom: '',
    dateTo: '',
  });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Load examinations
  const loadExaminations = useCallback(async () => {
    setExaminationsLoading(true);
    try {
      const response = await examinationService.getExaminations({ limit: 100 });
      let examList = [];
      if (response.success) {
        examList = response.data || [];
      } else if (Array.isArray(response)) {
        examList = response;
      } else if (response.data && Array.isArray(response.data)) {
        examList = response.data;
      }
      setExaminations(examList);
    } catch (err) {
      console.error('Failed to load examinations:', err);
    } finally {
      setExaminationsLoading(false);
    }
  }, []);

  // Load history
  const loadHistory = useCallback(async () => {
    if (!selectedExaminationId) {
      setHistoryData([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit,
        ...filters,
      };
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await centreAssignmentService.getAssignmentHistory(
        selectedExaminationId,
        params
      );
      if (response.success) {
        setHistoryData(response.data || []);
        setTotal(response.meta?.total || response.total || 0);
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to load history',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [selectedExaminationId, page, limit, filters]);

  // Initial load
  useEffect(() => {
    loadExaminations();
  }, [loadExaminations]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Handle examination change
  const handleExaminationChange = (examId) => {
    setSearchParams({ examinationId: examId });
    setPage(0);
    setFilters({
      search: '',
      centreId: '',
      assignedBy: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      centreId: '',
      assignedBy: '',
      dateFrom: '',
      dateTo: '',
    });
    setPage(0);
  };

  const handleRefresh = () => {
    loadHistory();
  };

  const handleBack = () => {
    navigate('/centre-assignment');
  };

  // Check permissions
  if (!canView) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Alert severity="error">
          You do not have permission to view assignment history. Please contact your administrator.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back
        </Button>
      </Container>
    );
  }

  const selectedExam = examinations.find(e => e._id === selectedExaminationId);

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Assignment History"
        subtitle="View assignment history for examination centres"
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={handleBack}
            >
              Back
            </Button>
          </Stack>
        }
      />

      {/* Examination Selector */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Select Examination</InputLabel>
              <Select
                value={selectedExaminationId}
                onChange={(e) => handleExaminationChange(e.target.value)}
                label="Select Examination"
                disabled={examinationsLoading}
              >
                <MenuItem value="">
                  <em>Select an examination</em>
                </MenuItem>
                {examinations.map((exam) => (
                  <MenuItem key={exam._id} value={exam._id}>
                    {exam.name} ({exam.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {selectedExaminationId && selectedExam && (
            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Chip label={selectedExam.name} color="primary" />
                <Chip label={selectedExam.code} variant="outlined" size="small" />
                <Chip label={selectedExam.status} variant="outlined" size="small" />
                {examinationsLoading && <CircularProgress size={24} />}
              </Stack>
            </Grid>
          )}
        </Grid>
      </Paper>

      {selectedExaminationId ? (
        <>
          {/* Filters */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: filters.search && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => handleFilterChange('search', '')}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Date From"
                  type="date"
                  size="small"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Date To"
                  type="date"
                  size="small"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Assigned By"
                  size="small"
                  value={filters.assignedBy}
                  onChange={(e) => handleFilterChange('assignedBy', e.target.value)}
                  fullWidth
                  placeholder="User name"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={handleClearFilters}
                  disabled={!Object.values(filters).some(v => v)}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* History Table */}
          <AssignmentHistoryTable
            data={historyData}
            loading={loading}
            page={page}
            limit={limit}
            total={total}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </>
      ) : (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Please select an examination to view assignment history.
          </Typography>
          {examinationsLoading ? (
            <CircularProgress size={24} sx={{ mt: 2 }} />
          ) : examinations.length === 0 ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                No examinations available.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/examinations/create')}
                sx={{ mt: 2 }}
              >
                Create Examination
              </Button>
            </Box>
          ) : null}
        </Box>
      )}

      {/* Toast */}
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

export default AssignmentHistory;
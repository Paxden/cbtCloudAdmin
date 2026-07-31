/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Examination Validation Page
 * Main page for validation and pre-deployment checks
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Stack,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Refresh as RefreshIcon,
  PlayArrow as RunIcon,
  CheckCircle as ApproveIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
  Description as ReportIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import ValidationSummaryCards from '../../components/examinationValidation/ValidationSummaryCards';
import ValidationChecklist from '../../components/examinationValidation/ValidationChecklist';
import ValidationResultTable from '../../components/examinationValidation/ValidationResultTable';
import ValidationHistoryTable from '../../components/examinationValidation/ValidationHistoryTable';
import ValidationLogsDrawer from '../../components/examinationValidation/ValidationLogsDrawer';
import ValidationStatusChip from '../../components/examinationValidation/ValidationStatusChip';
import * as validationService from '../../services/examinationValidation/examinationValidationService';
import * as examinationService from '../../services/examination/examinationService';

const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') {
    return user.role.name || user.role.role || 'USER';
  }
  return 'USER';
};

const TABS = [
  { id: 'results', label: 'Results' },
  { id: 'checklist', label: 'Checklist' },
  { id: 'history', label: 'History' },
];

const ExaminationValidation = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const selectedExaminationId = searchParams.get('examinationId') || '';

  const canValidate = ['SUPER_ADMIN', 'TECH_ADMIN', 'EXAM_MANAGER'].includes(userRole);
  const canApprove = ['SUPER_ADMIN', 'TECH_ADMIN'].includes(userRole);
  const canDownload = ['SUPER_ADMIN', 'TECH_ADMIN'].includes(userRole);
  const canViewHistory = ['SUPER_ADMIN', 'TECH_ADMIN', 'EXAM_MANAGER'].includes(userRole);

  // State
  const [examinations, setExaminations] = useState([]);
  const [examinationsLoading, setExaminationsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [validationHistory, setValidationHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [logsOpen, setLogsOpen] = useState(false);
  const [selectedValidation, setSelectedValidation] = useState(null);
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

  // Load validation result
  const loadValidationResult = useCallback(async () => {
    if (!selectedExaminationId) {
      setValidationResult(null);
      setStats(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await validationService.getLatestValidation(selectedExaminationId);
      console.log('📋 Validation result:', response);

      if (response && response.success) {
        setValidationResult(response.data);
        setStats(response.data);
      } else {
        setValidationResult(null);
        setStats(null);
      }
    } catch (err) {
      console.error('❌ Failed to load validation:', err);
      setValidationResult(null);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [selectedExaminationId]);

  // Load validation history
  const loadValidationHistory = useCallback(async () => {
    if (!selectedExaminationId) {
      setValidationHistory([]);
      setTotal(0);
      return;
    }

    try {
      const params = {
        page: page + 1,
        limit,
        sort: '-validatedAt',
      };
      const response = await validationService.getValidationHistory(selectedExaminationId, params);
      if (response && response.success) {
        setValidationHistory(response.data || []);
        setTotal(response.meta?.total || 0);
      }
    } catch (err) {
      console.error('Failed to load validation history:', err);
      setValidationHistory([]);
      setTotal(0);
    }
  }, [selectedExaminationId, page, limit]);

  // Initial load
  useEffect(() => {
    loadExaminations();
  }, [loadExaminations]);

  useEffect(() => {
    if (selectedExaminationId) {
      loadValidationResult();
      if (currentTab === 2) {
        loadValidationHistory();
      }
    }
  }, [selectedExaminationId, currentTab, loadValidationResult, loadValidationHistory]);

  // Handle examination change
  const handleExaminationChange = (examId) => {
    setSearchParams({ examinationId: examId });
    setValidationResult(null);
    setStats(null);
    setValidationHistory([]);
  };

  // Handle run validation
  const handleRunValidation = async () => {
    setRunning(true);
    try {
      const response = await validationService.runValidation(selectedExaminationId, {
        comments: 'Manual validation run',
      });

      console.log('📋 Validation response:', response);

      if (response && response.success) {
        setValidationResult(response.data);
        setStats(response.data);
        setToast({
          open: true,
          message: response.data.status === 'PASSED'
            ? '✅ Validation passed! Examination is ready for deployment.'
            : '⚠️ Validation completed with issues. Please review the results.',
          severity: response.data.status === 'PASSED' ? 'success' : 'error',
        });
        loadValidationResult();
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to run validation',
        severity: 'error',
      });
    } finally {
      setRunning(false);
    }
  };

  // Handle view logs
  const handleViewLogs = (validation) => {
    setSelectedValidation(validation);
    setLogsOpen(true);
  };

  // Handle back
  const handleBack = () => {
    navigate('/examinations');
  };

  // Handle refresh
  const handleRefresh = () => {
    loadValidationResult();
    if (currentTab === 2) {
      loadValidationHistory();
    }
  };

  const selectedExam = examinations.find(e => e._id === selectedExaminationId);
  const isPassed = validationResult?.status === 'PASSED';

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Examination Validation"
        subtitle="Final validation and pre-deployment checks"
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            {canValidate && selectedExaminationId && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<RunIcon />}
                onClick={handleRunValidation}
                disabled={running}
              >
                {running ? 'Running...' : 'Run Validation'}
              </Button>
            )}
            {canDownload && selectedExaminationId && validationResult && (
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
              >
                Export Report
              </Button>
            )}
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
                {validationResult && (
                  <ValidationStatusChip status={validationResult.status} size="medium" />
                )}
                {examinationsLoading && <CircularProgress size={24} />}
              </Stack>
            </Grid>
          )}
        </Grid>
      </Paper>

      {selectedExaminationId ? (
        <>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Summary Cards */}
              <ValidationSummaryCards stats={validationResult || stats} loading={loading} />

              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                  value={currentTab}
                  onChange={(e, v) => {
                    setCurrentTab(v);
                    if (v === 2) {
                      loadValidationHistory();
                    }
                  }}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {TABS.map((tab) => (
                    <Tab key={tab.id} label={tab.label} />
                  ))}
                </Tabs>
              </Box>

              {/* Tab Content */}
              {currentTab === 0 && (
                <ValidationResultTable
                  results={validationResult?.checks || []}
                  loading={loading}
                  onView={handleViewLogs}
                  canView={canValidate}
                />
              )}

              {currentTab === 1 && (
                <ValidationChecklist
                  items={validationResult?.checks || []}
                  loading={loading}
                  progress={validationResult?.validationScore || 0}
                />
              )}

              {currentTab === 2 && (
                <ValidationHistoryTable
                  data={validationHistory}
                  loading={loading}
                  page={page}
                  limit={limit}
                  total={total}
                  onPageChange={setPage}
                  onLimitChange={setLimit}
                  onView={handleViewLogs}
                />
              )}
            </>
          )}
        </>
      ) : (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Please select an examination to validate.
          </Typography>
        </Box>
      )}

      {/* Logs Drawer */}
      <ValidationLogsDrawer
        open={logsOpen}
        onClose={() => setLogsOpen(false)}
        logs={selectedValidation?.logs || []}
        loading={false}
        validationId={selectedValidation?._id}
      />

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

export default ExaminationValidation;
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Examination Schedule Page
 * Main page for scheduling examinations
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
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  CheckCircle as ValidateIcon,
  Publish as PublishIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import ScheduleSummaryCards from '../../components/examinationSchedule/ScheduleSummaryCards';
import SessionTable from '../../components/examinationSchedule/SessionTable';
import SessionForm from '../../components/examinationSchedule/SessionForm';
import SessionStatusChip from '../../components/examinationSchedule/SessionStatusChip';
import ScheduleValidationPanel from '../../components/examinationSchedule/ScheduleValidationPanel';
import * as scheduleService from '../../services/examinationSchedule/examinationScheduleService';
import * as examinationService from '../../services/examination/examinationService';
import * as centreService from '../../services/centres/centreService';

const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') {
    return user.role.name || user.role.role || 'USER';
  }
  return 'USER';
};

const ExaminationSchedule = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const selectedExaminationId = searchParams.get('examinationId') || '';

  const canManage = ['SUPER_ADMIN', 'TECH_ADMIN', 'EXAM_MANAGER'].includes(userRole);
  const canPublish = ['SUPER_ADMIN', 'TECH_ADMIN'].includes(userRole);

  // State
  const [examinations, setExaminations] = useState([]);
  const [examinationsLoading, setExaminationsLoading] = useState(false);
  const [centres, setCentres] = useState([]);
  const [centresLoading, setCentresLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [validation, setValidation] = useState(null);
  const [validationLoading, setValidationLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
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

  // Load centres
  const loadCentres = useCallback(async () => {
    setCentresLoading(true);
    try {
      const response = await centreService.getCentres({ status: 'ACTIVE', limit: 100 });
      let centreList = [];
      if (response.success) {
        centreList = response.data || [];
      } else if (Array.isArray(response)) {
        centreList = response;
      } else if (response.data && Array.isArray(response.data)) {
        centreList = response.data;
      }
      setCentres(centreList);
    } catch (err) {
      console.error('Failed to load centres:', err);
    } finally {
      setCentresLoading(false);
    }
  }, []);

  // Load sessions
  const loadSessions = useCallback(async () => {
    if (!selectedExaminationId) {
      setSessions([]);
      setStats(null);
      setTotal(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const params = { page: page + 1, limit };
      const response = await scheduleService.getSessions(selectedExaminationId, params);
      console.log('📋 Sessions response:', response);

      if (response && response.success) {
        setSessions(response.data || []);
        setTotal(response.meta?.total || 0);
        // Calculate stats
        const data = response.data || [];
        const statsData = {
          totalSessions: data.length,
          scheduled: data.filter(s => s.status === 'SCHEDULED').length,
          running: data.filter(s => s.status === 'RUNNING').length,
          completed: data.filter(s => s.status === 'COMPLETED').length,
          centresScheduled: new Set(data.map(s => s.centreId?._id || s.centreId)).size,
          conflicts: 0, // Will be calculated from validation
        };
        setStats(statsData);
      } else {
        setSessions([]);
        setStats(null);
        setTotal(0);
      }
    } catch (err) {
      console.error('❌ Failed to load sessions:', err);
      setSessions([]);
      setStats(null);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [selectedExaminationId, page, limit]);

  // Initial load
  useEffect(() => {
    loadExaminations();
    loadCentres();
  }, [loadExaminations, loadCentres]);

  useEffect(() => {
    if (selectedExaminationId) {
      loadSessions();
    }
  }, [selectedExaminationId, loadSessions]);

  // Handle examination change
  const handleExaminationChange = (examId) => {
    setSearchParams({ examinationId: examId });
    setSessions([]);
    setStats(null);
    setValidation(null);
    setPage(0);
  };

  // Handle create/update session
  const handleSaveSession = async (data) => {
    setSaving(true);
    try {
      let response;
      if (editingSession) {
        response = await scheduleService.updateSession(editingSession._id, data);
      } else {
        response = await scheduleService.createSession(selectedExaminationId, data);
      }

      if (response && response.success) {
        setDialogOpen(false);
        setEditingSession(null);
        setToast({
          open: true,
          message: editingSession ? 'Session updated successfully' : 'Session created successfully',
          severity: 'success',
        });
        loadSessions();
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to save session',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete session
  const handleDeleteSession = async (session) => {
    if (!window.confirm(`Are you sure you want to delete session "${session.sessionName || session.name}"?`)) {
      return;
    }

    try {
      const response = await scheduleService.deleteSession(session._id, {
        reason: 'Deleted by administrator',
      });
      if (response && response.success) {
        setToast({
          open: true,
          message: 'Session deleted successfully',
          severity: 'success',
        });
        loadSessions();
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to delete session',
        severity: 'error',
      });
    }
  };

  // Handle cancel session
  const handleCancelSession = async (session) => {
    if (!window.confirm(`Are you sure you want to cancel session "${session.sessionName || session.name}"?`)) {
      return;
    }

    try {
      const response = await scheduleService.cancelSession(session._id, {
        reason: 'Cancelled by administrator',
      });
      if (response && response.success) {
        setToast({
          open: true,
          message: 'Session cancelled successfully',
          severity: 'success',
        });
        loadSessions();
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to cancel session',
        severity: 'error',
      });
    }
  };

  // Handle schedule session (DRAFT -> SCHEDULED)
  const handleScheduleSession = async (session) => {
    try {
      const response = await scheduleService.scheduleSession(session._id);
      if (response && response.success) {
        setToast({
          open: true,
          message: 'Session scheduled successfully',
          severity: 'success',
        });
        loadSessions();
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to schedule session',
        severity: 'error',
      });
    }
  };

  // Handle validate schedule
  const handleValidateSchedule = async () => {
    setValidationLoading(true);
    try {
      const response = await scheduleService.validateSchedule(selectedExaminationId);
      if (response && response.success) {
        setValidation(response.data);
        setToast({
          open: true,
          message: response.data.isValid ? 'Schedule is valid!' : 'Schedule has issues',
          severity: response.data.isValid ? 'success' : 'error',
        });
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to validate schedule',
        severity: 'error',
      });
    } finally {
      setValidationLoading(false);
    }
  };

  // Handle publish schedule
  const handlePublishSchedule = async () => {
    if (!window.confirm('Are you sure you want to publish this schedule?')) {
      return;
    }

    try {
      const response = await scheduleService.publishSchedule(selectedExaminationId, {
        comments: 'Published for deployment',
      });
      if (response && response.success) {
        setToast({
          open: true,
          message: 'Schedule published successfully',
          severity: 'success',
        });
        loadSessions();
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to publish schedule',
        severity: 'error',
      });
    }
  };

  // Handle back
  const handleBack = () => {
    navigate('/examinations');
  };

  const selectedExam = examinations.find(e => e._id === selectedExaminationId);
  const isPublished = sessions.some(s => s.status === 'SCHEDULED' || s.status === 'RUNNING' || s.status === 'COMPLETED');

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Examination Schedule"
        subtitle="Schedule examination sessions across centres"
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadSessions}
            >
              Refresh
            </Button>
            {canManage && selectedExaminationId && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditingSession(null);
                  setDialogOpen(true);
                }}
                disabled={!centres.length}
              >
                Add Session
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
                <Chip
                  label={`${sessions.length} sessions`}
                  color="info"
                  variant="outlined"
                  size="small"
                />
                {examinationsLoading && <CircularProgress size={24} />}
              </Stack>
            </Grid>
          )}
        </Grid>
      </Paper>

      {selectedExaminationId ? (
        <>
          {/* Loading State */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Summary Cards */}
              <ScheduleSummaryCards stats={stats} loading={loading} />

              {/* Action Buttons */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<ValidateIcon />}
                    onClick={handleValidateSchedule}
                    disabled={!sessions.length || validationLoading}
                  >
                    {validationLoading ? 'Validating...' : 'Validate'}
                  </Button>
                  {canPublish && sessions.length > 0 && !isPublished && (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<PublishIcon />}
                      onClick={handlePublishSchedule}
                    >
                      Publish Schedule
                    </Button>
                  )}
                </Stack>
              </Paper>

              {/* Session Table */}
              <SessionTable
                sessions={sessions}
                loading={loading}
                page={page}
                limit={limit}
                total={total}
                onPageChange={setPage}
                onLimitChange={setLimit}
                onView={(session) => {
                  // Open details drawer
                  setEditingSession(session);
                  setDialogOpen(true);
                }}
                onEdit={(session) => {
                  setEditingSession(session);
                  setDialogOpen(true);
                }}
                onDelete={handleDeleteSession}
                onCancel={handleCancelSession}
                onSchedule={handleScheduleSession}
                canEdit={canManage}
                canDelete={canManage}
                canSchedule={canManage}
                isPublished={isPublished}
              />

              {/* Session Dialog */}
              <Dialog
                open={dialogOpen}
                onClose={() => {
                  setDialogOpen(false);
                  setEditingSession(null);
                }}
                maxWidth="md"
                fullWidth
              >
                <DialogTitle>
                  {editingSession ? 'Edit Session' : 'Create Session'}
                </DialogTitle>
                <DialogContent dividers>
                  <SessionForm
                    initialData={editingSession}
                    onSubmit={handleSaveSession}
                    onCancel={() => {
                      setDialogOpen(false);
                      setEditingSession(null);
                    }}
                    loading={saving}
                    isEdit={!!editingSession}
                    centres={centres}
                    examinations={examinations}
                    selectedExaminationId={selectedExaminationId}
                    readOnly={false}
                  />
                </DialogContent>
              </Dialog>

              {/* Validation Panel */}
              {validation && (
                <ScheduleValidationPanel validation={validation} loading={validationLoading} />
              )}
            </>
          )}
        </>
      ) : (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Please select an examination to manage its schedule.
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

export default ExaminationSchedule;
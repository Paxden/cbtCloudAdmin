/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Examination Preview Page
 * Main page for examination preview and readiness dashboard
 */

import React, { useState, useEffect, useCallback } from 'react';
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
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tabs,
  Tab,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Refresh as RefreshIcon,
  CheckCircle as ApproveIcon,
  Download as DownloadIcon,
  Visibility as PreviewIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import ReadinessScoreCard from '../../components/examinationPreview/ReadinessScoreCard';
import ExecutiveSummaryCards from '../../components/examinationPreview/ExecutiveSummaryCards';
import ReadinessChecklist from '../../components/examinationPreview/ReadinessChecklist';
import MissingConfigurationCard from '../../components/examinationPreview/MissingConfigurationCard';
import CandidatePreviewDialog from '../../components/examinationPreview/CandidatePreviewDialog';
import PublishReadinessDialog from '../../components/examinationPreview/PublishReadinessDialog';
import * as previewService from '../../services/examinationPreview/examinationPreviewService';
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
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'Details' },
  { id: 'checklist', label: 'Checklist' },
];

const ExaminationPreview = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const selectedExaminationId = searchParams.get('examinationId') || '';

  const canApprove = ['SUPER_ADMIN', 'TECH_ADMIN'].includes(userRole);
  const canExport = ['SUPER_ADMIN', 'TECH_ADMIN'].includes(userRole);
  const canView = ['SUPER_ADMIN', 'TECH_ADMIN', 'EXAM_MANAGER'].includes(userRole);

  // State
  const [examinations, setExaminations] = useState([]);
  const [examinationsLoading, setExaminationsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [candidatePreviewOpen, setCandidatePreviewOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [approveComments, setApproveComments] = useState('');
  const [approving, setApproving] = useState(false);
  const [exporting, setExporting] = useState(false);
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

  // Load preview data
  const loadPreview = useCallback(async () => {
    if (!selectedExaminationId) {
      setPreview(null);
      setReadiness(null);
      setChecklist(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [previewRes, readinessRes, checklistRes] = await Promise.all([
        previewService.getPreview(selectedExaminationId),
        previewService.getReadiness(selectedExaminationId),
        previewService.getChecklist(selectedExaminationId),
      ]);

      console.log('📋 Preview response:', previewRes);
      console.log('📋 Readiness response:', readinessRes);
      console.log('📋 Checklist response:', checklistRes);

      if (previewRes && previewRes.success) {
        setPreview(previewRes.data);
      }

      if (readinessRes && readinessRes.success) {
        setReadiness(readinessRes.data);
      }

      if (checklistRes && checklistRes.success) {
        setChecklist(checklistRes.data);
      }
    } catch (err) {
      console.error('❌ Failed to load preview:', err);
      setToast({
        open: true,
        message: err.message || 'Failed to load preview data',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [selectedExaminationId]);

  // Initial load
  useEffect(() => {
    loadExaminations();
  }, [loadExaminations]);

  useEffect(() => {
    if (selectedExaminationId) {
      loadPreview();
    }
  }, [selectedExaminationId, loadPreview]);

  // Handle examination change
  const handleExaminationChange = (examId) => {
    setSearchParams({ examinationId: examId });
    setPreview(null);
    setReadiness(null);
    setChecklist(null);
  };

  // Handle approve
  const handleApprove = async () => {
    setApproving(true);
    try {
      const response = await previewService.approvePreview(selectedExaminationId, {
        comments: approveComments || 'Approved for validation',
      });

      if (response && response.success) {
        setApproveDialogOpen(false);
        setApproveComments('');
        setToast({
          open: true,
          message: 'Examination approved for validation!',
          severity: 'success',
        });
        loadPreview();
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to approve examination',
        severity: 'error',
      });
    } finally {
      setApproving(false);
    }
  };

  // Handle export
  const handleExport = async (format = 'pdf') => {
    setExporting(true);
    try {
      const blob = await previewService.exportPreview(selectedExaminationId, {
        format,
        sections: 'all',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `preview_report_${selectedExaminationId}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setToast({
        open: true,
        message: 'Export completed successfully',
        severity: 'success',
      });
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to export preview',
        severity: 'error',
      });
    } finally {
      setExporting(false);
    }
  };

  // Handle back
  const handleBack = () => {
    navigate('/examinations');
  };

  // Handle navigation to fix missing items
  const handleNavigateToFix = (path) => {
    navigate(path);
  };

  const selectedExam = examinations.find(e => e._id === selectedExaminationId);

  // Check permissions
  if (!canView) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You do not have permission to view the examination preview.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Examinations
        </Button>
      </Box>
    );
  }

  // Get missing items from readiness
  const missingItems = readiness?.missingDetails || [];

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Examination Preview"
        subtitle="Review examination readiness before validation"
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadPreview}
            >
              Refresh
            </Button>
            {canExport && selectedExaminationId && (
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport('pdf')}
                disabled={exporting}
              >
                {exporting ? 'Exporting...' : 'Export Report'}
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={() => setCandidatePreviewOpen(true)}
              disabled={!preview}
            >
              Candidate Preview
            </Button>
            {canApprove && selectedExaminationId && readiness?.isReady && (
              <Button
                variant="contained"
                color="success"
                startIcon={<ApproveIcon />}
                onClick={() => setApproveDialogOpen(true)}
              >
                Approve for Validation
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
                {readiness && (
                  <Chip
                    label={`${readiness.percentage || 0}% Ready`}
                    color={readiness.percentage >= 90 ? 'success' : readiness.percentage >= 70 ? 'warning' : 'error'}
                  />
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
              {/* Readiness Score */}
              <ReadinessScoreCard readiness={readiness} loading={loading} />

              {/* Missing Configuration */}
              {missingItems.length > 0 && (
                <MissingConfigurationCard
                  missingItems={missingItems}
                  readiness={readiness}
                  onNavigate={handleNavigateToFix}
                />
              )}

              {/* Executive Summary */}
              <ExecutiveSummaryCards preview={preview} loading={loading} />

              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                  value={currentTab}
                  onChange={(e, v) => setCurrentTab(v)}
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
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        Examination Summary
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Stack spacing={1}>
                        <DetailItem label="Name" value={preview?.examination?.name} />
                        <DetailItem label="Code" value={preview?.examination?.code} />
                        <DetailItem label="Type" value={preview?.examination?.examinationType} />
                        <DetailItem label="Status" value={preview?.examination?.status} />
                        <DetailItem label="Version" value={`v${preview?.examination?.version || 1}`} />
                      </Stack>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        Quick Stats
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Stack spacing={1}>
                        <DetailItem label="Total Candidates" value={preview?.candidates?.total || 0} />
                        <DetailItem label="Assigned Candidates" value={preview?.candidates?.assignedToCentres || 0} />
                        <DetailItem label="Total Centres" value={preview?.centres?.total || 0} />
                        <DetailItem label="Total Questions" value={preview?.blueprint?.totalQuestions || 0} />
                        <DetailItem label="Total Marks" value={preview?.blueprint?.totalMarks || 0} />
                        <DetailItem label="Duration" value={`${preview?.blueprint?.duration || 0} min`} />
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              )}

              {currentTab === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Modules Status
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Stack spacing={1}>
                        <ModuleStatusItem
                          label="Blueprint"
                          status={preview?.blueprint ? 'Complete' : 'Missing'}
                          details={preview?.blueprint?.name}
                        />
                        <ModuleStatusItem
                          label="Question Paper"
                          status={preview?.paper ? 'Complete' : 'Missing'}
                          details={`${preview?.paper?.totalQuestions || 0} questions`}
                        />
                        <ModuleStatusItem
                          label="Policy Rules"
                          status={preview?.policy ? 'Complete' : 'Missing'}
                          details={preview?.policy?.name}
                        />
                        <ModuleStatusItem
                          label="Schedule"
                          status={preview?.schedule ? 'Complete' : 'Missing'}
                          details={`${preview?.schedule?.totalSessions || 0} sessions`}
                        />
                        <ModuleStatusItem
                          label="Instructions"
                          status={preview?.instructions ? 'Complete' : 'Missing'}
                          details={`${preview?.instructions?.total || 0} instructions`}
                        />
                      </Stack>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Distribution Summary
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Stack spacing={1}>
                        <DetailItem label="Difficulty Levels" value={preview?.blueprint?.difficultyDistribution ? Object.keys(preview.blueprint.difficultyDistribution).length : 0} />
                        <DetailItem label="Question Types" value={preview?.blueprint?.questionTypeDistribution ? Object.keys(preview.blueprint.questionTypeDistribution).length : 0} />
                        <DetailItem label="Sections" value={preview?.blueprint?.sectionCount || 0} />
                        <DetailItem label="Subjects" value={preview?.blueprint?.sections?.length || 0} />
                        <DetailItem label="Passing Score" value={`${preview?.blueprint?.passingScore || 0}%`} />
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              )}

              {currentTab === 2 && (
                <ReadinessChecklist checklist={checklist} loading={loading} />
              )}
            </>
          )}
        </>
      ) : (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Please select an examination to preview its readiness.
          </Typography>
        </Box>
      )}

      {/* Candidate Preview Dialog */}
      <CandidatePreviewDialog
        open={candidatePreviewOpen}
        onClose={() => setCandidatePreviewOpen(false)}
        examinationId={selectedExaminationId}
        previewData={preview}
      />

      {/* Approval Dialog */}
      <PublishReadinessDialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        onApprove={handleApprove}
        approving={approving}
        readiness={readiness}
        comments={approveComments}
        onCommentsChange={setApproveComments}
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

// Helper Components
const DetailItem = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
    <Typography variant="body2" color="textSecondary">{label}</Typography>
    <Typography variant="body2" fontWeight={500}>{value || '-'}</Typography>
  </Box>
);

const ModuleStatusItem = ({ label, status, details }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
    <Typography variant="body2" color="textSecondary">{label}</Typography>
    <Stack direction="row" spacing={1} alignItems="center">
      {details && <Typography variant="caption" color="textSecondary">{details}</Typography>}
      <Chip
        label={status}
        size="small"
        color={status === 'Complete' ? 'success' : 'error'}
        variant="outlined"
      />
    </Stack>
  </Box>
);

export default ExaminationPreview;
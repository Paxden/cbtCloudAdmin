/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Examination Instructions Page
 * Main page for managing examination instructions and resources
 */

import  { useState, useEffect, useCallback } from 'react';
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
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Add as AddIcon,
  CheckCircle as ValidateIcon,
  Publish as PublishIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import InstructionSummaryCards from '../../components/examinationInstructions/InstructionSummaryCards';
import InstructionStatusChip from '../../components/examinationInstructions/InstructionStatusChip';
import GeneralInstructionsEditor from '../../components/examinationInstructions/GeneralInstructionsEditor';
import ResourceTable from '../../components/examinationInstructions/ResourceTable';
import ResourceUploadDialog from '../../components/examinationInstructions/ResourceUploadDialog';
import ResourcePreviewDialog from '../../components/examinationInstructions/ResourcePreviewDialog';
import CandidatePreviewCard from '../../components/examinationInstructions/CandidatePreviewCard';
import InstructionValidationPanel from '../../components/examinationInstructions/InstructionValidationPanel';
import * as instructionService from '../../services/examinationInstructions/examinationInstructionService';
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
  { id: 'instructions', label: 'Instructions' },
  { id: 'resources', label: 'Resources' },
  { id: 'preview', label: 'Preview' },
];

const ExaminationInstructions = () => {
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
  const [instructions, setInstructions] = useState(null);
  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [validation, setValidation] = useState(null);
  const [validationLoading, setValidationLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
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

  // Load instructions and resources
  const loadInstructions = useCallback(async () => {
    if (!selectedExaminationId) {
      setInstructions(null);
      setResources([]);
      setStats(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await instructionService.getInstructions(selectedExaminationId);
      console.log('📋 Instructions response:', response);

      if (response && response.success) {
        const data = response.data;
        setInstructions(data.instructions || {});
        setResources(data.resources || []);
        
        // Calculate stats
        const instructionCount = data.instructions ? Object.keys(data.instructions).filter(k => data.instructions[k]).length : 0;
        setStats({
          instructionCount,
          resourceCount: data.resources?.length || 0,
          isValid: data.isValid !== false,
          lastUpdated: data.updatedAt || data.createdAt,
        });
      } else {
        setInstructions(null);
        setResources([]);
        setStats(null);
      }
    } catch (err) {
      console.error('❌ Failed to load instructions:', err);
      setInstructions(null);
      setResources([]);
      setStats(null);
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
      loadInstructions();
    }
  }, [selectedExaminationId, loadInstructions]);

  // Handle examination change
  const handleExaminationChange = (examId) => {
    setSearchParams({ examinationId: examId });
    setInstructions(null);
    setResources([]);
    setStats(null);
    setValidation(null);
    setHasChanges(false);
  };

  // Handle save instructions
  const handleSaveInstructions = async () => {
    if (!instructions) return;

    setSaving(true);
    try {
      const response = await instructionService.saveInstructions(
        selectedExaminationId,
        { instructions }
      );

      if (response && response.success) {
        setInstructions(response.data.instructions || {});
        setHasChanges(false);
        setToast({
          open: true,
          message: 'Instructions saved successfully',
          severity: 'success',
        });
        loadInstructions();
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to save instructions',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle upload resource
  const handleUploadResource = async (formData) => {
    setUploading(true);
    setUploadProgress(0);
    try {
      const response = await instructionService.uploadResource(
        selectedExaminationId,
        formData,
        (progress) => setUploadProgress(progress)
      );

      if (response && response.success) {
        setUploadDialogOpen(false);
        setToast({
          open: true,
          message: 'Resource uploaded successfully',
          severity: 'success',
        });
        loadInstructions();
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to upload resource',
        severity: 'error',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle delete resource
  const handleDeleteResource = async (resource) => {
    if (!window.confirm(`Are you sure you want to delete "${resource.name || resource.filename}"?`)) {
      return;
    }

    try {
      const response = await instructionService.deleteResource(
        selectedExaminationId,
        resource._id
      );

      if (response && response.success) {
        setToast({
          open: true,
          message: 'Resource deleted successfully',
          severity: 'success',
        });
        loadInstructions();
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to delete resource',
        severity: 'error',
      });
    }
  };

  // Handle preview instructions
  const handlePreviewInstructions = async () => {
    setPreviewLoading(true);
    try {
      const response = await instructionService.previewInstructions(selectedExaminationId);
      if (response && response.success) {
        setPreviewData(response.data);
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to generate preview',
        severity: 'error',
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  // Handle validate instructions
  const handleValidateInstructions = async () => {
    setValidationLoading(true);
    try {
      const response = await instructionService.validateInstructions(selectedExaminationId);
      if (response && response.success) {
        setValidation(response.data);
        setToast({
          open: true,
          message: response.data.isValid ? 'Instructions are valid!' : 'Instructions have issues',
          severity: response.data.isValid ? 'success' : 'error',
        });
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to validate instructions',
        severity: 'error',
      });
    } finally {
      setValidationLoading(false);
    }
  };

  // Handle publish instructions
  const handlePublishInstructions = async () => {
    if (!window.confirm('Are you sure you want to publish these instructions?')) {
      return;
    }

    try {
      const response = await instructionService.publishInstructions(selectedExaminationId, {
        comments: 'Published for deployment',
      });
      if (response && response.success) {
        setToast({
          open: true,
          message: 'Instructions published successfully',
          severity: 'success',
        });
        loadInstructions();
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to publish instructions',
        severity: 'error',
      });
    }
  };

  // Handle back
  const handleBack = () => {
    if (hasChanges) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        return;
      }
    }
    navigate('/examinations');
  };

  const selectedExam = examinations.find(e => e._id === selectedExaminationId);
  const isLocked = instructions?.status === 'PUBLISHED' || instructions?.status === 'ARCHIVED';

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Examination Instructions"
        subtitle="Create instructions and manage resources for candidates"
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadInstructions}
            >
              Refresh
            </Button>
            {canManage && !isLocked && (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveInstructions}
                disabled={!hasChanges || saving}
              >
                {saving ? 'Saving...' : 'Save Instructions'}
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
                {instructions && (
                  <InstructionStatusChip status={instructions.status || 'DRAFT'} size="medium" />
                )}
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
              <InstructionSummaryCards stats={stats} loading={loading} />

              {/* Action Buttons */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {canManage && !isLocked && (
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => setUploadDialogOpen(true)}
                    >
                      Upload Resource
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<ValidateIcon />}
                    onClick={handleValidateInstructions}
                    disabled={!instructions || validationLoading}
                  >
                    {validationLoading ? 'Validating...' : 'Validate'}
                  </Button>
                  {canPublish && !isLocked && instructions && (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<PublishIcon />}
                      onClick={handlePublishInstructions}
                    >
                      Publish Instructions
                    </Button>
                  )}
                </Stack>
              </Paper>

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
              <Box sx={{ mt: 2 }}>
                {currentTab === 0 && (
                  <GeneralInstructionsEditor
                    instructions={instructions || {}}
                    onChange={(values) => {
                      setInstructions(values);
                      setHasChanges(true);
                    }}
                    errors={validation?.errors}
                    readOnly={isLocked || !canManage}
                  />
                )}

                {currentTab === 1 && (
                  <Box>
                    <ResourceTable
                      resources={resources}
                      loading={loading}
                      onView={(resource) => {
                        setSelectedResource(resource);
                        setPreviewDialogOpen(true);
                      }}
                      onDelete={handleDeleteResource}
                      onDownload={(resource) => {
                        if (resource.url) {
                          window.open(resource.url, '_blank');
                        }
                      }}
                      canDelete={canManage && !isLocked}
                    />
                  </Box>
                )}

                {currentTab === 2 && (
                  <CandidatePreviewCard
                    instructions={instructions}
                    resources={resources}
                    loading={loading}
                    onPreview={handlePreviewInstructions}
                    previewData={previewData}
                    previewLoading={previewLoading}
                  />
                )}
              </Box>

              {/* Validation Panel */}
              {validation && (
                <InstructionValidationPanel validation={validation} loading={validationLoading} />
              )}

              {/* Resource Upload Dialog */}
              <ResourceUploadDialog
                open={uploadDialogOpen}
                onClose={() => setUploadDialogOpen(false)}
                onUpload={handleUploadResource}
                uploading={uploading}
                uploadProgress={uploadProgress}
              />

              {/* Resource Preview Dialog */}
              <ResourcePreviewDialog
                open={previewDialogOpen}
                onClose={() => setPreviewDialogOpen(false)}
                resource={selectedResource}
                loading={false}
              />
            </>
          )}
        </>
      ) : (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Please select an examination to manage its instructions.
          </Typography>
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

export default ExaminationInstructions;
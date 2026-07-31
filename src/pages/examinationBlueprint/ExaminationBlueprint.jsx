/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * Examination Blueprint Page
 * Main page for building examination blueprints
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
  Divider,
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
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  Archive as ArchiveIcon,
  CheckCircle as ValidateIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import BlueprintSummaryCards from '../../components/examinationBlueprint/BlueprintSummaryCards';
import BlueprintSectionTable from '../../components/examinationBlueprint/BlueprintSectionTable';
import BlueprintSectionDialog from '../../components/examinationBlueprint/BlueprintSectionDialog';
import DifficultyDistributionChart from '../../components/examinationBlueprint/DifficultyDistributionChart';
import QuestionTypeDistributionChart from '../../components/examinationBlueprint/QuestionTypeDistributionChart';
import BlueprintValidationCard from '../../components/examinationBlueprint/BlueprintValidationCard';
import BlueprintStatusChip from '../../components/examinationBlueprint/BlueprintStatusChip';
import * as blueprintService from '../../services/examinationBlueprint/examinationBlueprintService';
import * as examinationService from '../../services/examination/examinationService';

const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') {
    return user.role.name || user.role.role || 'USER';
  }
  return 'USER';
};

const ExaminationBlueprint = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const selectedExaminationId = searchParams.get('examinationId') || '';

  const canEdit = ['SUPER_ADMIN', 'TECH_ADMIN', 'EXAM_MANAGER'].includes(userRole);
  const canDelete = ['SUPER_ADMIN', 'TECH_ADMIN'].includes(userRole);
  const canLock = ['SUPER_ADMIN', 'TECH_ADMIN'].includes(userRole);

  // State
  const [examinations, setExaminations] = useState([]);
  const [examinationsLoading, setExaminationsLoading] = useState(false);
  const [blueprint, setBlueprint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [tab, setTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [validation, setValidation] = useState(null);
  const [validationLoading, setValidationLoading] = useState(false);
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

  // Load blueprint
  const loadBlueprint = useCallback(async () => {
    if (!selectedExaminationId) {
      setBlueprint(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await blueprintService.getBlueprint(selectedExaminationId);
      console.log('📋 Blueprint response:', response);
      
      if (response && response.success) {
        setBlueprint(response.data);
      } else {
        setBlueprint(null);
      }
    } catch (err) {
      console.error('❌ Failed to load blueprint:', err);
      setBlueprint(null);
    } finally {
      setLoading(false);
    }
  }, [selectedExaminationId]);

  // Load subjects
  const loadSubjects = useCallback(async () => {
    try {
      const response = await blueprintService.getSubjects({ limit: 100 });
      if (response && response.success) {
        setSubjects(response.data || []);
      }
    } catch (err) {
      console.error('Failed to load subjects:', err);
    }
  }, []);

  // Load topics for a subject
  const loadTopics = useCallback(async (subjectId) => {
    if (!subjectId) {
      setTopics([]);
      return;
    }
    try {
      const response = await blueprintService.getTopics(subjectId, { limit: 100 });
      if (response && response.success) {
        setTopics(response.data || []);
      }
    } catch (err) {
      console.error('Failed to load topics:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadExaminations();
    loadSubjects();
  }, [loadExaminations, loadSubjects]);

  useEffect(() => {
    if (selectedExaminationId) {
      loadBlueprint();
    }
  }, [selectedExaminationId, loadBlueprint]);

  // Handle examination change
  const handleExaminationChange = (examId) => {
    setSearchParams({ examinationId: examId });
    setBlueprint(null);
    setValidation(null);
  };

  // Handle create/update blueprint
  const handleSaveBlueprint = async (data) => {
    setSaving(true);
    try {
      let response;
      if (blueprint) {
        response = await blueprintService.updateBlueprint(selectedExaminationId, data);
      } else {
        response = await blueprintService.createBlueprint(selectedExaminationId, data);
      }
      
      if (response && response.success) {
        setBlueprint(response.data);
        setToast({
          open: true,
          message: blueprint ? 'Blueprint updated successfully' : 'Blueprint created successfully',
          severity: 'success',
        });
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to save blueprint',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle add section
  const handleAddSection = async (sectionData) => {
    setSaving(true);
    try {
      let response;
      if (editingSection) {
        response = await blueprintService.updateSection(
          selectedExaminationId,
          editingSection.sectionId,
          sectionData
        );
      } else {
        response = await blueprintService.addSection(selectedExaminationId, sectionData);
      }
      
      if (response && response.success) {
        setBlueprint(response.data);
        setDialogOpen(false);
        setEditingSection(null);
        setToast({
          open: true,
          message: editingSection ? 'Section updated successfully' : 'Section added successfully',
          severity: 'success',
        });
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to save section',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete section
  const handleDeleteSection = async (section) => {
    if (!window.confirm(`Are you sure you want to delete section "${section.name}"?`)) {
      return;
    }
    
    try {
      const response = await blueprintService.deleteSection(
        selectedExaminationId,
        section.sectionId
      );
      
      if (response && response.success) {
        setBlueprint(response.data);
        setToast({
          open: true,
          message: 'Section deleted successfully',
          severity: 'success',
        });
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to delete section',
        severity: 'error',
      });
    }
  };

  // Handle lock blueprint
  const handleLockBlueprint = async () => {
    try {
      const response = await blueprintService.lockBlueprint(selectedExaminationId);
      if (response && response.success) {
        setBlueprint(response.data);
        setToast({
          open: true,
          message: 'Blueprint locked successfully',
          severity: 'success',
        });
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to lock blueprint',
        severity: 'error',
      });
    }
  };

  // Handle unlock blueprint
  const handleUnlockBlueprint = async () => {
    try {
      const response = await blueprintService.unlockBlueprint(selectedExaminationId);
      if (response && response.success) {
        setBlueprint(response.data);
        setToast({
          open: true,
          message: 'Blueprint unlocked successfully',
          severity: 'success',
        });
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to unlock blueprint',
        severity: 'error',
      });
    }
  };

  // Handle archive blueprint
  const handleArchiveBlueprint = async () => {
    if (!window.confirm('Are you sure you want to archive this blueprint?')) {
      return;
    }
    
    try {
      const response = await blueprintService.archiveBlueprint(selectedExaminationId);
      if (response && response.success) {
        setBlueprint(response.data);
        setToast({
          open: true,
          message: 'Blueprint archived successfully',
          severity: 'success',
        });
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to archive blueprint',
        severity: 'error',
      });
    }
  };

  // Handle validate blueprint
  const handleValidateBlueprint = async () => {
    setValidationLoading(true);
    try {
      const response = await blueprintService.validateBlueprint(selectedExaminationId);
      if (response && response.success) {
        setValidation(response.data);
        setToast({
          open: true,
          message: response.data.isValid ? 'Blueprint is valid!' : 'Blueprint has validation errors',
          severity: response.data.isValid ? 'success' : 'error',
        });
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to validate blueprint',
        severity: 'error',
      });
    } finally {
      setValidationLoading(false);
    }
  };

  // Handle back
  const handleBack = () => {
    navigate('/examinations');
  };

  // Get aggregate distributions
  const getAggregateDistributions = () => {
    if (!blueprint || !blueprint.sections || blueprint.sections.length === 0) {
      return { difficulty: [], questionType: [] };
    }

    const difficultyMap = {};
    const typeMap = {};

    blueprint.sections.forEach(section => {
      if (section.difficultyDistribution) {
        section.difficultyDistribution.forEach(d => {
          difficultyMap[d.difficulty] = (difficultyMap[d.difficulty] || 0) + (d.percentage || 0);
        });
      }
      if (section.questionTypeDistribution) {
        section.questionTypeDistribution.forEach(d => {
          typeMap[d.questionType] = (typeMap[d.questionType] || 0) + (d.percentage || 0);
        });
      }
    });

    const sectionCount = blueprint.sections.length || 1;
    return {
      difficulty: Object.entries(difficultyMap).map(([key, value]) => ({
        name: key,
        value: Math.round(value / sectionCount),
      })),
      questionType: Object.entries(typeMap).map(([key, value]) => ({
        name: key,
        value: Math.round(value / sectionCount),
      })),
    };
  };

  const aggregateDistributions = getAggregateDistributions();

  const selectedExam = examinations.find(e => e._id === selectedExaminationId);
  const isLocked = blueprint?.metadata?.isLocked || false;

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Examination Blueprint"
        subtitle="Define the structure of your examination"
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadBlueprint}
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
                {blueprint && (
                  <BlueprintStatusChip 
                    status={blueprint.status} 
                    isLocked={isLocked}
                    size="medium"
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
              {/* Blueprint Actions */}
              {blueprint && (
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {!isLocked && canEdit && (
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          setEditingSection(null);
                          setDialogOpen(true);
                        }}
                      >
                        Add Section
                      </Button>
                    )}
                    
                    {!isLocked && canLock && (
                      <Button
                        variant="outlined"
                        color="warning"
                        startIcon={<LockIcon />}
                        onClick={handleLockBlueprint}
                      >
                        Lock Blueprint
                      </Button>
                    )}
                    
                    {isLocked && canLock && (
                      <Button
                        variant="outlined"
                        color="info"
                        startIcon={<UnlockIcon />}
                        onClick={handleUnlockBlueprint}
                      >
                        Unlock Blueprint
                      </Button>
                    )}
                    
                    {canLock && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<ArchiveIcon />}
                        onClick={handleArchiveBlueprint}
                      >
                        Archive
                      </Button>
                    )}
                    
                    <Button
                      variant="outlined"
                      color="success"
                      startIcon={<ValidateIcon />}
                      onClick={handleValidateBlueprint}
                      disabled={validationLoading}
                    >
                      {validationLoading ? 'Validating...' : 'Validate'}
                    </Button>
                  </Stack>
                </Paper>
              )}

              {/* Summary Cards */}
              <BlueprintSummaryCards blueprint={blueprint} loading={loading} />

              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tab} onChange={(e, v) => setTab(v)}>
                  <Tab label="Sections" />
                  <Tab label="Distributions" />
                  <Tab label="Validation" />
                </Tabs>
              </Box>

              {tab === 0 && (
                <>
                  {blueprint ? (
                    <BlueprintSectionTable
                      sections={blueprint.sections || []}
                      loading={loading}
                      onEdit={(section) => {
                        setEditingSection(section);
                        setDialogOpen(true);
                      }}
                      onDelete={handleDeleteSection}
                      onView={(section) => {
                        // View section details
                        setEditingSection(section);
                        setDialogOpen(true);
                      }}
                      canEdit={canEdit && !isLocked}
                      canDelete={canDelete && !isLocked}
                      isLocked={isLocked}
                    />
                  ) : (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                      <Typography variant="h6" color="textSecondary" gutterBottom>
                        No Blueprint Found
                      </Typography>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        This examination does not have a blueprint yet.
                      </Typography>
                      {canEdit && (
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            setDialogOpen(true);
                          }}
                        >
                          Create Blueprint
                        </Button>
                      )}
                    </Paper>
                  )}
                </>
              )}

              {tab === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <DifficultyDistributionChart
                      distributions={aggregateDistributions.difficulty}
                      loading={loading}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <QuestionTypeDistributionChart
                      distributions={aggregateDistributions.questionType}
                      loading={loading}
                    />
                  </Grid>
                </Grid>
              )}

              {tab === 2 && (
                <BlueprintValidationCard
                  validation={validation}
                  loading={validationLoading}
                />
              )}

              {/* Section Dialog */}
              <BlueprintSectionDialog
                open={dialogOpen}
                onClose={() => {
                  setDialogOpen(false);
                  setEditingSection(null);
                }}
                onSave={handleAddSection}
                section={editingSection}
                isEdit={!!editingSection}
                subjects={subjects}
                topics={topics}
                loading={saving}
              />
            </>
          )}
        </>
      ) : (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Please select an examination to manage its blueprint.
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

export default ExaminationBlueprint;
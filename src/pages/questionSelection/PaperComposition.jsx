/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Paper Composition Page
 * Detailed view of paper composition with section-wise breakdown
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Refresh as RefreshIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  Visibility as ViewIcon,
  CheckCircle as ValidIcon,
  Error as InvalidIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import PaperStatisticsCards from '../../components/questionSelection/PaperStatisticsCards';
import CompositionTable from '../../components/questionSelection/CompositionTable';
import QuestionPreviewDialog from '../../components/questionSelection/QuestionPreviewDialog';
import * as questionSelectionService from '../../services/questionSelection/questionSelectionService';
import * as blueprintService from '../../services/examinationBlueprint/examinationBlueprintService';

const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') {
    return user.role.name || user.role.role || 'USER';
  }
  return 'USER';
};

const SectionProgress = ({ section }) => {
  const total = section.questionCount || 0;
  const selected = section.questions?.length || 0;
  const percentage = total > 0 ? (selected / total) * 100 : 0;

  return (
    <Box sx={{ minWidth: 150 }}>
      <Typography variant="caption" color="textSecondary">
        {selected}/{total} selected
      </Typography>
      <LinearProgress
        variant="determinate"
        value={Math.min(percentage, 100)}
        color={percentage >= 100 ? 'success' : percentage >= 50 ? 'warning' : 'error'}
        sx={{ height: 6, borderRadius: 3, mt: 0.5 }}
      />
    </Box>
  );
};

const PaperComposition = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const examinationId = id || searchParams.get('examinationId');

  const canEdit = ['SUPER_ADMIN', 'TECH_ADMIN', 'EXAM_MANAGER'].includes(userRole);
  const canLock = ['SUPER_ADMIN', 'TECH_ADMIN'].includes(userRole);

  const [composition, setComposition] = useState(null);
  const [blueprint, setBlueprint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Load data
  const loadData = useCallback(async () => {
    if (!examinationId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Load blueprint
      const blueprintResponse = await blueprintService.getBlueprint(examinationId, { status: 'ACTIVE' });
      if (blueprintResponse && blueprintResponse.success) {
        setBlueprint(blueprintResponse.data);
      }

      // Load composition
      const compositionResponse = await questionSelectionService.getComposition(examinationId, {
        includeSnapshots: true,
      });
      
      if (compositionResponse && compositionResponse.success) {
        setComposition(compositionResponse.data);
        
        // Calculate stats
        const data = compositionResponse.data;
        const totalQuestions = data.totalQuestions || 0;
        const selectedQuestions = data.sections?.reduce((sum, s) => sum + (s.questions?.length || 0), 0) || 0;
        const lockedQuestions = data.sections?.reduce((sum, s) => 
          sum + (s.questions?.filter(q => q.isLocked).length || 0), 0) || 0;
        
        setStats({
          totalQuestions,
          selectedQuestions,
          lockedQuestions,
          unlockedQuestions: selectedQuestions - lockedQuestions,
          validationScore: data.validationScore || 0,
        });
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      setToast({
        open: true,
        message: err.message || 'Failed to load composition',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [examinationId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBack = () => {
    navigate('/question-selection');
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleViewQuestion = (question) => {
    setSelectedQuestion(question);
    setPreviewDialogOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Export logic - would generate PDF or CSV
    setToast({
      open: true,
      message: 'Export functionality coming soon',
      severity: 'info',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!composition) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          No paper composition found for this examination.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Question Selection
        </Button>
      </Box>
    );
  }

  const isLocked = composition.metadata?.isLocked || false;
  const isPublished = composition.status === 'ACTIVE';

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Paper Composition"
        subtitle={`${composition.totalQuestions || 0} questions • ${composition.totalMarks || 0} marks`}
        actions={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
            >
              Print
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
            >
              Export
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

      {/* Status Chips */}
      <Box sx={{ mb: 3 }}>
        <Chip
          label={composition.status || 'DRAFT'}
          color={composition.status === 'ACTIVE' ? 'success' : 'default'}
          size="medium"
        />
        {isLocked && (
          <Chip
            label="Locked"
            color="warning"
            size="medium"
            sx={{ ml: 1 }}
          />
        )}
        {isPublished && (
          <Chip
            label="Published"
            color="success"
            size="medium"
            sx={{ ml: 1 }}
          />
        )}
        <Chip
          label={`v${composition.compositionVersion || 1}`}
          variant="outlined"
          size="medium"
          sx={{ ml: 1 }}
        />
        <Chip
          label={`Seed: ${composition.randomSeed?.substring(0, 12)}...`}
          variant="outlined"
          size="medium"
          sx={{ ml: 1 }}
        />
      </Box>

      {/* Statistics */}
      <PaperStatisticsCards stats={stats} loading={loading} />

      {/* Sections */}
      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 3 }}>
        Sections
      </Typography>

      <Grid container spacing={3}>
        {composition.sections?.map((section, index) => (
          <Grid item xs={12} key={section.sectionId || index}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {section.name || `Section ${index + 1}`}
                  </Typography>
                  <Chip
                    label={`${section.questions?.length || 0} questions`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={`${section.totalMarks || 0} marks`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                  <SectionProgress section={section} />
                  {section.subjectId && (
                    <Typography variant="caption" color="textSecondary" sx={{ ml: 'auto' }}>
                      {section.subjectId.name}
                    </Typography>
                  )}
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                {section.questions && section.questions.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>Question Code</TableCell>
                          <TableCell>Difficulty</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Marks</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {section.questions.map((question, qIndex) => (
                          <TableRow key={question.questionId || qIndex} hover>
                            <TableCell>{qIndex + 1}</TableCell>
                            <TableCell>
                              <Typography variant="body2" fontFamily="monospace">
                                {question.questionCode || 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={question.difficulty || 'N/A'}
                                size="small"
                                color={
                                  question.difficulty === 'EASY' ? 'success' :
                                  question.difficulty === 'MEDIUM' ? 'warning' :
                                  question.difficulty === 'HARD' ? 'error' :
                                  'default'
                                }
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={question.questionType?.replace('_', ' ') || 'N/A'}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>{question.marks || 0}</TableCell>
                            <TableCell>
                              {question.isLocked ? (
                                <Chip
                                  icon={<LockIcon />}
                                  label="Locked"
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              ) : (
                                <Chip
                                  icon={<UnlockIcon />}
                                  label="Unlocked"
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="View Question">
                                <IconButton
                                  size="small"
                                  color="info"
                                  onClick={() => handleViewQuestion(question)}
                                >
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity="warning">
                    No questions selected for this section.
                  </Alert>
                )}
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>

      {/* Validation Summary */}
      {composition.validationResults && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Validation Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {composition.validationResults.isValid ? (
                      <ValidIcon color="success" fontSize="large" />
                    ) : (
                      <InvalidIcon color="error" fontSize="large" />
                    )}
                    <Box>
                      <Typography variant="subtitle2">
                        {composition.validationResults.isValid ? 'Valid' : 'Invalid'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {composition.validationResults.errors?.length || 0} errors • 
                        {composition.validationResults.warnings?.length || 0} warnings
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Issues
                  </Typography>
                  {composition.validationResults.errors?.length > 0 ? (
                    <Typography variant="caption" color="error">
                      {composition.validationResults.errors.map((e, i) => (
                        <div key={i}>• {e.message}</div>
                      ))}
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="success">
                      No validation errors found.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Question Preview Dialog */}
      <QuestionPreviewDialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        question={selectedQuestion}
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

export default PaperComposition;
/* eslint-disable no-unused-vars */
/**
 * Blueprint Details Page
 * View detailed examination blueprint information
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Stack,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Snackbar,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  Archive as ArchiveIcon,
  CheckCircle as ValidateIcon,
  ExpandMore as ExpandMoreIcon,
  LibraryBooks as SectionsIcon,
  QuestionAnswer as QuestionsIcon,
  Grade as MarksIcon,
  Subject as SubjectsIcon,
  Topic as TopicsIcon,
  Assessment as DifficultyIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import BlueprintStatusChip from '../../components/examinationBlueprint/BlueprintStatusChip';
import DifficultyDistributionChart from '../../components/examinationBlueprint/DifficultyDistributionChart';
import QuestionTypeDistributionChart from '../../components/examinationBlueprint/QuestionTypeDistributionChart';
import BlueprintValidationCard from '../../components/examinationBlueprint/BlueprintValidationCard';
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

const InfoRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
    <Typography variant="body2" color="textSecondary">{label}</Typography>
    <Typography variant="body2" fontWeight={500}>{value || '-'}</Typography>
  </Box>
);

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <Card>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            borderRadius: '50%',
            p: 1,
            display: 'flex',
          }}
        >
          <Icon />
        </Box>
        <Box>
          <Typography variant="caption" color="textSecondary">{title}</Typography>
          <Typography variant="h6" fontWeight={600}>{value || 0}</Typography>
          {subtitle && (
            <Typography variant="caption" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const BlueprintDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const canEdit = ['SUPER_ADMIN', 'TECH_ADMIN', 'EXAM_MANAGER'].includes(userRole);
  const canLock = ['SUPER_ADMIN', 'TECH_ADMIN'].includes(userRole);
  const canArchive = ['SUPER_ADMIN', 'TECH_ADMIN'].includes(userRole);

  const [examination, setExamination] = useState(null);
  const [blueprint, setBlueprint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validation, setValidation] = useState(null);
  const [validationLoading, setValidationLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get examination details
        const examResponse = await examinationService.getExamination(id);
        if (examResponse.success) {
          setExamination(examResponse.data);
        }

        // Get blueprint
        const blueprintResponse = await blueprintService.getBlueprint(id);
        if (blueprintResponse.success) {
          setBlueprint(blueprintResponse.data);
        }
      } catch (err) {
        setToast({
          open: true,
          message: err.message || 'Failed to load data',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Handle actions
  const handleBack = () => {
    navigate('/examination-blueprint');
  };

  const handleEdit = () => {
    navigate(`/examination-blueprint/${id}/edit`);
  };

  const handleLock = async () => {
    try {
      const response = await blueprintService.lockBlueprint(id);
      if (response.success) {
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

  const handleUnlock = async () => {
    try {
      const response = await blueprintService.unlockBlueprint(id);
      if (response.success) {
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

  const handleArchive = async () => {
    if (!window.confirm('Are you sure you want to archive this blueprint?')) {
      return;
    }
    try {
      const response = await blueprintService.archiveBlueprint(id);
      if (response.success) {
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

  const handleValidate = async () => {
    setValidationLoading(true);
    try {
      const response = await blueprintService.validateBlueprint(id);
      if (response.success) {
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!blueprint || !examination) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          {!examination ? 'Examination not found' : 'Blueprint not found for this examination'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Blueprints
        </Button>
      </Box>
    );
  }

  const isLocked = blueprint.metadata?.isLocked || false;
  const isArchived = blueprint.status === 'ARCHIVED';

  // Calculate aggregate distributions
  const getAggregateDistributions = () => {
    if (!blueprint.sections || blueprint.sections.length === 0) {
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

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title={blueprint.name || 'Untitled Blueprint'}
        subtitle={`${examination.code || 'N/A'} - ${examination.name || 'N/A'}`}
        actions={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={handleBack}
            >
              Back
            </Button>

            {!isArchived && !isLocked && canEdit && (
              <Tooltip title="Edit">
                <IconButton color="primary" onClick={handleEdit}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}

            {!isArchived && canLock && (
              <Tooltip title={isLocked ? 'Unlock' : 'Lock'}>
                <IconButton color="warning" onClick={isLocked ? handleUnlock : handleLock}>
                  {isLocked ? <UnlockIcon /> : <LockIcon />}
                </IconButton>
              </Tooltip>
            )}

            {!isArchived && canArchive && (
              <Tooltip title="Archive">
                <IconButton color="error" onClick={handleArchive}>
                  <ArchiveIcon />
                </IconButton>
              </Tooltip>
            )}

            {canLock && (
              <Tooltip title="Validate">
                <IconButton color="success" onClick={handleValidate}>
                  <ValidateIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        }
      />

      {/* Status Chips */}
      <Box sx={{ mb: 3 }}>
        <BlueprintStatusChip
          status={blueprint.status}
          isLocked={isLocked}
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
        {isArchived && (
          <Chip
            label="Archived"
            color="error"
            size="medium"
            sx={{ ml: 1 }}
          />
        )}
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sections"
            value={blueprint.sections?.length || 0}
            icon={SectionsIcon}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Questions"
            value={blueprint.totalQuestions || 0}
            icon={QuestionsIcon}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Marks"
            value={blueprint.totalMarks || 0}
            icon={MarksIcon}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Duration"
            value={`${blueprint.duration || 0} min`}
            icon={SectionsIcon}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - Details & Sections */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Blueprint Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <InfoRow label="Blueprint Name" value={blueprint.name} />
            <InfoRow label="Description" value={blueprint.description || 'N/A'} />
            <InfoRow label="Version" value={`v${blueprint.version || 1}`} />
            <InfoRow label="Status" value={blueprint.status} />
            <InfoRow label="Duration" value={`${blueprint.duration || 0} minutes`} />
            <InfoRow label="Passing Score" value={`${blueprint.passingScore || 0}%`} />
            <InfoRow label="Total Questions" value={blueprint.totalQuestions || 0} />
            <InfoRow label="Total Marks" value={blueprint.totalMarks || 0} />
          </Paper>

          {/* Sections */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Sections
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {blueprint.sections && blueprint.sections.length > 0 ? (
              <Stack spacing={2}>
                {blueprint.sections.map((section, index) => (
                  <Accordion key={section.sectionId || index} defaultExpanded={index === 0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {section.name}
                        </Typography>
                        <Chip
                          label={`${section.questionCount || 0} questions`}
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
                        <Typography variant="caption" color="textSecondary" sx={{ ml: 'auto' }}>
                          {section.subjectId?.name || 'No subject'}
                        </Typography>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Section Information
                          </Typography>
                          <InfoRow label="Section Name" value={section.name} />
                          <InfoRow label="Subject" value={section.subjectId?.name || 'N/A'} />
                          <InfoRow label="Topic" value={section.topicId?.name || 'N/A'} />
                          <InfoRow label="Question Count" value={section.questionCount || 0} />
                          <InfoRow label="Marks Per Question" value={section.marksPerQuestion || 0} />
                          <InfoRow label="Total Marks" value={section.totalMarks || 0} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Distributions
                          </Typography>
                          <Typography variant="caption" color="textSecondary" display="block">
                            Difficulty:
                          </Typography>
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mb: 1 }}>
                            {section.difficultyDistribution?.map((d) => (
                              <Chip
                                key={d.difficulty}
                                label={`${d.difficulty}: ${d.percentage}%`}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                          <Typography variant="caption" color="textSecondary" display="block">
                            Question Types:
                          </Typography>
                          <Stack direction="row" spacing={0.5} flexWrap="wrap">
                            {section.questionTypeDistribution?.map((d) => (
                              <Chip
                                key={d.questionType}
                                label={`${d.questionType.replace('_', ' ')}: ${d.percentage}%`}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>
            ) : (
              <Typography color="textSecondary">
                No sections defined in this blueprint.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Right Column - Charts & Validation */}
        <Grid item xs={12} md={4}>
          {/* Difficulty Distribution */}
          <DifficultyDistributionChart
            distributions={aggregateDistributions.difficulty}
            title="Difficulty Distribution (Average)"
            loading={false}
          />

          <Box sx={{ mt: 2 }}>
            <QuestionTypeDistributionChart
              distributions={aggregateDistributions.questionType}
              title="Question Type Distribution (Average)"
              loading={false}
            />
          </Box>

          {/* Validation Results */}
          <Box sx={{ mt: 2 }}>
            <BlueprintValidationCard
              validation={validation}
              loading={validationLoading}
            />
          </Box>

          {/* Audit Information */}
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Audit Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <InfoRow
              label="Created By"
              value={blueprint.createdBy?.name || 'Unknown'}
            />
            <InfoRow
              label="Created At"
              value={blueprint.createdAt ? format(new Date(blueprint.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
            />
            <InfoRow
              label="Last Updated"
              value={blueprint.updatedAt ? format(new Date(blueprint.updatedAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
            />
            {blueprint.metadata?.lockedAt && (
              <>
                <InfoRow
                  label="Locked At"
                  value={format(new Date(blueprint.metadata.lockedAt), 'dd/MM/yyyy HH:mm')}
                />
                <InfoRow
                  label="Locked By"
                  value={blueprint.metadata.lockedBy?.name || 'Unknown'}
                />
              </>
            )}
            {blueprint.archivedAt && (
              <>
                <InfoRow
                  label="Archived At"
                  value={format(new Date(blueprint.archivedAt), 'dd/MM/yyyy HH:mm')}
                />
                <InfoRow
                  label="Archived By"
                  value={blueprint.archivedBy?.name || 'Unknown'}
                />
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

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

export default BlueprintDetails;
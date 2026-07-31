/* eslint-disable no-unused-vars */
/**
 * Composition Validation Card Component
 * Displays validation results for paper composition
 */

import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Stack,
  Skeleton,
  Chip,
  Box,
  Divider,
  Alert,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Tooltip,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  CheckCircle as ValidIcon,
  Cancel as InvalidIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Assessment as ScoreIcon,
} from '@mui/icons-material';

const ValidationItem = ({ label, status, message, details, severity }) => {
  const getColor = () => {
    if (status === 'valid') return 'success';
    if (status === 'warning') return 'warning';
    return 'error';
  };

  const getIcon = () => {
    if (status === 'valid') return <ValidIcon fontSize="small" color="success" />;
    if (status === 'warning') return <WarningIcon fontSize="small" color="warning" />;
    return <InvalidIcon fontSize="small" color="error" />;
  };

  const [expanded, setExpanded] = useState(false);

  return (
    <Box sx={{ py: 0.5 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        {getIcon()}
        <Typography variant="body2" sx={{ flex: 1 }}>
          {label}
        </Typography>
        <Chip
          label={status.toUpperCase()}
          size="small"
          color={getColor()}
          variant="outlined"
        />
        {details && (
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        )}
      </Stack>
      {message && (
        <Typography variant="caption" color="textSecondary" sx={{ ml: 4, display: 'block' }}>
          {message}
        </Typography>
      )}
      {details && expanded && (
        <Box sx={{ ml: 4, mt: 1, pl: 2, borderLeft: '2px solid', borderColor: 'divider' }}>
          {typeof details === 'string' ? (
            <Typography variant="caption" color="textSecondary">
              {details}
            </Typography>
          ) : Array.isArray(details) ? (
            details.map((item, index) => (
              <Typography key={index} variant="caption" color="textSecondary" display="block">
                • {item}
              </Typography>
            ))
          ) : (
            <Typography variant="caption" color="textSecondary">
              {JSON.stringify(details)}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

const StatusSummaryCard = ({ title, value, icon: Icon, color, subtitle, status }) => {
  const getStatusColor = () => {
    if (status === 'pass') return 'success';
    if (status === 'warning') return 'warning';
    return 'error';
  };

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              bgcolor: `${getStatusColor()}.light`,
              color: `${getStatusColor()}.main`,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon fontSize="small" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {value || 0}
            </Typography>
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
};

const CompositionValidationCard = ({ validation, loading, blueprint }) => {
  const [expandedSections, setExpandedSections] = useState({});

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Skeleton variant="text" width="30%" height={30} />
          <Skeleton variant="rectangular" height={100} />
          <Skeleton variant="rectangular" height={200} />
        </Stack>
      </Paper>
    );
  }

  if (!validation) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">
          Run validation to check paper composition completeness and compliance.
        </Typography>
        {blueprint && (
          <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
            Blueprint: {blueprint.name} (v{blueprint.version || 1})
          </Typography>
        )}
      </Paper>
    );
  }

  const { isValid, score, errors = [], warnings = [], sections = [], summary = {} } = validation;

  // Calculate overall status
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0 && !hasErrors;
  const overallStatus = isValid ? 'pass' : (hasWarnings ? 'warning' : 'fail');

  // Section validation summary
  const sectionStatus = {};
  sections.forEach(section => {
    const sectionErrors = errors.filter(e => e.section === section.name || e.sectionId === section.id);
    const sectionWarnings = warnings.filter(w => w.section === section.name || w.sectionId === section.id);
    sectionStatus[section.id || section.name] = {
      total: section.questions?.length || 0,
      errors: sectionErrors.length,
      warnings: sectionWarnings.length,
      status: sectionErrors.length > 0 ? 'error' : (sectionWarnings.length > 0 ? 'warning' : 'pass'),
    };
  });

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Validation Results
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip
            label={isValid ? 'PASSED' : 'FAILED'}
            color={isValid ? 'success' : 'error'}
            size="medium"
          />
          {score !== undefined && (
            <Chip
              icon={<ScoreIcon />}
              label={`${score}%`}
              color={score >= 80 ? 'success' : score >= 50 ? 'warning' : 'error'}
              size="medium"
              variant="outlined"
            />
          )}
        </Stack>
      </Stack>

      {/* Validation Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatusSummaryCard
            title="Total Checks"
            value={summary.totalChecks || 0}
            icon={InfoIcon}
            status="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatusSummaryCard
            title="Passed"
            value={summary.passed || 0}
            icon={ValidIcon}
            status="pass"
            subtitle={`${summary.totalChecks > 0 ? Math.round((summary.passed / summary.totalChecks) * 100) : 0}%`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatusSummaryCard
            title="Warnings"
            value={warnings.length}
            icon={WarningIcon}
            status="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatusSummaryCard
            title="Errors"
            value={errors.length}
            icon={ErrorIcon}
            status="error"
          />
        </Grid>
      </Grid>

      {/* Overall Progress */}
      {summary.totalChecks > 0 && (
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography variant="caption" color="textSecondary">
              Validation Score
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {Math.round((summary.passed / summary.totalChecks) * 100)}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={(summary.passed / summary.totalChecks) * 100}
            color={overallStatus === 'pass' ? 'success' : overallStatus === 'warning' ? 'warning' : 'error'}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Errors */}
      {errors.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="error" gutterBottom>
            Errors ({errors.length})
          </Typography>
          <Alert severity="error" icon={false} sx={{ mb: 1 }}>
            <Stack spacing={0.5}>
              {errors.map((error, index) => (
                <Box key={index}>
                  <Typography variant="body2">
                    {error.message || error}
                  </Typography>
                  {error.section && (
                    <Typography variant="caption" color="textSecondary">
                      Section: {error.section}
                    </Typography>
                  )}
                  {error.field && (
                    <Typography variant="caption" color="textSecondary" sx={{ ml: 2 }}>
                      Field: {error.field}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </Alert>
        </Box>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="warning" gutterBottom>
            Warnings ({warnings.length})
          </Typography>
          <Alert severity="warning" icon={false}>
            <Stack spacing={0.5}>
              {warnings.map((warning, index) => (
                <Box key={index}>
                  <Typography variant="body2">
                    {warning.message || warning}
                  </Typography>
                  {warning.section && (
                    <Typography variant="caption" color="textSecondary">
                      Section: {warning.section}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </Alert>
        </Box>
      )}

      {/* Section-wise Validation */}
      {sections.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Section-wise Validation
          </Typography>
          <Stack spacing={1}>
            {sections.map((section) => {
              const status = sectionStatus[section.id || section.name];
              if (!status) return null;

              const isExpanded = expandedSections[section.id || section.name];

              return (
                <Paper
                  key={section.id || section.name}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderColor: status.status === 'pass' ? 'success.main' :
                               status.status === 'warning' ? 'warning.main' :
                               'error.main',
                    borderWidth: 2,
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => toggleSection(section.id || section.name)}
                  >
                    {status.status === 'pass' ? (
                      <ValidIcon color="success" fontSize="small" />
                    ) : status.status === 'warning' ? (
                      <WarningIcon color="warning" fontSize="small" />
                    ) : (
                      <InvalidIcon color="error" fontSize="small" />
                    )}
                    <Typography variant="body2" fontWeight={500} sx={{ flex: 1 }}>
                      {section.name || 'Section'}
                    </Typography>
                    <Chip
                      label={`${status.total} questions`}
                      size="small"
                      variant="outlined"
                    />
                    {status.errors > 0 && (
                      <Chip
                        label={`${status.errors} errors`}
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    )}
                    {status.warnings > 0 && status.errors === 0 && (
                      <Chip
                        label={`${status.warnings} warnings`}
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    )}
                    {status.errors === 0 && status.warnings === 0 && (
                      <Chip
                        label="Valid"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                    <IconButton size="small">
                      {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Stack>

                  <Collapse in={isExpanded}>
                    <Box sx={{ mt: 1, pl: 4 }}>
                      {/* Section details */}
                      <Stack spacing={0.5}>
                        <ValidationItem
                          label="Question Count"
                          status={section.questionCount > 0 ? 'valid' : 'error'}
                          message={section.questionCount > 0 ? `${section.questionCount} questions` : 'No questions defined'}
                        />
                        <ValidationItem
                          label="Marks Distribution"
                          status={section.totalMarks > 0 ? 'valid' : 'error'}
                          message={section.totalMarks > 0 ? `${section.totalMarks} marks` : 'No marks assigned'}
                        />
                        <ValidationItem
                          label="Difficulty Distribution"
                          status={section.difficultyDistribution?.length > 0 ? 'valid' : 'warning'}
                          message={section.difficultyDistribution?.length > 0 ? 
                            `${section.difficultyDistribution.length} levels configured` : 
                            'No difficulty distribution configured'}
                        />
                        <ValidationItem
                          label="Question Type Distribution"
                          status={section.questionTypeDistribution?.length > 0 ? 'valid' : 'warning'}
                          message={section.questionTypeDistribution?.length > 0 ? 
                            `${section.questionTypeDistribution.length} types configured` : 
                            'No question type distribution configured'}
                        />
                      </Stack>
                    </Box>
                  </Collapse>
                </Paper>
              );
            })}
          </Stack>
        </Box>
      )}

      {/* Validation Items (Detailed) */}
      {validation.items && validation.items.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Detailed Validation Checks
          </Typography>
          <Stack spacing={0.5}>
            {validation.items.map((item, index) => (
              <ValidationItem
                key={index}
                label={item.label}
                status={item.status}
                message={item.message}
                details={item.details}
                severity={item.severity}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Blueprint Compliance */}
      {blueprint && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Blueprint Compliance
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="textSecondary">
                  Blueprint
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {blueprint.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="textSecondary">
                  Version
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  v{blueprint.version || 1}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="textSecondary">
                  Status
                </Typography>
                <Chip
                  label={isValid ? 'Compliant' : 'Non-Compliant'}
                  size="small"
                  color={isValid ? 'success' : 'error'}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
    </Paper>
  );
};

export default CompositionValidationCard;
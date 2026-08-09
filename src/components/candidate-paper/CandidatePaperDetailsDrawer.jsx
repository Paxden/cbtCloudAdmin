/* eslint-disable no-unused-vars */
/**
 * CandidatePaperDetailsDrawer
 * Drawer displaying detailed candidate paper information
 * 
 * Location: src/components/candidate-paper/CandidatePaperDetailsDrawer.jsx
 */

import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Grid,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  Lock as LockIcon,
  Shuffle as ShuffleIcon,
  Download as DownloadIcon,
  Archive as ArchiveIcon,
} from '@mui/icons-material';
import { PaperStatus, PaperStatusLabels, PaperStatusColors } from '../../types/candidatePaper.types';

const CandidatePaperDetailsDrawer = ({
  open,
  onClose,
  paper,
  loading = false,
  onValidate,
  onArchive,
}) => {
  if (!open) return null;

  const getStatusChip = (status) => {
    const label = PaperStatusLabels[status] || status;
    const color = PaperStatusColors[status] || '#9e9e9e';
    
    let icon = null;
    if (status === PaperStatus.GENERATED || status === PaperStatus.ACTIVATED) {
      icon = <CheckCircleIcon />;
    } else if (status === PaperStatus.GENERATING) {
      icon = <PendingIcon />;
    } else if (status === PaperStatus.FAILED) {
      icon = <ErrorIcon />;
    } else if (status === PaperStatus.ENCRYPTED) {
      icon = <LockIcon />;
    }
    
    return (
      <Chip
        icon={icon}
        label={label}
        sx={{
          bgcolor: color,
          color: 'white',
          '& .MuiChip-icon': { color: 'white' },
        }}
      />
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!paper) {
      return (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Paper not found
        </Alert>
      );
    }

    return (
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {paper.paperCode}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Candidate: {paper.candidateNumber}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            {getStatusChip(paper.status)}
            <Chip
              label={`v${paper.version || 1}`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`${paper.questionCount || 0} questions`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Actions */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {paper.status !== PaperStatus.ARCHIVED && paper.status !== PaperStatus.FAILED && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => onValidate(paper._id)}
                size="small"
              >
                Validate
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<ArchiveIcon />}
                onClick={() => onArchive(paper._id)}
                size="small"
              >
                Archive
              </Button>
            </>
          )}
        </Box>

        {/* Details */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Generation Details
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Selection Rule
                  </Typography>
                  <Typography variant="body2">
                    {paper.questionSelectionRule?.type || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Question Order
                  </Typography>
                  <Typography variant="body2">
                    {paper.questionOrder?.type || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Option Order
                  </Typography>
                  <Typography variant="body2">
                    {paper.optionOrder?.type || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Random Seed
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {paper.questionSelectionRule?.seed?.substring(0, 12) || 'N/A'}...
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Question Statistics
              </Typography>
              {paper.questionStats ? (
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Questions
                    </Typography>
                    <Typography variant="body2">{paper.questionStats.totalQuestions || 0}</Typography>
                  </Box>
                  {paper.questionStats.byDifficulty && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        By Difficulty
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip label={`Easy: ${paper.questionStats.byDifficulty.EASY || 0}`} size="small" />
                        <Chip label={`Medium: ${paper.questionStats.byDifficulty.MEDIUM || 0}`} size="small" />
                        <Chip label={`Hard: ${paper.questionStats.byDifficulty.HARD || 0}`} size="small" />
                      </Stack>
                    </Box>
                  )}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No statistics available
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Compliance
              </Typography>
              {paper.compliance ? (
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Blueprint Compliant
                    </Typography>
                    <Chip
                      label={paper.compliance.blueprintCompliant ? 'Yes' : 'No'}
                      color={paper.compliance.blueprintCompliant ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Unique Questions
                    </Typography>
                    <Chip
                      label={paper.compliance.uniqueQuestions ? 'Yes' : 'No'}
                      color={paper.compliance.uniqueQuestions ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                  {paper.compliance.checks && paper.compliance.checks.length > 0 && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Checks
                      </Typography>
                      {paper.compliance.checks.map((check, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {check.passed ? (
                            <CheckCircleIcon color="success" fontSize="small" />
                          ) : (
                            <ErrorIcon color="error" fontSize="small" />
                          )}
                          <Typography variant="caption">{check.name}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No compliance data available
                </Typography>
              )}
            </Paper>
          </Grid>

          {paper.validation?.errors?.length > 0 && (
            <Grid item xs={12}>
              <Alert severity="error">
                <Typography variant="subtitle2">Validation Errors</Typography>
                {paper.validation.errors.map((err, idx) => (
                  <Typography key={idx} variant="body2">
                    • {err.message}
                  </Typography>
                ))}
              </Alert>
            </Grid>
          )}

          {paper.validation?.warnings?.length > 0 && (
            <Grid item xs={12}>
              <Alert severity="warning">
                <Typography variant="subtitle2">Validation Warnings</Typography>
                {paper.validation.warnings.map((warn, idx) => (
                  <Typography key={idx} variant="body2">
                    • {warn.message}
                  </Typography>
                ))}
              </Alert>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Metadata */}
        <Typography variant="caption" color="text.secondary" display="block">
          Created: {new Date(paper.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Last Updated: {new Date(paper.updatedAt).toLocaleString()}
        </Typography>
        {paper.generationMetadata?.totalTimeMs && (
          <Typography variant="caption" color="text.secondary" display="block">
            Generation Time: {paper.generationMetadata.totalTimeMs}ms
          </Typography>
        )}
        {paper.generationStats && (
          <Typography variant="caption" color="text.secondary" display="block">
            Questions Considered: {paper.generationStats.questionsConsidered || 0}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 480 },
          p: 3,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Paper Details
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {renderContent()}
    </Drawer>
  );
};

export default CandidatePaperDetailsDrawer;
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
/**
 * Candidate Preview Dialog Component
 * Preview examination as candidates would see it
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Chip,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  School as ExamIcon,
  Timer as TimerIcon,
  QuestionAnswer as QuestionIcon,
  CheckCircle as SubmitIcon,
} from '@mui/icons-material';
import * as previewService from '../../services/examinationPreview/examinationPreviewService';

const STEPS = [
  { label: 'Welcome', icon: ExamIcon },
  { label: 'Instructions', icon: QuestionIcon },
  { label: 'Examination', icon: TimerIcon },
  { label: 'Submission', icon: SubmitIcon },
];

const CandidatePreviewDialog = ({
  open,
  onClose,
  examinationId,
  previewData,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(previewData);

  useEffect(() => {
    if (open && !preview) {
      loadPreview();
    }
  }, [open]);

  const loadPreview = async () => {
    setLoading(true);
    try {
      const response = await previewService.getPreview(examinationId);
      if (response && response.success) {
        setPreview(response.data);
      }
    } catch (err) {
      console.error('Failed to load preview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  const renderStepContent = () => {
    const exam = preview?.examination || {};
    const blueprint = preview?.blueprint || {};
    const policy = preview?.policy || {};
    const instructions = preview?.instructions || {};

    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {instructions?.welcomeMessage || `Welcome to ${exam.name || 'Examination'}`}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Please read the following information carefully before you begin.
            </Typography>

            <Paper sx={{ p: 2, bgcolor: 'action.hover', mb: 2 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2">Examination Details</Typography>
                <DetailRow label="Examination" value={exam.name} />
                <DetailRow label="Code" value={exam.code} />
                <DetailRow label="Duration" value={`${blueprint.duration || 0} minutes`} />
                <DetailRow label="Total Questions" value={blueprint.totalQuestions || 0} />
                <DetailRow label="Total Marks" value={blueprint.totalMarks || 0} />
                <DetailRow label="Passing Score" value={`${blueprint.passingScore || 0}%`} />
              </Stack>
            </Paper>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Examination Instructions
            </Typography>

            {instructions?.overview && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Overview</Typography>
                <Typography variant="body2" dangerouslySetInnerHTML={{ __html: instructions.overview }} />
              </Paper>
            )}

            {instructions?.responsibilities && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Your Responsibilities</Typography>
                <Typography variant="body2" dangerouslySetInnerHTML={{ __html: instructions.responsibilities }} />
              </Paper>
            )}

            <Paper sx={{ p: 2, bgcolor: 'action.hover' }}>
              <Typography variant="subtitle2" gutterBottom>Important Information</Typography>
              <Stack spacing={0.5}>
                <DetailRow label="Navigation" value={policy?.navigationRules?.navigationType || 'Free'} />
                <DetailRow label="Time Limit" value={`${blueprint.duration || 0} minutes`} />
                <DetailRow label="Auto Submit" value={policy?.timingRules?.autoSubmitOnTimeout ? 'Yes' : 'No'} />
                <DetailRow label="Question Review" value={policy?.navigationRules?.allowReview ? 'Allowed' : 'Not Allowed'} />
              </Stack>
            </Paper>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Examination Interface
            </Typography>

            <Alert severity="info" sx={{ mb: 2 }}>
              This is a preview of the examination interface.
            </Alert>

            <Paper sx={{ p: 2, mb: 2 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2">Question Navigation</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {[...Array(10)].map((_, i) => (
                    <Chip
                      key={i}
                      label={i + 1}
                      size="small"
                      variant="outlined"
                      color={i < 5 ? 'primary' : 'default'}
                    />
                  ))}
                </Box>
              </Stack>
            </Paper>

            <Paper sx={{ p: 2, bgcolor: 'action.hover' }}>
              <Typography variant="subtitle2" gutterBottom>Question Display</Typography>
              <Typography variant="body2" color="textSecondary">
                Questions will be displayed one at a time with options to navigate.
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Chip label="Previous" size="small" variant="outlined" />
                <Chip label="Next" size="small" variant="outlined" />
                <Chip label="Flag" size="small" variant="outlined" color="warning" />
                <Chip label="Review" size="small" variant="outlined" color="info" />
              </Stack>
            </Paper>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Submission
            </Typography>

            <Alert severity="warning" sx={{ mb: 2 }}>
              Please review your answers before submitting.
            </Alert>

            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Summary</Typography>
              <Stack spacing={0.5}>
                <DetailRow label="Total Questions" value={blueprint.totalQuestions || 0} />
                <DetailRow label="Answered" value="0" />
                <DetailRow label="Unanswered" value={blueprint.totalQuestions || 0} />
                <DetailRow label="Flagged" value="0" />
              </Stack>
            </Paper>

            {instructions?.completionMessage && (
              <Paper sx={{ p: 2, bgcolor: 'success.lighter' }}>
                <Typography variant="subtitle2" gutterBottom>Completion Message</Typography>
                <Typography variant="body2" dangerouslySetInnerHTML={{ __html: instructions.completionMessage }} />
              </Paper>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Candidate Preview</Typography>
          <Button size="small" onClick={onClose} startIcon={<CloseIcon />}>
            Close
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stepper activeStep={activeStep} orientation="vertical">
          {STEPS.map((step, index) => (
            <Step key={step.label}>
              <StepLabel StepIconComponent={step.icon}>
                <Typography variant="subtitle2">{step.label}</Typography>
              </StepLabel>
              <StepContent>
                {renderStepContent()}
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  {activeStep > 0 && (
                    <Button variant="outlined" onClick={handleBack}>
                      Back
                    </Button>
                  )}
                  {activeStep < STEPS.length - 1 && (
                    <Button variant="contained" onClick={handleNext}>
                      Next
                    </Button>
                  )}
                  {activeStep === STEPS.length - 1 && (
                    <Button variant="contained" color="success" onClick={handleReset}>
                      Start Over
                    </Button>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close Preview</Button>
      </DialogActions>
    </Dialog>
  );
};

// Helper Component
const DetailRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
    <Typography variant="caption" color="textSecondary">{label}</Typography>
    <Typography variant="caption" fontWeight={500}>{value || 'N/A'}</Typography>
  </Box>
);

export default CandidatePreviewDialog;
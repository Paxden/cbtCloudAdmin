/* eslint-disable no-unused-vars */
/**
 * CandidatePaperPreviewDialog
 * Dialog for previewing candidate papers
 * 
 * Location: src/components/candidate-paper/CandidatePaperPreviewDialog.jsx
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Stack,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioIcon,
} from '@mui/icons-material';

const CandidatePaperPreviewDialog = ({
  open,
  onClose,
  preview,
  loading = false,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleNext = () => {
    if (currentQuestion < (preview?.questions?.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!preview) {
      return (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Preview data not available
        </Alert>
      );
    }

    const questions = preview.questions || [];
    const currentQ = questions[currentQuestion];

    if (questions.length === 0) {
      return (
        <Alert severity="info">
          No questions available for preview
        </Alert>
      );
    }

    return (
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {preview.paperCode}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`Question ${currentQuestion + 1} of ${questions.length}`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`${preview.totalMarks || 0} marks`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={currentQ?.difficulty || 'N/A'}
              size="small"
              color={
                currentQ?.difficulty === 'EASY' ? 'success' :
                currentQ?.difficulty === 'MEDIUM' ? 'warning' :
                currentQ?.difficulty === 'HARD' ? 'error' : 'default'
              }
            />
          </Box>
        </Box>

        {/* Question */}
        {currentQ && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              {currentQ.content?.text || currentQ.questionText || 'Question text not available'}
            </Typography>

            {currentQ.content?.options && currentQ.content.options.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Options:
                </Typography>
                <Stack spacing={1}>
                  {currentQ.content.options.map((opt, idx) => (
                    <Box
                      key={opt.id || idx}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        borderRadius: 1,
                        bgcolor: opt.isCorrect ? 'success.light' : 'transparent',
                      }}
                    >
                      {opt.isCorrect ? (
                        <CheckCircleIcon color="success" fontSize="small" />
                      ) : (
                        <RadioIcon color="action" fontSize="small" />
                      )}
                      <Typography variant="body2">
                        {opt.text || `Option ${idx + 1}`}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {currentQ.content?.explanation && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Explanation:
                </Typography>
                <Typography variant="body2">
                  {currentQ.content.explanation}
                </Typography>
              </Box>
            )}
          </Paper>
        )}

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            startIcon={<PrevIcon />}
            onClick={handlePrev}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Typography variant="caption" color="text.secondary">
            {currentQuestion + 1} of {questions.length}
          </Typography>
          <Button
            endIcon={<NextIcon />}
            onClick={handleNext}
            disabled={currentQuestion === questions.length - 1}
          >
            Next
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '60vh', maxHeight: '90vh' },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Paper Preview</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {renderContent()}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CandidatePaperPreviewDialog;
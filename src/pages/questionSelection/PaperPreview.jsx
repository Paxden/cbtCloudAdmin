/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * Paper Preview Page
 * Full examination paper preview with all questions
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
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Refresh as RefreshIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  CheckCircle as ValidIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import QuestionPreviewDialog from '../../components/questionSelection/QuestionPreviewDialog';
import * as questionSelectionService from '../../services/questionSelection/questionSelectionService';
import DOMPurify from 'dompurify';

const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') {
    return user.role.name || user.role.role || 'USER';
  }
  return 'USER';
};

const PreviewQuestion = ({ question, index }) => {
  const [expanded, setExpanded] = useState(false);

  const {
    questionText,
    options = [],
    correctAnswer,
    explanation,
    marks,
    difficulty,
    questionType,
    questionCode,
  } = question;

  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        mb: 2,
        '&:hover': { borderColor: 'primary.main' },
        transition: 'all 0.2s ease',
      }}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle1" fontWeight={600}>
            Question {index + 1}
          </Typography>
          <Chip label={questionCode || 'N/A'} size="small" variant="outlined" />
          <Chip
            label={difficulty || 'N/A'}
            size="small"
            color={
              difficulty === 'EASY' ? 'success' :
              difficulty === 'MEDIUM' ? 'warning' :
              difficulty === 'HARD' ? 'error' :
              'default'
            }
            variant="outlined"
          />
          <Chip
            label={questionType?.replace('_', ' ') || 'N/A'}
            size="small"
            variant="outlined"
          />
          <Chip
            label={`${marks || 0} marks`}
            size="small"
            color="info"
            variant="outlined"
          />
        </Stack>
        {question.isLocked && (
          <Chip label="Locked" size="small" color="primary" />
        )}
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* Question Text */}
      <Typography
        variant="body1"
        sx={{ mb: 2 }}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(questionText || 'No question text provided'),
        }}
      />

      {/* Options */}
      {options.length > 0 && (
        <Stack spacing={1} sx={{ mb: 2 }}>
          {options.map((option, optIndex) => {
            const isCorrect = option === correctAnswer;
            return (
              <Paper
                key={optIndex}
                variant="outlined"
                sx={{
                  p: 1.5,
                  bgcolor: isCorrect ? 'success.lighter' : 'background.paper',
                  borderColor: isCorrect ? 'success.main' : 'divider',
                  borderWidth: isCorrect ? 2 : 1,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight={isCorrect ? 600 : 400}>
                    {optionLabels[optIndex] || `${optIndex + 1}`}.
                  </Typography>
                  <Typography
                    variant="body2"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(option),
                    }}
                  />
                  {isCorrect && (
                    <Chip
                      icon={<ValidIcon />}
                      label="Correct Answer"
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ ml: 'auto' }}
                    />
                  )}
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      )}

      {/* Correct Answer (for non-MCQ) */}
      {correctAnswer && options.length === 0 && (
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            mb: 2,
            bgcolor: 'success.lighter',
            borderColor: 'success.main',
            borderWidth: 2,
          }}
        >
          <Typography variant="body2">
            <strong>Correct Answer:</strong> {correctAnswer}
          </Typography>
        </Paper>
      )}

      {/* Explanation */}
      {explanation && (
        <Box sx={{ mt: 1 }}>
          <Button
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{ textTransform: 'none' }}
          >
            {expanded ? 'Hide Explanation' : 'Show Explanation'}
          </Button>
          {expanded && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mt: 1,
                bgcolor: 'action.hover',
              }}
            >
              <Typography variant="body2">{explanation}</Typography>
            </Paper>
          )}
        </Box>
      )}
    </Paper>
  );
};

const PaperPreview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const examinationId = id || searchParams.get('examinationId');

  const [composition, setComposition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Load composition
  const loadComposition = useCallback(async () => {
    if (!examinationId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await questionSelectionService.getComposition(examinationId, {
        includeSnapshots: true,
      });

      if (response && response.success) {
        setComposition(response.data);

        // Flatten all questions from all sections
        const questions = [];
        response.data.sections?.forEach(section => {
          section.questions?.forEach(question => {
            questions.push({
              ...question,
              sectionName: section.name,
              sectionId: section.sectionId,
            });
          });
        });
        setAllQuestions(questions);
      }
    } catch (err) {
      console.error('Failed to load composition:', err);
      setToast({
        open: true,
        message: err.message || 'Failed to load paper',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [examinationId]);

  useEffect(() => {
    loadComposition();
  }, [loadComposition]);

  const handleBack = () => {
    navigate('/question-selection');
  };

  const handleViewQuestion = (question) => {
    setSelectedQuestion(question);
    setPreviewDialogOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
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

  if (!composition || allQuestions.length === 0) {
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

  return (
    <Box sx={{ p: 3 }} id="paper-preview">
      <AppPageHeader
        title="Paper Preview"
        subtitle={`${allQuestions.length} questions • ${composition.totalMarks || 0} marks`}
        actions={
          <Stack direction="row" spacing={1}>
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

      {/* Paper Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={1} alignItems="center" sx={{ textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={600}>
            {composition.examinationId?.name || 'Examination Paper'}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {composition.examinationId?.code || 'N/A'}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            <Chip label={`${allQuestions.length} Questions`} variant="outlined" />
            <Chip label={`${composition.totalMarks || 0} Marks`} variant="outlined" />
            <Chip label={`Duration: ${composition.examinationId?.duration || 0} mins`} variant="outlined" />
            <Chip label={`Passing Score: ${composition.examinationId?.passingScore || 0}%`} variant="outlined" />
          </Stack>
          <Divider sx={{ width: '100%', maxWidth: 400 }} />
          <Typography variant="body2" color="textSecondary">
            Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </Typography>
        </Stack>
      </Paper>

      {/* Section Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {composition.sections?.map((section, index) => (
          <Grid item xs={12} sm={6} md={3} key={section.sectionId || index}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                  {section.name || `Section ${index + 1}`}
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block">
                  {section.questions?.length || 0} questions
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block">
                  {section.totalMarks || 0} marks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mb: 3 }}>
        <Chip label="Questions" />
      </Divider>

      {/* Questions */}
      <Box sx={{ mb: 3 }}>
        {allQuestions.map((question, index) => (
          <Box key={question.questionId || index}>
            <PreviewQuestion question={question} index={index} />
            {index < allQuestions.length - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))}
      </Box>

      {/* End of Paper */}
      <Paper sx={{ p: 3, textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="textSecondary">
          End of Examination Paper
        </Typography>
        <Typography variant="caption" color="textSecondary">
          This is a computer-based examination. All answers must be submitted electronically.
        </Typography>
      </Paper>

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

export default PaperPreview;
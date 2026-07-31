/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
/**
 * Question Preview Page
 * Testing and demonstration page for the rendering engine
 */

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Alert,
  Button,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import AppPageHeader from '../../components/common/AppPageHeader';
import QuestionRenderer from '../../components/questionRenderer/QuestionRenderer';
import PreviewToolbar from '../../components/questionRenderer/PreviewToolbar';
import * as questionPreviewService from '../../services/questionPreview/questionPreviewService';
import * as questionBankService from '../../services/questionBank/questionBankService';

const QuestionPreview = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('desktop');
  const [displayOptions, setDisplayOptions] = useState({
    showAnswers: false,
    showExplanation: false,
    showReference: false,
    showMetadata: false,
  });
  const [renderErrors, setRenderErrors] = useState([]);

  useEffect(() => {
    if (questionId) {
      loadQuestion();
    }
  }, [questionId]);

  const loadQuestion = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await questionBankService.getQuestion(questionId);
      if (response.success) {
        const questionData = response.data;
        // Check if we need to load from preview endpoint
        const previewResponse = await questionPreviewService.loadQuestion(questionId, {
          mode: 'examiner',
        });
        setQuestion(previewResponse.data || questionData);
      } else {
        setError(response.message || 'Failed to load question');
      }
    } catch (err) {
      setError(err.message || 'Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const handleDisplayOptionChange = (newOptions) => {
    setDisplayOptions(newOptions);
  };

  const handleRenderError = (errors) => {
    setRenderErrors(errors);
  };

  const getPreviewWidth = () => {
    switch (mode) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      default:
        return '100%';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={loadQuestion}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!question) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          No question found
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Question Preview"
        subtitle="Preview how this question will appear to candidates"
      />

      {/* Toolbar */}
      <PreviewToolbar
        mode={mode}
        onModeChange={handleModeChange}
        displayOptions={displayOptions}
        onDisplayOptionChange={handleDisplayOptionChange}
        loading={loading}
      />

      {/* Render Errors */}
      {renderErrors.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {renderErrors.map((err, i) => (
            <div key={i}>• {err}</div>
          ))}
        </Alert>
      )}

      {/* Question Information */}
      <Paper sx={{ p: 2, mb: 2, bgcolor: 'action.hover' }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Typography variant="caption" color="textSecondary">
            <strong>Code:</strong> {question.questionCode || 'N/A'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            <strong>Type:</strong> {question.questionTypeId?.name || 'N/A'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            <strong>Difficulty:</strong> {question.difficultyId?.name || 'N/A'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            <strong>Marks:</strong> {question.marks || 0}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            <strong>Status:</strong> {question.status || 'N/A'}
          </Typography>
        </Stack>
      </Paper>

      {/* Renderer */}
      <Box sx={{ maxWidth: getPreviewWidth(), mx: 'auto' }}>
        <QuestionRenderer
          question={question}
          showAnswers={displayOptions.showAnswers}
          showExplanation={displayOptions.showExplanation}
          showReference={displayOptions.showReference}
          showMetadata={displayOptions.showMetadata}
          disabled={true}
          mode="candidate"
          onRenderError={handleRenderError}
        />
      </Box>

      {/* Information Note */}
      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
        This preview shows the question as it would appear to candidates.
        Toggle display options above to see additional information.
      </Typography>
    </Box>
  );
};

export default QuestionPreview;
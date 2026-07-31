/**
 * Question Renderer Component
 * Universal question rendering engine
 * 
 * This component renders a question exactly as candidates will see it.
 * Reused by: Question Builder, Question Bank, Approval Workflow,
 * Exam Builder, Candidate CBT Application, Results Review
 */

import { Box, Paper, Divider, Typography } from '@mui/material';
import QuestionHeader from './QuestionHeader';
import QuestionBody from './QuestionBody';
import QuestionOptions from './QuestionOptions';
import ExplanationPanel from './ExplanationPanel';
import ReferencePanel from './ReferencePanel';
import QuestionMetadataPanel from './QuestionMetadataPanel';
import { validateQuestionRender } from '../../services/questionPreview/questionPreviewService';

const QuestionRenderer = ({
  question,
  index = 0,
  total = 1,
  showAnswers = false,
  showExplanation = false,
  showReference = false,
  showMetadata = false,
  disabled = true,
  mode = 'candidate',
  onRenderError,
  sx = {},
}) => {
  // Validate question
  const validation = validateQuestionRender(question);
  if (!validation.isValid) {
    if (onRenderError) {
      onRenderError(validation.errors);
    }
    return (
      <Paper sx={{ p: 3, textAlign: 'center', color: 'error.main', ...sx }}>
        <Typography variant="body1">This question cannot be rendered</Typography>
        {validation.errors.map((err, i) => (
          <Typography key={i} variant="caption" display="block" color="textSecondary">
            • {err}
          </Typography>
        ))}
      </Paper>
    );
  }

  return (
    <Box sx={{ ...sx }}>
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        {/* Header */}
        <QuestionHeader question={question} index={index} total={total} showMetadata={showMetadata} />

        <Divider sx={{ mb: 3 }} />

        {/* Question Body */}
        <QuestionBody question={question} />

        {/* Options */}
        {question.options && question.options.length > 0 && (
          <QuestionOptions
            question={question}
            showAnswers={showAnswers}
            disabled={disabled}
          />
        )}

        {/* Explanation */}
        <ExplanationPanel
          question={question}
          showExplanation={showExplanation}
          defaultExpanded={mode === 'examiner'}
        />

        {/* Reference */}
        <ReferencePanel
          question={question}
          showReference={showReference}
          defaultExpanded={mode === 'examiner'}
        />

        {/* Metadata */}
        <QuestionMetadataPanel
          question={question}
          showMetadata={showMetadata}
          defaultExpanded={mode === 'examiner'}
        />
      </Paper>
    </Box>
  );
};

export default QuestionRenderer;
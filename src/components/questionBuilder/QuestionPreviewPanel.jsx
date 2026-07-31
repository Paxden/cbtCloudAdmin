/* eslint-disable no-unused-vars */
/**
 * Question Preview Panel Component
 * Live preview of the question as candidates will see it
 */

import { Box, Paper, Typography, Chip, Divider, Stack } from '@mui/material';
import StatusChip from '../chips/StatusChip';

const QuestionPreviewPanel = ({
  questionData,
  loading = false,
}) => {
  if (!questionData) {
    return (
      <Paper sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="textSecondary">
          Fill in the question details to see a preview
        </Typography>
      </Paper>
    );
  }

  const { questionText, options, questionType, marks, difficulty, status } = questionData;

  return (
    <Paper sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Question Preview
        </Typography>
        <Stack direction="row" spacing={1}>
          {status && <StatusChip status={status} size="small" />}
          {marks && <Chip label={`${marks} mark${marks > 1 ? 's' : ''}`} size="small" variant="outlined" />}
        </Stack>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Question Text */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Question
        </Typography>
        <Box
          sx={{
            p: 2,
            bgcolor: 'action.hover',
            borderRadius: 1,
            minHeight: 60,
          }}
          dangerouslySetInnerHTML={{ __html: questionText || 'No content yet' }}
        />
      </Box>

      {/* Options */}
      {options && options.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Options
          </Typography>
          <Stack spacing={1}>
            {options.map((option, index) => (
              <Box
                key={option.id}
                sx={{
                  p: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  {option.id}.
                </Typography>
                <Typography variant="body2">{option.text}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Question Type & Difficulty */}
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        {questionType && (
          <Chip label={questionType.name || questionType} size="small" color="primary" variant="outlined" />
        )}
        {difficulty && (
          <Chip label={difficulty.name || difficulty} size="small" color="secondary" variant="outlined" />
        )}
      </Stack>
    </Paper>
  );
};

export default QuestionPreviewPanel;
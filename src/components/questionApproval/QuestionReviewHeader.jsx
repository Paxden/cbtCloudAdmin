/**
 * Question Review Header Component
 * Displays question information in review mode
 */

import { Box, Typography, Chip, Stack, Paper } from '@mui/material';
import ReviewStatusChip from './ReviewStatusChip';
import { format } from 'date-fns';

const QuestionReviewHeader = ({ question, loading }) => {
  if (loading || !question) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography>Loading question...</Typography>
      </Paper>
    );
  }

  const title = question.questionText?.replace(/<[^>]*>/g, '').substring(0, 100) || 'No title';

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mt: 0.5 }}>
            <Chip
              label={question.questionCode || 'N/A'}
              size="small"
              variant="outlined"
              sx={{ fontFamily: 'monospace' }}
            />
            <ReviewStatusChip status={question.status} size="small" />
            {question.marks && (
              <Chip label={`${question.marks} marks`} size="small" variant="outlined" />
            )}
          </Stack>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="caption" color="textSecondary">
            Author: {question.createdBy?.name || 'Unknown'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Submitted: {question.submittedAt ? format(new Date(question.submittedAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        <Chip label={`Category: ${question.categoryId?.name || 'N/A'}`} size="small" variant="outlined" />
        <Chip label={`Subject: ${question.subjectId?.name || 'N/A'}`} size="small" variant="outlined" />
        <Chip label={`Topic: ${question.topicId?.name || 'N/A'}`} size="small" variant="outlined" />
        <Chip label={`Difficulty: ${question.difficultyId?.name || 'N/A'}`} size="small" variant="outlined" />
        <Chip label={`Type: ${question.questionTypeId?.name || 'N/A'}`} size="small" variant="outlined" />
      </Box>
    </Paper>
  );
};

export default QuestionReviewHeader;
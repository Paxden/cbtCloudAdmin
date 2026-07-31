/**
 * Question Header Component
 * Displays question number, type, marks, and status
 */

import { Box, Typography, Chip, Stack } from '@mui/material';
import QuestionStatusChip from '../questionBank/QuestionStatusChip';

const QuestionHeader = ({ question, index, total, showMetadata = false }) => {
  if (!question) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Question {index + 1} of {total}
          </Typography>
          {showMetadata && question.questionCode && (
            <Typography variant="caption" color="textSecondary" sx={{ fontFamily: 'monospace' }}>
              {question.questionCode}
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {question.marks && (
            <Chip label={`${question.marks} mark${question.marks > 1 ? 's' : ''}`} size="small" variant="outlined" />
          )}
          {question.questionTypeId?.name && (
            <Chip label={question.questionTypeId.name} size="small" color="primary" variant="outlined" />
          )}
          {question.status && (
            <QuestionStatusChip status={question.status} size="small" />
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default QuestionHeader;
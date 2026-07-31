/**
 * Question Options Component
 * Renders options based on question type
 */

import { Box, Typography, Radio, RadioGroup, Checkbox, FormControlLabel, TextField,  } from '@mui/material';

const QuestionOptions = ({
  question,
  showAnswers = false,
  disabled = true,
}) => {
  if (!question) return null;

  const typeCode = question.questionTypeId?.code || question.questionType;

  // Single Choice
  if (typeCode === 'SINGLE_CHOICE') {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Select one correct answer:
        </Typography>
        <RadioGroup value="" disabled={disabled}>
          {question.options?.map((option) => {
            const isCorrect = showAnswers && question.correctAnswer === option.id;
            return (
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">{option.id}. {option.text}</Typography>
                    {isCorrect && (
                      <Typography variant="caption" color="success.main" fontWeight={600}>
                        ✓ Correct
                      </Typography>
                    )}
                  </Box>
                }
                sx={{
                  p: 1,
                  borderRadius: 1,
                  width: '100%',
                  border: isCorrect ? '2px solid' : '1px solid',
                  borderColor: isCorrect ? 'success.main' : 'divider',
                  bgcolor: isCorrect ? 'success.light' : 'transparent',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              />
            );
          })}
        </RadioGroup>
      </Box>
    );
  }

  // Multiple Choice
  if (typeCode === 'MULTIPLE_CHOICE') {
    const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Select all correct answers:
        </Typography>
        {question.options?.map((option) => {
          const isCorrect = showAnswers && correctAnswers.includes(option.id);
          return (
            <FormControlLabel
              key={option.id}
              control={<Checkbox disabled={disabled} />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">{option.id}. {option.text}</Typography>
                  {isCorrect && (
                    <Typography variant="caption" color="success.main" fontWeight={600}>
                      ✓ Correct
                    </Typography>
                  )}
                </Box>
              }
              sx={{
                p: 1,
                borderRadius: 1,
                width: '100%',
                border: isCorrect ? '2px solid' : '1px solid',
                borderColor: isCorrect ? 'success.main' : 'divider',
                bgcolor: isCorrect ? 'success.light' : 'transparent',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            />
          );
        })}
      </Box>
    );
  }

  // True/False
  if (typeCode === 'TRUE_FALSE') {
    const correctValue = showAnswers ? question.correctAnswer : null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Select True or False:
        </Typography>
        <RadioGroup value="" disabled={disabled}>
          {['True', 'False'].map((value) => {
            const isCorrect = showAnswers && correctValue === (value === 'True');
            return (
              <FormControlLabel
                key={value}
                value={value.toLowerCase()}
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">{value}</Typography>
                    {isCorrect && (
                      <Typography variant="caption" color="success.main" fontWeight={600}>
                        ✓ Correct
                      </Typography>
                    )}
                  </Box>
                }
                sx={{
                  p: 1,
                  borderRadius: 1,
                  width: '100%',
                  border: isCorrect ? '2px solid' : '1px solid',
                  borderColor: isCorrect ? 'success.main' : 'divider',
                  bgcolor: isCorrect ? 'success.light' : 'transparent',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              />
            );
          })}
        </RadioGroup>
      </Box>
    );
  }

  // Fill in the Blank
  if (typeCode === 'FILL_BLANK') {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Type your answer:
        </Typography>
        <TextField
          fullWidth
          placeholder="Type your answer here..."
          disabled={disabled}
          variant="outlined"
          size="medium"
          sx={{ maxWidth: 400 }}
          helperText={
            showAnswers && question.correctAnswer && (
              <Typography variant="caption" color="success.main">
                Accepted answers: {Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer}
              </Typography>
            )
          }
        />
      </Box>
    );
  }

  // Default fallback
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body2" color="textSecondary">
        No options available for this question type.
      </Typography>
    </Box>
  );
};

export default QuestionOptions;
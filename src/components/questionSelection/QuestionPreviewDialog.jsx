/* eslint-disable no-unused-vars */
/**
 * Question Preview Dialog Component
 * Preview a question with all details
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Stack,
  Box,
  Divider,
  Paper,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Subject as SubjectIcon,
  Topic as TopicIcon,
  Assessment as DifficultyIcon,
} from '@mui/icons-material';
import DOMPurify from 'dompurify';

const QuestionPreviewDialog = ({ open, onClose, question }) => {
  if (!question) return null;

  const {
    questionText,
    options = [],
    correctAnswer,
    explanation,
    subjectId,
    topicId,
    difficulty,
    questionType,
    marks,
    questionCode,
    metadata,
  } = question;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            Question Preview
          </Typography>
          <Chip label={questionCode || 'N/A'} variant="outlined" size="small" />
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Metadata */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {subjectId && (
              <Chip
                icon={<SubjectIcon />}
                label={subjectId.name || 'N/A'}
                size="small"
                variant="outlined"
              />
            )}
            {topicId && (
              <Chip
                icon={<TopicIcon />}
                label={topicId.name || 'N/A'}
                size="small"
                variant="outlined"
              />
            )}
            {difficulty && (
              <Chip
                icon={<DifficultyIcon />}
                label={difficulty}
                size="small"
                color={
                  difficulty === 'EASY' ? 'success' :
                  difficulty === 'MEDIUM' ? 'warning' :
                  difficulty === 'HARD' ? 'error' :
                  'default'
                }
                variant="outlined"
              />
            )}
            {questionType && (
              <Chip
                label={questionType.replace('_', ' ')}
                size="small"
                variant="outlined"
              />
            )}
            {marks && (
              <Chip
                label={`${marks} marks`}
                size="small"
                color="info"
                variant="outlined"
              />
            )}
          </Stack>

          <Divider />

          {/* Question Text */}
          <Box>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Question Text
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover' }}>
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(questionText || 'No question text provided'),
                }}
              />
            </Paper>
          </Box>

          {/* Options */}
          {options.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Options
              </Typography>
              <Stack spacing={1}>
                {options.map((option, index) => {
                  const isCorrect = option === correctAnswer;
                  return (
                    <Paper
                      key={index}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        bgcolor: isCorrect ? 'success.lighter' : 'background.paper',
                        borderColor: isCorrect ? 'success.main' : 'divider',
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" fontWeight={isCorrect ? 600 : 400}>
                          {String.fromCharCode(65 + index)}.
                        </Typography>
                        <Typography
                          variant="body2"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(option),
                          }}
                        />
                        {isCorrect && (
                          <Chip
                            label="Correct"
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </Paper>
                  );
                })}
              </Stack>
            </Box>
          )}

          {/* Correct Answer */}
          {correctAnswer && options.length === 0 && (
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Correct Answer
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'success.lighter', borderColor: 'success.main' }}>
                <Typography variant="body2">{correctAnswer}</Typography>
              </Paper>
            </Box>
          )}

          {/* Explanation */}
          {explanation && (
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Explanation
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover' }}>
                <Typography
                  variant="body2"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(explanation),
                  }}
                />
              </Paper>
            </Box>
          )}

          {/* Metadata */}
          {metadata && (
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Additional Information
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {metadata.keywords?.map((keyword) => (
                  <Chip key={keyword} label={keyword} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionPreviewDialog;
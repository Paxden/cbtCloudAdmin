/* eslint-disable no-unused-vars */
/**
 * Question Details Drawer Component
 * Displays complete question details
 */

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Grid,
  Skeleton,
  Stack,
  Paper,
  Button,
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Edit as EditIcon, 
  Preview as PreviewIcon,
  Send as SubmitIcon, // ✅ Add Submit Icon
} from '@mui/icons-material';
import QuestionStatusChip from './QuestionStatusChip';
import { format } from 'date-fns';

const DetailRow = ({ label, value, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="50%" />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
      <Typography variant="body2" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value || '-'}
      </Typography>
    </Box>
  );
};

const QuestionDetailsDrawer = ({
  open,
  question,
  onClose,
  loading,
  onEdit,
  onPreview,
  onSubmitReview, // ✅ Add submit handler
  canSubmit, // ✅ Add submit permission
}) => {
  if (!question && !loading) {
    return null;
  }

  const canEdit = question?.status !== 'ARCHIVED';
  const isDraft = question?.status === 'DRAFT';

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 500 },
          p: 3,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Question Details
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {loading ? (
        <Box>
          <Skeleton variant="text" height={40} />
          <Skeleton variant="text" height={20} />
          <Skeleton variant="rectangular" height={100} sx={{ my: 2 }} />
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} variant="text" height={30} />
          ))}
        </Box>
      ) : (
        <Box>
          {/* Actions */}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
            {canEdit && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => onEdit(question)}
              >
                Edit
              </Button>
            )}
            <Button
              variant="outlined"
              size="small"
              startIcon={<PreviewIcon />}
              onClick={() => onPreview(question)}
            >
              Preview
            </Button>
            {/* ✅ Submit for Review Button */}
            {canSubmit && isDraft && (
              <Button
                variant="contained"
                color="warning"
                size="small"
                startIcon={<SubmitIcon />}
                onClick={() => onSubmitReview(question)}
              >
                Submit for Review
              </Button>
            )}
          </Stack>

          {/* Code & Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h5" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
              {question.questionCode || 'N/A'}
            </Typography>
            <QuestionStatusChip status={question.status} size="medium" />
          </Box>

          {/* Question Text */}
          <Paper sx={{ p: 2, bgcolor: 'action.hover', mb: 3 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Question Text
            </Typography>
            <Box dangerouslySetInnerHTML={{ __html: question.questionText || 'No content' }} />
          </Paper>

          {/* Options */}
          {question.options && question.options.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Options
              </Typography>
              <Stack spacing={1}>
                {question.options.map((option) => (
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
                      bgcolor: question.correctAnswer && (
                        Array.isArray(question.correctAnswer)
                          ? question.correctAnswer.includes(option.id)
                          : question.correctAnswer === option.id
                      ) ? 'success.light' : 'transparent',
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {option.id}.
                    </Typography>
                    <Typography variant="body2">{option.text}</Typography>
                    {question.correctAnswer && (
                      Array.isArray(question.correctAnswer)
                        ? question.correctAnswer.includes(option.id)
                        : question.correctAnswer === option.id
                    ) && (
                      <Chip label="Correct" size="small" color="success" />
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Correct Answer for True/False */}
          {question.questionTypeId?.code === 'TRUE_FALSE' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Correct Answer
              </Typography>
              <Chip
                label={question.correctAnswer ? 'True' : 'False'}
                color={question.correctAnswer ? 'success' : 'default'}
              />
            </Box>
          )}

          {/* Correct Answer for Fill in the Blank */}
          {question.questionTypeId?.code === 'FILL_BLANK' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Accepted Answers
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {(question.correctAnswer || []).map((answer, index) => (
                  <Chip key={index} label={answer} color="success" size="small" />
                ))}
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Metadata */}
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Metadata
          </Typography>

          <Stack spacing={0.5}>
            <DetailRow label="Category" value={question.categoryId?.name} />
            <DetailRow label="Subject" value={question.subjectId?.name} />
            <DetailRow label="Topic" value={question.topicId?.name} />
            <DetailRow label="Question Type" value={question.questionTypeId?.name} />
            <DetailRow label="Difficulty" value={question.difficultyId?.name} />
            <DetailRow label="Marks" value={question.marks} />
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Explanation */}
          {question.explanation && (
            <>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Explanation
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'action.hover', mb: 3 }}>
                <Box dangerouslySetInnerHTML={{ __html: question.explanation }} />
              </Paper>
            </>
          )}

          {/* Reference */}
          {(question.referenceBook || question.referenceSection || question.referenceUrl) && (
            <>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Reference
              </Typography>
              <Stack spacing={0.5}>
                {question.referenceBook && (
                  <DetailRow label="Book/Document" value={question.referenceBook} />
                )}
                {question.referenceSection && (
                  <DetailRow label="Section" value={question.referenceSection} />
                )}
                {question.referenceUrl && (
                  <DetailRow label="URL" value={question.referenceUrl} />
                )}
              </Stack>
            </>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Audit Info */}
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Audit Information
          </Typography>

          <Stack spacing={0.5}>
            <DetailRow label="Created By" value={question.createdBy?.name} />
            <DetailRow
              label="Created Date"
              value={question.createdAt ? format(new Date(question.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
            />
            <DetailRow
              label="Last Updated"
              value={question.updatedAt ? format(new Date(question.updatedAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
            />
            <DetailRow label="Version" value={question.currentVersion || 1} />
          </Stack>
        </Box>
      )}
    </Drawer>
  );
};

export default QuestionDetailsDrawer;
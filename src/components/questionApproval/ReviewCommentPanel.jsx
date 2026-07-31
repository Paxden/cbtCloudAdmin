/**
 * Review Comment Panel Component
 * Handles review comments for approve/reject actions
 */

import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';

const ReviewCommentPanel = ({
  action,
  onSubmit,
  onCancel,
  loading = false,
  error = null,
}) => {
  const [comment, setComment] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [validationError, setValidationError] = useState(null);

  const isReject = action === 'reject';

  const handleSubmit = () => {
    if (isReject && !comment.trim()) {
      setValidationError('Rejection comment is required');
      return;
    }

    onSubmit({
      comment: comment.trim(),
      ...(isReject && { suggestions: suggestions.trim() }),
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {isReject ? 'Reject Question' : 'Approve Question'}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {(error || validationError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || validationError}
        </Alert>
      )}

      <Stack spacing={2}>
        <TextField
          label={isReject ? 'Rejection Comment *' : 'Approval Comment (Optional)'}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (validationError) setValidationError(null);
          }}
          fullWidth
          multiline
          rows={3}
          placeholder={
            isReject
              ? 'Explain why this question is being rejected...'
              : 'Add any optional comments about this question...'
          }
          error={isReject && !comment.trim() && !!validationError}
          helperText={
            isReject
              ? 'Please provide a clear reason for rejection'
              : 'Optional comment for the author'
          }
          disabled={loading}
        />

        {isReject && (
          <TextField
            label="Suggestions (Optional)"
            value={suggestions}
            onChange={(e) => setSuggestions(e.target.value)}
            fullWidth
            multiline
            rows={2}
            placeholder="Provide suggestions for improvement..."
            disabled={loading}
          />
        )}

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 1 }}>
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color={isReject ? 'error' : 'success'}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Processing...' : isReject ? 'Reject' : 'Approve'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default ReviewCommentPanel;
/**
 * Question Content Editor Component
 * Wraps the rich text editor for question content
 */

import { Box, Typography } from '@mui/material';
import QuestionEditor from '../editor/QuestionEditor';

const QuestionContentEditor = ({
  value,
  onChange,
  error,
  disabled = false,
}) => {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Question Content *
      </Typography>
      <QuestionEditor
        value={value}
        onChange={onChange}
        placeholder="Write your question content here..."
        maxLength={10000}
        disabled={disabled}
        error={error}
      />
      {error && typeof error === 'string' && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default QuestionContentEditor;
/**
 * Explanation Editor Component
 * Rich text editor for question explanation
 */

import { Box, Typography } from '@mui/material';
import QuestionEditor from '../editor/QuestionEditor';

const ExplanationEditor = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Explanation (Optional)
      </Typography>
      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
        Provide an explanation that will be shown to candidates after review.
      </Typography>
      <QuestionEditor
        value={value}
        onChange={onChange}
        placeholder="Explain the correct answer..."
        maxLength={1000}
        disabled={disabled}
      />
    </Box>
  );
};

export default ExplanationEditor;
/* eslint-disable no-undef */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/**
 * Correct Answer Selector Component
 * Renders appropriate answer selector based on question type
 */

import { Box, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Checkbox, Chip, TextField, Button, Stack } from '@mui/material';

const CorrectAnswerSelector = ({
  questionType,
  options = [],
  correctAnswer,
  onChange,
  error,
  disabled = false,
}) => {
  const isSingleChoice = questionType?.code === 'SINGLE_CHOICE';
  const isMultipleChoice = questionType?.code === 'MULTIPLE_CHOICE';
  const isTrueFalse = questionType?.code === 'TRUE_FALSE';
  const isFillBlank = questionType?.code === 'FILL_BLANK';

  if (isTrueFalse) {
    return (
      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Correct Answer *
        </Typography>
        <FormControl component="fieldset" error={!!error}>
          <RadioGroup
            value={correctAnswer !== undefined ? String(correctAnswer) : ''}
            onChange={(e) => onChange(e.target.value === 'true')}
          >
            <FormControlLabel value="true" control={<Radio />} label="True" />
            <FormControlLabel value="false" control={<Radio />} label="False" />
          </RadioGroup>
          {error && <Typography variant="caption" color="error">{error}</Typography>}
        </FormControl>
      </Box>
    );
  }

  if (isFillBlank) {
    const acceptedAnswers = Array.isArray(correctAnswer) ? correctAnswer : [];
    const [newAnswer, setNewAnswer] = useState('');

    const handleAddAnswer = () => {
      if (!newAnswer.trim()) return;
      onChange([...acceptedAnswers, newAnswer.trim()]);
      setNewAnswer('');
    };

    const handleRemoveAnswer = (index) => {
      onChange(acceptedAnswers.filter((_, i) => i !== index));
    };

    return (
      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Accepted Answers *
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <TextField
            size="small"
            placeholder="Enter accepted answer"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            disabled={disabled}
            fullWidth
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddAnswer();
              }
            }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleAddAnswer}
            disabled={disabled || !newAnswer.trim()}
          >
            Add
          </Button>
        </Stack>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {acceptedAnswers.map((answer, index) => (
            <Chip
              key={index}
              label={answer}
              onDelete={disabled ? undefined : () => handleRemoveAnswer(index)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>
    );
  }

  if (isSingleChoice || isMultipleChoice) {
    return null; // Handled by QuestionOptionsEditor
  }

  return null;
};

export default CorrectAnswerSelector;
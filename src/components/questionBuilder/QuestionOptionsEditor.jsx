/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/rules-of-hooks */
/**
 * Question Options Editor Component
 * Dynamic options editor based on question type
 */

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Stack,
  Chip,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  Alert,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
} from "@mui/icons-material";

const QuestionOptionsEditor = ({
  questionType,
  options = [],
  correctAnswer,
  onChange,
  onCorrectAnswerChange,
  error,
  disabled = false,
}) => {
  const [newOptionText, setNewOptionText] = useState("");
  const [localOptions, setLocalOptions] = useState(options);
  const [localCorrectAnswer, setLocalCorrectAnswer] = useState(correctAnswer);

  // Sync with parent props
  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  useEffect(() => {
    setLocalCorrectAnswer(correctAnswer);
  }, [correctAnswer]);

  const isSingleChoice = questionType?.code === "SINGLE_CHOICE";
  const isMultipleChoice = questionType?.code === "MULTIPLE_CHOICE";
  const isTrueFalse = questionType?.code === "TRUE_FALSE";
  const isFillBlank = questionType?.code === "FILL_BLANK";

  // Update parent when local options change
  const updateParentOptions = (newOptions) => {
    setLocalOptions(newOptions);
    if (onChange) {
      onChange(newOptions);
    }
  };

  // Update parent when correct answer changes
  const updateParentCorrectAnswer = (newAnswer) => {
    setLocalCorrectAnswer(newAnswer);
    if (onCorrectAnswerChange) {
      onCorrectAnswerChange(newAnswer);
    }
  };

  const handleAddOption = () => {
    if (!newOptionText.trim()) return;
    const newOption = {
      id: String.fromCharCode(65 + localOptions.length), // A, B, C, D...
      text: newOptionText.trim(),
      order: localOptions.length + 1,
    };
    const newOptions = [...localOptions, newOption];
    updateParentOptions(newOptions);
    setNewOptionText("");
  };

  const handleRemoveOption = (index) => {
    // ✅ Create new array without the removed option
    const newOptions = localOptions.filter((_, i) => i !== index);

    // Reassign IDs and orders
    const renumbered = newOptions.map((opt, i) => ({
      ...opt,
      id: String.fromCharCode(65 + i),
      order: i + 1,
    }));

    updateParentOptions(renumbered);

    // Update correct answer if needed
    if (localCorrectAnswer) {
      const ids = renumbered.map((o) => o.id);
      if (Array.isArray(localCorrectAnswer)) {
        const newCorrect = localCorrectAnswer.filter((id) => ids.includes(id));
        if (newCorrect.length !== localCorrectAnswer.length) {
          updateParentCorrectAnswer(newCorrect);
        }
      } else if (!ids.includes(localCorrectAnswer)) {
        updateParentCorrectAnswer(null);
      }
    }
  };

  const handleOptionTextChange = (index, text) => {
    const newOptions = [...localOptions];
    newOptions[index].text = text;
    updateParentOptions(newOptions);
  };

  const handleCorrectAnswerChange = (newAnswer) => {
    updateParentCorrectAnswer(newAnswer);
  };

  // True/False rendering
  if (isTrueFalse) {
    return (
      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Correct Answer *
        </Typography>
        <FormControl component="fieldset" error={!!error}>
          <RadioGroup
            value={
              localCorrectAnswer !== undefined ? String(localCorrectAnswer) : ""
            }
            onChange={(e) =>
              handleCorrectAnswerChange(e.target.value === "true")
            }
          >
            <FormControlLabel value="true" control={<Radio />} label="True" />
            <FormControlLabel value="false" control={<Radio />} label="False" />
          </RadioGroup>
          {error && (
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          )}
        </FormControl>
      </Box>
    );
  }

  // Fill in the Blank rendering
  if (isFillBlank) {
    const acceptedAnswers = Array.isArray(localCorrectAnswer)
      ? localCorrectAnswer
      : [];
    const [newAnswer, setNewAnswer] = useState("");

    const handleAddAnswer = () => {
      if (!newAnswer.trim()) return;
      const newAnswers = [...acceptedAnswers, newAnswer.trim()];
      handleCorrectAnswerChange(newAnswers);
      setNewAnswer("");
    };

    const handleRemoveAnswer = (index) => {
      const newAnswers = acceptedAnswers.filter((_, i) => i !== index);
      handleCorrectAnswerChange(newAnswers);
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
              if (e.key === "Enter") {
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
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {acceptedAnswers.map((answer, index) => (
            <Chip
              key={index}
              label={answer}
              onDelete={disabled ? undefined : () => handleRemoveAnswer(index)}
              color="primary"
              variant="outlined"
            />
          ))}
          {acceptedAnswers.length === 0 && (
            <Typography variant="body2" color="textSecondary">
              No accepted answers added yet
            </Typography>
          )}
        </Box>
        {error && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 1, display: "block" }}
          >
            {error}
          </Typography>
        )}
      </Box>
    );
  }

  // Single Choice / Multiple Choice rendering
  if (!isSingleChoice && !isMultipleChoice) {
    return (
      <Alert severity="info">
        Options editor for {questionType?.name || "this question type"} will
        appear here.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Options{" "}
        {isMultipleChoice
          ? "(Select all correct answers)"
          : "(Select one correct answer)"}{" "}
        *
      </Typography>

      {localOptions.map((option, index) => (
        <Paper
          key={option.id || index}
          variant="outlined"
          sx={{
            p: 1.5,
            mb: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderColor:
              localCorrectAnswer &&
              (Array.isArray(localCorrectAnswer)
                ? localCorrectAnswer.includes(option.id)
                : localCorrectAnswer === option.id)
                ? "success.main"
                : "divider",
            bgcolor:
              localCorrectAnswer &&
              (Array.isArray(localCorrectAnswer)
                ? localCorrectAnswer.includes(option.id)
                : localCorrectAnswer === option.id)
                ? "success.light"
                : "transparent",
          }}
        >
          <DragIcon sx={{ color: "text.disabled", cursor: "grab" }} />
          <Typography variant="body2" fontWeight={500} sx={{ minWidth: 24 }}>
            {option.id}.
          </Typography>
          <TextField
            value={option.text}
            onChange={(e) => handleOptionTextChange(index, e.target.value)}
            fullWidth
            size="small"
            disabled={disabled}
            placeholder={`Option ${option.id}`}
          />
          <IconButton
            size="small"
            color="error"
            onClick={() => handleRemoveOption(index)}
            disabled={disabled || localOptions.length <= 2}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          {isSingleChoice ? (
            <Radio
              checked={localCorrectAnswer === option.id}
              onChange={() => handleCorrectAnswerChange(option.id)}
              disabled={disabled}
              color="success"
            />
          ) : (
            <Checkbox
              checked={
                Array.isArray(localCorrectAnswer) &&
                localCorrectAnswer.includes(option.id)
              }
              onChange={(e) => {
                const current = Array.isArray(localCorrectAnswer)
                  ? localCorrectAnswer
                  : [];
                if (e.target.checked) {
                  handleCorrectAnswerChange([...current, option.id]);
                } else {
                  handleCorrectAnswerChange(
                    current.filter((id) => id !== option.id),
                  );
                }
              }}
              disabled={disabled}
              color="success"
            />
          )}
        </Paper>
      ))}

      {/* Add Option Input */}
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <TextField
          size="small"
          placeholder="Enter option text"
          value={newOptionText}
          onChange={(e) => setNewOptionText(e.target.value)}
          disabled={disabled || localOptions.length >= 10}
          fullWidth
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddOption();
            }
          }}
        />
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddOption}
          disabled={
            disabled || localOptions.length >= 10 || !newOptionText.trim()
          }
          size="small"
        >
          Add Option
        </Button>
      </Stack>

      {error && (
        <Typography
          variant="caption"
          color="error"
          sx={{ mt: 1, display: "block" }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default QuestionOptionsEditor;

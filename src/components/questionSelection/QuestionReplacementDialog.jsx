/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Question Replacement Dialog Component
 * Dialog for replacing a question in the paper
 */

import React, { useState, useEffect, useCallback } from 'react';
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
  Alert,
  CircularProgress,
  Divider,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  SwapHoriz as ReplaceIcon,
  Visibility as ViewIcon,
  CheckCircle as ValidIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import * as questionSelectionService from '../../services/questionSelection/questionSelectionService';
import QuestionPreviewDialog from './QuestionPreviewDialog';

const QuestionReplacementDialog = ({
  open,
  onClose,
  onReplace,
  examinationId,
  currentQuestion,
  blueprint,
}) => {
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    subjectId: '',
    topicId: '',
    difficulty: '',
    questionType: '',
  });
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState(null);
  const [replacing, setReplacing] = useState(false);

  // Load available questions
  const loadAvailableQuestions = useCallback(async () => {
    if (!examinationId) return;

    setSearching(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        ...filters,
        // Exclude the current question
        excludeQuestionId: currentQuestion?.questionId || currentQuestion?._id,
        // Filter by section requirements if available
        sectionId: currentQuestion?.sectionId,
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await questionSelectionService.getAvailableQuestions(
        examinationId,
        params
      );

      if (response && response.success) {
        setAvailableQuestions(response.data || []);
        setTotalQuestions(response.total || 0);
      } else {
        setAvailableQuestions([]);
        setTotalQuestions(0);
      }
    } catch (err) {
      console.error('Failed to load available questions:', err);
      setError(err.message || 'Failed to load available questions');
      setAvailableQuestions([]);
      setTotalQuestions(0);
    } finally {
      setSearching(false);
    }
  }, [examinationId, page, limit, filters, currentQuestion]);

  useEffect(() => {
    if (open) {
      loadAvailableQuestions();
    }
  }, [open, loadAvailableQuestions]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      subjectId: '',
      topicId: '',
      difficulty: '',
      questionType: '',
    });
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);
  };

  const handleViewQuestion = (question) => {
    setSelectedQuestion(question);
    setPreviewOpen(true);
  };

  const handleReplace = async () => {
    if (!selectedQuestion) return;

    setReplacing(true);
    try {
      await onReplace({
        questionId: selectedQuestion._id || selectedQuestion.questionId,
        oldQuestionId: currentQuestion?.questionId || currentQuestion?._id,
        sectionId: currentQuestion?.sectionId,
        marks: currentQuestion?.marks || selectedQuestion.marks,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to replace question');
    } finally {
      setReplacing(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return 'success';
      case 'MEDIUM': return 'warning';
      case 'HARD': return 'error';
      case 'EXPERT': return 'secondary';
      default: return 'default';
    }
  };

  const isQuestionSelected = (question) => {
    return selectedQuestion?._id === question._id || 
           selectedQuestion?.questionId === question.questionId;
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '80vh' },
        }}
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <ReplaceIcon color="primary" />
              <Typography variant="h6">Replace Question</Typography>
            </Stack>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          {/* Current Question Summary */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <Typography variant="subtitle2">Replacing:</Typography>
              <Chip
                label={currentQuestion.questionCode || 'N/A'}
                size="small"
                variant="outlined"
              />
              <Chip
                label={currentQuestion.subjectId?.name || 'N/A'}
                size="small"
                variant="outlined"
              />
              <Chip
                label={currentQuestion.difficulty || 'N/A'}
                size="small"
                color={getDifficultyColor(currentQuestion.difficulty)}
                variant="outlined"
              />
              <Chip
                label={`${currentQuestion.marks || 0} marks`}
                size="small"
                color="info"
                variant="outlined"
              />
              <Typography variant="caption" color="textSecondary">
                Section: {currentQuestion.sectionName || currentQuestion.sectionId || 'N/A'}
              </Typography>
            </Stack>
          </Alert>

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Search and Filters */}
          <Stack spacing={2} sx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder="Search questions..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Subject</InputLabel>
                  <Select
                    value={filters.subjectId}
                    onChange={(e) => handleFilterChange('subjectId', e.target.value)}
                    label="Subject"
                  >
                    <MenuItem value="">All Subjects</MenuItem>
                    {blueprint?.sections?.map((section) => (
                      <MenuItem key={section.subjectId?._id || section.subjectId} value={section.subjectId?._id || section.subjectId}>
                        {section.subjectId?.name || 'N/A'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={filters.difficulty}
                    onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    label="Difficulty"
                  >
                    <MenuItem value="">All Difficulties</MenuItem>
                    <MenuItem value="EASY">Easy</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HARD">Hard</MenuItem>
                    <MenuItem value="EXPERT">Expert</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Question Type</InputLabel>
                  <Select
                    value={filters.questionType}
                    onChange={(e) => handleFilterChange('questionType', e.target.value)}
                    label="Question Type"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="SINGLE_CHOICE">Single Choice</MenuItem>
                    <MenuItem value="MULTIPLE_CHOICE">Multiple Choice</MenuItem>
                    <MenuItem value="TRUE_FALSE">True/False</MenuItem>
                    <MenuItem value="FILL_IN">Fill in the Blank</MenuItem>
                    <MenuItem value="MATCHING">Matching</MenuItem>
                    <MenuItem value="ESSAY">Essay</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                    fullWidth
                    size="small"
                  >
                    Clear Filters
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Stack>

          {/* Available Questions Table */}
          {searching ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : availableQuestions.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="textSecondary">
                No available questions found. Try adjusting your filters.
              </Typography>
            </Paper>
          ) : (
            <>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Code</TableCell>
                      <TableCell>Question</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Difficulty</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Marks</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {availableQuestions.map((question) => {
                      const isSelected = isQuestionSelected(question);
                      return (
                        <TableRow
                          key={question._id || question.questionId}
                          hover
                          selected={isSelected}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'action.hover' },
                            bgcolor: isSelected ? 'action.selected' : 'inherit',
                          }}
                          onClick={() => handleSelectQuestion(question)}
                        >
                          <TableCell>
                            <Typography variant="body2" fontFamily="monospace">
                              {question.questionCode || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: 200,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {question.questionText?.replace(/<[^>]*>/g, '').substring(0, 60) || 'N/A'}
                              {question.questionText?.length > 60 && '...'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {question.subjectId?.name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={question.difficulty || 'N/A'}
                              size="small"
                              color={getDifficultyColor(question.difficulty)}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={question.questionType?.replace('_', ' ') || 'N/A'}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {question.marks || 0}
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={0.5} justifyContent="center">
                              <Tooltip title="View Question">
                                <IconButton
                                  size="small"
                                  color="info"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewQuestion(question);
                                  }}
                                >
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {isSelected && (
                                <Chip
                                  icon={<ValidIcon />}
                                  label="Selected"
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                />
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {totalQuestions > limit && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination
                    count={Math.ceil(totalQuestions / limit)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={replacing}>
            Cancel
          </Button>
          <Button
            onClick={handleReplace}
            variant="contained"
            color="primary"
            startIcon={<ReplaceIcon />}
            disabled={!selectedQuestion || replacing}
          >
            {replacing ? 'Replacing...' : 'Replace Question'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Question Preview Dialog */}
      <QuestionPreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        question={selectedQuestion}
      />
    </>
  );
};

export default QuestionReplacementDialog;
/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable no-unused-vars */
/**
 * Create Question Page
 * Complete question authoring workspace
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Button,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
  Typography,
  Divider,
} from '@mui/material';
import { Save as SaveIcon, Refresh as RefreshIcon, Preview as PreviewIcon, Check as CheckIcon } from '@mui/icons-material';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import QuestionMetadataForm from '../../components/questionBuilder/QuestionMetadataForm';
import QuestionContentEditor from '../../components/questionBuilder/QuestionContentEditor';
import QuestionOptionsEditor from '../../components/questionBuilder/QuestionOptionsEditor';
import ExplanationEditor from '../../components/questionBuilder/ExplanationEditor';
import ReferenceEditor from '../../components/questionBuilder/ReferenceEditor';
import QuestionPreviewPanel from '../../components/questionBuilder/QuestionPreviewPanel';
import QuestionValidationSummary from '../../components/questionBuilder/QuestionValidationSummary';
import ConfirmDialog from '../../components/dialogs/ConfirmDialog';
import * as questionBuilderService from '../../services/questionBuilder/questionBuilderService';
import { validateEditorContent } from '../../utils/editor/editorValidator';

// Validation schema
const getValidationSchema = (questionType) => {
  return yup.object().shape({
    categoryId: yup.string().required('Category is required'),
    subjectId: yup.string().required('Subject is required'),
    topicId: yup.string().required('Topic is required'),
    questionTypeId: yup.string().required('Question type is required'),
    difficultyId: yup.string().required('Difficulty level is required'),
    marks: yup.number().min(0.5, 'Marks must be at least 0.5').max(100, 'Marks cannot exceed 100').required('Marks are required'),
    questionText: yup.string().required('Question content is required'),
    options: yup.array().when((values, schema) => {
      // Check if question type requires options
      return schema;
    }),
    correctAnswer: yup.mixed().required('Correct answer is required'),
    explanation: yup.string(),
  });
};

const CreateQuestion = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const methods = useForm({
    resolver: yupResolver(getValidationSchema(selectedQuestionType?.code)),
    defaultValues: {
      categoryId: '',
      subjectId: '',
      topicId: '',
      questionTypeId: '',
      difficultyId: '',
      marks: 1,
      questionText: '',
      options: [],
      correctAnswer: null,
      explanation: '',
      referenceBook: '',
      referenceSection: '',
      referenceUrl: '',
    },
  });

  const { handleSubmit, watch, setValue, reset, formState: { errors, isDirty } } = methods;

  const questionTypeId = watch('questionTypeId');
  const questionText = watch('questionText');
  const options = watch('options');
  const correctAnswer = watch('correctAnswer');

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  // Fetch question type details when selected
  useEffect(() => {
    if (questionTypeId) {
      // In production, fetch from API
      // For now, use placeholder
      const types = {
        SINGLE_CHOICE: { code: 'SINGLE_CHOICE', name: 'Single Choice' },
        MULTIPLE_CHOICE: { code: 'MULTIPLE_CHOICE', name: 'Multiple Choice' },
        TRUE_FALSE: { code: 'TRUE_FALSE', name: 'True / False' },
        FILL_BLANK: { code: 'FILL_BLANK', name: 'Fill in the Blank' },
      };
      // Find the type - in production this would come from an API
      setSelectedQuestionType(types.SINGLE_CHOICE);
    }
  }, [questionTypeId]);

  // Preview update
  useEffect(() => {
    setPreviewData({
      questionText,
      options,
      questionType: selectedQuestionType,
      marks: watch('marks'),
      difficulty: watch('difficultyId'),
      status: 'DRAFT',
    });
  }, [questionText, options, selectedQuestionType, watch]);

  const handleValidate = () => {
    const data = methods.getValues();
    const result = validateEditorContent(data.questionText, data.questionText);
    setValidationResult(result);
    if (!result.isValid) {
      setToast({ open: true, message: 'Validation failed. Please fix the errors.', severity: 'error' });
    } else {
      setToast({ open: true, message: 'Question is valid!', severity: 'success' });
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const response = await questionBuilderService.createQuestion({
        ...data,
        status: 'DRAFT', // ✅ Backend stores as DRAFT
        createdBy: user?.id,
      });
      if (response.success) {
        setToast({ open: true, message: 'Question created successfully!', severity: 'success' });
        setHasUnsavedChanges(false);
        // Navigate to the question bank or view the question
        navigate(`/question-bank`);
      }
    } catch (error) {
      setToast({ open: true, message: error.message || 'Failed to create question', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setShowLeaveConfirm(true);
  };

  const confirmReset = () => {
    reset();
    setValidationResult(null);
    setHasUnsavedChanges(false);
    setShowLeaveConfirm(false);
    setToast({ open: true, message: 'Form has been reset', severity: 'info' });
  };

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Create Question"
        subtitle="Author a new examination question"
        actions={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={handleValidate}
              startIcon={<CheckIcon />}
            >
              Validate
            </Button>
            <Button
              variant="outlined"
              onClick={handleReset}
              disabled={!hasUnsavedChanges}
              startIcon={<RefreshIcon />}
              color="warning"
            >
              Reset Form
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              disabled={saving}
              startIcon={<SaveIcon />}
              color="primary"
            >
              {saving ? 'Saving...' : 'Save Question'}
            </Button>
          </Stack>
        }
      />

      <FormProvider {...methods}>
        <Grid container spacing={3}>
          {/* Main Form */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3 }}>
              <Stack spacing={3}>
                <QuestionMetadataForm
                  control={methods.control}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                />

                <Divider />

                <QuestionContentEditor
                  value={watch('questionText')}
                  onChange={(content) => setValue('questionText', content.html)}
                  error={errors.questionText?.message}
                />

                {selectedQuestionType && (
                  <>
                    <Divider />
                    <QuestionOptionsEditor
                      questionType={selectedQuestionType}
                      options={options}
                      correctAnswer={correctAnswer}
                      onChange={(newOptions) => setValue('options', newOptions)}
                      onCorrectAnswerChange={(answer) => setValue('correctAnswer', answer)}
                      error={errors.options?.message || errors.correctAnswer?.message}
                    />
                  </>
                )}

                <Divider />

                <ExplanationEditor
                  value={watch('explanation')}
                  onChange={(content) => setValue('explanation', content.html)}
                />

                <Divider />

                <ReferenceEditor
                  control={methods.control}
                  errors={errors}
                />
              </Stack>
            </Paper>

            {/* Validation Summary */}
            <Box sx={{ mt: 2 }}>
              <QuestionValidationSummary validationResult={validationResult} />
            </Box>
          </Grid>

          {/* Preview Panel */}
          <Grid item xs={12} lg={4}>
            <QuestionPreviewPanel questionData={previewData} />
          </Grid>
        </Grid>
      </FormProvider>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        open={showLeaveConfirm}
        onClose={() => setShowLeaveConfirm(false)}
        onConfirm={confirmReset}
        title="Reset Form?"
        message="This will clear all unsaved changes. Are you sure you want to reset the form?"
        confirmText="Reset"
        cancelText="Stay"
        severity="warning"
      />

      {/* Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateQuestion;
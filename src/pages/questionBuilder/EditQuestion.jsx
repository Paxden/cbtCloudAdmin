/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable no-unused-vars */
/**
 * Edit Question Page
 * Edit an existing question
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { Save as SaveIcon, Refresh as RefreshIcon, ArrowBack as ArrowBackIcon, Check as CheckIcon } from '@mui/icons-material';
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
import { getQuestion } from '../../services/questionBuilder/questionBuilderService';

const EditQuestion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const methods = useForm({
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

  // Fetch question data
  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      try {
        const response = await getQuestion(id);
        if (response.success) {
          const data = response.data;
          setInitialData(data);
          reset({
            categoryId: data.categoryId?._id || data.categoryId || '',
            subjectId: data.subjectId?._id || data.subjectId || '',
            topicId: data.topicId?._id || data.topicId || '',
            questionTypeId: data.questionTypeId?._id || data.questionTypeId || '',
            difficultyId: data.difficultyId?._id || data.difficultyId || '',
            marks: data.marks || 1,
            questionText: data.questionText || '',
            options: data.options || [],
            correctAnswer: data.correctAnswer || null,
            explanation: data.explanation || '',
            referenceBook: data.referenceBook || '',
            referenceSection: data.referenceSection || '',
            referenceUrl: data.referenceUrl || '',
          });
          // Set question type
          if (data.questionTypeId) {
            setSelectedQuestionType(data.questionTypeId);
          }
        }
      } catch (error) {
        setToast({ open: true, message: 'Failed to load question', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id, reset]);

  // Preview update
  useEffect(() => {
    setPreviewData({
      questionText,
      options,
      questionType: selectedQuestionType,
      marks: watch('marks'),
      difficulty: watch('difficultyId'),
      status: initialData?.status || 'DRAFT',
    });
  }, [questionText, options, selectedQuestionType, watch, initialData]);

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
      const response = await questionBuilderService.updateQuestion(id, {
        ...data,
        updatedBy: user?.id,
      });
      if (response.success) {
        setToast({ open: true, message: 'Question updated successfully!', severity: 'success' });
        setHasUnsavedChanges(false);
        navigate('/question-bank');
      }
    } catch (error) {
      setToast({ open: true, message: error.message || 'Failed to update question', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setShowLeaveConfirm(true);
  };

  const confirmReset = () => {
    if (initialData) {
      reset({
        categoryId: initialData.categoryId?._id || initialData.categoryId || '',
        subjectId: initialData.subjectId?._id || initialData.subjectId || '',
        topicId: initialData.topicId?._id || initialData.topicId || '',
        questionTypeId: initialData.questionTypeId?._id || initialData.questionTypeId || '',
        difficultyId: initialData.difficultyId?._id || initialData.difficultyId || '',
        marks: initialData.marks || 1,
        questionText: initialData.questionText || '',
        options: initialData.options || [],
        correctAnswer: initialData.correctAnswer || null,
        explanation: initialData.explanation || '',
        referenceBook: initialData.referenceBook || '',
        referenceSection: initialData.referenceSection || '',
        referenceUrl: initialData.referenceUrl || '',
      });
    }
    setValidationResult(null);
    setHasUnsavedChanges(false);
    setShowLeaveConfirm(false);
    setToast({ open: true, message: 'Form has been reset', severity: 'info' });
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Edit Question"
        subtitle="Modify an existing examination question"
        actions={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={() => navigate('/question-bank')}
              startIcon={<ArrowBackIcon />}
            >
              Back to Question Bank
            </Button>
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
              Reset
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              disabled={saving}
              startIcon={<SaveIcon />}
              color="primary"
            >
              {saving ? 'Saving...' : 'Update Question'}
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
        message="This will discard all unsaved changes. Are you sure you want to reset the form?"
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

export default EditQuestion;
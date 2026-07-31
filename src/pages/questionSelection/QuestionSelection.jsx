/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Question Selection Page
 * Main page for paper composition
 */

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Button,
  Stack,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Refresh as RefreshIcon,
  AutoAwesome as GenerateIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  CheckCircle as ValidateIcon,
  Publish as PublishIcon,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import AppPageHeader from "../../components/common/AppPageHeader";
import BlueprintSummaryCard from "../../components/questionSelection/BlueprintSummaryCard";
import PaperStatisticsCards from "../../components/questionSelection/PaperStatisticsCards";
import CompositionTable from "../../components/questionSelection/CompositionTable";
import QuestionPreviewDialog from "../../components/questionSelection/QuestionPreviewDialog";
import AutoGenerationDialog from "../../components/questionSelection/AutoGenerationDialog";
import QuestionReplacementDialog from "../../components/questionSelection/QuestionReplacementDialog";
import CompositionValidationCard from "../../components/questionSelection/CompositionValidationCard";
import * as questionSelectionService from "../../services/questionSelection/questionSelectionService";
import * as blueprintService from "../../services/examinationBlueprint/examinationBlueprintService";
import * as examinationService from "../../services/examination/examinationService";

const getUserRole = (user) => {
  if (!user) return "GUEST";
  if (typeof user.role === "string") return user.role;
  if (user.role && typeof user.role === "object") {
    return user.role.name || user.role.role || "USER";
  }
  return "USER";
};

const QuestionSelection = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const selectedExaminationId = searchParams.get("examinationId") || "";

  const canEdit = ["SUPER_ADMIN", "TECH_ADMIN", "EXAM_MANAGER"].includes(
    userRole,
  );
  const canPublish = ["SUPER_ADMIN", "TECH_ADMIN"].includes(userRole);
  const canLock = ["SUPER_ADMIN", "TECH_ADMIN"].includes(userRole);

  // State
  const [examinations, setExaminations] = useState([]);
  const [examinationsLoading, setExaminationsLoading] = useState(false);
  const [blueprint, setBlueprint] = useState(null);
  const [composition, setComposition] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [replaceDialogOpen, setReplaceDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [validation, setValidation] = useState(null);
  const [validationLoading, setValidationLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load examinations
  const loadExaminations = useCallback(async () => {
    setExaminationsLoading(true);
    try {
      const response = await examinationService.getExaminations({ limit: 100 });
      let examList = [];
      if (response.success) {
        examList = response.data || [];
      } else if (Array.isArray(response)) {
        examList = response;
      } else if (response.data && Array.isArray(response.data)) {
        examList = response.data;
      }
      setExaminations(examList);
    } catch (err) {
      console.error("Failed to load examinations:", err);
    } finally {
      setExaminationsLoading(false);
    }
  }, []);

  // Load blueprint
  const loadBlueprint = useCallback(async () => {
    if (!selectedExaminationId) {
      setBlueprint(null);
      return;
    }

    try {
      const response = await blueprintService.getBlueprint(
        selectedExaminationId,
        { status: "ACTIVE" },
      );
      if (response && response.success) {
        setBlueprint(response.data);
      } else {
        setBlueprint(null);
      }
    } catch (err) {
      console.error("Failed to load blueprint:", err);
      setBlueprint(null);
    }
  }, [selectedExaminationId]);

  // Load composition
  const loadComposition = useCallback(async () => {
    if (!selectedExaminationId) {
      setComposition(null);
      setStats(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await questionSelectionService.getComposition(
        selectedExaminationId,
        {
          includeSnapshots: true,
        },
      );
      console.log("📋 Composition response:", response);

      if (response && response.success) {
        setComposition(response.data);
        // Set stats from composition
        if (response.data) {
          const totalQuestions = response.data.totalQuestions || 0;
          const selectedQuestions =
            response.data.sections?.reduce(
              (sum, s) => sum + (s.questions?.length || 0),
              0,
            ) || 0;
          const lockedQuestions =
            response.data.sections?.reduce(
              (sum, s) =>
                sum + (s.questions?.filter((q) => q.isLocked).length || 0),
              0,
            ) || 0;

          setStats({
            totalQuestions: totalQuestions || selectedQuestions,
            selectedQuestions,
            lockedQuestions,
            unlockedQuestions: selectedQuestions - lockedQuestions,
            validationScore: response.data.validationScore || 0,
          });
        }
      } else {
        setComposition(null);
        setStats(null);
      }
    } catch (err) {
      console.error("❌ Failed to load composition:", err);
      setComposition(null);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [selectedExaminationId]);

  // Initial load
  useEffect(() => {
    loadExaminations();
  }, [loadExaminations]);

  useEffect(() => {
    if (selectedExaminationId) {
      loadBlueprint();
      loadComposition();
    }
  }, [selectedExaminationId, loadBlueprint, loadComposition]);

  // Handle examination change
  const handleExaminationChange = (examId) => {
    setSearchParams({ examinationId: examId });
    setComposition(null);
    setBlueprint(null);
    setStats(null);
    setValidation(null);
  };

  // Handle replace question - ADD THIS FUNCTION
  const handleReplaceQuestion = async (data) => {
    try {
      const response = await questionSelectionService.replaceQuestion(
        selectedExaminationId,
        data,
      );
      if (response && response.success) {
        setComposition(response.data);
        setToast({
          open: true,
          message: "Question replaced successfully",
          severity: "success",
        });
        setReplaceDialogOpen(false);
        loadComposition();
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Failed to replace question",
        severity: "error",
      });
    }
  };

  // Handle generate paper
  const handleGeneratePaper = async (data) => {
    try {
      const response = await questionSelectionService.generatePaper(
        selectedExaminationId,
        data,
      );
      if (response && response.success) {
        setComposition(response.data);
        setToast({
          open: true,
          message: "Paper generated successfully",
          severity: "success",
        });
        setGenerateDialogOpen(false);
        loadComposition();
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Failed to generate paper",
        severity: "error",
      });
    }
  };

  // Handle remove question
  const handleRemoveQuestion = async (question) => {
    if (!window.confirm(`Are you sure you want to remove this question?`)) {
      return;
    }

    try {
      const response = await questionSelectionService.removeQuestion(
        selectedExaminationId,
        question.questionId || question._id,
        { reason: "Manually removed" },
      );
      if (response && response.success) {
        setComposition(response.data);
        setToast({
          open: true,
          message: "Question removed successfully",
          severity: "success",
        });
        loadComposition();
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Failed to remove question",
        severity: "error",
      });
    }
  };

  // Handle lock question
  const handleLockQuestion = async (question) => {
    try {
      const response = await questionSelectionService.lockQuestion(
        selectedExaminationId,
        question.questionId || question._id,
      );
      if (response && response.success) {
        setComposition(response.data);
        setToast({
          open: true,
          message: "Question locked successfully",
          severity: "success",
        });
        loadComposition();
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Failed to lock question",
        severity: "error",
      });
    }
  };

  // Handle unlock question
  const handleUnlockQuestion = async (question) => {
    try {
      const response = await questionSelectionService.unlockQuestion(
        selectedExaminationId,
        question.questionId || question._id,
      );
      if (response && response.success) {
        setComposition(response.data);
        setToast({
          open: true,
          message: "Question unlocked successfully",
          severity: "success",
        });
        loadComposition();
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Failed to unlock question",
        severity: "error",
      });
    }
  };

  // Handle validate composition
  const handleValidateComposition = async () => {
    setValidationLoading(true);
    try {
      const response = await questionSelectionService.validateComposition(
        selectedExaminationId,
      );
      if (response && response.success) {
        setValidation(response.data);
        setToast({
          open: true,
          message: response.data.isValid
            ? "Composition is valid!"
            : "Composition has validation issues",
          severity: response.data.isValid ? "success" : "error",
        });
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Failed to validate composition",
        severity: "error",
      });
    } finally {
      setValidationLoading(false);
    }
  };

  // Handle publish composition
  const handlePublishComposition = async () => {
    if (
      !window.confirm(
        "Are you sure you want to publish this paper composition?",
      )
    ) {
      return;
    }

    try {
      const response = await questionSelectionService.publishComposition(
        selectedExaminationId,
        {
          comments: "Published for package generation",
        },
      );
      if (response && response.success) {
        setComposition(response.data);
        setToast({
          open: true,
          message: "Paper published successfully",
          severity: "success",
        });
        loadComposition();
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Failed to publish paper",
        severity: "error",
      });
    }
  };

  // Handle back
  const handleBack = () => {
    navigate("/examinations");
  };

  // Get questions from composition
  const getCompositionQuestions = () => {
    if (!composition || !composition.sections) return [];
    const allQuestions = [];
    composition.sections.forEach((section) => {
      if (section.questions) {
        section.questions.forEach((question) => {
          allQuestions.push({
            ...question,
            sectionName: section.name,
            sectionId: section.sectionId,
          });
        });
      }
    });
    return allQuestions;
  };

  const questions = getCompositionQuestions();
  const isLocked = composition?.metadata?.isLocked || false;
  const isPublished = composition?.status === "ACTIVE";

  const selectedExam = examinations.find(
    (e) => e._id === selectedExaminationId,
  );

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Question Selection"
        subtitle="Compose examination paper from question bank"
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadComposition}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={handleBack}
            >
              Back
            </Button>
          </Stack>
        }
      />

      {/* Examination Selector */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Select Examination</InputLabel>
              <Select
                value={selectedExaminationId}
                onChange={(e) => handleExaminationChange(e.target.value)}
                label="Select Examination"
                disabled={examinationsLoading}
              >
                <MenuItem value="">
                  <em>Select an examination</em>
                </MenuItem>
                {examinations.map((exam) => (
                  <MenuItem key={exam._id} value={exam._id}>
                    {exam.name} ({exam.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {selectedExaminationId && selectedExam && (
            <Grid item xs={12} md={8}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                flexWrap="wrap"
              >
                <Chip label={selectedExam.name} color="primary" />
                <Chip
                  label={selectedExam.code}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={selectedExam.status}
                  variant="outlined"
                  size="small"
                />
                {composition && (
                  <Chip
                    label={composition.status || "DRAFT"}
                    color={
                      composition.status === "ACTIVE" ? "success" : "default"
                    }
                    size="small"
                  />
                )}
                {examinationsLoading && <CircularProgress size={24} />}
              </Stack>
            </Grid>
          )}
        </Grid>
      </Paper>

      {selectedExaminationId ? (
        <>
          {/* Blueprint Summary */}
          <BlueprintSummaryCard blueprint={blueprint} loading={loading} />

          {/* Action Buttons */}
          <Paper sx={{ p: 2, mb: 3, mt: 2 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {canEdit && !isPublished && !isLocked && (
                <Button
                  variant="contained"
                  startIcon={<GenerateIcon />}
                  onClick={() => setGenerateDialogOpen(true)}
                  disabled={!blueprint}
                >
                  Generate Paper
                </Button>
              )}

              {canLock && !isPublished && (
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<LockIcon />}
                  onClick={handleLockQuestion}
                  disabled={!composition}
                >
                  Lock Paper
                </Button>
              )}

              {canPublish && !isPublished && composition && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<PublishIcon />}
                  onClick={handlePublishComposition}
                >
                  Publish Paper
                </Button>
              )}

              <Button
                variant="outlined"
                color="success"
                startIcon={<ValidateIcon />}
                onClick={handleValidateComposition}
                disabled={!composition || validationLoading}
              >
                {validationLoading ? "Validating..." : "Validate"}
              </Button>
            </Stack>
          </Paper>

          {/* Statistics */}
          <PaperStatisticsCards stats={stats} loading={loading} />

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs value={tab} onChange={(e, v) => setTab(v)}>
              <Tab label="Composition" />
              <Tab label="Validation" />
            </Tabs>
          </Box>

          {tab === 0 && (
            <CompositionTable
              questions={questions}
              loading={loading}
              page={0}
              limit={20}
              total={questions.length}
              onPageChange={() => {}}
              onLimitChange={() => {}}
              onView={(question) => {
                setSelectedQuestion(question);
                setPreviewDialogOpen(true);
              }}
              onRemove={handleRemoveQuestion}
              onLock={handleLockQuestion}
              onUnlock={handleUnlockQuestion}
              onReplace={(question) => {
                setSelectedQuestion(question);
                setReplaceDialogOpen(true);
              }}
              canEdit={canEdit && !isPublished && !isLocked}
              canLock={canLock && !isPublished}
              canRemove={canEdit && !isPublished && !isLocked}
              isLocked={isLocked || isPublished}
            />
          )}

          {tab === 1 && (
            <CompositionValidationCard
              validation={validation}
              loading={validationLoading}
              blueprint={blueprint}
            />
          )}

          {/* Dialogs */}
          <AutoGenerationDialog
            open={generateDialogOpen}
            onClose={() => setGenerateDialogOpen(false)}
            onGenerate={handleGeneratePaper}
            blueprint={blueprint}
            loading={loading}
          />

          <QuestionReplacementDialog
            open={replaceDialogOpen}
            onClose={() => setReplaceDialogOpen(false)}
            onReplace={handleReplaceQuestion}
            examinationId={selectedExaminationId}
            currentQuestion={selectedQuestion}
            blueprint={blueprint}
          />

          <QuestionPreviewDialog
            open={previewDialogOpen}
            onClose={() => setPreviewDialogOpen(false)}
            question={selectedQuestion}
          />
        </>
      ) : (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography variant="body1" color="textSecondary">
            Please select an examination to compose its paper.
          </Typography>
        </Box>
      )}

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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

export default QuestionSelection;

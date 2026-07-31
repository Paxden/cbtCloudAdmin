/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * Question Bank Page
 * Main page for managing all questions
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  Typography,
} from "@mui/material";
import { Add as AddIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import AppPageHeader from "../../components/common/AppPageHeader";
import QuestionStatsCards from "../../components/questionBank/QuestionStatsCards";
import QuestionSearch from "../../components/questionBank/QuestionSearch";
import QuestionFilters from "../../components/questionBank/QuestionFilters";
import QuestionTable from "../../components/questionBank/QuestionTable";
import QuestionDetailsDrawer from "../../components/questionBank/QuestionDetailsDrawer";
import QuestionPreviewDialog from "../../components/questionBank/QuestionPreviewDialog";
import DuplicateQuestionDialog from "../../components/questionBank/DuplicateQuestionDialog";
import ArchiveQuestionDialog from "../../components/questionBank/ArchiveQuestionDialog";
import RestoreQuestionDialog from "../../components/questionBank/RestoreQuestionDialog";
import BulkActionToolbar from "../../components/questionSearch/BulkActionToolbar";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog";
import * as questionBankService from "../../services/questionBank/questionBankService";
import * as questionApprovalService from "../../services/questionApproval/questionApprovalService";

// ✅ ROLE PERMISSION FIX: Helper function to get user role as string
const getUserRole = (user) => {
  if (!user) return "GUEST";
  if (typeof user.role === "string") return user.role;
  if (user.role && typeof user.role === "object")
    return user.role.name || "USER";
  return "USER";
};

const QuestionBank = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ✅ ROLE PERMISSION FIX: Get role as string
  const userRole = getUserRole(user);

  // ✅ Permissions - now work correctly with string comparison
  const canEdit = userRole === "SUPER_ADMIN" || userRole === "TECH_ADMIN";
  const canDelete = userRole === "SUPER_ADMIN";
  const canArchive = userRole === "SUPER_ADMIN" || userRole === "TECH_ADMIN";
  const canRestore = userRole === "SUPER_ADMIN" || userRole === "TECH_ADMIN";
  const canView = true;
  const canCreate = userRole === "SUPER_ADMIN" || userRole === "TECH_ADMIN";
  const canSubmit =
    userRole === "SUPER_ADMIN" ||
    userRole === "TECH_ADMIN" ||
    userRole === "EXAM_MANAGER";

  // State
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState([]);

  // Dialog states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [bulkSubmitDialogOpen, setBulkSubmitDialogOpen] = useState(false); // ✅ Add bulk submit dialog
  const [questionToActOn, setQuestionToActOn] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch questions
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit,
        search: searchTerm || undefined,
        ...filters,
      };

      // EXAM_MANAGER can only see published questions
      if (userRole === "EXAM_MANAGER") {
        params.status = "PUBLISHED";
      }

      const response = await questionBankService.getQuestions(params);
      setQuestions(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      setToast({
        open: true,
        message: error.message || "Failed to load questions",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, filters, userRole]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await questionBankService.getQuestionBankStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchQuestions();
    fetchStats();
  }, [fetchQuestions, fetchStats]);

  // Handle filters change
  const handleFilterChange = (newFilters) => {
    setPage(0);
    setFilters(newFilters);
  };

  const handleVersionHistory = (question) => {
    navigate(`/question-bank/questions/${question._id}/versions`);
  };

  const handleClearFilters = () => {
    setPage(0);
    setFilters({});
    setSearchTerm("");
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(0);
  };

  // Handle refresh
  const handleRefresh = () => {
    setSelected([]);
    fetchQuestions();
    fetchStats();
  };

  // Handle view
  const handleView = (question) => {
    setSelectedQuestion(question);
    setDrawerOpen(true);
  };

  // Handle edit
  const handleEdit = (question) => {
    navigate(`/question-bank/questions/${question._id}/edit`);
  };

  // Handle preview
  const handlePreview = (question) => {
    setSelectedQuestion(question);
    setPreviewOpen(true);
  };

  // ✅ Handle Single Submit for Review
  const handleSubmitForReview = (question) => {
    setQuestionToActOn(question);
    setSubmitDialogOpen(true);
  };

  const confirmSubmit = async () => {
    setActionLoading(true);
    try {
      const response = await questionApprovalService.submitForReview(
        questionToActOn._id,
        {
          comment: "Submitting for review",
        },
      );
      if (response.success) {
        setToast({
          open: true,
          message: `Question "${questionToActOn.questionCode}" submitted for review`,
          severity: "success",
        });
        setSubmitDialogOpen(false);
        setQuestionToActOn(null);
        fetchQuestions();
        fetchStats();
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || "Failed to submit for review",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ Handle Bulk Submit for Review
  const handleBulkSubmitReview = () => {
    setBulkSubmitDialogOpen(true);
  };

  const confirmBulkSubmit = async () => {
    setActionLoading(true);
    try {
      let successCount = 0;
      let failCount = 0;

      for (const id of selected) {
        try {
          await questionApprovalService.submitForReview(id, {
            comment: "Bulk submission for review",
          });
          successCount++;
        } catch (error) {
          failCount++;
          console.error(`Failed to submit question ${id}:`, error);
        }
      }

      setToast({
        open: true,
        message: `${successCount} question${successCount > 1 ? "s" : ""} submitted for review${failCount > 0 ? `, ${failCount} failed` : ""}`,
        severity: failCount > 0 && successCount === 0 ? "error" : "success",
      });
      setBulkSubmitDialogOpen(false);
      setSelected([]);
      fetchQuestions();
      fetchStats();
    } catch (error) {
      setToast({
        open: true,
        message: error.message || "Failed to submit questions",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle duplicate
  const handleDuplicate = (question) => {
    setQuestionToActOn(question);
    setDuplicateDialogOpen(true);
  };

  const confirmDuplicate = async () => {
    setActionLoading(true);
    try {
      const response = await questionBankService.duplicateQuestion(
        questionToActOn._id,
      );
      if (response.success) {
        setToast({
          open: true,
          message: "Question duplicated successfully",
          severity: "success",
        });
        setDuplicateDialogOpen(false);
        fetchQuestions();
        fetchStats();
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || "Failed to duplicate question",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
      setQuestionToActOn(null);
    }
  };

  // Handle archive
  const handleArchive = (question) => {
    setQuestionToActOn(question);
    setArchiveDialogOpen(true);
  };

  const confirmArchive = async () => {
    setActionLoading(true);
    try {
      const response = await questionBankService.archiveQuestion(
        questionToActOn._id,
      );
      if (response.success) {
        setToast({
          open: true,
          message: "Question archived successfully",
          severity: "success",
        });
        setArchiveDialogOpen(false);
        fetchQuestions();
        fetchStats();
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || "Failed to archive question",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
      setQuestionToActOn(null);
    }
  };

  // Handle restore
  const handleRestore = (question) => {
    setQuestionToActOn(question);
    setRestoreDialogOpen(true);
  };

  const confirmRestore = async () => {
    setActionLoading(true);
    try {
      const response = await questionBankService.restoreQuestion(
        questionToActOn._id,
      );
      if (response.success) {
        setToast({
          open: true,
          message: "Question restored successfully",
          severity: "success",
        });
        setRestoreDialogOpen(false);
        fetchQuestions();
        fetchStats();
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || "Failed to restore question",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
      setQuestionToActOn(null);
    }
  };

  // Handle delete permanent
  const handleDelete = (question) => {
    setQuestionToActOn(question);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      const response = await questionBankService.deleteQuestionPermanently(
        questionToActOn._id,
      );
      if (response.success) {
        setToast({
          open: true,
          message: "Question deleted permanently",
          severity: "success",
        });
        setDeleteDialogOpen(false);
        fetchQuestions();
        fetchStats();
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || "Failed to delete question",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
      setQuestionToActOn(null);
    }
  };

  // ✅ Bulk actions (placeholder for archive, publish, export)
  const handleBulkArchive = (ids) => {
    setToast({
      open: true,
      message: `Archiving ${ids.length} questions...`,
      severity: "info",
    });
    // In production, call archive endpoint
    setSelected([]);
  };

  const handleBulkPublish = (ids) => {
    setToast({
      open: true,
      message: `Publishing ${ids.length} questions...`,
      severity: "info",
    });
    setSelected([]);
  };

  const handleBulkExport = (ids) => {
    setToast({
      open: true,
      message: `Exporting ${ids.length} questions...`,
      severity: "info",
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Question Bank"
        subtitle="Manage all examination questions"
        actions={
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/question-bank/questions/new")}
              >
                New Question
              </Button>
            )}
          </Stack>
        }
      />

      {/* Statistics Cards */}
      <QuestionStatsCards stats={stats} loading={loading} />

      {/* Search & Filters */}
      <QuestionSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onClear={() => {
          setSearchTerm("");
          setPage(0);
        }}
      />

      <QuestionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
        loading={loading}
      />

      {/* Active Filters Display */}
      {Object.keys(filters).filter((k) => filters[k]).length > 0 && (
        <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {Object.entries(filters)
            .filter(([_, v]) => v)
            .map(([key, value]) => (
              <Chip
                key={key}
                label={`${key}: ${value}`}
                onDelete={() => {
                  const newFilters = { ...filters };
                  delete newFilters[key];
                  handleFilterChange(newFilters);
                }}
                size="small"
              />
            ))}
        </Box>
      )}

      {/* Bulk Action Toolbar */}
      <BulkActionToolbar
        selected={selected}
        onClearSelection={() => setSelected([])}
        onArchive={handleBulkArchive}
        onSubmitReview={handleBulkSubmitReview} // ✅ Pass bulk submit handler
        onPublish={handleBulkPublish}
        onExport={handleBulkExport}
        loading={actionLoading}
      />

      {/* Table */}
      <QuestionTable
        questions={questions}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onView={handleView}
        onEdit={handleEdit}
        onPreview={handlePreview}
        onVersionHistory={handleVersionHistory}
        onDuplicate={handleDuplicate}
        onArchive={handleArchive}
        onRestore={handleRestore}
        onDelete={handleDelete}
        onSubmitReview={handleSubmitForReview}
        onRefresh={handleRefresh}
        onSelect={setSelected}
        selected={selected}
        canEdit={canEdit}
        canDelete={canDelete}
        canArchive={canArchive}
        canRestore={canRestore}
        canView={canView}
        canSubmit={canSubmit}
      />

      {/* Details Drawer */}
      <QuestionDetailsDrawer
        open={drawerOpen}
        question={selectedQuestion}
        onClose={() => setDrawerOpen(false)}
        onEdit={handleEdit}
        onPreview={handlePreview}
        onSubmitReview={handleSubmitForReview}
        canSubmit={canSubmit}
      />

      {/* Preview Dialog */}
      <QuestionPreviewDialog
        open={previewOpen}
        question={selectedQuestion}
        onClose={() => setPreviewOpen(false)}
      />

      {/* Single Submit for Review Dialog */}
      <ConfirmDialog
        open={submitDialogOpen}
        onClose={() => {
          setSubmitDialogOpen(false);
          setQuestionToActOn(null);
        }}
        onConfirm={confirmSubmit}
        title="Submit for Review?"
        message={`Are you sure you want to submit "${questionToActOn?.questionText?.replace(/<[^>]*>/g, "").substring(0, 50) || "this question"}" for review?`}
        confirmText="Submit"
        cancelText="Cancel"
        confirmColor="warning"
        severity="info"
        loading={actionLoading}
      />

      {/* Bulk Submit for Review Dialog */}
      <ConfirmDialog
        open={bulkSubmitDialogOpen}
        onClose={() => setBulkSubmitDialogOpen(false)}
        onConfirm={confirmBulkSubmit}
        title="Submit Selected Questions for Review?"
        message={`Are you sure you want to submit ${selected.length} question${selected.length > 1 ? "s" : ""} for review?`}
        confirmText="Submit All"
        cancelText="Cancel"
        confirmColor="warning"
        severity="info"
        loading={actionLoading}
      />

      {/* Duplicate Dialog */}
      <DuplicateQuestionDialog
        open={duplicateDialogOpen}
        onClose={() => setDuplicateDialogOpen(false)}
        onConfirm={confirmDuplicate}
        questionTitle={questionToActOn?.questionText
          ?.replace(/<[^>]*>/g, "")
          .substring(0, 50)}
        loading={actionLoading}
      />

      {/* Archive Dialog */}
      <ArchiveQuestionDialog
        open={archiveDialogOpen}
        onClose={() => setArchiveDialogOpen(false)}
        onConfirm={confirmArchive}
        questionTitle={questionToActOn?.questionText
          ?.replace(/<[^>]*>/g, "")
          .substring(0, 50)}
        loading={actionLoading}
      />

      {/* Restore Dialog */}
      <RestoreQuestionDialog
        open={restoreDialogOpen}
        onClose={() => setRestoreDialogOpen(false)}
        onConfirm={confirmRestore}
        questionTitle={questionToActOn?.questionText
          ?.replace(/<[^>]*>/g, "")
          .substring(0, 50)}
        loading={actionLoading}
      />

      {/* Delete Permanently Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Question Permanently"
        message={`Are you sure you want to permanently delete "${questionToActOn?.questionText?.replace(/<[^>]*>/g, "").substring(0, 50) || "this question"}"? This action cannot be undone.`}
        confirmText="Delete Permanently"
        cancelText="Cancel"
        confirmColor="error"
        severity="error"
        loading={actionLoading}
      />

      {/* Toast Notifications */}
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

export default QuestionBank;

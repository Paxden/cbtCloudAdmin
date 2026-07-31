/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Question Topics Page
 * Main page for managing question topics
 */

import { useState, useEffect, useCallback } from "react";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useAuth } from "../../../hooks/useAuth";
import AppPageHeader from "../../../components/common/AppPageHeader";
import TopicSearch from "../../../components/questionBank/topics/TopicSearch";
import TopicStatsCards from "../../../components/questionBank/topics/TopicStatsCards";
import TopicFilters from "../../../components/questionBank/topics/TopicFilters";
import TopicTable from "../../../components/questionBank/topics/TopicTable";
import TopicFormDialog from "../../../components/questionBank/topics/TopicFormDialog";
import TopicDetailsDrawer from "../../../components/questionBank/topics/TopicDetailsDrawer";
import ConfirmDialog from "../../../components/dialogs/ConfirmDialog";
import * as topicService from "../../../services/questionBank/topicService";
import * as subjectService from "../../../services/questionBank/subjectService";

// Helper to get role name from user object
const getUserRole = (user) => {
  if (!user) return "GUEST";
  if (typeof user.role === "string") return user.role;
  if (user.role && typeof user.role === "object")
    return user.role.name || "USER";
  return "USER";
};

const QuestionTopics = () => {
  const { user } = useAuth();

  // ✅ FIX: Get role name from the role object
  const userRole = getUserRole(user);

  // Debug - log to check what's happening
  console.log("🔍 Current User:", user);
  console.log("🔍 User Role:", userRole);

  // Permissions
  const canEdit = userRole === "SUPER_ADMIN" || userRole === "TECH_ADMIN";
  const canDelete = userRole === "SUPER_ADMIN";
  const canManageStatus =
    userRole === "SUPER_ADMIN" || userRole === "TECH_ADMIN";
  const canView = true;

  // State
  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [formMode, setFormMode] = useState("create");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTopic, setDrawerTopic] = useState(null);
  const [drawerStats, setDrawerStats] = useState({ questions: 0 });

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch subjects for filters
  const fetchSubjects = useCallback(async () => {
    try {
      const response = await subjectService.getSubjects({
        limit: 100,
        status: "ACTIVE",
      });
      setSubjects(response.data || []);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    }
  }, []);

  // Fetch topic statistics
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await topicService.getTopicStatistics();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch topic statistics:", error);
      setToast({
        open: true,
        message: error.message || "Failed to load statistics",
        severity: "error",
      });
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch topics
  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit,
        search: searchTerm || undefined,
        subjectId: subjectFilter || undefined,
        status: statusFilter || undefined,
      };

      const response = await topicService.getTopics(params);
      setTopics(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
      setToast({
        open: true,
        message: error.message || "Failed to load topics",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, subjectFilter, statusFilter]);

  // Initial load
  useEffect(() => {
    fetchSubjects();
    fetchTopics();
    fetchStats();
  }, [fetchSubjects, fetchTopics, fetchStats]);

  // Handle filters
  useEffect(() => {
    setPage(0);
    fetchTopics();
  }, [searchTerm, subjectFilter, statusFilter, fetchTopics]);

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
    fetchTopics();
    fetchStats();
  };

  // Handle view
  const handleView = async (topic) => {
    setDrawerTopic(topic);
    setDrawerStats({ questions: 0 });
    setDrawerOpen(true);
  };

  // Handle create
  const handleCreate = () => {
    setSelectedTopic(null);
    setFormMode("create");
    setFormError(null);
    setFormDialogOpen(true);
  };

  // Handle edit
  const handleEdit = (topic) => {
    setSelectedTopic(topic);
    setFormMode("edit");
    setFormError(null);
    setFormDialogOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    setFormError(null);

    try {
      let response;
      if (formMode === "create") {
        response = await topicService.createTopic(data);
      } else {
        response = await topicService.updateTopic(selectedTopic._id, data);
      }

      if (response.success) {
        setToast({
          open: true,
          message:
            formMode === "create"
              ? "Topic created successfully"
              : "Topic updated successfully",
          severity: "success",
        });
        setFormDialogOpen(false);
        fetchTopics();
        fetchStats();
      }
    } catch (error) {
      setFormError(error.message || "Failed to save topic");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle activate
  const handleActivate = async (id) => {
    try {
      const response = await topicService.activateTopic(id);
      if (response.success) {
        setToast({
          open: true,
          message: "Topic activated successfully",
          severity: "success",
        });
        fetchTopics();
        fetchStats();
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || "Failed to activate topic",
        severity: "error",
      });
    }
  };

  // Handle deactivate
  const handleDeactivate = async (id) => {
    try {
      const response = await topicService.deactivateTopic(id);
      if (response.success) {
        setToast({
          open: true,
          message: "Topic deactivated successfully",
          severity: "success",
        });
        fetchTopics();
        fetchStats();
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || "Failed to deactivate topic",
        severity: "error",
      });
    }
  };

  // Handle delete
  const handleDelete = (id) => {
    setTopicToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await topicService.deleteTopic(topicToDelete);
      if (response.success) {
        setToast({
          open: true,
          message: "Topic archived successfully",
          severity: "success",
        });
        setDeleteDialogOpen(false);
        fetchTopics();
        fetchStats();
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || "Failed to archive topic",
        severity: "error",
      });
    } finally {
      setDeleteLoading(false);
      setTopicToDelete(null);
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <AppPageHeader
        title="Question Topics"
        subtitle="Manage topics for organizing questions within subjects"
        actions={
          canEdit && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              New Topic
            </Button>
          )
        }
      />

      {/* Stats Cards */}
      <TopicStatsCards stats={stats} loading={statsLoading} />

      {/* Search & Filters */}
      <TopicSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onClear={() => setSearchTerm("")}
      />

      <TopicFilters
        subjects={subjects}
        subjectFilter={subjectFilter}
        setSubjectFilter={setSubjectFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onClear={() => {
          setSubjectFilter("");
          setStatusFilter("");
          setSearchTerm("");
        }}
      />

      {/* Table */}
      <TopicTable
        topics={topics}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onView={handleView}
        onEdit={handleEdit}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        onDelete={handleDelete}
        onRefresh={handleRefresh}
        canEdit={canEdit}
        canDelete={canDelete}
        canManageStatus={canManageStatus}
        canView={canView}
      />

      {/* Create/Edit Dialog */}
      <TopicFormDialog
        open={formDialogOpen}
        topic={selectedTopic}
        mode={formMode}
        loading={formLoading}
        error={formError}
        onClose={() => setFormDialogOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Details Drawer */}
      <TopicDetailsDrawer
        open={drawerOpen}
        topic={drawerTopic}
        onClose={() => setDrawerOpen(false)}
        loading={false}
        stats={drawerStats}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Archive Topic?"
        message="This will archive the topic. It will no longer be available for selection when creating questions. This action can be reversed by reactivating the topic."
        confirmText="Archive"
        confirmColor="error"
        severity="warning"
        loading={deleteLoading}
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

export default QuestionTopics;
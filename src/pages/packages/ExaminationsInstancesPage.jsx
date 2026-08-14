/* eslint-disable no-unused-vars */
/**
 * ExaminationInstancesPage
 * Main page for managing examination instances
 *
 * Location: src/pages/instances/ExaminationInstancesPage.jsx
 */

import React, { useState, useCallback } from "react";
import {
  Box,
  Container,
  Breadcrumbs,
  Link,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { NavigateNext as NavigateNextIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useInstances } from "../../hooks/useInstances";
import { useAuth } from "../../hooks/useAuth";

// Components
import InstanceStatisticsCards from "../../components/instances/InstanceStatisticsCards";
import InstanceToolbar from "../../components/instances/InstanceToolbar";
import InstanceFilters from "../../components/instances/InstanceFilters";
import InstanceTable from "../../components/instances/InstanceTable";
import CreateInstanceDialog from "../../components/instances/CreateInstanceDialog";
import InstanceDetailsDrawer from "../../components/instances/InstanceDetailsDrawer";

// Constants
const PAGE_TITLE = "Examination Instances";

const ExaminationInstancesPage = () => {
  const navigate = useNavigate();

  // Get auth from the existing hook
  const { user } = useAuth();

  // ✅ FIX: Get role name from user object (user.role can be an object or string)
  const userRole = user?.role?.name || user?.role || "USER";
  const userRoleName =
    typeof userRole === "string" ? userRole : userRole?.name || "USER";

  // Permissions based on user role
  const isAdmin =
    userRoleName === "SUPER_ADMIN" || userRoleName === "TECH_ADMIN";
  const canCreate = isAdmin;
  const canLock = isAdmin;
  const canArchive = isAdmin;
  const canGenerate = isAdmin;

  // Use the instance hook
  const {
    instances,
    totalInstances,
    statistics,
    filters,
    isLoading,
    isCreating,
    isLocking,
    isArchiving,
    createDialogOpen,
    detailsDrawerOpen,
    archiveDialogOpen,
    archiveReason,
    selectedInstanceId,
    validatedExaminations,
    selectedInstance,
    snackbar,
    hideSnackbar,
    updateFilters,
    resetFilters,
    handlePageChange,
    handleRowsPerPageChange,
    openDetails,
    closeDetails,
    openCreateDialog,
    closeCreateDialog,
    openArchiveDialog,
    closeArchiveDialog,
    handleArchiveConfirm,
    handleLock,
    handleCreateInstance,
    navigateToPackageGenerator,
    setArchiveReason,
    refresh,
  } = useInstances();

  // Local state
  const [exporting, setExporting] = useState(false);

  // Count active filters
  const filterCount = Object.keys(filters).filter(
    (key) =>
      !["page", "limit", "sort"].includes(key) &&
      filters[key] &&
      filters[key] !== "",
  ).length;

  // Handle export
  const handleExport = useCallback(async () => {
    try {
      setExporting(true);
      const data = instances.map((instance) => ({
        code: instance.instanceCode,
        exam: instance.examName,
        status: instance.status,
        candidates: instance.candidateCount,
        centres: instance.centreCount,
        created: new Date(instance.createdAt).toLocaleDateString(),
      }));

      if (data.length === 0) {
        return;
      }

      const headers = Object.keys(data[0]);
      const csv = [
        headers.join(","),
        ...data.map((row) => headers.map((h) => row[h]).join(",")),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `instances-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  }, [instances]);

  // Handle generate packages
  const handleGeneratePackages = useCallback(
    (instanceId) => {
      const result = navigateToPackageGenerator(instanceId);
      if (result) {
        navigate(`/packages/generate?instanceId=${instanceId}`);
      }
    },
    [navigate, navigateToPackageGenerator],
  );

  // Handle view history (placeholder)
  const handleViewHistory = useCallback(
    (instanceId) => {
      navigate(`/instances/${instanceId}/history`);
    },
    [navigate],
  );

  // Handle lock with confirmation
  const handleLockConfirm = useCallback(
    async (instanceId) => {
      try {
        await handleLock(instanceId);
      } catch (error) {
        // Error handled in hook
      }
    },
    [handleLock],
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 2 }}
      >
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/dashboard");
          }}
        >
          Dashboard
        </Link>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/packages");
          }}
        >
          Packages
        </Link>
        <Typography color="text.primary">{PAGE_TITLE}</Typography>
      </Breadcrumbs>

      {/* Statistics Cards */}
      <InstanceStatisticsCards statistics={statistics} loading={isLoading} />

      {/* Toolbar */}
      <InstanceToolbar
        onCreate={openCreateDialog}
        onRefresh={refresh}
        onExport={handleExport}
        totalCount={totalInstances}
        loading={isLoading || exporting}
        filterCount={filterCount}
        canCreate={canCreate}
      />

      {/* Filters */}
      <InstanceFilters
        filters={filters}
        onFilterChange={updateFilters}
        onReset={resetFilters}
      />

      {/* Table */}
      <InstanceTable
        instances={instances}
        total={totalInstances}
        page={filters.page}
        limit={filters.limit}
        loading={isLoading}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onViewDetails={openDetails}
        onLock={handleLockConfirm}
        onArchive={openArchiveDialog}
        onGeneratePackages={handleGeneratePackages}
        onViewHistory={handleViewHistory}
        canLock={canLock}
        canArchive={canArchive}
        canGenerate={canGenerate}
      />

      {/* Create Instance Dialog */}
      <CreateInstanceDialog
        open={createDialogOpen}
        onClose={closeCreateDialog}
        onCreate={handleCreateInstance}
        examinations={validatedExaminations}
        loading={isCreating}
        error={null}
      />

      {/* Instance Details Drawer */}
      <InstanceDetailsDrawer
        open={detailsDrawerOpen}
        onClose={closeDetails}
        instance={selectedInstance}
        loading={!selectedInstance}
        onLock={handleLockConfirm}
        onArchive={(id) => {
          closeDetails();
          openArchiveDialog(id);
        }}
        onGeneratePackages={handleGeneratePackages}
        canLock={canLock}
        canArchive={canArchive}
        canGenerate={canGenerate}
      />

      {/* Archive Dialog */}
      <Dialog open={archiveDialogOpen} onClose={closeArchiveDialog}>
        <DialogTitle>Archive Instance</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to archive this instance? This action can be
            reverted if needed.
          </DialogContentText>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Reason for Archiving (Optional)"
            placeholder="Please provide a reason for archiving this instance..."
            value={archiveReason}
            onChange={(e) => setArchiveReason(e.target.value)}
            disabled={isArchiving}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeArchiveDialog} disabled={isArchiving}>
            Cancel
          </Button>
          <Button
            onClick={handleArchiveConfirm}
            color="error"
            variant="contained"
            disabled={isArchiving}
            startIcon={isArchiving && <CircularProgress size={20} />}
          >
            {isArchiving ? "Archiving..." : "Archive"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={hideSnackbar}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Backdrop for loading states */}
      <Backdrop
        open={isLocking || isArchiving}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box sx={{ textAlign: "center", color: "white" }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>
            {isLocking ? "Locking instance..." : "Archiving instance..."}
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default ExaminationInstancesPage;

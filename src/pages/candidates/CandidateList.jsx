/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Candidate List Page
 * Main page for managing candidates with examination filtering
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
  Tabs,
  Tab,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import AppPageHeader from "../../components/common/AppPageHeader";
import CandidateSummaryCards from "../../components/candidates/CandidateSummaryCards";
import CandidateFilters from "../../components/candidates/CandidateFilters";
import CandidateTable from "../../components/candidates/CandidateTable";
import BulkActionToolbar from "../../components/candidates/BulkActionToolbar";
import * as candidateService from "../../services/candidates/candidateService";
import * as examinationService from "../../services/examination/examinationService";

const getUserRole = (user) => {
  if (!user) return "GUEST";
  if (typeof user.role === "string") return user.role;
  if (user.role && typeof user.role === "object") {
    return user.role.name || user.role.role || "USER";
  }
  return "USER";
};

const CandidateList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  // Get examinationId from URL params or state
  const [selectedExaminationId, setSelectedExaminationId] = useState(
    searchParams.get("examinationId") || "",
  );

  // Permissions
  const canManage = ["SUPER_ADMIN", "TECH_ADMIN", "EXAM_MANAGER"].includes(
    userRole,
  );
  const canEdit = canManage;
  const canActivate = canManage;
  const canDelete = ["SUPER_ADMIN", "TECH_ADMIN"].includes(userRole);
  const canRestore = ["SUPER_ADMIN", "TECH_ADMIN"].includes(userRole);

  // State
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    gender: "",
    department: "",
    organization: "",
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [examinations, setExaminations] = useState([]);
  const [examinationsLoading, setExaminationsLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ✅ Load examinations for dropdown - FIXED
// Load examinations for dropdown - FIXED
const loadExaminations = useCallback(async () => {
  setExaminationsLoading(true);
  try {
    console.log("🔍 Loading examinations...");

    const response = await examinationService.getExaminations({
      limit: 100,
      // Remove status filter to get all examinations
      // status: "Active",
    });

    console.log("📋 Full API Response:", response);
    console.log("📋 Response type:", typeof response);
    console.log("📋 Response keys:", Object.keys(response || {}));

    // Handle different response structures
    let examList = [];

    // Check if response is undefined or null
    if (!response) {
      console.warn("⚠️ Response is null or undefined");
      setExaminations([]);
      setExaminationsLoading(false);
      return;
    }

    // If response has success property
    if (response.success === true) {
      // Check for data in response.data
      if (response.data) {
        if (Array.isArray(response.data)) {
          examList = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          examList = response.data.data;
        } else if (response.data.items && Array.isArray(response.data.items)) {
          examList = response.data.items;
        } else if (response.data.results && Array.isArray(response.data.results)) {
          examList = response.data.results;
        } else {
          // Try to find any array property in response.data
          for (const key of Object.keys(response.data)) {
            if (Array.isArray(response.data[key])) {
              examList = response.data[key];
              console.log(`📋 Found array in response.data.${key}:`, examList.length);
              break;
            }
          }
        }
      }
    } 
    // If response is directly an array
    else if (Array.isArray(response)) {
      examList = response;
    }
    // If response has data property that is an array
    else if (response.data && Array.isArray(response.data)) {
      examList = response.data;
    }
    // If response has meta and data
    else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      examList = response.data.data;
    }
    // Try to find any array in the response
    else {
      for (const key of ['items', 'results', 'examinations', 'list', 'data']) {
        if (response[key] && Array.isArray(response[key])) {
          examList = response[key];
          console.log(`📋 Found array in response.${key}:`, examList.length);
          break;
        }
      }
    }

    console.log("📋 Parsed examinations:", examList);
    console.log("📋 Number of examinations:", examList.length);

    setExaminations(examList);

    // If no examination selected and there are examinations, select the first one
    if (!selectedExaminationId && examList.length > 0) {
      const firstExam = examList[0];
      setSelectedExaminationId(firstExam._id || firstExam.id);
      setSearchParams({ examinationId: firstExam._id || firstExam.id });
      console.log("✅ Auto-selected examination:", firstExam.name);
    }
  } catch (err) {
    console.error("❌ Failed to load examinations:", err);
    console.error("❌ Error details:", err.response?.data || err.message);
    setToast({
      open: true,
      message: err.message || "Failed to load examinations",
      severity: "error",
    });
    setExaminations([]);
  } finally {
    setExaminationsLoading(false);
  }
}, [selectedExaminationId, setSearchParams]);
  // Load candidates
  const loadCandidates = useCallback(async () => {
    if (!selectedExaminationId) {
      setCandidates([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit,
        ...filters,
      };

      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (
          params[key] === "" ||
          params[key] === null ||
          params[key] === undefined
        ) {
          delete params[key];
        }
      });

      console.log(
        "📋 Loading candidates for examination:",
        selectedExaminationId,
        params,
      );

      const response = await candidateService.getCandidates(
        selectedExaminationId,
        params,
      );
      console.log("📋 Candidates response:", response);

      if (response.success) {
        setCandidates(response.data || []);
        setTotal(response.meta?.total || response.total || 0);
      } else {
        // Try to extract data from different response structures
        const data = response.data || response;
        setCandidates(data.data || data || []);
        setTotal(data.meta?.total || data.total || 0);
      }
    } catch (err) {
      console.error("❌ Failed to load candidates:", err);
      setCandidates([]);
      setTotal(0);
      setToast({
        open: true,
        message: err.message || "Failed to load candidates",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedExaminationId, page, limit, filters]);

  // Load statistics
  const loadStats = useCallback(async () => {
    if (!selectedExaminationId) {
      setStats(null);
      setStatsLoading(false);
      return;
    }

    setStatsLoading(true);
    try {
      const response = await candidateService.getCandidateStats(
        selectedExaminationId,
      );
      if (response.success) {
        setStats(response.data);
      } else {
        setStats(null);
      }
    } catch (err) {
      console.error("❌ Failed to load stats:", err);
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  }, [selectedExaminationId]);

  // ✅ Initial load - load examinations first
  useEffect(() => {
    loadExaminations();
  }, [loadExaminations]);

  // ✅ Load data when examination changes
  useEffect(() => {
    if (selectedExaminationId) {
      loadCandidates();
      loadStats();
    } else {
      setCandidates([]);
      setTotal(0);
      setStats(null);
      setLoading(false);
      setStatsLoading(false);
    }
  }, [selectedExaminationId, loadCandidates, loadStats]);

  // Handle examination change
  const handleExaminationChange = (examId) => {
    console.log("🔄 Examination changed to:", examId);
    setSelectedExaminationId(examId);
    setSearchParams({ examinationId: examId });
    setPage(0);
    setSelectedRows([]);
    setFilters({
      search: "",
      status: "",
      gender: "",
      department: "",
      organization: "",
    });
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(0);
    setSelectedRows([]);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "",
      gender: "",
      department: "",
      organization: "",
    });
    setPage(0);
    setSelectedRows([]);
  };

  // Navigation handlers
  const handleView = (candidate) => {
    navigate(`/candidates/${candidate._id}`);
  };

  const handleEdit = (candidate) => {
    navigate(`/candidates/${candidate._id}/edit`);
  };

  // Action handlers
  const handleActivate = async (candidate) => {
    try {
      await candidateService.activateCandidate(candidate._id);
      setToast({
        open: true,
        message: "Candidate activated successfully",
        severity: "success",
      });
      loadCandidates();
      loadStats();
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Failed to activate",
        severity: "error",
      });
    }
  };

  const handleDeactivate = async (candidate) => {
    try {
      await candidateService.deactivateCandidate(candidate._id);
      setToast({
        open: true,
        message: "Candidate deactivated successfully",
        severity: "success",
      });
      loadCandidates();
      loadStats();
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Failed to deactivate",
        severity: "error",
      });
    }
  };

  const handleDelete = async (candidate) => {
    if (
      !window.confirm(
        `Are you sure you want to delete candidate ${candidate.candidateNumber}?`,
      )
    ) {
      return;
    }
    try {
      await candidateService.deleteCandidate(candidate._id);
      setToast({
        open: true,
        message: "Candidate deleted successfully",
        severity: "success",
      });
      loadCandidates();
      loadStats();
      setSelectedRows([]);
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Failed to delete",
        severity: "error",
      });
    }
  };

  const handleRestore = async (candidate) => {
    try {
      await candidateService.restoreCandidate(candidate._id);
      setToast({
        open: true,
        message: "Candidate restored successfully",
        severity: "success",
      });
      loadCandidates();
      loadStats();
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Failed to restore",
        severity: "error",
      });
    }
  };

  // Bulk actions
  const handleBulkActivate = async () => {
    try {
      await candidateService.bulkActivate(selectedExaminationId, selectedRows);
      setToast({
        open: true,
        message: `${selectedRows.length} candidates activated`,
        severity: "success",
      });
      loadCandidates();
      loadStats();
      setSelectedRows([]);
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Bulk activate failed",
        severity: "error",
      });
    }
  };

  const handleBulkDeactivate = async () => {
    try {
      await candidateService.bulkDeactivate(
        selectedExaminationId,
        selectedRows,
      );
      setToast({
        open: true,
        message: `${selectedRows.length} candidates deactivated`,
        severity: "success",
      });
      loadCandidates();
      loadStats();
      setSelectedRows([]);
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Bulk deactivate failed",
        severity: "error",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedRows.length} candidates?`,
      )
    ) {
      return;
    }
    try {
      for (const id of selectedRows) {
        await candidateService.deleteCandidate(id);
      }
      setToast({
        open: true,
        message: `${selectedRows.length} candidates deleted`,
        severity: "success",
      });
      loadCandidates();
      loadStats();
      setSelectedRows([]);
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Bulk delete failed",
        severity: "error",
      });
    }
  };

  const handleRefresh = () => {
    loadCandidates();
    loadStats();
  };

  // ✅ Check if user has permission
  if (!canManage) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Alert severity="error">
          You do not have permission to manage candidates. Please contact your
          administrator.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate("/examinations")}
          sx={{ mt: 2 }}
        >
          Back to Examinations
        </Button>
      </Container>
    );
  }

  // ✅ Get selected examination name
  const selectedExam = examinations.find(
    (e) => e._id === selectedExaminationId,
  );

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Candidates"
        subtitle="Manage candidates across all examinations"
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={() => navigate("/examinations")}
            >
              Back
            </Button>
          </Stack>
        }
      />

      {/* ✅ Examination Selector */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <FormControl sx={{ minWidth: 300 }} size="medium">
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
            {examinations.length === 0 && !examinationsLoading && (
              <MenuItem disabled>
                <em>No examinations available</em>
              </MenuItem>
            )}
            {examinations.map((exam) => (
              <MenuItem key={exam._id || exam.id} value={exam._id || exam.id}>
                {exam.name} ({exam.code})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {examinationsLoading && <CircularProgress size={24} />}

        {selectedExaminationId && selectedExam && (
          <Chip
            label={`${selectedExam.name} - ${selectedExam.code}`}
            color="primary"
            size="medium"
            onDelete={() => handleExaminationChange("")}
          />
        )}

        {selectedExaminationId && !examinationsLoading && (
          <Typography variant="caption" color="textSecondary">
            Total: {total} candidates
          </Typography>
        )}
      </Box>

      {/* ✅ Statistics */}
      {selectedExaminationId && (
        <CandidateSummaryCards stats={stats} loading={statsLoading} />
      )}

      {/* ✅ Bulk Actions */}
      {selectedExaminationId && (
        <BulkActionToolbar
          selectedCount={selectedRows.length}
          onActivate={handleBulkActivate}
          onDeactivate={handleBulkDeactivate}
          onDelete={handleBulkDelete}
          loading={loading}
          canActivate={canActivate}
          canDelete={canDelete}
        />
      )}

      {/* ✅ Filters */}
      {selectedExaminationId && (
        <CandidateFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
          examinations={examinations}
          loading={loading}
        />
      )}

      {/* ✅ Table */}
      {selectedExaminationId ? (
        <CandidateTable
          candidates={candidates}
          loading={loading}
          page={page}
          limit={limit}
          total={total}
          onPageChange={setPage}
          onLimitChange={setLimit}
          onView={handleView}
          onEdit={handleEdit}
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
          onDelete={handleDelete}
          onRestore={handleRestore}
          selectedRows={selectedRows}
          onSelectRows={setSelectedRows}
          canEdit={canEdit}
          canActivate={canActivate}
          canDelete={canDelete}
          canRestore={canRestore}
          examinationId={selectedExaminationId}
        />
      ) : (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography variant="body1" color="textSecondary">
            Please select an examination to view candidates.
          </Typography>
          {examinationsLoading ? (
            <CircularProgress size={24} sx={{ mt: 2 }} />
          ) : examinations.length === 0 ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                No examinations available.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/examinations/create")}
                sx={{ mt: 2 }}
              >
                Create Examination
              </Button>
            </Box>
          ) : null}
        </Box>
      )}

      {/* ✅ Toast */}
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

export default CandidateList;

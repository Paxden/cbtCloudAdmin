/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Examinations List Page
 * Main page for managing examinations
 */

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import AppPageHeader from "../../components/common/AppPageHeader";
import ExaminationTable from "../../components/examinations/ExaminationTable";
import ExaminationStatsCards from "../../components/examinations/ExaminationStatsCards";
import * as examinationService from "../../services/examination/examinationService";

// ✅ Helper to get role name from user object
const getUserRole = (user) => {
  if (!user) return "GUEST";
  if (typeof user.role === "string") return user.role;
  if (user.role && typeof user.role === "object")
    return user.role.name || "USER";
  return "USER";
};

const Examinations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ✅ FIX: Get role name from the role object
  const userRole = getUserRole(user);

  // Debug - log to check what's happening
  console.log("🔍 Examinations Page - User:", user);
  console.log("🔍 Examinations Page - User Role:", userRole);

  // Permissions
  const canCreate = ["SUPER_ADMIN", "TECH_ADMIN", "EXAM_MANAGER"].includes(
    userRole,
  );
  const canEdit = ["SUPER_ADMIN", "TECH_ADMIN", "EXAM_MANAGER"].includes(
    userRole,
  );
  const canArchive = ["SUPER_ADMIN", "TECH_ADMIN"].includes(userRole);
  const canDelete = ["SUPER_ADMIN"].includes(userRole);
  const canClone = ["SUPER_ADMIN", "TECH_ADMIN"].includes(userRole);
  const canView = true;

  // State
  const [examinations, setExaminations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    examinationType: "all",
    promotionYear: "all",
  });
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ✅ Load examinations
  const loadExaminations = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit,
        search: filters.search || undefined,
        status: filters.status !== "all" ? filters.status : undefined,
        examinationType:
          filters.examinationType !== "all"
            ? filters.examinationType
            : undefined,
        promotionYear:
          filters.promotionYear !== "all"
            ? parseInt(filters.promotionYear)
            : undefined,
        sort: "-createdAt",
      };

      const response = await examinationService.getExaminations(params);

      // ✅ Handle different response structures
      const data = response.data || response;
      setExaminations(data.data || data || []);
      setTotal(data.pagination?.total || data.total || 0);
    } catch (error) {
      console.error("Failed to load examinations:", error);
      setToast({
        open: true,
        message: error.message || "Failed to load examinations",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  // ✅ Load statistics
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await examinationService.getExaminationStats();
      setStats(response.data || response);
    } catch (error) {
      console.error("Failed to load statistics:", error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ✅ Initial load
  useEffect(() => {
    loadExaminations();
    loadStats();
  }, [loadExaminations, loadStats]);

  // ✅ Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      examinationType: "all",
      promotionYear: "all",
    });
    setPage(0);
  };

  const handleRefresh = () => {
    loadExaminations();
    loadStats();
  };

  // ✅ Navigation handlers
  const handleCreate = () => {
    navigate("/examinations/create");
  };

  const handleView = (exam) => {
    navigate(`/examinations/${exam._id}`);
  };

  const handleEdit = (exam) => {
    navigate(`/examinations/${exam._id}/edit`);
  };

  const handleClone = (exam) => {
    navigate(`/examinations/${exam._id}/clone`);
  };

  // ✅ API handlers
  const handleArchive = async (id, data) => {
    try {
      await examinationService.archiveExamination(id, data);
      setToast({
        open: true,
        message: "Examination archived successfully",
        severity: "success",
      });
      loadExaminations();
      loadStats();
    } catch (error) {
      setToast({
        open: true,
        message: error.message || "Failed to archive examination",
        severity: "error",
      });
    }
  };

  const handleRestore = async (exam) => {
    try {
      await examinationService.restoreExamination(exam._id);
      setToast({
        open: true,
        message: "Examination restored successfully",
        severity: "success",
      });
      loadExaminations();
      loadStats();
    } catch (error) {
      setToast({
        open: true,
        message: error.message || "Failed to restore examination",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await examinationService.deleteExamination(id);
      setToast({
        open: true,
        message: "Examination deleted successfully",
        severity: "success",
      });
      loadExaminations();
      loadStats();
    } catch (error) {
      setToast({
        open: true,
        message: error.message || "Failed to delete examination",
        severity: "error",
      });
    }
  };

  // ✅ Check code availability
  const handleCheckCodeAvailability = async (code) => {
    try {
      const response = await examinationService.checkCodeAvailability(code);
      return response.data || response;
    } catch (error) {
      return { isAvailable: false };
    }
  };

  // ✅ Check if any filters are active
  const hasActiveFilters =
    filters.search ||
    filters.status !== "all" ||
    filters.examinationType !== "all" ||
    filters.promotionYear !== "all";

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Examinations"
        subtitle="Manage promotional and certification examinations"
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreate}
              >
                Create Examination
              </Button>
            )}
          </Stack>
        }
      />

      {/* Statistics */}
      <ExaminationStatsCards stats={stats} loading={statsLoading} />

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by name, code..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: filters.search && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => handleFilterChange("search", "")}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.examinationType}
                  label="Type"
                  onChange={(e) =>
                    handleFilterChange("examinationType", e.target.value)
                  }
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="Promotion">Promotion</MenuItem>
                  <MenuItem value="Recruitment">Recruitment</MenuItem>
                  <MenuItem value="Certification">Certification</MenuItem>
                  <MenuItem value="Internal Assessment">
                    Internal Assessment
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Year</InputLabel>
                <Select
                  value={filters.promotionYear}
                  label="Year"
                  onChange={(e) =>
                    handleFilterChange("promotionYear", e.target.value)
                  }
                >
                  <MenuItem value="all">All Years</MenuItem>
                  {Array.from(
                    { length: 10 },
                    (_, i) => new Date().getFullYear() - 5 + i,
                  ).map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                {hasActiveFilters && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ClearIcon />}
                    onClick={handleClearFilters}
                  >
                    Clear
                  </Button>
                )}
                <Tooltip title="Active Filters">
                  <Chip
                    label={`${Object.entries(filters).filter(([k, v]) => v && v !== "all" && v !== "").length} active`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table */}
      <ExaminationTable
        examinations={examinations}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onView={handleView}
        onEdit={handleEdit}
        onArchive={handleArchive}
        onRestore={handleRestore}
        onClone={handleClone}
        onDelete={handleDelete}
        canEdit={canEdit}
        canArchive={canArchive}
        canDelete={canDelete}
        canClone={canClone}
        canView={canView}
      />

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

export default Examinations;

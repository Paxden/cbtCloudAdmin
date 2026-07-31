/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Centre List Page
 * Main page for managing centres
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import AppPageHeader from "../../components/common/AppPageHeader";
import CentreSummaryCards from "../../components/centres/CentreSummaryCards";
import CentreTable from "../../components/centres/CentreTable";
import * as centreService from "../../services/centres/centreService";
import * as userService from "../../services/user/userService";

const getUserRole = (user) => {
  if (!user) return "GUEST";
  if (typeof user.role === "string") return user.role;
  if (user.role && typeof user.role === "object") {
    return user.role.name || user.role.role || "USER";
  }
  return "USER";
};

const CentreList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  // Permissions
  const canCreate = ["SUPER_ADMIN", "TECH_ADMIN"].includes(userRole);
  const canEdit = ["SUPER_ADMIN", "TECH_ADMIN"].includes(userRole);
  const canActivate = ["SUPER_ADMIN", "TECH_ADMIN"].includes(userRole);
  const canDelete = ["SUPER_ADMIN"].includes(userRole);
  const canAssignManager = ["SUPER_ADMIN", "TECH_ADMIN"].includes(userRole);

  // State
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    centre: null,
  });

  // Load centres - FIXED
  const loadCentres = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit,
        search: filters.search || undefined,
        status: filters.status !== "all" ? filters.status : undefined,
        sort: "-createdAt",
      };

      const response = await centreService.getCentres(params);
      console.log("📋 Centres response:", response);

      // ✅ Handle the actual response structure: { data: [...], pagination: {...} }
      // The API returns: { data: [centres], pagination: { total, page, limit, pages } }
      if (response) {
        // Check if response has data property (array)
        if (response.data && Array.isArray(response.data)) {
          setCentres(response.data);
          setTotal(response.pagination?.total || response.data.length || 0);
        }
        // Check if response has success property (from other endpoints)
        else if (response.success && response.data) {
          if (Array.isArray(response.data)) {
            setCentres(response.data);
            setTotal(response.meta?.total || response.data.length || 0);
          } else if (response.data.data && Array.isArray(response.data.data)) {
            setCentres(response.data.data);
            setTotal(
              response.data.pagination?.total || response.data.data.length || 0,
            );
          } else {
            setCentres([]);
            setTotal(0);
          }
        }
        // Check if response is the data directly
        else if (Array.isArray(response)) {
          setCentres(response);
          setTotal(response.length);
        } else {
          // Try to find any array in the response
          let foundArray = false;
          for (const key of ["items", "results", "list", "centres"]) {
            if (response[key] && Array.isArray(response[key])) {
              setCentres(response[key]);
              setTotal(response.total || response[key].length || 0);
              foundArray = true;
              break;
            }
          }
          if (!foundArray) {
            setCentres([]);
            setTotal(0);
          }
        }
      } else {
        setCentres([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("❌ Failed to load centres:", err);
      setToast({
        open: true,
        message: err.message || "Failed to load centres",
        severity: "error",
      });
      setCentres([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  // Load statistics - FIXED
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await centreService.getCentreStats();
      console.log("📊 Stats response:", response);

      // ✅ Handle different response structures
      if (response && response.success) {
        setStats(response.data || {});
      } else if (response && response.data) {
        setStats(response.data || {});
      } else {
        // If response is the data directly
        setStats(response || {});
      }
    } catch (err) {
      console.error("❌ Failed to load statistics:", err);
      // ✅ Set empty stats to prevent errors
      setStats({
        total: 0,
        active: 0,
        inactive: 0,
        pending: 0,
        totalCapacity: 0,
        usedCapacity: 0,
      });
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadCentres();
    loadStats();
  }, [loadCentres, loadStats]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({ search: "", status: "all" });
    setPage(0);
  };

  const handleRefresh = () => {
    loadCentres();
    loadStats();
  };

  // Navigation handlers
  const handleCreate = () => {
    navigate("/centres/create");
  };

  const handleView = (centre) => {
    navigate(`/centres/${centre._id}`);
  };

  const handleEdit = (centre) => {
    navigate(`/centres/${centre._id}/edit`);
  };

  // Action handlers
  const handleActivate = async (centre) => {
    try {
      await centreService.activateCentre(centre._id);
      setToast({
        open: true,
        message: "Centre activated successfully",
        severity: "success",
      });
      loadCentres();
      loadStats();
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Failed to activate centre",
        severity: "error",
      });
    }
  };

  const handleDeactivate = async (centre) => {
    try {
      await centreService.deactivateCentre(centre._id);
      setToast({
        open: true,
        message: "Centre deactivated successfully",
        severity: "success",
      });
      loadCentres();
      loadStats();
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Failed to deactivate centre",
        severity: "error",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.centre) return;

    try {
      await centreService.deleteCentre(deleteDialog.centre._id);
      setToast({
        open: true,
        message: "Centre deleted successfully",
        severity: "success",
      });
      setDeleteDialog({ open: false, centre: null });
      loadCentres();
      loadStats();
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Failed to delete centre",
        severity: "error",
      });
    }
  };

  const handleAssignManager = (centre) => {
    navigate(`/centres/${centre._id}/assign-manager`);
  };

  const hasActiveFilters = filters.search || filters.status !== "all";

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Centres"
        subtitle="Manage examination centres"
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
                Create Centre
              </Button>
            )}
          </Stack>
        }
      />

      {/* Statistics */}
      <CentreSummaryCards stats={stats} loading={statsLoading} />

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
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              {hasActiveFilters && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={handleClearFilters}
                  fullWidth
                >
                  Clear
                </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table */}
      <CentreTable
        centres={centres}
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
        onDelete={(centre) => setDeleteDialog({ open: true, centre })}
        onAssignManager={handleAssignManager}
        canEdit={canEdit}
        canActivate={canActivate}
        canDelete={canDelete}
        canAssignManager={canAssignManager}
      />

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, centre: null })}
      >
        <DialogTitle>Delete Centre</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete centre "{deleteDialog.centre?.name}
            "? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, centre: null })}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

export default CentreList;

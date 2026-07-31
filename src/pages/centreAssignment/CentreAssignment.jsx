/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Centre Assignment Page
 * Main page for assigning candidates to centres
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
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  Refresh as RefreshIcon,
  AutoAwesome as AutoIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
  Delete as DeleteIcon,
  Map as MapIcon,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import AppPageHeader from "../../components/common/AppPageHeader";
import AssignmentSummaryCards from "../../components/centreAssignment/AssignmentSummaryCards";
import AssignmentFilters from "../../components/centreAssignment/AssignmentFilters";
import CandidateAssignmentTable from "../../components/centreAssignment/CandidateAssignmentTable";
import AssignedCandidatesTable from "../../components/centreAssignment/AssignedCandidatesTable";
import CentreCapacityCard from "../../components/centreAssignment/CentreCapacityCard";
import LocationStatsCard from "../../components/centreAssignment/LocationStatsCard";
import * as centreAssignmentService from "../../services/centreAssignment/centreAssignmentService";
import * as examinationService from "../../services/examination/examinationService";
import * as centreService from "../../services/centres/centreService";

const getUserRole = (user) => {
  if (!user) return "GUEST";
  if (typeof user.role === "string") return user.role;
  if (user.role && typeof user.role === "object") {
    return user.role.name || user.role.role || "USER";
  }
  return "USER";
};

const CentreAssignment = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const selectedExaminationId = searchParams.get("examinationId") || "";

  const canAssign = ["SUPER_ADMIN", "TECH_ADMIN", "EXAM_MANAGER"].includes(
    userRole,
  );
  const canRemove = ["SUPER_ADMIN", "TECH_ADMIN"].includes(userRole);
  const canAutoAssign = ["SUPER_ADMIN", "TECH_ADMIN"].includes(userRole);
  const canAssignCentre = ["SUPER_ADMIN", "TECH_ADMIN", "EXAM_MANAGER"].includes(
    userRole,
  );

  // State
  const [examinations, setExaminations] = useState([]);
  const [examinationsLoading, setExaminationsLoading] = useState(false);
  const [centres, setCentres] = useState([]);
  const [centresLoading, setCentresLoading] = useState(false);
  const [unassignedCandidates, setUnassignedCandidates] = useState([]);
  const [assignedCandidates, setAssignedCandidates] = useState([]);
  const [stats, setStats] = useState(null);
  const [locationStats, setLocationStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [locationStatsLoading, setLocationStatsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    centreId: "",
    gender: "",
    department: "",
    city: "",
    state: "",
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [tab, setTab] = useState(0);
  const [autoDialogOpen, setAutoDialogOpen] = useState(false);
  const [autoStrategy, setAutoStrategy] = useState("BALANCE");
  const [preferLocation, setPreferLocation] = useState(true);
  const [fallbackToAny, setFallbackToAny] = useState(true);
  const [removing, setRemoving] = useState(false);
  const [showLocationStats, setShowLocationStats] = useState(false);
  
  // Assign Centre Dialog State
  const [assignCentreDialogOpen, setAssignCentreDialogOpen] = useState(false);
  const [availableCentres, setAvailableCentres] = useState([]);
  const [selectedCentreToAssign, setSelectedCentreToAssign] = useState("");
  const [assignCentreNotes, setAssignCentreNotes] = useState("");
  const [availableCentresLoading, setAvailableCentresLoading] = useState(false);
  const [assigningCentre, setAssigningCentre] = useState(false);

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

  // Load centres assigned to examination
  const loadCentres = useCallback(async () => {
    if (!selectedExaminationId) {
      setCentres([]);
      setCentresLoading(false);
      return;
    }
    
    setCentresLoading(true);
    try {
      const response = await centreAssignmentService.getAvailableCentres(selectedExaminationId);
      console.log('📋 Centres response:', response);
      
      if (response && response.success) {
        let centresList = [];
        
        if (response.data) {
          if (Array.isArray(response.data)) {
            centresList = response.data;
          } else if (response.data.centres && Array.isArray(response.data.centres)) {
            centresList = response.data.centres;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            centresList = response.data.data;
          } else {
            centresList = [];
          }
        } else if (Array.isArray(response)) {
          centresList = response;
        } else {
          centresList = [];
        }
        
        setCentres(centresList);
        
        // Auto-select first centre if none selected and centres exist
        if (!selectedCentre && centresList.length > 0) {
          setSelectedCentre(centresList[0]);
        }
      } else {
        setCentres([]);
      }
    } catch (err) {
      console.error('❌ Failed to load centres:', err);
      setCentres([]);
    } finally {
      setCentresLoading(false);
    }
  }, [selectedExaminationId, selectedCentre]);

  // Load location statistics
  const loadLocationStats = useCallback(async () => {
    if (!selectedExaminationId) {
      setLocationStats(null);
      return;
    }

    setLocationStatsLoading(true);
    try {
      const response = await centreAssignmentService.getLocationStats(
        selectedExaminationId,
        { includeAssigned: false }
      );
      if (response.success) {
        setLocationStats(response.data);
      }
    } catch (err) {
      console.error("Failed to load location stats:", err);
    } finally {
      setLocationStatsLoading(false);
    }
  }, [selectedExaminationId]);

  // Load available centres for assignment dialog
  const loadAvailableCentres = useCallback(async () => {
    setAvailableCentresLoading(true);
    try {
      const response = await centreService.getCentres({ 
        status: 'ACTIVE', 
        limit: 100 
      });
      
      console.log('📋 All centres response:', response);
      
      let allCentres = [];
      if (response && response.success) {
        if (Array.isArray(response.data)) {
          allCentres = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          allCentres = response.data.data;
        } else if (response.data.centres && Array.isArray(response.data.centres)) {
          allCentres = response.data.centres;
        } else {
          allCentres = [];
        }
      } else if (Array.isArray(response)) {
        allCentres = response;
      } else {
        allCentres = [];
      }
      
      // Filter out already assigned centres
      const assignedCentreIds = centres.map(c => c._id);
      const unassignedCentres = allCentres.filter(c => !assignedCentreIds.includes(c._id));
      
      console.log('📋 Available centres to assign:', unassignedCentres);
      setAvailableCentres(unassignedCentres);
    } catch (err) {
      console.error('❌ Failed to load available centres:', err);
      setAvailableCentres([]);
    } finally {
      setAvailableCentresLoading(false);
    }
  }, [centres]);

  // Load unassigned candidates
  const loadUnassignedCandidates = useCallback(async () => {
    if (!selectedExaminationId) {
      setUnassignedCandidates([]);
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

      console.log("📋 Fetching unassigned candidates:", {
        examinationId: selectedExaminationId,
        params,
      });

      const response = await centreAssignmentService.getUnassignedCandidates(
        selectedExaminationId,
        params,
      );
      console.log("📋 Unassigned candidates response:", response);

      if (response && response.success) {
        let candidatesList = [];
        let totalCount = 0;

        if (response.data) {
          if (Array.isArray(response.data)) {
            candidatesList = response.data;
            totalCount = response.total || candidatesList.length;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            candidatesList = response.data.data;
            totalCount = response.data.total || candidatesList.length;
          } else if (
            response.data.candidates &&
            Array.isArray(response.data.candidates)
          ) {
            candidatesList = response.data.candidates;
            totalCount = response.data.total || candidatesList.length;
          } else {
            candidatesList = [];
            totalCount = 0;
          }
        } else if (Array.isArray(response)) {
          candidatesList = response;
          totalCount = response.length;
        } else {
          candidatesList = [];
          totalCount = 0;
        }

        setUnassignedCandidates(candidatesList);
        setTotal(totalCount);
      } else {
        setUnassignedCandidates([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("❌ Failed to load unassigned candidates:", err);
      setUnassignedCandidates([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [selectedExaminationId, page, limit, filters]);

  // Load assigned candidates
  const loadAssignedCandidates = useCallback(async () => {
    if (!selectedExaminationId) {
      setAssignedCandidates([]);
      return;
    }

    try {
      const params = {
        page: page + 1,
        limit,
        status: 'ACTIVE',
        ...filters,
      };
      if (selectedCentre) {
        params.centreId = selectedCentre._id;
      }
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      console.log('📋 Fetching assigned candidates:', {
        examinationId: selectedExaminationId,
        params
      });

      const response = await centreAssignmentService.getAssignments(
        selectedExaminationId,
        params
      );
      console.log('📋 Assigned candidates response:', response);
      
      if (response && response.success) {
        let assignmentsList = [];
        let totalCount = 0;
        
        if (response.data) {
          if (Array.isArray(response.data)) {
            assignmentsList = response.data;
            totalCount = response.total || assignmentsList.length;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            assignmentsList = response.data.data;
            totalCount = response.data.total || assignmentsList.length;
          } else {
            assignmentsList = [];
            totalCount = 0;
          }
        } else if (Array.isArray(response)) {
          assignmentsList = response;
          totalCount = response.length;
        } else {
          assignmentsList = [];
          totalCount = 0;
        }
        
        setAssignedCandidates(assignmentsList);
        setTotal(totalCount);
      } else {
        setAssignedCandidates([]);
        setTotal(0);
      }
    } catch (err) {
      console.error('❌ Failed to load assigned candidates:', err);
      setAssignedCandidates([]);
      setTotal(0);
    }
  }, [selectedExaminationId, page, limit, filters, selectedCentre]);

  // Load statistics
  const loadStats = useCallback(async () => {
    if (!selectedExaminationId) {
      setStats(null);
      setStatsLoading(false);
      return;
    }

    setStatsLoading(true);
    try {
      const response = await centreAssignmentService.getCentreStats(
        selectedExaminationId,
      );
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, [selectedExaminationId]);

  // Initial load
  useEffect(() => {
    loadExaminations();
  }, [loadExaminations]);

  useEffect(() => {
    if (selectedExaminationId) {
      loadCentres();
      loadStats();
      loadLocationStats();
    }
  }, [selectedExaminationId, loadCentres, loadStats, loadLocationStats]);

  useEffect(() => {
    if (tab === 0) {
      loadUnassignedCandidates();
    } else {
      loadAssignedCandidates();
    }
  }, [tab, loadUnassignedCandidates, loadAssignedCandidates]);

  // Handle examination change
  const handleExaminationChange = (examId) => {
    setSearchParams({ examinationId: examId });
    setPage(0);
    setSelectedRows([]);
    setSelectedCentre(null);
    setFilters({
      search: "",
      status: "",
      centreId: "",
      gender: "",
      department: "",
      city: "",
      state: "",
    });
    setLocationStats(null);
  };

  // Handle assign candidate to centre
  const handleAssign = async (candidate, centreId) => {
    const targetCentreId = centreId || selectedCentre?._id;
    if (!targetCentreId) {
      setToast({
        open: true,
        message: 'Please select a centre first',
        severity: 'warning',
      });
      return;
    }

    try {
      console.log('📤 Assigning candidate:', {
        examinationId: selectedExaminationId,
        centreId: targetCentreId,
        candidateId: candidate._id
      });

      const response = await centreAssignmentService.assignCandidates(
        selectedExaminationId,
        targetCentreId,
        [candidate._id],
        { notes: 'Manual assignment' }
      );
      
      console.log('✅ Assign response:', response);
      
      if (response && response.success) {
        setToast({
          open: true,
          message: `Candidate ${candidate.candidateNumber} assigned successfully`,
          severity: 'success',
        });
        // Refresh all data
        loadUnassignedCandidates();
        loadAssignedCandidates();
        loadStats();
        loadCentres();
        loadLocationStats();
        setSelectedRows([]);
      } else {
        throw new Error(response?.message || 'Assignment failed');
      }
    } catch (err) {
      console.error('❌ Assign error:', err);
      setToast({
        open: true,
        message: err.message || 'Failed to assign candidate',
        severity: 'error',
      });
    }
  };

  // Handle bulk assignment
  const handleBulkAssign = async () => {
    if (selectedRows.length === 0) {
      setToast({
        open: true,
        message: "Please select candidates to assign",
        severity: "warning",
      });
      return;
    }

    if (!selectedCentre) {
      setToast({
        open: true,
        message: "Please select a centre first",
        severity: "warning",
      });
      return;
    }

    try {
      await centreAssignmentService.assignCandidates(
        selectedExaminationId,
        selectedCentre._id,
        selectedRows,
        { notes: "Bulk assignment" },
      );
      setToast({
        open: true,
        message: `${selectedRows.length} candidates assigned successfully`,
        severity: "success",
      });
      loadUnassignedCandidates();
      loadAssignedCandidates();
      loadStats();
      loadCentres();
      loadLocationStats();
      setSelectedRows([]);
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Failed to assign candidates",
        severity: "error",
      });
    }
  };

  // Handle auto assign
  const handleAutoAssign = async () => {
    try {
      const payload = {
        strategy: autoStrategy,
        notes: `Auto-assigned using ${autoStrategy} strategy`,
        preferLocation: preferLocation,
        fallbackToAny: fallbackToAny,
      };
      
      if (selectedCentre) {
        payload.centreIds = [selectedCentre._id];
      }
      
      console.log('📤 Auto-assign payload:', payload);

      const response = await centreAssignmentService.autoAssignCandidates(
        selectedExaminationId,
        payload
      );
      
      console.log('✅ Auto-assign response:', response);
      
      if (response && response.success) {
        const data = response.data || {};
        setToast({
          open: true,
          message: `${data.successful || 0} candidates auto-assigned successfully`,
          severity: 'success',
        });
      } else {
        throw new Error(response?.message || 'Auto-assignment failed');
      }
      
      setAutoDialogOpen(false);
      loadUnassignedCandidates();
      loadAssignedCandidates();
      loadStats();
      loadCentres();
      loadLocationStats();
      setSelectedRows([]);
    } catch (err) {
      console.error('❌ Auto-assign error:', err);
      setToast({
        open: true,
        message: err.message || 'Failed to auto-assign candidates',
        severity: 'error',
      });
    }
  };

  // Handle assign centre to examination
  const handleAssignCentre = async () => {
    if (!selectedCentreToAssign) {
      setToast({
        open: true,
        message: 'Please select a centre',
        severity: 'warning',
      });
      return;
    }

    setAssigningCentre(true);
    try {
      const response = await centreAssignmentService.assignCentreToExamination(
        selectedExaminationId,
        selectedCentreToAssign,
        { 
          notes: assignCentreNotes || 'Assigned from centre assignment page'
        }
      );
      
      console.log('✅ Assign centre response:', response);
      
      if (response && response.success) {
        setToast({
          open: true,
          message: 'Centre assigned to examination successfully',
          severity: 'success'
        });
        
        setAssignCentreDialogOpen(false);
        setSelectedCentreToAssign('');
        setAssignCentreNotes('');
        
        // Refresh data
        loadCentres();
        loadStats();
        loadLocationStats();
      } else {
        throw new Error(response?.message || 'Failed to assign centre');
      }
    } catch (err) {
      console.error('❌ Assign centre error:', err);
      setToast({
        open: true,
        message: err.message || 'Failed to assign centre to examination',
        severity: 'error',
      });
    } finally {
      setAssigningCentre(false);
    }
  };

  // Handle remove assignment
  const handleRemove = async (assignment) => {
    if (!window.confirm("Are you sure you want to remove this assignment?")) {
      return;
    }

    setRemoving(true);
    try {
      await centreAssignmentService.removeAssignment(assignment._id, {
        reason: "Removed by administrator",
      });
      setToast({
        open: true,
        message: "Assignment removed successfully",
        severity: "success",
      });
      loadUnassignedCandidates();
      loadAssignedCandidates();
      loadStats();
      loadCentres();
      loadLocationStats();
      setSelectedRows([]);
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Failed to remove assignment",
        severity: "error",
      });
    } finally {
      setRemoving(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadUnassignedCandidates();
    loadAssignedCandidates();
    loadStats();
    loadCentres();
    loadLocationStats();
  };

  // Open assign centre dialog
  const handleOpenAssignCentreDialog = () => {
    loadAvailableCentres();
    setAssignCentreDialogOpen(true);
  };

  // Toggle location stats
  const toggleLocationStats = () => {
    setShowLocationStats(!showLocationStats);
    if (!showLocationStats && !locationStats) {
      loadLocationStats();
    }
  };

  // Check permissions
  if (!canAssign) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Alert severity="error">
          You do not have permission to assign candidates. Please contact your
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

  const selectedExam = examinations.find(
    (e) => e._id === selectedExaminationId,
  );

  // Prepare stats for summary cards
  const summaryStats = {
    ...stats,
    locationStats: locationStats,
  };

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Centre Assignment"
        subtitle="Assign candidates to examination centres"
        actions={
          <Stack direction="row" spacing={2}>
            <Tooltip title="Toggle Location Stats">
              <Button
                variant={showLocationStats ? "contained" : "outlined"}
                color="info"
                startIcon={<MapIcon />}
                onClick={toggleLocationStats}
                size="small"
              >
                {showLocationStats ? "Hide" : "Show"} Location Stats
              </Button>
            </Tooltip>
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
                {examinationsLoading && <CircularProgress size={24} />}
              </Stack>
            </Grid>
          )}
        </Grid>
      </Paper>

      {selectedExaminationId ? (
        <>
          {/* Statistics */}
          <AssignmentSummaryCards stats={summaryStats} loading={statsLoading} />

          {/* Location Statistics (Collapsible) */}
          {showLocationStats && (
            <LocationStatsCard
              stats={locationStats}
              loading={locationStatsLoading}
              onRefresh={loadLocationStats}
            />
          )}

          {/* Centre Selection */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Select Centre
              </Typography>
              {canAssignCentre && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAssignCentreDialog}
                >
                  Assign Centre
                </Button>
              )}
            </Stack>
            
            <Grid container spacing={2}>
              {centresLoading ? (
                <Grid item xs={12}>
                  <CircularProgress size={24} />
                </Grid>
              ) : centres.length === 0 ? (
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    No centres available. Click "Assign Centre" to add centres to this examination.
                  </Typography>
                </Grid>
              ) : (
                centres.map((centre) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={centre._id}>
                    <CentreCapacityCard
                      centre={centre}
                      selected={selectedCentre?._id === centre._id}
                      onSelect={setSelectedCentre}
                    />
                  </Grid>
                ))
              )}
            </Grid>
          </Paper>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs value={tab} onChange={(e, v) => setTab(v)}>
              <Tab label="Unassigned Candidates" />
              <Tab label="Assigned Candidates" />
            </Tabs>
          </Box>

          {/* Filters */}
          <AssignmentFilters
            filters={filters}
            onFilterChange={setFilters}
            onClear={() =>
              setFilters({
                search: "",
                status: "",
                centreId: "",
                gender: "",
                department: "",
                city: "",
                state: "",
              })
            }
            centres={centres}
            loading={loading}
          />

          {/* Bulk Actions */}
          {tab === 0 && selectedRows.length > 0 && (
            <Paper sx={{ p: 2, mb: 2, bgcolor: "action.hover" }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" fontWeight={500}>
                  {selectedRows.length} candidates selected
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleBulkAssign}
                  disabled={!selectedCentre}
                >
                  Assign to {selectedCentre?.name || "Selected Centre"}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setSelectedRows([])}
                >
                  Clear Selection
                </Button>
              </Stack>
            </Paper>
          )}

          {/* Tables */}
          {tab === 0 ? (
            <CandidateAssignmentTable
              candidates={unassignedCandidates}
              loading={loading}
              page={page}
              limit={limit}
              total={total}
              onPageChange={setPage}
              onLimitChange={setLimit}
              onView={(candidate) => navigate(`/candidates/${candidate._id}`)}
              onAssign={handleAssign}
              selectedRows={selectedRows}
              onSelectRows={setSelectedRows}
              canAssign={canAssign}
              centres={centres}
            />
          ) : (
            <AssignedCandidatesTable
              assignments={assignedCandidates}
              loading={loading}
              page={page}
              limit={limit}
              total={total}
              onPageChange={setPage}
              onLimitChange={setLimit}
              onView={(assignment) =>
                navigate(`/candidates/${assignment.candidateId?._id}`)
              }
              onRemove={handleRemove}
              selectedRows={selectedRows}
              onSelectRows={setSelectedRows}
              canRemove={canRemove}
            />
          )}

          {/* Auto Assign Button */}
          {canAutoAssign && tab === 0 && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AutoIcon />}
                onClick={() => setAutoDialogOpen(true)}
                disabled={!selectedCentre}
              >
                Auto Assign Candidates
              </Button>
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography variant="body1" color="textSecondary">
            Please select an examination to manage centre assignments.
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

      {/* Assign Centre to Examination Dialog */}
      <Dialog
        open={assignCentreDialogOpen}
        onClose={() => setAssignCentreDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationIcon color="primary" />
            <Typography variant="h6">Assign Centre to Examination</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Select a centre to assign to this examination. Only active centres that are not already assigned will be shown.
          </DialogContentText>
          
          {availableCentresLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={32} />
            </Box>
          ) : availableCentres.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              No available centres. All active centres are already assigned to this examination.
            </Alert>
          ) : (
            <>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Select Centre</InputLabel>
                <Select
                  value={selectedCentreToAssign}
                  onChange={(e) => setSelectedCentreToAssign(e.target.value)}
                  label="Select Centre"
                >
                  <MenuItem value="">
                    <em>Select a centre</em>
                  </MenuItem>
                  {availableCentres.map((centre) => (
                    <MenuItem key={centre._id} value={centre._id}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <span>{centre.name}</span>
                        <Chip 
                          label={centre.code} 
                          size="small" 
                          variant="outlined" 
                        />
                        <Typography variant="caption" color="textSecondary">
                          {centre.address?.city || 'No location'} • Capacity: {centre.capacity || 'N/A'}
                        </Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                size="small"
                label="Notes (Optional)"
                multiline
                rows={2}
                value={assignCentreNotes}
                onChange={(e) => setAssignCentreNotes(e.target.value)}
                placeholder="Add any notes about this assignment"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setAssignCentreDialogOpen(false);
              setSelectedCentreToAssign('');
              setAssignCentreNotes('');
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignCentre}
            variant="contained"
            disabled={!selectedCentreToAssign || availableCentres.length === 0 || assigningCentre}
            startIcon={assigningCentre ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {assigningCentre ? 'Assigning...' : 'Assign Centre'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Auto Assignment Dialog */}
      <Dialog
        open={autoDialogOpen}
        onClose={() => setAutoDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Auto Assign Candidates</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Automatically distribute unassigned candidates to available centres.
          </DialogContentText>

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Strategy</InputLabel>
            <Select
              value={autoStrategy}
              onChange={(e) => setAutoStrategy(e.target.value)}
              label="Strategy"
            >
              <MenuItem value="BALANCE">Balance Distribution</MenuItem>
              <MenuItem value="FILL">Fill Centres Sequentially</MenuItem>
              <MenuItem value="DISTRIBUTE">Round Robin</MenuItem>
              <MenuItem value="LOCATION_BASED">Location Based</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={preferLocation}
                onChange={(e) => setPreferLocation(e.target.checked)}
                color="primary"
              />
            }
            label="Prefer Location-Based Assignment"
          />

          <FormControlLabel
            control={
              <Switch
                checked={fallbackToAny}
                onChange={(e) => setFallbackToAny(e.target.checked)}
                color="primary"
              />
            }
            label="Fallback to Any Centre if Location Match Fails"
          />

          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ mt: 1, display: "block" }}
          >
            {autoStrategy === "BALANCE" &&
              "Distributes candidates evenly across all available centres."}
            {autoStrategy === "FILL" && "Fills centres to capacity one by one."}
            {autoStrategy === "DISTRIBUTE" &&
              "Distributes candidates in round-robin fashion."}
            {autoStrategy === "LOCATION_BASED" &&
              "Assigns candidates to centres based on their city/state matching."}
          </Typography>

          <Alert severity="info" sx={{ mt: 2 }}>
            {preferLocation 
              ? "Candidates will be assigned to centres in their city/state first." 
              : "Candidates will be assigned without location preference."}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAutoDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAutoAssign}
            variant="contained"
            color="secondary"
          >
            Start Auto Assignment
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

export default CentreAssignment;
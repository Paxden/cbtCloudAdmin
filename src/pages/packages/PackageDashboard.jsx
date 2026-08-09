/* eslint-disable no-unused-vars */
/**
 * Package Dashboard Page
 *
 * Displays overview of all examination packages with:
 * - Summary statistics cards
 * - Status breakdown charts
 * - Recent packages list
 * - Activity feed
 * - Centre statistics
 *
 * Access: SUPER_ADMIN, TECH_ADMIN, EXAM_MANAGER
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Avatar,
  AvatarGroup,
  Stack,
  useTheme,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  FileCopy as FileIcon,
  People as PeopleIcon,
  Storage as StorageIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  Download as DownloadIcon,
  Security as SecurityIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Verified as VerifiedIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Import hooks
import {
  useDashboardOverview,
  useStatusTimeline,
  usePerformanceMetrics,
  useCentreStats,
  useActivityFeed,
  useRefreshDashboard,
} from "../../hooks/usePackageDashboard";

// Import components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const PackageDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Filter state
  const [filters, setFilters] = useState({
    centreId: "",
    examId: "",
    days: 30,
    limit: 20,
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Memoize filter objects
  const overviewFilters = useMemo(
    () => ({
      centreId: filters.centreId || undefined,
      examId: filters.examId || undefined,
    }),
    [filters.centreId, filters.examId],
  );

  const timelineFilters = useMemo(
    () => ({
      centreId: filters.centreId || undefined,
      examId: filters.examId || undefined,
      days: filters.days,
    }),
    [filters.centreId, filters.examId, filters.days],
  );

  const activityFilters = useMemo(
    () => ({
      centreId: filters.centreId || undefined,
      examId: filters.examId || undefined,
      limit: filters.limit,
    }),
    [filters.centreId, filters.examId, filters.limit],
  );

  // Use hooks
  const {
    data: overview,
    loading: overviewLoading,
    error: overviewError,
    refetch: refetchOverview,
  } = useDashboardOverview(overviewFilters, { delay: 0 });

  const {
    data: timeline,
    loading: timelineLoading,
    error: timelineError,
    refetch: refetchTimeline,
  } = useStatusTimeline(timelineFilters, { delay: 300 });

  const {
    data: performance,
    loading: performanceLoading,
    error: performanceError,
    refetch: refetchPerformance,
  } = usePerformanceMetrics(overviewFilters, { delay: 600 });

  const {
    data: centres,
    loading: centresLoading,
    error: centresError,
    refetch: refetchCentres,
  } = useCentreStats({ examId: filters.examId || undefined }, { delay: 900 });

  const {
    data: activity,
    loading: activityLoading,
    error: activityError,
    refetch: refetchActivity,
  } = useActivityFeed(activityFilters, { delay: 1200 });

  // Combined loading state
  const isLoading =
    overviewLoading ||
    timelineLoading ||
    performanceLoading ||
    centresLoading ||
    activityLoading;

  const hasError =
    overviewError ||
    timelineError ||
    performanceError ||
    centresError ||
    activityError;

  // Refresh all data
  const refreshAll = useRefreshDashboard({
    overview: refetchOverview,
    timeline: refetchTimeline,
    performance: refetchPerformance,
    centres: refetchCentres,
    activity: refetchActivity,
  });

  const handleRefresh = useCallback(async () => {
    await refreshAll();
    setSnackbar({
      open: true,
      message: "Dashboard refreshed successfully",
      severity: "success",
    });
  }, [refreshAll]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Navigation handlers
  const handleViewPackage = (packageId) => {
    navigate(`/packages/${packageId}`);
  };

  const handleGeneratePackage = () => {
    navigate("/packages/generate");
  };

  // ============================================================
  // DATA TRANSFORMATIONS
  // ============================================================

  // Prepare summary statistics
  const summaryStats = useMemo(() => {
    if (!overview) return null;

    const statusBreakdown = overview.statusBreakdown || {};
    const encryption = overview.encryption || { breakdown: {} };
    const signature = overview.signature || { breakdown: {} };
    const distribution = overview.distribution || { breakdown: {} };

    return {
      totalPackages: overview.totalPackages || 0,
      totalCandidates: overview.totalCandidates || 0,
      totalFileSize: overview.totalFileSizeFormatted || "0 B",
      validated: statusBreakdown.VALIDATED || 0,
      generated: statusBreakdown.GENERATED || 0,
      encrypted: statusBreakdown.ENCRYPTED || 0,
      signed: statusBreakdown.SIGNED || 0,
      downloaded: statusBreakdown.DOWNLOADED || 0,
      failed: statusBreakdown.FAILED || 0,
      encryptionCount: encryption.total || 0,
      signatureVerified: signature.breakdown.VERIFIED || 0,
      distributionDownloaded: distribution.breakdown.DOWNLOADED || 0,
    };
  }, [overview]);

  // Prepare chart data
  const statusChartData = useMemo(() => {
    if (!overview || !overview.statusBreakdown) return [];

    const statusMap = {
      DRAFT: "Draft",
      PENDING: "Pending",
      GENERATED: "Generated",
      ENCRYPTED: "Encrypted",
      SIGNED: "Signed",
      VALIDATED: "Validated",
      DOWNLOADED: "Downloaded",
      FAILED: "Failed",
      REVOKED: "Revoked",
      EXPIRED: "Expired",
    };

    return Object.entries(overview.statusBreakdown)
      .map(([status, count]) => ({
        status: statusMap[status] || status,
        count,
      }))
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [overview]);

  // Prepare timeline data
  const timelineData = useMemo(() => {
    if (!timeline || !Array.isArray(timeline)) return [];
    return timeline;
  }, [timeline]);

  // Prepare recent packages
  const recentPackages = useMemo(() => {
    if (!overview || !overview.recentPackages) return [];
    return overview.recentPackages;
  }, [overview]);

  // Prepare centre stats
  const centreStats = useMemo(() => {
    if (!centres || !Array.isArray(centres)) return [];
    return centres;
  }, [centres]);

  // Prepare activity feed
  const activityFeed = useMemo(() => {
    if (!activity || !Array.isArray(activity)) return [];
    return activity;
  }, [activity]);

  // Prepare package metrics for security chart
  const securityData = useMemo(() => {
    if (!performance || !performance.securityBreakdown) return [];

    const breakdown = performance.securityBreakdown;
    return [
      { name: "High", value: breakdown.high || 0 },
      { name: "Medium", value: breakdown.medium || 0 },
      { name: "Low", value: breakdown.low || 0 },
      { name: "None", value: breakdown.none || 0 },
    ].filter((item) => item.value > 0);
  }, [performance]);

  // ============================================================
  // RENDER HELPERS
  // ============================================================

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: "#9e9e9e",
      PENDING: "#ff9800",
      GENERATED: "#2196f3",
      ENCRYPTED: "#00bcd4",
      SIGNED: "#4caf50",
      VALIDATED: "#8bc34a",
      DOWNLOADED: "#009688",
      FAILED: "#f44336",
      REVOKED: "#e91e63",
      EXPIRED: "#ff5722",
    };
    return colors[status] || "#9e9e9e";
  };

  const getStatusIcon = (status) => {
    const icons = {
      DRAFT: <FileIcon />,
      PENDING: <PendingIcon />,
      GENERATED: <FileIcon />,
      ENCRYPTED: <SecurityIcon />,
      SIGNED: <VerifiedIcon />,
      VALIDATED: <CheckCircleIcon />,
      DOWNLOADED: <DownloadIcon />,
      FAILED: <ErrorIcon />,
      REVOKED: <ErrorIcon />,
      EXPIRED: <ScheduleIcon />,
    };
    return icons[status] || <FileIcon />;
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Package Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of all examination packages and their status
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
          <Button
            variant="outlined"
            startIcon={<AssignmentIcon />}
            onClick={handleGeneratePackage}
          >
            Generate Package
          </Button>
        </Box>
      </Box>

      {/* Loading Indicator */}
      {isLoading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress />
        </Box>
      )}

      {/* Error Message */}
      {hasError && (
        <Alert
          severity="warning"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }
        >
          Some data failed to load. Please try refreshing.
          {overviewError && <div>• Overview: {overviewError.message}</div>}
          {timelineError && <div>• Timeline: {timelineError.message}</div>}
          {activityError && <div>• Activity: {activityError.message}</div>}
        </Alert>
      )}

      {/* Summary Statistics Cards */}
      {summaryStats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography color="text.secondary" variant="subtitle2">
                      Total Packages
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {summaryStats.totalPackages}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {summaryStats.totalCandidates} candidates
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 48,
                      height: 48,
                    }}
                  >
                    <FileIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography color="text.secondary" variant="subtitle2">
                      Validated
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color="success.main"
                    >
                      {summaryStats.validated}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {summaryStats.encryptionCount} encrypted
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.success.main,
                      width: 48,
                      height: 48,
                    }}
                  >
                    <CheckCircleIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography color="text.secondary" variant="subtitle2">
                      Downloaded
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color="info.main"
                    >
                      {summaryStats.distributionDownloaded}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {summaryStats.signatureVerified} verified
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.info.main,
                      width: 48,
                      height: 48,
                    }}
                  >
                    <DownloadIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography color="text.secondary" variant="subtitle2">
                      Total Size
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {summaryStats.totalFileSize}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {summaryStats.totalCandidates} candidates
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.warning.main,
                      width: 48,
                      height: 48,
                    }}
                  >
                    <StorageIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Status Breakdown Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Package Status Breakdown
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="count" fill={theme.palette.primary.main}>
                    {statusChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Timeline Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Activity Timeline
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={theme.palette.primary.main}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Security & Centre Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Security Breakdown */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Security Score Distribution
            </Typography>
            <Box
              sx={{ height: 250, display: "flex", justifyContent: "center" }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={securityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {securityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Centre Statistics */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Centre Statistics
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Centre Code</TableCell>
                    <TableCell>Centre Name</TableCell>
                    <TableCell align="right">Packages</TableCell>
                    <TableCell align="right">Candidates</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {centreStats.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary">
                          No centre data available
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    centreStats.map((centre) => (
                      <TableRow key={centre._id}>
                        <TableCell>
                          <Chip label={centre.centreCode} size="small" />
                        </TableCell>
                        <TableCell>{centre.centreName}</TableCell>
                        <TableCell align="right">
                          {centre.packageCount}
                        </TableCell>
                        <TableCell align="right">
                          {centre.totalCandidates}
                        </TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={0.5}
                            justifyContent="flex-end"
                          >
                            {Object.entries(centre.statusBreakdown || {})
                              .filter(([_, count]) => count > 0)
                              .map(([status, count]) => (
                                <Chip
                                  key={status}
                                  label={`${status}: ${count}`}
                                  size="small"
                                  sx={{
                                    bgcolor: getStatusColor(status),
                                    color: "white",
                                  }}
                                />
                              ))}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Packages & Activity Feed */}
      <Grid container spacing={3}>
        {/* Recent Packages */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Packages
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Package Code</TableCell>
                    <TableCell>Centre</TableCell>
                    <TableCell align="right">Candidates</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentPackages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary">
                          No packages generated yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentPackages.map((pkg) => (
                      <TableRow
                        key={pkg._id}
                        hover
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleViewPackage(pkg._id)}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {pkg.packageCode}
                          </Typography>
                        </TableCell>
                        <TableCell>{pkg.centreCode}</TableCell>
                        <TableCell align="right">
                          {pkg.candidateCount}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(pkg.status)}
                            label={pkg.status}
                            size="small"
                            sx={{
                              bgcolor: getStatusColor(pkg.status),
                              color: "white",
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {new Date(pkg.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Activity Feed */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Activity Feed
            </Typography>
            <Box sx={{ maxHeight: 400, overflow: "auto" }}>
              {activityFeed.length === 0 ? (
                <Typography
                  color="text.secondary"
                  align="center"
                  sx={{ py: 4 }}
                >
                  No recent activity
                </Typography>
              ) : (
                activityFeed.map((item, index) => (
                  <Box key={item.packageId || index}>
                    {index > 0 && <Divider />}
                    <Box sx={{ py: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" fontWeight="medium">
                          {item.packageCode}
                        </Typography>
                        <Chip
                          label={item.status}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(item.status),
                            color: "white",
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                          mb: 1,
                        }}
                      >
                        <Chip
                          label={`Centre: ${item.centreCode}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={`${item.candidateCount} candidates`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {item.encryptionStatus && (
                          <Chip
                            label={`🔒 ${item.encryptionStatus}`}
                            size="small"
                            variant="outlined"
                            color={
                              item.encryptionStatus === "ENCRYPTED"
                                ? "success"
                                : "default"
                            }
                          />
                        )}
                        {item.signatureStatus && (
                          <Chip
                            label={`✍️ ${item.signatureStatus}`}
                            size="small"
                            variant="outlined"
                            color={
                              item.signatureStatus === "VERIFIED"
                                ? "success"
                                : "default"
                            }
                          />
                        )}
                        {item.checksumStatus && (
                          <Chip
                            label={`✓ ${item.checksumStatus}`}
                            size="small"
                            variant="outlined"
                            color={
                              item.checksumStatus === "VERIFIED"
                                ? "success"
                                : "default"
                            }
                          />
                        )}
                        {item.distributionStatus && (
                          <Chip
                            label={`📥 ${item.distributionStatus}`}
                            size="small"
                            variant="outlined"
                            color={
                              item.distributionStatus === "DOWNLOADED"
                                ? "success"
                                : "default"
                            }
                          />
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        {new Date(item.updatedAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PackageDashboard;

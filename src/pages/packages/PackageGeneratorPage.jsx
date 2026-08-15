/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

/**
 * PackageBuilderPage
 * Main page for building CBTX packages
 *
 * Location: src/pages/package-builder/PackageBuilderPage.jsx
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Container,
  Breadcrumbs,
  Link,
  Typography,
  Paper,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop,
  TextField,
  InputAdornment,
  Chip,
  Card,
  CardContent,
  Grid,
  Stack,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  NavigateNext as NavigateNextIcon,
  Build as BuildIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Hooks
import {
  useBuildPackage,
  useRebuildPackage,
  usePackageFile,
  useDownloadPackage,
} from "../../hooks/usePackageBuilder";

// Import packages hook
import { usePackages } from "../../hooks/usePackage";

// Components
import PackageBuilderDialog from "../../components/package-builder/PackageBuilderDialog";
import PackageStatusCard from "../../components/package/PackageStatusCard";
import BuildHistoryTable from "../../components/package-builder/BuildHistoryTable";

// Types
import { FileStatus, FileStatusLabels, FileStatusColors } from "../../types/packageBuilder.types";

// Helper: Format file size
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const PackageBuilderPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [selectedPackageCode, setSelectedPackageCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Hooks for build operations
  const { buildPackage, loading: building, result: buildResult } = useBuildPackage();
  const { rebuildPackage, loading: rebuilding, result: rebuildResult } = useRebuildPackage();
  const { downloadPackage, loading: downloading } = useDownloadPackage();

  // Get package file for selected package
  const {
    data: fileRecord,
    loading: fileLoading,
    error: fileError,
    refetch: refetchFile,
  } = usePackageFile(
    selectedPackageId && selectedPackageId !== 'null' ? selectedPackageId : null,
    {
      enabled: !!selectedPackageId && selectedPackageId !== 'null' && selectedPackageId !== null,
    }
  );

  // ✅ Memoize filter params to prevent infinite re-renders
  const packageParams = useMemo(() => ({
    page: 1,
    limit: 100,
    search: searchQuery || undefined,
  }), [searchQuery]);

  // Get packages with memoized params
  const {
    data: packagesData,
    loading: packagesLoading,
    error: packagesError,
    refetch: refetchPackages,
  } = usePackages(packageParams);

  const packages = packagesData?.data || [];

  // ============================================================
  // ✅ HELPER FUNCTIONS (defined first)
  // ============================================================

  // ✅ Determine file status from package data
  const getPackageFileStatus = useCallback((pkg) => {
    // Check if package has file status
    if (pkg.fileStatus) {
      return pkg.fileStatus;
    }
    
    // Check if package has a file record
    if (pkg.fileRecord) {
      return pkg.fileRecord.status || FileStatus.CREATED;
    }
    
    // Check package status
    if (pkg.status === 'VALIDATED' || pkg.status === 'DOWNLOADED') {
      return FileStatus.CREATED;
    }
    if (pkg.status === 'BUILDING') {
      return FileStatus.BUILDING;
    }
    if (pkg.status === 'FAILED') {
      return FileStatus.FAILED;
    }
    
    return FileStatus.PENDING;
  }, []);

  const getStatusChip = useCallback((status) => {
    const label = FileStatusLabels[status] || status;
    const color = FileStatusColors[status] || "#9e9e9e";

    let icon = null;
    if (status === FileStatus.CREATED) icon = <CheckCircleIcon />;
    else if (status === FileStatus.FAILED) icon = <ErrorIcon />;
    else if (status === FileStatus.BUILDING) icon = <PendingIcon />;

    return (
      <Chip
        icon={icon}
        label={label}
        size="small"
        sx={{
          bgcolor: color,
          color: "white",
          "& .MuiChip-icon": { color: "white" },
        }}
      />
    );
  }, []);

  // ✅ Check if package can be built
  const canBuildPackage = useCallback((pkg) => {
    const status = getPackageFileStatus(pkg);
    return status !== FileStatus.CREATED && 
           status !== FileStatus.BUILDING &&
           pkg.status !== 'FAILED';
  }, [getPackageFileStatus]);

  // ✅ Check if package can be rebuilt
  const canRebuildPackage = useCallback((pkg) => {
    const status = getPackageFileStatus(pkg);
    return status === FileStatus.CREATED || status === FileStatus.FAILED;
  }, [getPackageFileStatus]);

  // ✅ Check if package can be downloaded
  const canDownloadPackage = useCallback((pkg) => {
    const status = getPackageFileStatus(pkg);
    return status === FileStatus.CREATED;
  }, [getPackageFileStatus]);

  // ============================================================
  // ✅ SNACKBAR FUNCTIONS (defined before being used)
  // ============================================================

  const showSnackbar = useCallback((message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar({ open: false, message: "", severity: "info" });
  }, []);

  // ============================================================
  // ✅ HANDLERS (defined after showSnackbar)
  // ============================================================

  const handleOpenDialog = useCallback((packageId, packageCode) => {
    if (!packageId || packageId === 'null') {
      showSnackbar('Invalid package selected', 'error');
      return;
    }
    setSelectedPackageId(packageId);
    setSelectedPackageCode(packageCode);
    setDialogOpen(true);
  }, [showSnackbar]);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    if (selectedPackageId && selectedPackageId !== 'null') {
      refetchFile();
    }
    refetchPackages();
  }, [selectedPackageId, refetchFile, refetchPackages]);

  const handleBuild = useCallback(async (packageId) => {
    if (!packageId || packageId === 'null') {
      showSnackbar('Invalid package selected', 'error');
      return;
    }
    try {
      await buildPackage(packageId);
      await refetchFile();
      refetchPackages();
      showSnackbar("Package built successfully!", "success");
    } catch (error) {
      showSnackbar(error.message || "Failed to build package", "error");
    }
  }, [buildPackage, refetchFile, refetchPackages, showSnackbar]);

  const handleRebuild = useCallback(async (packageId) => {
    if (!packageId || packageId === 'null') {
      showSnackbar('Invalid package selected', 'error');
      return;
    }
    try {
      await rebuildPackage(packageId);
      await refetchFile();
      refetchPackages();
      showSnackbar("Package rebuilt successfully!", "success");
    } catch (error) {
      showSnackbar(error.message || "Failed to rebuild package", "error");
    }
  }, [rebuildPackage, refetchFile, refetchPackages, showSnackbar]);

  const handleDownload = useCallback(async (packageId, fileName) => {
    if (!packageId || packageId === 'null') {
      showSnackbar('Invalid package selected', 'error');
      return;
    }
    try {
      await downloadPackage(packageId, fileName);
      showSnackbar("Package downloaded successfully!", "success");
    } catch (error) {
      showSnackbar(error.message || "Failed to download package", "error");
    }
  }, [downloadPackage, showSnackbar]);

  const handleViewPackage = useCallback((packageId) => {
    navigate(`/packages/${packageId}`);
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    if (selectedPackageId && selectedPackageId !== 'null') {
      refetchFile();
    }
    refetchPackages();
    showSnackbar("Refreshed successfully", "success");
  }, [selectedPackageId, refetchFile, refetchPackages, showSnackbar]);

  // ============================================================
  // ✅ STATISTICS
  // ============================================================

  const stats = useMemo(() => {
    const total = packages.length;
    const built = packages.filter(p => getPackageFileStatus(p) === FileStatus.CREATED).length;
    const pending = packages.filter(p => getPackageFileStatus(p) === FileStatus.PENDING).length;
    const building = packages.filter(p => getPackageFileStatus(p) === FileStatus.BUILDING).length;
    const failed = packages.filter(p => getPackageFileStatus(p) === FileStatus.FAILED).length;
    
    return { total, built, pending, building, failed };
  }, [packages, getPackageFileStatus]);

  // ============================================================
  // ✅ RENDER
  // ============================================================

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3 }}
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
        <Typography color="text.primary">Package Builder</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Package Builder
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Build CBTX packages from validated examination packages
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={packagesLoading}
        >
          Refresh
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Total Packages
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Built
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats.built}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Building
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {stats.building}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Pending
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {stats.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Failed
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {stats.failed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search packages by code, exam name, or centre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Package List */}
      <Paper sx={{ overflow: "hidden" }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6">Packages Ready for Build</Typography>
        </Box>

        {packagesLoading && packages.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading packages...</Typography>
          </Box>
        ) : packages.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              {searchQuery ? "No packages match your search" : "No packages ready for build"}
            </Typography>
          </Box>
        ) : (
          packages.map((pkg) => {
            const fileStatus = getPackageFileStatus(pkg);
            const canBuild = canBuildPackage(pkg);
            const canRebuild = canRebuildPackage(pkg);
            const canDownload = canDownloadPackage(pkg);
            
            return (
              <Box
                key={pkg._id}
                sx={{
                  p: 2,
                  borderBottom: 1,
                  borderColor: "divider",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" fontWeight="medium">
                      {pkg.packageCode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {pkg.examInfo?.examName || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Centre: {pkg.centreCode} | v{pkg.packageVersion || 1}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="body2" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body2">
                      {new Date(pkg.createdAt || pkg.generationTiming?.completedAt).toLocaleDateString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    {getStatusChip(fileStatus)}
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="body2" color="text.secondary">
                      Size
                    </Typography>
                    <Typography variant="body2">
                      {pkg.packageSize ? formatFileSize(pkg.packageSize) : "N/A"}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Actions
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Package">
                        <IconButton
                          size="small"
                          onClick={() => handleViewPackage(pkg._id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {canBuild && (
                        <Tooltip title="Build Package">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDialog(pkg._id, pkg.packageCode)}
                          >
                            <BuildIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {canDownload && (
                        <Tooltip title="Download Package">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleDownload(pkg._id, pkg.packageCode + '.cbtx')}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            );
          })
        )}
      </Paper>

      {/* Build Dialog */}
      <PackageBuilderDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        packageId={selectedPackageId}
        packageCode={selectedPackageCode}
        onBuild={handleBuild}
        onRebuild={handleRebuild}
        onDownload={handleDownload}
        building={building}
        rebuilding={rebuilding}
        downloading={downloading}
        fileRecord={fileRecord}
        buildResult={buildResult || rebuildResult}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Backdrop for loading */}
      <Backdrop
        open={building || rebuilding || downloading}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box sx={{ textAlign: "center", color: "white" }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>
            {building ? "Building package..." : rebuilding ? "Rebuilding package..." : "Downloading..."}
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default PackageBuilderPage;
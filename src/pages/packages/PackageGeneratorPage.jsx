/* eslint-disable no-unused-vars */
/**
 * PackageBuilderPage
 * Main page for building CBTX packages
 *
 * Location: src/pages/package-builder/PackageBuilderPage.jsx
 */

import React, { useState, useCallback } from "react";
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

// Components
import PackageBuilderDialog from "../../components/package-builder/PackageBuilderDialog";
import PackageStatusCard from "../../components/package-builder/PackageStatusCard";
import BuildHistoryTable from "../../components/package-Builder/BuildHistoryTable";

// Types
import { FileStatus, FileStatusLabels, FileStatusColors } from "../../types/packageBuilder.types";

const PackageBuilderPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [selectedPackageId, setSelectedPackageId] = useState(null);
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
  } = usePackageFile(selectedPackageId, {
    enabled: !!selectedPackageId,
  });

  // Handlers
  const handleOpenDialog = (packageId) => {
    setSelectedPackageId(packageId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPackageId(null);
  };

  const handleBuild = async (packageId) => {
    try {
      await buildPackage(packageId);
      await refetchFile();
      showSnackbar("Package built successfully!", "success");
    } catch (error) {
      showSnackbar(error.message || "Failed to build package", "error");
    }
  };

  const handleRebuild = async (packageId) => {
    try {
      await rebuildPackage(packageId);
      await refetchFile();
      showSnackbar("Package rebuilt successfully!", "success");
    } catch (error) {
      showSnackbar(error.message || "Failed to rebuild package", "error");
    }
  };

  const handleDownload = async (packageId, fileName) => {
    try {
      await downloadPackage(packageId, fileName);
      showSnackbar("Package downloaded successfully!", "success");
    } catch (error) {
      showSnackbar(error.message || "Failed to download package", "error");
    }
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "info" });
  };

  // Navigate to package details
  const handleViewPackage = (packageId) => {
    navigate(`/packages/${packageId}`);
  };

  // Mock data for demonstration - replace with actual data from API
  const packages = [
    {
      id: "1",
      packageCode: "PROMO-2027-ABJ001-V1",
      examName: "Promotion Examination 2027",
      centreCode: "ABJ001",
      status: "VALIDATED",
      createdAt: "2026-08-01T21:14:01.468Z",
      fileStatus: FileStatus.CREATED,
      fileSize: "2.4 MB",
      version: 1,
    },
    {
      id: "2",
      packageCode: "PROMO-2027-LAG002-V1",
      examName: "Promotion Examination 2027",
      centreCode: "LAG002",
      status: "VALIDATED",
      createdAt: "2026-08-02T10:30:00.000Z",
      fileStatus: FileStatus.PENDING,
      fileSize: null,
      version: 1,
    },
  ];

  const getStatusChip = (status) => {
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
  };

  // Filter packages
  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.packageCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.examName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.centreCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          onClick={() => {
            // Refresh logic
            showSnackbar("Refreshed successfully", "success");
          }}
        >
          Refresh
        </Button>
      </Box>

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

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Total Packages
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {packages.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Built
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {packages.filter((p) => p.fileStatus === FileStatus.CREATED).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Pending
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {packages.filter((p) => p.fileStatus === FileStatus.PENDING).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Failed
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {packages.filter((p) => p.fileStatus === FileStatus.FAILED).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Package List */}
      <Paper sx={{ overflow: "hidden" }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6">Packages Ready for Build</Typography>
        </Box>

        {filteredPackages.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              {searchQuery ? "No packages match your search" : "No packages ready for build"}
            </Typography>
          </Box>
        ) : (
          filteredPackages.map((pkg) => (
            <Box
              key={pkg.id}
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
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" fontWeight="medium">
                    {pkg.packageCode}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {pkg.examName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Centre: {pkg.centreCode} | v{pkg.version}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="text.secondary">
                    Created
                  </Typography>
                  <Typography variant="body2">
                    {new Date(pkg.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  {getStatusChip(pkg.fileStatus)}
                </Grid>

                <Grid item xs={12} md={2}>
                  <Typography variant="body2" color="text.secondary">
                    Size
                  </Typography>
                  <Typography variant="body2">{pkg.fileSize || "N/A"}</Typography>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<BuildIcon />}
                      onClick={() => handleOpenDialog(pkg.id)}
                    >
                      Build
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => handleViewPackage(pkg.id)}
                    >
                      View
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          ))
        )}
      </Paper>

      {/* Build Dialog */}
      <PackageBuilderDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        packageId={selectedPackageId}
        packageCode={packages.find((p) => p.id === selectedPackageId)?.packageCode}
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
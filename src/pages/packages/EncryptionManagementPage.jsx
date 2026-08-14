
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/**
 * EncryptionManagementPage
 * Main page for managing package encryption
 *
 * Location: src/pages/encryption/EncryptionManagementPage.jsx
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
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Visibility as VisibilityIcon,
  Replay as ReplayIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Hooks
import {
  useEncryptionStatus,
  useEncryptPackage,
  useReEncryptPackage,
  useDecryptAsset,
} from "../../hooks/useEncryption";

// Import packages hook
import { usePackages } from "../../hooks/usePackage";

// Components
import EncryptionStatusCard from "../../components/encryption/EncryptionStatusCard";
import EncryptionDialog from "../../components/encryption/EncryptionDialog";

// Types
import {
  EncryptionStatus,
  EncryptionStatusLabels,
  EncryptionStatusColors,
} from "../../types/encryption.types";

// Helper: Format file size
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const EncryptionManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [selectedPackageCode, setSelectedPackageCode] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("encrypt"); // encrypt, re-encrypt, decrypt
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Hooks for encryption operations
  const {
    encryptPackage,
    loading: encrypting,
    result: encryptResult,
  } = useEncryptPackage();
  const {
    reEncryptPackage,
    loading: reEncrypting,
    result: reEncryptResult,
  } = useReEncryptPackage();
  const {
    decryptAsset,
    loading: decrypting,
    result: decryptResult,
  } = useDecryptAsset();

  // ✅ Only enable when selectedPackageId is a valid non-null value
  const {
    data: encryptionStatus,
    loading: statusLoading,
    error: statusError,
    refetch: refetchStatus,
    startPolling,
    stopPolling,
    isPolling,
  } = useEncryptionStatus(
    selectedPackageId && selectedPackageId !== "null"
      ? selectedPackageId
      : null,
    {
      enabled:
        !!selectedPackageId &&
        selectedPackageId !== "null" &&
        selectedPackageId !== null,
      autoPoll: false,
    },
  );

  // ✅ Memoize filter params to prevent infinite re-renders
  const packageParams = useMemo(
    () => ({
      page: 1,
      limit: 100,
      search: searchQuery || undefined,
    }),
    [searchQuery],
  );

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

  // ✅ Determine encryption status from package data
  const getPackageEncryptionStatus = useCallback((pkg) => {
    if (pkg.encryptionStatus) {
      return pkg.encryptionStatus;
    }
    if (pkg.status === "ENCRYPTED") {
      return EncryptionStatus.ENCRYPTED;
    }
    if (pkg.status === "ENCRYPTING") {
      return EncryptionStatus.ENCRYPTING;
    }
    if (pkg.status === "FAILED") {
      return EncryptionStatus.FAILED;
    }
    if (pkg.status === "GENERATED" || pkg.status === "READY_FOR_ENCRYPTION") {
      return EncryptionStatus.PENDING;
    }
    return EncryptionStatus.PENDING;
  }, []);

  const getEncryptionStatusChip = useCallback((status) => {
    const label = EncryptionStatusLabels[status] || status;
    const color = EncryptionStatusColors[status] || "#9e9e9e";

    let icon = null;
    if (status === EncryptionStatus.ENCRYPTED) icon = <LockIcon />;
    else if (status === EncryptionStatus.PENDING) icon = <PendingIcon />;
    else if (status === EncryptionStatus.FAILED) icon = <ErrorIcon />;
    else if (status === EncryptionStatus.DECRYPTED) icon = <LockOpenIcon />;
    else if (status === EncryptionStatus.ENCRYPTING) icon = <PendingIcon />;

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

  // ✅ Check if package can be encrypted
  const canEncryptPackage = useCallback(
    (pkg) => {
      const status = getPackageEncryptionStatus(pkg);
      return (
        status !== EncryptionStatus.ENCRYPTED &&
        status !== EncryptionStatus.ENCRYPTING &&
        pkg.status !== "FAILED"
      );
    },
    [getPackageEncryptionStatus],
  );

  // ✅ Check if package can be re-encrypted
  const canReEncryptPackage = useCallback(
    (pkg) => {
      const status = getPackageEncryptionStatus(pkg);
      return status === EncryptionStatus.ENCRYPTED;
    },
    [getPackageEncryptionStatus],
  );

  // ✅ Check if package can be decrypted
  const canDecryptPackage = useCallback(
    (pkg) => {
      const status = getPackageEncryptionStatus(pkg);
      return status === EncryptionStatus.ENCRYPTED;
    },
    [getPackageEncryptionStatus],
  );

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

  const handleOpenDialog = useCallback(
    (packageId, packageCode, mode) => {
      if (!packageId || packageId === "null") {
        showSnackbar("Invalid package selected", "error");
        return;
      }
      setSelectedPackageId(packageId);
      setSelectedPackageCode(packageCode);
      setDialogMode(mode);
      setDialogOpen(true);
      if (mode === "encrypt" || mode === "re-encrypt") {
        startPolling(3000);
      }
    },
    [startPolling, showSnackbar],
  );

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    stopPolling();
    if (selectedPackageId && selectedPackageId !== "null") {
      refetchStatus();
    }
    refetchPackages();
  }, [selectedPackageId, refetchStatus, refetchPackages, stopPolling]);

  const handleEncrypt = useCallback(
    async (packageId) => {
      if (!packageId || packageId === "null") {
        showSnackbar("Invalid package selected", "error");
        return;
      }
      try {
        await encryptPackage(packageId);
        showSnackbar("Package encrypted successfully!", "success");
        refetchStatus();
        refetchPackages();
      } catch (error) {
        showSnackbar(error.message || "Failed to encrypt package", "error");
      }
    },
    [encryptPackage, refetchStatus, refetchPackages, showSnackbar],
  );

  const handleReEncrypt = useCallback(
    async (packageId) => {
      if (!packageId || packageId === "null") {
        showSnackbar("Invalid package selected", "error");
        return;
      }
      try {
        await reEncryptPackage(packageId);
        showSnackbar("Package re-encrypted successfully!", "success");
        refetchStatus();
        refetchPackages();
      } catch (error) {
        showSnackbar(error.message || "Failed to re-encrypt package", "error");
      }
    },
    [reEncryptPackage, refetchStatus, refetchPackages, showSnackbar],
  );

  const handleDecrypt = useCallback(
    async (packageId, assetType) => {
      if (!packageId || packageId === "null") {
        showSnackbar("Invalid package selected", "error");
        return;
      }
      try {
        await decryptAsset(packageId, assetType);
        showSnackbar("Asset decrypted successfully!", "success");
      } catch (error) {
        showSnackbar(error.message || "Failed to decrypt asset", "error");
      }
    },
    [decryptAsset, showSnackbar],
  );

  const handleViewPackage = useCallback(
    (packageId) => {
      navigate(`/packages/${packageId}`);
    },
    [navigate],
  );

  const handleRefresh = useCallback(() => {
    if (selectedPackageId && selectedPackageId !== "null") {
      refetchStatus();
    }
    refetchPackages();
    showSnackbar("Refreshed successfully", "success");
  }, [selectedPackageId, refetchStatus, refetchPackages, showSnackbar]);

  const handleCheckStatus = useCallback(
    (packageId, packageCode) => {
      if (!packageId || packageId === "null") {
        showSnackbar("Invalid package selected", "error");
        return;
      }
      setSelectedPackageId(packageId);
      setSelectedPackageCode(packageCode);
    },
    [refetchStatus, showSnackbar],
  );

  // ============================================================
  // ✅ STATISTICS
  // ============================================================

  const stats = useMemo(() => {
    const total = packages.length;
    const encrypted = packages.filter(
      (p) =>
        getPackageEncryptionStatus(p) === EncryptionStatus.ENCRYPTED ||
        p.status === "ENCRYPTED",
    ).length;
    const pending = packages.filter(
      (p) =>
        getPackageEncryptionStatus(p) === EncryptionStatus.PENDING ||
        p.status === "GENERATED" ||
        p.status === "READY_FOR_ENCRYPTION",
    ).length;
    const failed = packages.filter(
      (p) =>
        getPackageEncryptionStatus(p) === EncryptionStatus.FAILED ||
        p.status === "FAILED",
    ).length;

    return { total, encrypted, pending, failed };
  }, [packages, getPackageEncryptionStatus]);

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
        <Typography color="text.primary">Encryption Management</Typography>
      </Breadcrumbs>

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
            Encryption Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage encryption for examination packages using AES-256-GCM
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
        <Grid item xs={12} sm={6} md={3}>
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
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2">
                Encrypted
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {stats.encrypted}
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
                {stats.pending}
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
          <Typography variant="h6">Packages</Typography>
        </Box>

        {packagesLoading && packages.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading packages...</Typography>
          </Box>
        ) : packages.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              {searchQuery
                ? "No packages match your search"
                : "No packages found"}
            </Typography>
          </Box>
        ) : (
          packages.map((pkg) => {
            const encStatus = getPackageEncryptionStatus(pkg);
            const canEncrypt = canEncryptPackage(pkg);
            const canReEncrypt = canReEncryptPackage(pkg);
            const canDecrypt = canDecryptPackage(pkg);

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
                      {pkg.examInfo?.examName || "N/A"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Centre: {pkg.centreCode}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="body2" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body2">
                      {new Date(
                        pkg.createdAt || pkg.generationTiming?.completedAt,
                      ).toLocaleDateString()}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Typography variant="body2" color="text.secondary">
                      Encryption Status
                    </Typography>
                    {getEncryptionStatusChip(encStatus)}
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

                      {canEncrypt && (
                        <Tooltip title="Encrypt Package">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              handleOpenDialog(
                                pkg._id,
                                pkg.packageCode,
                                "encrypt",
                              )
                            }
                          >
                            <LockIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {canReEncrypt && (
                        <Tooltip title="Re-encrypt (Key Rotation)">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() =>
                              handleOpenDialog(
                                pkg._id,
                                pkg.packageCode,
                                "re-encrypt",
                              )
                            }
                          >
                            <ReplayIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {canDecrypt && (
                        <Tooltip title="Decrypt Asset">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() =>
                              handleOpenDialog(
                                pkg._id,
                                pkg.packageCode,
                                "decrypt",
                              )
                            }
                          >
                            <LockOpenIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        handleCheckStatus(pkg._id, pkg.packageCode)
                      }
                      disabled={!pkg._id || pkg._id === "null"}
                    >
                      Check Status
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            );
          })
        )}
      </Paper>

      {/* Encryption Status Card (when package selected) */}
      {selectedPackageId && selectedPackageId !== "null" && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Encryption Details: {selectedPackageCode}
          </Typography>
          <EncryptionStatusCard
            status={encryptionStatus}
            loading={statusLoading}
            onRefresh={refetchStatus}
            onEncrypt={() =>
              handleOpenDialog(
                selectedPackageId,
                selectedPackageCode,
                "encrypt",
              )
            }
            onReEncrypt={() =>
              handleOpenDialog(
                selectedPackageId,
                selectedPackageCode,
                "re-encrypt",
              )
            }
            onDecryptAsset={() =>
              handleOpenDialog(
                selectedPackageId,
                selectedPackageCode,
                "decrypt",
              )
            }
            canEncrypt={encryptionStatus?.status !== EncryptionStatus.ENCRYPTED}
            canReEncrypt={
              encryptionStatus?.status === EncryptionStatus.ENCRYPTED
            }
            canDecrypt={encryptionStatus?.status === EncryptionStatus.ENCRYPTED}
          />
        </Box>
      )}

      {/* Encryption Dialog */}
      <EncryptionDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        packageId={selectedPackageId}
        packageCode={selectedPackageCode}
        encryptionStatus={encryptionStatus}
        onEncrypt={handleEncrypt}
        onReEncrypt={handleReEncrypt}
        onDecrypt={handleDecrypt}
        loading={encrypting || reEncrypting || decrypting}
        error={null}
        result={encryptResult || reEncryptResult || decryptResult}
        mode={dialogMode}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Backdrop for loading */}
      <Backdrop
        open={encrypting || reEncrypting || decrypting}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Box sx={{ textAlign: "center", color: "white" }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>
            {encrypting
              ? "Encrypting package..."
              : reEncrypting
                ? "Re-encrypting package..."
                : decrypting
                  ? "Decrypting asset..."
                  : "Processing..."}
          </Typography>
        </Box>
      </Backdrop>
    </Container>
  );
};

export default EncryptionManagementPage;

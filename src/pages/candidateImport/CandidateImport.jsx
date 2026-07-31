/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * Candidate Import Page
 * Main page for importing candidates
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  CircularProgress,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import { ArrowBack as BackIcon } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import AppPageHeader from "../../components/common/AppPageHeader";
import ExaminationSelector from "../../components/candidateImport/ExaminationSelector";
import ImportTemplateCard from "../../components/candidateImport/ImportTemplateCard";
import CandidateUploadArea from "../../components/candidateImport/CandidateUploadArea";
import ImportPreviewTable from "../../components/candidateImport/ImportPreviewTable";
import ImportValidationSummary from "../../components/candidateImport/ImportValidationSummary";
import ImportErrorTable from "../../components/candidateImport/ImportErrorTable";
import ImportSummaryCards from "../../components/candidateImport/ImportSummaryCards";
import ImportHistoryTable from "../../components/candidateImport/ImportHistoryTable";
import ImportFilters from "../../components/candidateImport/ImportFilters";
import CandidateImportStepper from "../../components/candidateImport/CandidateImportStepper";
import * as candidateImportService from "../../services/candidateImport/candidateImportService";
import * as examinationService from "../../services/examination/examinationService";

// Helper function to get user role
const getUserRole = (user) => {
  if (!user) return "GUEST";
  if (typeof user.role === "string") return user.role;
  if (user.role && typeof user.role === "object" && user.role.name) {
    return user.role.name;
  }
  if (user.role && typeof user.role === "object" && user.role.role) {
    return user.role.role;
  }
  return "USER";
};

const CandidateImport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  // Permissions - allow all admin roles
  const canImport = [
    "SUPER_ADMIN",
    "TECH_ADMIN",
    "EXAM_MANAGER",
    "ADMIN",
  ].includes(userRole);

  // State - Step Management
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  // State - Examination
  const [examinations, setExaminations] = useState([]);
  const [selectedExamination, setSelectedExamination] = useState(null);
  const [loadingExams, setLoadingExams] = useState(true);

  // State - File Upload
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // State - Preview & Validation
  const [previewData, setPreviewData] = useState([]);
  const [validation, setValidation] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // State - Import Result
  const [importResult, setImportResult] = useState(null);

  // State - History
  const [historyData, setHistoryData] = useState([]);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyPage, setHistoryPage] = useState(0);
  const [historyLimit, setHistoryLimit] = useState(20);
  const [historyFilters, setHistoryFilters] = useState({});
  const [loadingHistory, setLoadingHistory] = useState(false);

  // State - UI
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load examinations - FIXED
  useEffect(() => {
    const loadExaminations = async () => {
      setLoadingExams(true);
      try {
        // Use the service correctly
        const response = await examinationService.getExaminations({
          limit: 100,
          includeArchived: true,
        });
        console.log("📋 Loaded examinations:", response);

        // Handle different response formats
        if (response && response.success) {
          setExaminations(response.data || []);
        } else if (response && response.data) {
          setExaminations(response.data || []);
        } else {
          setExaminations([]);
        }
      } catch (err) {
        console.error("❌ Failed to load examinations:", err);
        setToast({
          open: true,
          message: err.message || "Failed to load examinations",
          severity: "error",
        });
        setExaminations([]);
      } finally {
        setLoadingExams(false);
      }
    };
    loadExaminations();
  }, []);

  // Load import history
  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const params = {
        page: historyPage + 1,
        limit: historyLimit,
        ...historyFilters,
      };
      const response = await candidateImportService.getImportHistory(params);
      console.log("📋 History response:", response);

      // Handle the response format: { success: true, message: "...", data: [], meta: { total, page, pages, limit } }
      if (response && response.success) {
        setHistoryData(response.data || []);
        setHistoryTotal(response.meta?.total || 0);
      } else {
        setHistoryData([]);
        setHistoryTotal(0);
      }
    } catch (err) {
      console.error("❌ Failed to load import history:", err);
      setToast({
        open: true,
        message: err.message || "Failed to load import history",
        severity: "error",
      });
    } finally {
      setLoadingHistory(false);
    }
  }, [historyPage, historyLimit, historyFilters]);

  useEffect(() => {
    if (tab === 1) {
      loadHistory();
    }
  }, [tab, loadHistory]);

// Handle file upload - FIXED
const handleFileUpload = async (uploadedFile) => {
  if (!selectedExamination) {
    setToast({
      open: true,
      message: "Please select an examination first",
      severity: "warning",
    });
    return;
  }

  console.log('📄 Uploading file:', {
    name: uploadedFile.name,
    size: uploadedFile.size,
    type: uploadedFile.type,
  });

  setFile(uploadedFile);
  setError(null);
  setUploading(true);
  setUploadProgress(0);

  const formData = new FormData();
  // The field name MUST be 'file' to match multer configuration
  formData.append("file", uploadedFile);

  // Log FormData contents for debugging
  console.log('📋 FormData contents:');
  for (let pair of formData.entries()) {
    if (pair[1] instanceof File) {
      console.log(`  ${pair[0]}: ${pair[1].name} (${pair[1].size} bytes, ${pair[1].type})`);
    } else {
      console.log(`  ${pair[0]}: ${pair[1]}`);
    }
  }

  try {
    const response = await candidateImportService.uploadCandidateFile(
      selectedExamination._id,
      formData,
      (progress) => {
        setUploadProgress(progress);
      }
    );

    console.log('✅ Upload response:', response);

    if (response && response.success && response.data) {
      const { fileId, fileName, totalRecords } = response.data;

      console.log('📋 File ID received:', fileId);

      setFileId(fileId);
      setUploadProgress(100);
      setToast({
        open: true,
        message: `File uploaded successfully! ${totalRecords || 0} records found.`,
        severity: "success",
      });

      // Move to validation step (Step 3)
      setActiveStep(3);
    } else {
      throw new Error(response?.message || "Upload failed");
    }
  } catch (err) {
    console.error("❌ Upload error:", err);
    const errorMessage = err.message || err.msg || "Failed to upload file";
    setError(errorMessage);
    setToast({
      open: true,
      message: errorMessage,
      severity: "error",
    });
    setFile(null);
    setFileId(null);
  } finally {
    setUploading(false);
  }
};

  // Handle validation
  const handleValidate = async () => {
    if (!fileId || fileId === "null" || fileId === "undefined") {
      setToast({
        open: true,
        message: "No file uploaded. Please upload a file first.",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log("🔍 Validating file:", {
        examinationId: selectedExamination._id,
        fileId: fileId,
      });

      const response = await candidateImportService.validateImport(
        selectedExamination._id,
        fileId,
      );

      console.log("✅ Validation response:", response);

      if (response && response.success && response.data) {
        const data = response.data;

        setValidation(data);
        setErrors(data.errors || []);
        setPreviewData(data.preview || []);

        setToast({
          open: true,
          message:
            data.invalidRecords === 0
              ? "✅ All records are valid!"
              : `⚠️ Validation completed with ${data.invalidRecords} errors`,
          severity: data.invalidRecords === 0 ? "success" : "warning",
        });

        // Move to preview step (Step 4)
        setActiveStep(4);
      } else {
        throw new Error(response?.message || "Validation failed");
      }
    } catch (err) {
      console.error("❌ Validation error:", err);
      const errorMessage = err.message || err.msg || "Failed to validate";
      setError(errorMessage);
      setToast({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle commit import
  const handleCommit = async () => {
    if (!fileId || fileId === "null" || fileId === "undefined") {
      setToast({
        open: true,
        message: "No file to commit. Please upload a file first.",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log("📥 Committing import:", {
        examinationId: selectedExamination._id,
        fileId: fileId,
      });

      const response = await candidateImportService.commitImport(
        selectedExamination._id,
        fileId,
        { skipDuplicates: true },
      );

      console.log("✅ Commit response:", response);

      if (response && response.success && response.data) {
        setImportResult(response.data);
        setCompleted(true);
        setActiveStep(5);
        setToast({
          open: true,
          message: `✅ ${response.data.successfulRecords || 0} candidates imported successfully!`,
          severity: "success",
        });
      } else {
        throw new Error(response?.message || "Commit failed");
      }
    } catch (err) {
      console.error("❌ Commit error:", err);
      const errorMessage = err.message || err.msg || "Failed to import";
      setError(errorMessage);
      setToast({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    setActiveStep(0);
    setCompleted(false);
    setFile(null);
    setFileId(null);
    setUploadProgress(0);
    setPreviewData([]);
    setValidation(null);
    setErrors([]);
    setImportResult(null);
    setError(null);
    setSelectedExamination(null);
  };

  // Handle download template
  const handleDownloadTemplate = async (format) => {
    if (!selectedExamination) {
      setToast({
        open: true,
        message: "Please select an examination first",
        severity: "warning",
      });
      return;
    }
    try {
      const blob = await candidateImportService.downloadTemplate(
        selectedExamination._id,
        format,
      );
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `candidate_template_${selectedExamination.code}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setToast({
        open: true,
        message: "Template downloaded successfully",
        severity: "success",
      });
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Failed to download template",
        severity: "error",
      });
    }
  };

  // Handle view history details
  const handleViewHistoryDetails = (item) => {
    setToast({
      open: true,
      message: `Viewing import ${item._id}`,
      severity: "info",
    });
  };

  // Handle download error report
  const handleDownloadErrors = async (item) => {
    try {
      const blob = await candidateImportService.downloadErrorReport(item._id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `error_report_${item._id}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setToast({
        open: true,
        message: err.message || "Failed to download error report",
        severity: "error",
      });
    }
  };

  // Handle back to examinations
  const handleBack = () => {
    navigate("/examinations");
  };

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  // Step navigation
  const handleNext = () => {
    if (activeStep === 3) {
      handleValidate();
    } else if (activeStep === 4) {
      handleCommit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBackStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const getNextButtonLabel = () => {
    if (activeStep === 3) return "Validate";
    if (activeStep === 4) return "Import Candidates";
    return "Next";
  };

  const getNextButtonDisabled = () => {
    if (loading || uploading) return true;
    if (activeStep === 0 && !selectedExamination) return true;
    if (activeStep === 2 && !file) return true;
    if (activeStep === 3 && errors.length > 0) return true;
    return false;
  };

  // Render active step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <ExaminationSelector
            examinations={examinations}
            selectedExamination={selectedExamination}
            onChange={setSelectedExamination}
            loading={loadingExams}
          />
        );
      case 1:
        return (
          <ImportTemplateCard
            examination={selectedExamination}
            onDownload={handleDownloadTemplate}
          />
        );
      case 2:
        return (
          <Stack spacing={3}>
            <CandidateUploadArea
              onFileUpload={handleFileUpload}
              file={file}
              uploading={uploading}
              uploadProgress={uploadProgress}
              error={error}
              onRemoveFile={() => {
                setFile(null);
                setFileId(null);
                setUploadProgress(0);
                setError(null);
              }}
            />
            {uploadProgress === 100 && (
              <Alert severity="success">
                File uploaded successfully. Click Validate to continue.
              </Alert>
            )}
          </Stack>
        );
      case 3:
        return (
          <Stack spacing={3}>
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            )}
            {!loading && !validation && (
              <Alert severity="info">
                Click "Validate" below to check your file for errors before
                importing.
              </Alert>
            )}
            {validation && <ImportValidationSummary validation={validation} />}
            {errors.length > 0 && (
              <ImportErrorTable errors={errors} loading={loading} />
            )}
          </Stack>
        );
      case 4:
        return (
          <Stack spacing={3}>
            <ImportPreviewTable
              data={previewData}
              loading={loadingPreview}
              page={0}
              limit={20}
              total={previewData.length}
              onPageChange={() => {}}
              onLimitChange={() => {}}
            />
          </Stack>
        );
      case 5:
        return (
          <Stack spacing={3}>
            {importResult && <ImportSummaryCards summary={importResult} />}
            <Alert severity="success">Import completed successfully!</Alert>
          </Stack>
        );
      default:
        return null;
    }
  };

  // Check if user has permission
  if (!canImport) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Alert severity="error">
          You do not have permission to import candidates. Please contact your
          administrator.
        </Alert>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Your role: {userRole}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Examinations
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <AppPageHeader
        title="Candidate Import"
        subtitle="Import candidates into an examination"
        actions={
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={handleBack}
          >
            Back to Examinations
          </Button>
        }
      />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Import Candidates" />
          <Tab label="Import History" />
        </Tabs>
      </Box>

      {tab === 0 ? (
        <Grid container spacing={3}>
          {/* Left Column: Stepper */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, position: "sticky", top: 20 }}>
              <CandidateImportStepper
                activeStep={activeStep}
                completed={completed}
              />
            </Paper>
          </Grid>

          {/* Right Column: Content */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {renderStepContent()}

              {/* Navigation buttons */}
              {!completed && activeStep < 5 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  {activeStep > 0 && (
                    <Button
                      onClick={handleBackStep}
                      disabled={loading || uploading}
                      variant="outlined"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={getNextButtonDisabled()}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      getNextButtonLabel()
                    )}
                  </Button>
                </Box>
              )}

              {completed && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Button variant="outlined" onClick={handleReset}>
                    Start New Import
                  </Button>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <Stack spacing={3}>
          <ImportFilters
            filters={historyFilters}
            onFilterChange={setHistoryFilters}
            onClear={() => setHistoryFilters({})}
            examinations={examinations}
            loading={loadingHistory}
          />

          <ImportHistoryTable
            data={historyData}
            loading={loadingHistory}
            page={historyPage}
            limit={historyLimit}
            total={historyTotal}
            onPageChange={setHistoryPage}
            onLimitChange={setHistoryLimit}
            onViewDetails={handleViewHistoryDetails}
            onDownloadErrors={handleDownloadErrors}
          />
        </Stack>
      )}

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
    </Container>
  );
};

export default CandidateImport;

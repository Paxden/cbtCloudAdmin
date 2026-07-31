/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Examination Policies Page
 * Main page for managing examination policies
 */

import  { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
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
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  CheckCircle as ValidateIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import PolicySummaryCards from '../../components/examinationPolicies/PolicySummaryCards';
import PolicyStatusChip from '../../components/examinationPolicies/PolicyStatusChip';
import GeneralPolicyForm from '../../components/examinationPolicies/GeneralPolicyForm';
import NavigationPolicyForm from '../../components/examinationPolicies/NavigationPolicyForm';
import TimingPolicyForm from '../../components/examinationPolicies/TimingPolicyForm';
import SecurityPolicyForm from '../../components/examinationPolicies/SecurityPolicyForm';
import * as examinationPolicyService from '../../services/examinationPolicies/examinationPolicyService';
import * as examinationService from '../../services/examination/examinationService';

const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') {
    return user.role.name || user.role.role || 'USER';
  }
  return 'USER';
};

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'timing', label: 'Timing' },
  { id: 'security', label: 'Security' },
];

const ExaminationPolicies = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const selectedExaminationId = searchParams.get('examinationId') || '';

  const canManage = ['SUPER_ADMIN', 'TECH_ADMIN', 'EXAM_MANAGER'].includes(userRole);
  const canActivate = ['SUPER_ADMIN', 'TECH_ADMIN'].includes(userRole);

  // State
  const [examinations, setExaminations] = useState([]);
  const [examinationsLoading, setExaminationsLoading] = useState(false);
  const [policies, setPolicies] = useState(null);
  const [stats, setStats] = useState(null); // ✅ ADDED
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [validation, setValidation] = useState(null);
  const [validationLoading, setValidationLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

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
      console.error('Failed to load examinations:', err);
    } finally {
      setExaminationsLoading(false);
    }
  }, []);

  // Load policies
  const loadPolicies = useCallback(async () => {
    if (!selectedExaminationId) {
      setPolicies(null);
      setStats(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await examinationPolicyService.getPolicies(selectedExaminationId);
      console.log('📋 Policies response:', response);

      if (response && response.success) {
        setPolicies(response.data);
        // Calculate stats from the policy data
        if (response.data) {
          const policyData = response.data;
          const calculatedStats = {
            generalRules: policyData.generalRules ? Object.keys(policyData.generalRules).length : 0,
            securityRules: policyData.securityRules ? Object.keys(policyData.securityRules).length : 0,
            timingRules: policyData.timingRules ? Object.keys(policyData.timingRules).length : 0,
            navigationRules: policyData.navigationRules ? Object.keys(policyData.navigationRules).length : 0,
            restrictionRules: policyData.restrictionRules ? Object.keys(policyData.restrictionRules).length : 0,
            validationStatus: policyData.status === 'ACTIVE' ? 'valid' : 'pending',
          };
          setStats(calculatedStats);
        }
      } else {
        setPolicies(null);
        setStats(null);
      }
    } catch (err) {
      console.error('❌ Failed to load policies:', err);
      setPolicies(null);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [selectedExaminationId]);

  // Initial load
  useEffect(() => {
    loadExaminations();
  }, [loadExaminations]);

  useEffect(() => {
    if (selectedExaminationId) {
      loadPolicies();
    }
  }, [selectedExaminationId, loadPolicies]);

  // Handle examination change
  const handleExaminationChange = (examId) => {
    setSearchParams({ examinationId: examId });
    setPolicies(null);
    setStats(null);
    setValidation(null);
    setHasChanges(false);
  };

  // Handle policy change
  const handlePolicyChange = (category, values) => {
    setPolicies(prev => ({
      ...prev,
      [category]: values,
    }));
    setHasChanges(true);
  };

  // Handle save policies
  const handleSavePolicies = async () => {
    setSaving(true);
    try {
      let response;
      if (policies?._id) {
        response = await examinationPolicyService.updatePolicies(selectedExaminationId, policies);
      } else {
        response = await examinationPolicyService.createPolicies(selectedExaminationId, policies);
      }

      if (response && response.success) {
        setPolicies(response.data);
        setHasChanges(false);
        setToast({
          open: true,
          message: 'Policies saved successfully',
          severity: 'success',
        });
        // Refresh stats
        if (response.data) {
          const policyData = response.data;
          const calculatedStats = {
            generalRules: policyData.generalRules ? Object.keys(policyData.generalRules).length : 0,
            securityRules: policyData.securityRules ? Object.keys(policyData.securityRules).length : 0,
            timingRules: policyData.timingRules ? Object.keys(policyData.timingRules).length : 0,
            navigationRules: policyData.navigationRules ? Object.keys(policyData.navigationRules).length : 0,
            restrictionRules: policyData.restrictionRules ? Object.keys(policyData.restrictionRules).length : 0,
            validationStatus: policyData.status === 'ACTIVE' ? 'valid' : 'pending',
          };
          setStats(calculatedStats);
        }
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to save policies',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle validate policies
  const handleValidatePolicies = async () => {
    setValidationLoading(true);
    try {
      const response = await examinationPolicyService.validatePolicies(selectedExaminationId);
      if (response && response.success) {
        setValidation(response.data);
        setToast({
          open: true,
          message: response.data.isValid ? 'Policies are valid!' : 'Policies have validation issues',
          severity: response.data.isValid ? 'success' : 'error',
        });
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to validate policies',
        severity: 'error',
      });
    } finally {
      setValidationLoading(false);
    }
  };

  // Handle activate policies
  const handleActivatePolicies = async () => {
    if (!window.confirm('Are you sure you want to activate these policies?')) {
      return;
    }
    try {
      const response = await examinationPolicyService.activatePolicies(selectedExaminationId);
      if (response && response.success) {
        setPolicies(response.data);
        setToast({
          open: true,
          message: 'Policies activated successfully',
          severity: 'success',
        });
        loadPolicies();
      }
    } catch (err) {
      setToast({
        open: true,
        message: err.message || 'Failed to activate policies',
        severity: 'error',
      });
    }
  };

  // Handle back
  const handleBack = () => {
    if (hasChanges) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        return;
      }
    }
    navigate('/examinations');
  };

  const selectedExam = examinations.find(e => e._id === selectedExaminationId);
  const isLocked = policies?.status === 'ACTIVE' || policies?.status === 'ARCHIVED';

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Examination Policies"
        subtitle="Configure examination behaviour and security rules"
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadPolicies}
            >
              Refresh
            </Button>
            {canManage && !isLocked && (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSavePolicies}
                disabled={!hasChanges || saving}
              >
                {saving ? 'Saving...' : 'Save Policies'}
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={handleBack}
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
              <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                <Chip label={selectedExam.name} color="primary" />
                <Chip label={selectedExam.code} variant="outlined" size="small" />
                <Chip label={selectedExam.status} variant="outlined" size="small" />
                {policies && (
                  <PolicyStatusChip status={policies.status} size="medium" />
                )}
                {isLocked && (
                  <Chip
                    label="Locked"
                    color="warning"
                    size="small"
                    icon={<LockIcon />}
                  />
                )}
                {examinationsLoading && <CircularProgress size={24} />}
              </Stack>
            </Grid>
          )}
        </Grid>
      </Paper>

      {selectedExaminationId ? (
        <>
          {/* Loading State */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Summary Cards */}
              <PolicySummaryCards stats={stats} loading={loading} />

              {/* Action Buttons */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<ValidateIcon />}
                    onClick={handleValidatePolicies}
                    disabled={!policies || validationLoading}
                  >
                    {validationLoading ? 'Validating...' : 'Validate'}
                  </Button>
                  {canActivate && !isLocked && policies && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleActivatePolicies}
                    >
                      Activate Policies
                    </Button>
                  )}
                </Stack>
              </Paper>

              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                  value={currentTab}
                  onChange={(e, v) => setCurrentTab(v)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {TABS.map((tab) => (
                    <Tab key={tab.id} label={tab.label} />
                  ))}
                </Tabs>
              </Box>

              {/* Tab Content */}
              <Box sx={{ mt: 2 }}>
                {currentTab === 0 && (
                  <GeneralPolicyForm
                    policies={policies?.generalRules || {}}
                    onChange={(values) => handlePolicyChange('generalRules', values)}
                    errors={validation?.errors?.general}
                    readOnly={isLocked || !canManage}
                  />
                )}

                {currentTab === 1 && (
                  <NavigationPolicyForm
                    policies={policies?.navigationRules || {}}
                    onChange={(values) => handlePolicyChange('navigationRules', values)}
                    errors={validation?.errors?.navigation}
                    readOnly={isLocked || !canManage}
                  />
                )}

                {currentTab === 2 && (
                  <TimingPolicyForm
                    policies={policies?.timingRules || {}}
                    onChange={(values) => handlePolicyChange('timingRules', values)}
                    errors={validation?.errors?.timing}
                    readOnly={isLocked || !canManage}
                  />
                )}

                {currentTab === 3 && (
                  <SecurityPolicyForm
                    policies={policies?.securityRules || {}}
                    onChange={(values) => handlePolicyChange('securityRules', values)}
                    errors={validation?.errors?.security}
                    readOnly={isLocked || !canManage}
                  />
                )}
              </Box>

              {/* Validation Panel */}
              {validation && (
                <Paper sx={{ p: 3, mt: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Validation Results
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  {validation.isValid ? (
                    <Alert severity="success">
                      All policies are valid and ready for deployment.
                    </Alert>
                  ) : (
                    <Stack spacing={1}>
                      {validation.errors && validation.errors.length > 0 && (
                        <Alert severity="error">
                          <Typography variant="subtitle2">Errors:</Typography>
                          {validation.errors.map((error, index) => (
                            <Typography key={index} variant="body2">
                              • {error.message}
                            </Typography>
                          ))}
                        </Alert>
                      )}
                      {validation.warnings && validation.warnings.length > 0 && (
                        <Alert severity="warning">
                          <Typography variant="subtitle2">Warnings:</Typography>
                          {validation.warnings.map((warning, index) => (
                            <Typography key={index} variant="body2">
                              • {warning.message}
                            </Typography>
                          ))}
                        </Alert>
                      )}
                    </Stack>
                  )}
                </Paper>
              )}
            </>
          )}
        </>
      ) : (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Please select an examination to manage its policies.
          </Typography>
        </Box>
      )}

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default ExaminationPolicies;
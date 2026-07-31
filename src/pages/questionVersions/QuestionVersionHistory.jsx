/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * Question Version History Page
 * Main page for viewing version history and audit timeline
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Alert,
  Button,
  Typography,
  Tabs,
  Tab,
  Paper,
  Stack,
  Snackbar,
} from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import VersionStatsCards from '../../components/questionVersions/VersionStatsCards';
import VersionFilters from '../../components/questionVersions/VersionFilters';
import VersionTable from '../../components/questionVersions/VersionTable';
import VersionMetadataCard from '../../components/questionVersions/VersionMetadataCard';
import VersionComparisonView from '../../components/questionVersions/VersionComparisonView';
import AuditTimeline from '../../components/questionVersions/AuditTimeline';
import * as questionVersionService from '../../services/questionVersions/questionVersionService';
import * as questionBankService from '../../services/questionBank/questionBankService';

const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') return user.role.name || 'USER';
  return 'USER';
};

const QuestionVersionHistory = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const canView = true;

  // State
  const [question, setQuestion] = useState(null);
  const [versions, setVersions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  // Selection for comparison
  const [selectedVersions, setSelectedVersions] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);

  // Audit timeline
  const [auditEvents, setAuditEvents] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Load question data
  useEffect(() => {
    if (questionId) {
      loadQuestion();
    }
  }, [questionId]);

  const loadQuestion = async () => {
    try {
      const response = await questionBankService.getQuestion(questionId);
      if (response.success) {
        setQuestion(response.data);
      }
    } catch (error) {
      console.error('Failed to load question:', error);
    }
  };

  // Load versions
  const loadVersions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit,
        ...filters,
      };

      const response = await questionVersionService.getVersions(questionId, params);
      setVersions(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to load versions',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters, questionId]);

  // Load statistics
  const loadStats = useCallback(async () => {
    try {
      const response = await questionVersionService.getVersionStatistics(questionId);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  }, [questionId]);

  // Load audit timeline
  const loadAuditTimeline = useCallback(async () => {
    setAuditLoading(true);
    try {
      const response = await questionVersionService.getAuditTimeline(questionId, { limit: 50 });
      setAuditEvents(response.data || []);
    } catch (error) {
      console.error('Failed to load audit timeline:', error);
    } finally {
      setAuditLoading(false);
    }
  }, [questionId]);

  // Initial load
  useEffect(() => {
    loadVersions();
    loadStats();
    loadAuditTimeline();
  }, [loadVersions, loadStats, loadAuditTimeline]);

  // Handle filters
  const handleFilterChange = (newFilters) => {
    setPage(0);
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setPage(0);
    setFilters({});
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(0);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  // Handle version selection for comparison
  const handleSelectVersion = (versionNumber) => {
    setSelectedVersions((prev) => {
      if (prev.includes(versionNumber)) {
        return prev.filter((v) => v !== versionNumber);
      }
      if (prev.length >= 2) {
        return [prev[1], versionNumber];
      }
      return [...prev, versionNumber];
    });
    setComparison(null);
  };

  // Handle compare
  const handleCompare = async (versionNumber) => {
    const versionsToCompare = [...selectedVersions, versionNumber].slice(-2);
    if (versionsToCompare.length < 2) {
      setToast({
        open: true,
        message: 'Please select two versions to compare',
        severity: 'warning',
      });
      return;
    }

    setComparisonLoading(true);
    try {
      const [vA, vB] = versionsToCompare;
      const response = await questionVersionService.compareVersions(questionId, vA, vB);
      setComparison(response.data);
      setSelectedVersions(versionsToCompare);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to compare versions',
        severity: 'error',
      });
    } finally {
      setComparisonLoading(false);
    }
  };

  // Handle view version
  const handleViewVersion = (version) => {
    // Open version details in drawer or navigate
    setToast({
      open: true,
      message: `Viewing version ${version.versionNumber}`,
      severity: 'info',
    });
  };

  const handleBack = () => {
    navigate(`/question-bank`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Version History"
        subtitle={question?.questionCode || 'Question Version History'}
        actions={
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={handleBack}
          >
            Back to Question
          </Button>
        }
      />

      {/* Question Info */}
      {question && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="body2">
            <strong>Question:</strong> {question.questionText?.replace(/<[^>]*>/g, '').substring(0, 100)}...
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Code: {question.questionCode} • Current Version: {question.currentVersion || 1}
          </Typography>
        </Paper>
      )}

      {/* Stats */}
      <VersionStatsCards stats={stats} loading={loading} />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Versions" />
          <Tab label="Comparison" />
          <Tab label="Audit Timeline" />
        </Tabs>
      </Box>

      {/* Tab: Versions */}
      {tab === 0 && (
        <>
          <VersionFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
            loading={loading}
          />

          <VersionTable
            versions={versions}
            loading={loading}
            page={page}
            limit={limit}
            total={total}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            onView={handleViewVersion}
            onCompare={handleCompare}
            selectedVersions={selectedVersions}
            onSelectVersion={handleSelectVersion}
            canView={canView}
          />

          {selectedVersions.length === 1 && (
            <Paper sx={{ p: 2, mt: 2, bgcolor: 'action.hover' }}>
              <Typography variant="body2" color="textSecondary">
                {selectedVersions.length} version selected. Select another version to compare.
              </Typography>
            </Paper>
          )}

          {selectedVersions.length === 2 && !comparison && (
            <Paper sx={{ p: 2, mt: 2, bgcolor: 'action.hover' }}>
              <Typography variant="body2" color="textSecondary">
                2 versions selected. Click "Compare" on any version to view comparison.
              </Typography>
            </Paper>
          )}
        </>
      )}

      {/* Tab: Comparison */}
      {tab === 1 && (
        <VersionComparisonView
          comparison={comparison}
          loading={comparisonLoading}
        />
      )}

      {/* Tab: Audit Timeline */}
      {tab === 2 && (
        <AuditTimeline
          events={auditEvents}
          loading={auditLoading}
        />
      )}

      {/* Toast Notifications */}
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

export default QuestionVersionHistory;
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Question Approval Queue Page
 * Main page for managing question reviews with bulk actions
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import AppPageHeader from '../../components/common/AppPageHeader';
import ReviewStatsCards from '../../components/questionApproval/ReviewStatsCards';
import ReviewFilters from '../../components/questionApproval/ReviewFilters';
import ApprovalQueueTable from '../../components/questionApproval/ApprovalQueueTable';
import ReviewHistoryTimeline from '../../components/questionApproval/ReviewHistoryTimeline';
import ConfirmDialog from '../../components/dialogs/ConfirmDialog';
import * as questionApprovalService from '../../services/questionApproval/questionApprovalService';
import * as questionBankService from '../../services/questionBank/questionBankService';

// Helper function to get user role
const getUserRole = (user) => {
  if (!user) return 'GUEST';
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object') return user.role.name || 'USER';
  return 'USER';
};

const QuestionApprovalQueue = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const canApprove = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';
  const canReject = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';

  // State
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Dialog states
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  
  // Bulk action dialog
  const [bulkDialog, setBulkDialog] = useState({
    open: false,
    action: 'approve',
    count: 0,
    onConfirm: null,
  });

  // Toast notifications
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch queue
  const fetchQueue = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit,
        search: searchTerm || undefined,
        ...filters,
      };

      const response = await questionApprovalService.getReviewQueue(params);
      setQuestions(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to load review queue',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchTerm, filters]);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await questionApprovalService.getReviewStatistics();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchQueue();
    fetchStats();
  }, [fetchQueue, fetchStats]);

  // Handle filters change
  const handleFilterChange = (newFilters) => {
    setPage(0);
    setFilters(newFilters);
    setSelectedRows([]);
  };

  const handleClearFilters = () => {
    setPage(0);
    setFilters({});
    setSearchTerm('');
    setSelectedRows([]);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(0);
    setSelectedRows([]);
  };

  // Handle refresh
  const handleRefresh = () => {
    setSelectedRows([]);
    fetchQueue();
    fetchStats();
  };

  // Handle review
  const handleReview = (question) => {
    navigate(`/question-approval/review/${question._id}`);
  };

  // Handle single approve
  const handleApprove = async (question) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const response = await questionApprovalService.approveQuestion(question._id, {
        comment: 'Approved from queue',
      });
      if (response.success) {
        setToast({
          open: true,
          message: `Question ${question.questionCode} approved successfully`,
          severity: 'success',
        });
        fetchQueue();
        fetchStats();
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to approve question',
        severity: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle single reject
  const handleReject = async (question) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const response = await questionApprovalService.rejectQuestion(question._id, {
        comment: 'Rejected from queue - please review and resubmit',
      });
      if (response.success) {
        setToast({
          open: true,
          message: `Question ${question.questionCode} rejected successfully`,
          severity: 'success',
        });
        fetchQueue();
        fetchStats();
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || 'Failed to reject question',
        severity: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle bulk approve
  const handleBulkApprove = (ids) => {
    setBulkDialog({
      open: true,
      action: 'approve',
      count: ids.length,
      onConfirm: () => confirmBulkAction(ids, 'approve'),
    });
  };

  // Handle bulk reject
  const handleBulkReject = (ids) => {
    setBulkDialog({
      open: true,
      action: 'reject',
      count: ids.length,
      onConfirm: () => confirmBulkAction(ids, 'reject'),
    });
  };

  // Confirm bulk action
  const confirmBulkAction = async (ids, action) => {
    setBulkLoading(true);
    setBulkDialog({ ...bulkDialog, open: false });
    
    try {
      let response;
      if (action === 'approve') {
        response = await questionApprovalService.bulkApproveQuestions(ids, {
          comment: 'Bulk approved from queue',
        });
      } else {
        response = await questionApprovalService.bulkRejectQuestions(ids, {
          comment: 'Bulk rejected from queue',
        });
      }

      if (response.success) {
        setToast({
          open: true,
          message: `${response.data?.processed || ids.length} questions ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
          severity: 'success',
        });
        setSelectedRows([]);
        fetchQueue();
        fetchStats();
      } else {
        throw new Error(response.message || `Failed to ${action} questions`);
      }
    } catch (error) {
      setToast({
        open: true,
        message: error.message || `Failed to ${action} questions`,
        severity: 'error',
      });
    } finally {
      setBulkLoading(false);
    }
  };

  // Handle history
  const handleHistory = (question) => {
    setToast({
      open: true,
      message: `Viewing history for ${question.questionCode}`,
      severity: 'info',
    });
  };

  // Close bulk dialog
  const closeBulkDialog = () => {
    setBulkDialog({ ...bulkDialog, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <AppPageHeader
        title="Question Approval"
        subtitle="Review and manage pending questions"
        actions={
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        }
      />

      {/* Statistics Cards */}
      <ReviewStatsCards stats={stats} loading={loading} />

      {/* Search & Filters */}
      <ReviewFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
        loading={loading}
      />

      {/* Queue Table */}
      <ApprovalQueueTable
        questions={questions}
        loading={loading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onReview={handleReview}
        onApprove={handleApprove}
        onReject={handleReject}
        onHistory={handleHistory}
        onRefresh={handleRefresh}
        canApprove={canApprove}
        canReject={canReject}
        // Bulk props
        selectedRows={selectedRows}
        onSelectRows={setSelectedRows}
        onBulkApprove={handleBulkApprove}
        onBulkReject={handleBulkReject}
        bulkLoading={bulkLoading}
      />

      {/* Bulk Action Confirmation Dialog */}
      <ConfirmDialog
        open={bulkDialog.open}
        onClose={closeBulkDialog}
        onConfirm={bulkDialog.onConfirm}
        title={`Bulk ${bulkDialog.action === 'approve' ? 'Approve' : 'Reject'} Questions`}
        message={`Are you sure you want to ${bulkDialog.action} ${bulkDialog.count} question${bulkDialog.count > 1 ? 's' : ''}?`}
        confirmText={bulkDialog.action === 'approve' ? 'Approve All' : 'Reject All'}
        cancelText="Cancel"
        confirmColor={bulkDialog.action === 'approve' ? 'success' : 'error'}
        severity={bulkDialog.action === 'approve' ? 'info' : 'warning'}
        loading={bulkLoading}
      />

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

export default QuestionApprovalQueue;
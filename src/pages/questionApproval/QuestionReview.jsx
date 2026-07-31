/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
/**
 * Question Review Page
 * Review a single question with full context
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Alert,
  Button,
  Typography,
  Drawer,
  Paper,
  Stack,
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import QuestionRenderer from '../../components/questionRenderer/QuestionRenderer';
import QuestionReviewHeader from '../../components/questionApproval/QuestionReviewHeader';
import ReviewToolbar from '../../components/questionApproval/ReviewToolbar';
import ReviewCommentPanel from '../../components/questionApproval/ReviewCommentPanel';
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

const QuestionReview = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = getUserRole(user);

  const canApprove = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';
  const canReject = userRole === 'SUPER_ADMIN' || userRole === 'TECH_ADMIN';

  // State
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Dialog states
  const [showApprovePanel, setShowApprovePanel] = useState(false);
  const [showRejectPanel, setShowRejectPanel] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });
  const [actionError, setActionError] = useState(null);

  // Display options for renderer
  const [displayOptions] = useState({
    showAnswers: true,
    showExplanation: true,
    showReference: true,
    showMetadata: true,
  });

  // Load question
  useEffect(() => {
    if (questionId) {
      loadQuestion();
    }
  }, [questionId]);

  const loadQuestion = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await questionBankService.getQuestion(questionId);
      if (response.success) {
        setQuestion(response.data);
        // Load history
        loadHistory(questionId);
      } else {
        setError(response.message || 'Failed to load question');
      }
    } catch (err) {
      setError(err.message || 'Failed to load question');
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  const loadHistory = async (id) => {
    setHistoryLoading(true);
    try {
      const response = await questionApprovalService.getReviewHistory(id, { limit: 50 });
      setHistory(response.data || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/question-approval');
  };

  const handleApprove = () => {
    if (question.status === 'PENDING_REVIEW') {
      setShowApprovePanel(true);
      setShowRejectPanel(false);
      setActionError(null);
    }
  };

  const handleReject = () => {
    if (question.status === 'PENDING_REVIEW') {
      setShowRejectPanel(true);
      setShowApprovePanel(false);
      setActionError(null);
    }
  };

  const handleConfirmApprove = async (data) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const response = await questionApprovalService.approveQuestion(questionId, {
        comment: data.comment,
      });
      if (response.success) {
        setShowApprovePanel(false);
        await loadQuestion();
        // Show success toast
      }
    } catch (err) {
      setActionError(err.message || 'Failed to approve question');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReject = async (data) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const response = await questionApprovalService.rejectQuestion(questionId, {
        comment: data.comment,
        suggestions: data.suggestions,
      });
      if (response.success) {
        setShowRejectPanel(false);
        await loadQuestion();
        // Show success toast
      }
    } catch (err) {
      setActionError(err.message || 'Failed to reject question');
    } finally {
      setActionLoading(false);
    }
  };

  const handleHistory = () => {
    setShowHistoryDrawer(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={loadQuestion}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!question) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Question not found
        </Alert>
      </Box>
    );
  }

  const isPending = question.status === 'PENDING_REVIEW';

  return (
    <Box sx={{ p: 3 }}>
      {/* Toolbar */}
      <ReviewToolbar
        question={question}
        onBack={handleBack}
        onApprove={handleApprove}
        onReject={handleReject}
        onHistory={handleHistory}
        canApprove={canApprove}
        canReject={canReject}
        loading={actionLoading}
        disabled={!isPending}
      />

      {/* Header */}
      <QuestionReviewHeader question={question} loading={loading} />

      {/* Renderer */}
      <QuestionRenderer
        question={question}
        showAnswers={true}
        showExplanation={true}
        showReference={true}
        showMetadata={true}
        disabled={true}
        mode="examiner"
      />

      {/* Approve Panel (Inline) */}
      {showApprovePanel && (
        <Paper sx={{ mt: 2, border: '2px solid', borderColor: 'success.main' }}>
          <ReviewCommentPanel
            action="approve"
            onSubmit={handleConfirmApprove}
            onCancel={() => setShowApprovePanel(false)}
            loading={actionLoading}
            error={actionError}
          />
        </Paper>
      )}

      {/* Reject Panel (Inline) */}
      {showRejectPanel && (
        <Paper sx={{ mt: 2, border: '2px solid', borderColor: 'error.main' }}>
          <ReviewCommentPanel
            action="reject"
            onSubmit={handleConfirmReject}
            onCancel={() => setShowRejectPanel(false)}
            loading={actionLoading}
            error={actionError}
          />
        </Paper>
      )}

      {/* History Drawer */}
      <Drawer
        anchor="right"
        open={showHistoryDrawer}
        onClose={() => setShowHistoryDrawer(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            p: 3,
          },
        }}
      >
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Review History
        </Typography>
        <ReviewHistoryTimeline
          history={history}
          loading={historyLoading}
        />
      </Drawer>
    </Box>
  );
};

export default QuestionReview;
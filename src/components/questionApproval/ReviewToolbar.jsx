/**
 * Review Toolbar Component
 * Toolbar for review actions
 */

import { Box, Button, Stack, Tooltip, Divider, Chip } from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  History as HistoryIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';

const ReviewToolbar = ({
  question,
  onBack,
  onApprove,
  onReject,
  onHistory,
  canApprove,
  canReject,
  loading = false,
  disabled = false,
}) => {
  const isPending = question?.status === 'PENDING_REVIEW';
  const canAct = isPending && !loading && !disabled;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        alignItems: 'center',
        p: 1.5,
        mb: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Button
        startIcon={<BackIcon />}
        onClick={onBack}
        disabled={loading}
        size="small"
      >
        Back to Queue
      </Button>

      <Divider orientation="vertical" flexItem />

      <Box sx={{ flex: 1 }} />

      <Stack direction="row" spacing={1}>
        <Tooltip title="View Review History">
          <Button
            variant="outlined"
            size="small"
            startIcon={<HistoryIcon />}
            onClick={onHistory}
            disabled={loading}
          >
            History
          </Button>
        </Tooltip>

        {canApprove && canAct && (
          <Tooltip title="Approve this question">
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<ApproveIcon />}
              onClick={onApprove}
              disabled={!canAct}
            >
              Approve
            </Button>
          </Tooltip>
        )}

        {canReject && canAct && (
          <Tooltip title="Reject this question">
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<RejectIcon />}
              onClick={onReject}
              disabled={!canAct}
            >
              Reject
            </Button>
          </Tooltip>
        )}

        {question?.status !== 'PENDING_REVIEW' && (
          <Chip
            label={`Status: ${question?.status || 'Unknown'}`}
            color={
              question?.status === 'APPROVED' ? 'success' :
              question?.status === 'REJECTED' ? 'error' :
              'default'
            }
            size="small"
          />
        )}
      </Stack>
    </Box>
  );
};

export default ReviewToolbar;
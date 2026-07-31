/**
 * Restore Question Dialog Component
 * Confirmation dialog for restoring an archived question
 */

import ConfirmDialog from '../dialogs/ConfirmDialog';

const RestoreQuestionDialog = ({
  open,
  onClose,
  onConfirm,
  questionTitle,
  loading = false,
}) => {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Restore Question"
      message={`Are you sure you want to restore "${questionTitle || 'this question'}"? The question will become available for use again.`}
      confirmText="Restore"
      cancelText="Cancel"
      confirmColor="success"
      severity="info"
      loading={loading}
    />
  );
};

export default RestoreQuestionDialog;
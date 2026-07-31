/**
 * Archive Question Dialog Component
 * Confirmation dialog for archiving a question
 */

import ConfirmDialog from '../dialogs/ConfirmDialog';

const ArchiveQuestionDialog = ({
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
      title="Archive Question"
      message={`Are you sure you want to archive "${questionTitle || 'this question'}"? The question will be hidden from active use but can be restored later.`}
      confirmText="Archive"
      cancelText="Cancel"
      confirmColor="warning"
      severity="warning"
      loading={loading}
    />
  );
};

export default ArchiveQuestionDialog;
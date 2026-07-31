/**
 * Duplicate Question Dialog Component
 * Confirmation dialog for duplicating a question
 */

import ConfirmDialog from '../dialogs/ConfirmDialog';

const DuplicateQuestionDialog = ({
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
      title="Duplicate Question"
      message={`Are you sure you want to duplicate "${questionTitle || 'this question'}"? This will create a new draft with a new question code.`}
      confirmText="Duplicate"
      cancelText="Cancel"
      confirmColor="primary"
      severity="info"
      loading={loading}
    />
  );
};

export default DuplicateQuestionDialog;
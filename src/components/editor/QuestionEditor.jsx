/* eslint-disable no-unused-vars */
/**
 * Question Editor Component
 * Complete question content editor with all features
 */

import { useState, useCallback, useRef } from "react";
import { Box, Typography } from "@mui/material";
import EditorContentArea from "./EditorContentArea";
import ImageUploadExtension from "./ImageUploadExtension";
import FormulaEditor from "./FormulaEditor";
import LinkDialog from "./LinkDialog";
import TableControls from "./TableControls";
import { uploadEditorImage } from "../../services/media/mediaUploadService";
import { sanitizeHtml } from "../../utils/editor/editorExtensions";

const QuestionEditor = ({
  value = "",
  onChange,
  placeholder = "Write your question content here...",
  maxLength = 10000,
  readOnly = false,
  disabled = false,
  label = "Question Content",
  error,
}) => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isFormulaDialogOpen, setIsFormulaDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [editorContent, setEditorContent] = useState(value);
  const [tableInsertCallback, setTableInsertCallback] = useState(null);

  const handleContentChange = useCallback(
    (content) => {
      setEditorContent(content);
      if (onChange) {
        onChange(content);
      }
    },
    [onChange],
  );

  const handleImageUpload = useCallback(async (file) => {
    try {
      setUploading(true);
      setUploadError(null);

      // Validate file type
      const validTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/svg+xml",
        "image/gif",
      ];
      if (!validTypes.includes(file.type)) {
        throw new Error(
          "Invalid file type. Please upload PNG, JPEG, SVG, or GIF.",
        );
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size exceeds 5MB limit.");
      }

      const response = await uploadEditorImage(file);

      if (response.success) {
        setIsImageDialogOpen(false);
        return response.data;
      }
    } catch (error) {
      setUploadError(error.message);
      throw error;
    } finally {
      setUploading(false);
    }
  }, []);

  const handleFormulaInsert = useCallback((formula) => {
    setIsFormulaDialogOpen(false);
  }, []);

  const handleLinkInsert = useCallback(({ url, text }) => {
    setIsLinkDialogOpen(false);
  }, []);

  // ✅ Handle table dialog open
  const handleTableDialogOpen = useCallback((insertCallback) => {
    setTableInsertCallback(() => insertCallback);
    setIsTableDialogOpen(true);
  }, []);

  // ✅ Handle table insertion from dialog
  const handleTableInsert = useCallback(
    ({ rows, cols }) => {
      if (tableInsertCallback) {
        tableInsertCallback({ rows, cols });
      }
      setIsTableDialogOpen(false);
      setTableInsertCallback(null);
    },
    [tableInsertCallback],
  );

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}

      <EditorContentArea
        content={typeof value === "string" ? value : value?.html || ""}
        onChange={handleContentChange}
        placeholder={placeholder}
        maxLength={maxLength}
        readOnly={readOnly}
        disabled={disabled}
        onImageUpload={() => setIsImageDialogOpen(true)}
        onFormulaInsert={() => setIsFormulaDialogOpen(true)}
        onLinkInsert={() => setIsLinkDialogOpen(true)}
        onTableInsert={handleTableDialogOpen}
        error={error}
      />

      {/* Image Upload Dialog */}
      <ImageUploadExtension
        open={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
        onUpload={handleImageUpload}
        uploading={uploading}
        error={uploadError}
      />

      {/* Formula Editor */}
      <FormulaEditor
        open={isFormulaDialogOpen}
        onClose={() => setIsFormulaDialogOpen(false)}
        onInsert={handleFormulaInsert}
      />

      {/* Link Dialog */}
      <LinkDialog
        open={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        onInsert={handleLinkInsert}
      />

      {/* Table Controls */}
      <TableControls
        open={isTableDialogOpen}
        onClose={() => {
          setIsTableDialogOpen(false);
          setTableInsertCallback(null);
        }}
        onInsert={handleTableInsert}
      />
    </Box>
  );
};

export default QuestionEditor;

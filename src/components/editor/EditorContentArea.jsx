/**
 * Editor Content Area Component
 * Main content area with TipTap editor
 */

import { useEditor, EditorContent } from "@tiptap/react";
import { Box, Paper, Alert, CircularProgress } from "@mui/material";
import {
  getEditorExtensions,
  sanitizeHtml,
} from "../../utils/editor/editorExtensions";
import EditorToolbar from "./EditorToolbar";

const EditorContentArea = ({
  content,
  onChange,
  placeholder,
  maxLength,
  readOnly = false,
  disabled = false,
  onImageUpload,
  onFormulaInsert,
  onLinkInsert,
  onTableInsert: onTableInsertProp,
  error,
}) => {
  const editor = useEditor({
    extensions: getEditorExtensions({ placeholder, maxLength }),
    content: content || "",
    editable: !readOnly && !disabled,
    onUpdate: ({ editor }) => {
      if (onChange) {
        const html = editor.getHTML();
        const json = editor.getJSON();
        onChange({
          html: sanitizeHtml(html),
          json,
        });
      }
    },
  });

  if (!editor) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // ✅ Handle table insertion using the Table extension's built-in command
  const handleTableInsert = (options) => {
    if (!editor) return;

    const { rows, cols } = options;

    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();

    // Close dialog
    if (onTableInsertProp) {
      onTableInsertProp(options);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        borderColor: error ? "error.main" : "divider",
      }}
    >
      {!readOnly && (
        <EditorToolbar
          editor={editor}
          onImageUpload={onImageUpload}
          onFormulaInsert={onFormulaInsert}
          onLinkInsert={onLinkInsert}
          onTableInsert={() => {
            // Open table dialog
            if (onTableInsertProp) {
              // Pass the actual insertion function up to the parent,
              // which stores it and calls it once the dialog collects rows/cols
              onTableInsertProp(handleTableInsert);
            }
          }}
          disabled={disabled}
          maxContentLength={maxLength}
        />
      )}

      <Box
        sx={{
          p: 2,
          minHeight: 200,
          "& .ProseMirror": {
            outline: "none",
            minHeight: 200,
            "& p": {
              margin: "0 0 1em 0",
            },
            "& img.editor-image": {
              maxWidth: "100%",
              height: "auto",
              borderRadius: 1,
              margin: "8px 0",
            },
            "& .is-editor-empty:first-child::before": {
              content: "attr(data-placeholder)",
              float: "left",
              color: "text.disabled",
              pointerEvents: "none",
              height: 0,
            },
            "& table": {
              borderCollapse: "collapse",
              margin: "8px 0",
              width: "100%",
              "& td, & th": {
                border: "1px solid",
                borderColor: "divider",
                padding: "8px",
                minWidth: "50px",
              },
              "& th": {
                backgroundColor: "action.hover",
                fontWeight: 600,
              },
            },
            "& blockquote": {
              borderLeft: "4px solid",
              borderColor: "primary.main",
              paddingLeft: "16px",
              margin: "8px 0",
              color: "text.secondary",
            },
            "& code": {
              backgroundColor: "action.hover",
              padding: "2px 4px",
              borderRadius: 4,
              fontSize: "0.875em",
            },
            "& pre": {
              backgroundColor: "action.hover",
              padding: "16px",
              borderRadius: 8,
              overflowX: "auto",
              "& code": {
                backgroundColor: "transparent",
                padding: 0,
                borderRadius: 0,
              },
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      {error && (
        <Box sx={{ p: 1.5, bgcolor: "error.light" }}>
          <Alert
            severity="error"
            variant="outlined"
            sx={{ fontSize: "0.75rem" }}
          >
            {error}
          </Alert>
        </Box>
      )}
    </Paper>
  );
};

export default EditorContentArea;
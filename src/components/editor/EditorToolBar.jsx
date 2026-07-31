/**
 * Editor Toolbar Component
 * Toolbar for the TipTap editor
 */

import {
  Box,
  IconButton,
  Tooltip,
  Divider,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  StrikethroughS as StrikeIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as OrderedListIcon,
  FormatAlignLeft as AlignLeftIcon,
  FormatAlignCenter as AlignCenterIcon,
  FormatAlignRight as AlignRightIcon,
  TableChart as TableIcon,
  Image as ImageIcon,
  Functions as FormulaIcon,
  Link as LinkIcon,
  Code as CodeIcon,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  FormatQuote as QuoteIcon,
  HorizontalRule as HorizontalRuleIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
} from "@mui/icons-material";

const HEADING_LEVELS = [
  { value: "paragraph", label: "Normal" },
  { value: "1", label: "Heading 1" },
  { value: "2", label: "Heading 2" },
  { value: "3", label: "Heading 3" },
  { value: "4", label: "Heading 4" },
];

/**
 * Toolbar button - hoisted out of EditorToolbar so it isn't
 * recreated as a "new" component type on every parent render
 * (fixes react/no-unstable-nested-components).
 */
const ToolbarButton = ({
  onClick,
  icon,
  tooltip,
  isActive,
  disabled,
  isMobile,
}) => (
  <Tooltip title={tooltip} arrow>
    <span>
      <IconButton
        onClick={onClick}
        disabled={disabled}
        color={isActive ? "primary" : "default"}
        size={isMobile ? "small" : "medium"}
        sx={{
          borderRadius: 1,
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        {icon}
      </IconButton>
    </span>
  </Tooltip>
);

const EditorToolbar = ({
  editor,
  onImageUpload,
  onFormulaInsert,
  onLinkInsert,
  onTableInsert,
  disabled = false,
  maxContentLength = 5000,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!editor) return null;

  const currentHeading = () => {
    for (const level of HEADING_LEVELS) {
      if (editor.isActive("heading", { level: parseInt(level.value) })) {
        return level.value;
      }
    }
    return "paragraph";
  };

 
  const toggleTable = () => {
    if (editor.isActive("table")) {
      editor.chain().focus().deleteTable().run();
    } else {
      // Open table dialog instead of inserting directly
      if (onTableInsert) {
        onTableInsert();
      }
    }
  };
  const characterCount = editor.storage.characterCount?.characters() || 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 0.5,
        p: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        borderRadius: "8px 8px 0 0",
      }}
    >
      {/* Undo/Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        icon={<UndoIcon fontSize="small" />}
        tooltip="Undo"
        disabled={!editor.can().undo() || disabled}
        isMobile={isMobile}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        icon={<RedoIcon fontSize="small" />}
        tooltip="Redo"
        disabled={!editor.can().redo() || disabled}
        isMobile={isMobile}
      />

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Headings */}
      <FormControl size="small" sx={{ minWidth: 100 }}>
        <Select
          value={currentHeading()}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "paragraph") {
              editor.chain().focus().setParagraph().run();
            } else {
              editor
                .chain()
                .focus()
                .toggleHeading({ level: parseInt(value) })
                .run();
            }
          }}
          disabled={disabled}
          displayEmpty
          size="small"
          sx={{ fontSize: "0.75rem" }}
        >
          {HEADING_LEVELS.map((level) => (
            <MenuItem key={level.value} value={level.value}>
              {level.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Text Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        icon={<BoldIcon fontSize="small" />}
        tooltip="Bold"
        isActive={editor.isActive("bold")}
        disabled={disabled}
        isMobile={isMobile}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        icon={<ItalicIcon fontSize="small" />}
        tooltip="Italic"
        isActive={editor.isActive("italic")}
        disabled={disabled}
        isMobile={isMobile}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        icon={<UnderlineIcon fontSize="small" />}
        tooltip="Underline"
        isActive={editor.isActive("underline")}
        disabled={disabled}
        isMobile={isMobile}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        icon={<StrikeIcon fontSize="small" />}
        tooltip="Strike"
        isActive={editor.isActive("strike")}
        disabled={disabled}
        isMobile={isMobile}
      />

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        icon={<BulletListIcon fontSize="small" />}
        tooltip="Bullet List"
        isActive={editor.isActive("bulletList")}
        disabled={disabled}
        isMobile={isMobile}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        icon={<OrderedListIcon fontSize="small" />}
        tooltip="Ordered List"
        isActive={editor.isActive("orderedList")}
        disabled={disabled}
        isMobile={isMobile}
      />

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        icon={<AlignLeftIcon fontSize="small" />}
        tooltip="Align Left"
        isActive={editor.isActive({ textAlign: "left" })}
        disabled={disabled}
        isMobile={isMobile}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        icon={<AlignCenterIcon fontSize="small" />}
        tooltip="Center"
        isActive={editor.isActive({ textAlign: "center" })}
        disabled={disabled}
        isMobile={isMobile}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        icon={<AlignRightIcon fontSize="small" />}
        tooltip="Align Right"
        isActive={editor.isActive({ textAlign: "right" })}
        disabled={disabled}
        isMobile={isMobile}
      />

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Advanced Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        icon={<SuperscriptIcon fontSize="small" />}
        tooltip="Superscript"
        isActive={editor.isActive("superscript")}
        disabled={disabled}
        isMobile={isMobile}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        icon={<SubscriptIcon fontSize="small" />}
        tooltip="Subscript"
        isActive={editor.isActive("subscript")}
        disabled={disabled}
        isMobile={isMobile}
      />

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Insert Elements */}
      <ToolbarButton
        onClick={onImageUpload}
        icon={<ImageIcon fontSize="small" />}
        tooltip="Insert Image"
        disabled={disabled}
        isMobile={isMobile}
      />
      <ToolbarButton
        onClick={onFormulaInsert}
        icon={<FormulaIcon fontSize="small" />}
        tooltip="Insert Formula"
        disabled={disabled}
        isMobile={isMobile}
      />
      <ToolbarButton
        onClick={onLinkInsert}
        icon={<LinkIcon fontSize="small" />}
        tooltip="Insert Link"
        disabled={disabled}
        isMobile={isMobile}
      />
      <ToolbarButton
        onClick={toggleTable}
        icon={<TableIcon fontSize="small" />}
        tooltip={editor.isActive("table") ? "Delete Table" : "Insert Table"}
        isActive={editor.isActive("table")}
        disabled={disabled}
        isMobile={isMobile}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        icon={<CodeIcon fontSize="small" />}
        tooltip="Code Block"
        isActive={editor.isActive("codeBlock")}
        disabled={disabled}
        isMobile={isMobile}
      />

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Quote */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        icon={<QuoteIcon fontSize="small" />}
        tooltip="Quote"
        isActive={editor.isActive("blockquote")}
        disabled={disabled}
        isMobile={isMobile}
      />

      {/* Horizontal Rule */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon={<HorizontalRuleIcon fontSize="small" />}
        tooltip="Horizontal Rule"
        disabled={disabled}
        isMobile={isMobile}
      />

      {/* Character Count */}
      <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
        <Tooltip title="Character Count" arrow>
          <Box
            component="span"
            sx={{
              fontSize: "0.75rem",
              color:
                characterCount > maxContentLength
                  ? "error.main"
                  : "text.secondary",
            }}
          >
            {characterCount}/{maxContentLength}
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default EditorToolbar;

/* eslint-disable no-unused-vars */
/**
 * Preview Toolbar Component
 * Controls for preview display options
 */

import { Box, ToggleButton, ToggleButtonGroup, Stack, Tooltip, FormControlLabel, Switch, ButtonGroup, Button } from '@mui/material';
import { DesktopWindows, TabletAndroid, PhoneAndroid, Info, Description, Book, CheckCircle } from '@mui/icons-material';

const PreviewToolbar = ({
  mode,
  onModeChange,
  displayOptions,
  onDisplayOptionChange,
  loading = false,
}) => {
  const handleDisplayToggle = (key) => {
    if (onDisplayOptionChange) {
      onDisplayOptionChange({ ...displayOptions, [key]: !displayOptions[key] });
    }
  };

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
      {/* View Mode */}
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(e, val) => val && onModeChange(val)}
        size="small"
        aria-label="preview mode"
      >
        <ToggleButton value="desktop" aria-label="desktop">
          <Tooltip title="Desktop">
            <DesktopWindows fontSize="small" />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="tablet" aria-label="tablet">
          <Tooltip title="Tablet">
            <TabletAndroid fontSize="small" />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="mobile" aria-label="mobile">
          <Tooltip title="Mobile">
            <PhoneAndroid fontSize="small" />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ flex: 1 }} />

      {/* Display Options */}
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Tooltip title="Show Answers">
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={displayOptions.showAnswers || false}
                onChange={() => handleDisplayToggle('showAnswers')}
                disabled={loading}
              />
            }
            label={<CheckCircle fontSize="small" />}
            labelPlacement="end"
          />
        </Tooltip>

        <Tooltip title="Show Explanation">
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={displayOptions.showExplanation || false}
                onChange={() => handleDisplayToggle('showExplanation')}
                disabled={loading}
              />
            }
            label={<Info fontSize="small" />}
            labelPlacement="end"
          />
        </Tooltip>

        <Tooltip title="Show Reference">
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={displayOptions.showReference || false}
                onChange={() => handleDisplayToggle('showReference')}
                disabled={loading}
              />
            }
            label={<Book fontSize="small" />}
            labelPlacement="end"
          />
        </Tooltip>

        <Tooltip title="Show Metadata">
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={displayOptions.showMetadata || false}
                onChange={() => handleDisplayToggle('showMetadata')}
                disabled={loading}
              />
            }
            label={<Description fontSize="small" />}
            labelPlacement="end"
          />
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default PreviewToolbar;
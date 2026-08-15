/**
 * Remember Me Checkbox Component
 * Reusable remember me checkbox with enhanced UX
 * 
 * Key Improvements:
 * - Custom styled checkbox
 * - Better spacing
 * - Hover effects
 * - Accessibility improvements
 */

import { FormControlLabel, Checkbox, Box, Typography, alpha, useTheme } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

const RememberMeCheckbox = ({
  checked,
  onChange,
  label = 'Remember me',
  disabled,
  sx = {},
}) => {
  const theme = useTheme();

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          color="primary"
          sx={{
            '& .MuiSvgIcon-root': {
              fontSize: 20,
            },
            '&.Mui-checked': {
              '& .MuiSvgIcon-root': {
                color: 'primary.main',
              },
            },
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.04),
            },
          }}
          checkedIcon={
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: 1,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
              }}
            >
              <CheckIcon sx={{ fontSize: 16 }} />
            </Box>
          }
          icon={
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: 1,
                border: '2px solid',
                borderColor: 'grey.400',
                bgcolor: 'background.paper',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
            />
          }
        />
      }
      label={
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontWeight: 400,
            fontSize: '0.8125rem',
            userSelect: 'none',
          }}
        >
          {label}
        </Typography>
      }
      sx={{
        m: 0,
        '& .MuiFormControlLabel-root': {
          marginRight: 0,
        },
        ...sx,
      }}
    />
  );
};

export default RememberMeCheckbox;
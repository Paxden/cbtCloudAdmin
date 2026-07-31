/**
 * AppSwitch - Reusable Switch Component
 * 
 * Features:
 * - React Hook Form compatible
 * - Label support
 * - Color variants
 * - Disabled state
 */

import { FormControlLabel, Switch } from '@mui/material';

export const AppSwitch = ({
  label,
  name,
  checked,
  onChange,
  onBlur,
  disabled = false,
  color = 'primary',
  size = 'medium',
  register = null,
  sx = {},
  ...props
}) => {
  const registerProps = register && name ? register(name) : {};

  return (
    <FormControlLabel
      control={
        <Switch
          name={name}
          checked={checked}
          onChange={onChange || registerProps?.onChange}
          onBlur={onBlur || registerProps?.onBlur}
          inputRef={registerProps?.ref}
          disabled={disabled}
          color={color}
          size={size}
          sx={sx}
          {...props}
        />
      }
      label={label}
      disabled={disabled}
    />
  );
};

export default AppSwitch;
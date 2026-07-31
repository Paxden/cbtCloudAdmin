/**
 * Remember Me Checkbox Component
 * Reusable remember me checkbox
 */

import { FormControlLabel, Checkbox } from '@mui/material';

const RememberMeCheckbox = ({
  checked,
  onChange,
  label = 'Remember me',
  disabled,
}) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          color="primary"
        />
      }
      label={label}
    />
  );
};

export default RememberMeCheckbox;
import { ChangeEvent } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';

type InputProps = {
  type: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  variant?: TextFieldProps['variant'];
  label?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  width?: number;
  textCenter?: boolean;
  error?: boolean;
  errorText?: string;
  required?: boolean;
};

export default function Input({
  type,
  value,
  onChange,
  variant,
  label,
  disabled,
  min,
  max,
  step,
  width,
  textCenter,
  error,
  errorText,
  required,
}: InputProps) {
  return (
    <TextField
      size="small"
      id="input"
      variant={variant ?? 'outlined'}
      value={value}
      onChange={onChange}
      type={type}
      label={label ?? ''}
      disabled={disabled}
      inputProps={{
        min: min ?? null,
        max: max ?? null,
        step: step ?? null,
        style: {
          textAlign: textCenter ? 'center' : 'start',
        },
      }}
      InputLabelProps={{
        shrink: true,
      }}
      sx={{
        width: width ?? '80px',
        '& .MuiInputLabel-asterisk': {
          color: 'red',
        },
      }}
      error={error ?? false}
      helperText={errorText ?? null}
      required={required ?? false}
    />
  );
}

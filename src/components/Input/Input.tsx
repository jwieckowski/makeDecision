import { ChangeEvent, FocusEvent } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';

import HelperText from './HelperText';

type InputProps = {
  type?: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  variant?: TextFieldProps['variant'];
  label?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  width?: number;
  textCenter?: boolean;
  error?: boolean;
  helperText?: string | string[];
  required?: boolean;
  name?: string;
};

export default function Input({
  type,
  value,
  onChange,
  onBlur,
  variant,
  label,
  disabled,
  min,
  max,
  step,
  width,
  textCenter,
  error,
  helperText,
  required,
  name,
}: InputProps) {
  if (Array.isArray(helperText)) {
    return (
      <>
        <TextField
          name={name}
          size="small"
          id="input"
          variant={variant ?? 'outlined'}
          value={value}
          onChange={onChange}
          type={type ?? 'string'}
          label={label ?? ''}
          disabled={disabled}
          onBlur={onBlur}
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
          helperText={null}
          required={required ?? false}
        />
        <HelperText messages={helperText} />
      </>
    );
  }

  return (
    <TextField
      name={name}
      size="small"
      id="input"
      variant={variant ?? 'outlined'}
      value={value}
      onChange={onChange}
      type={type ?? 'string'}
      label={label ?? ''}
      disabled={disabled}
      onBlur={onBlur}
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
      helperText={helperText ?? null}
      required={required ?? false}
    />
  );
}

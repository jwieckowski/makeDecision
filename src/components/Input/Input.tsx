import { ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';

type InputProps = {
  type: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
};

export default function Input({ type, value, onChange, label, disabled, min, max, step }: InputProps) {
  return (
    <TextField
      size="small"
      id="input"
      variant="standard"
      value={value}
      onChange={onChange}
      type={type}
      label={label ?? ''}
      disabled={disabled}
      inputProps={{
        min: min ?? null,
        max: max ?? null,
        step: step ?? null,
      }}
    />
  );
}

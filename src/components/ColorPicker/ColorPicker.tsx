import React, { ChangeEvent } from 'react';
import { Box } from '@mui/system';

type ColorPickerProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
};

export default function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  return (
    <Box>
      {label ? <label htmlFor="colorPicker">{label} </label> : null}
      <input type="color" id="colorPicker" name="colorPicker" value={value ?? '#fff'} onChange={onChange} />
    </Box>
  );
}

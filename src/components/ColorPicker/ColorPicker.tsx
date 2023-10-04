import React, { ChangeEvent } from 'react';
import { Box } from '@mui/system';

type ColorPickerProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
};

export default function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {label ? <label htmlFor="colorPicker">{label} </label> : null}
      <input
        type="color"
        id="colorPicker"
        name="colorPicker"
        value={value ?? '#fff'}
        onChange={onChange}
        style={{
          width: '50px',
          height: '30px',
          backgroundColor: 'transparent',
          margin: 0,
          padding: 0,
          border: 'none',
          cursor: 'pointer',
        }}
      />
    </Box>
  );
}

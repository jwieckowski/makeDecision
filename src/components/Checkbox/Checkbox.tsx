import React, { ChangeEvent } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

type CheckboxProps = {
  id: string;
  label: string;
  value: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function CustomCheckbox({ id, label, value, onChange }: CheckboxProps) {
  return (
    <FormGroup>
      <FormControlLabel
        id={id}
        control={<Checkbox checked={value} onChange={onChange} />}
        label={label}
        labelPlacement="start"
      />
    </FormGroup>
  );
}

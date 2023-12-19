import { ChangeEvent } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

type CheckboxProps = {
  id: string;
  label: string;
  value: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placement?: FormControlLabelProps['labelPlacement'];
  name?: string;
  disabled?: boolean;
};

export default function CustomCheckbox({ id, label, value, onChange, placement, name, disabled }: CheckboxProps) {
  return (
    <FormGroup>
      <FormControlLabel
        id={id}
        control={<Checkbox checked={value} onChange={onChange} name={name} />}
        label={label}
        labelPlacement={placement ?? 'end'}
        sx={{ width: '100%', justifyContent: 'center' }}
        disabled={disabled ?? false}
      />
    </FormGroup>
  );
}

import { ChangeEvent } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';

type Items = {
  label: string;
  value: string;
};

type SelectProps = {
  items: Items[];
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  light?: boolean;
  minWidth?: number;
  small?: boolean;
  required?: boolean;
  fontSize?: number;
  name?: string;
};

export default function MySelect({
  items,
  value,
  onChange,
  label,
  placeholder,
  light,
  minWidth,
  required,
  fontSize,
  name,
}: SelectProps) {
  return (
    <FormControl variant="outlined" sx={{ minWidth: minWidth ?? 50 }}>
      <TextField
        select
        name={name}
        value={value}
        onChange={onChange}
        id="select-component"
        sx={{
          width: minWidth ?? 70,
          '& .MuiInputLabel-asterisk': {
            color: 'red',
          },
        }}
        margin="none"
        size="small"
        label={label}
        required={required}
        SelectProps={{
          native: true,
        }}
        inputProps={{ style: { fontSize: fontSize ?? 16 } }}
      >
        {placeholder ? (
          <option disabled value="">
            <em>{placeholder}</em>
          </option>
        ) : null}
        {items.map((item, index) => {
          return (
            <option key={`select-${index}`} value={item.value}>
              {/* <Typography sx={{ p: 0, m: 0, fontSize: fontSize ?? 16 }}>{item.label}</Typography> */}
              {item.label}
            </option>
          );
        })}
      </TextField>
    </FormControl>
  );
}

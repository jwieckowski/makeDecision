import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

type Items = {
  label: string;
  value: string;
};

type SelectProps = {
  items: Items[];
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  label?: string;
  placeholder?: string;
  light?: boolean;
};

export default function MySelect({ items, value, onChange, label, placeholder, light }: SelectProps) {
  return (
    <FormControl variant="standard" sx={{ minWidth: 60 }}>
      {label ? <InputLabel id="select-id">{label}</InputLabel> : null}
      <Select
        labelId="select-id"
        id="select-component"
        value={value}
        onChange={onChange}
        label={label}
        sx={{
          color: light ? 'white' : 'dark',
          '&:before': {
            borderColor: light ? 'white' : 'dark',
          },
          '&:after': {
            borderColor: light ? 'white' : 'dark',
          },
          '& .MuiSvgIcon-root': {
            color: light ? 'white' : 'dark',
          },
          '&:hover:not(.Mui-disabled):before': {
            borderColor: light ? 'white' : 'dark',
          },
        }}
      >
        {placeholder ? (
          <MenuItem disabled value="">
            <em>{placeholder}</em>
          </MenuItem>
        ) : null}
        {items.map((item, index) => {
          return (
            <MenuItem key={`select-${index}`} value={item.value}>
              {item.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

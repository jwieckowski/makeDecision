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
  placeholder?: string
};

export default function MySelect({
  items,
  value,
  onChange,
  label,
  placeholder
}: SelectProps) {
  return (
    <FormControl variant="standard" sx={{ minWidth: 60}}>
        {label ? <InputLabel id="select-id">{label}</InputLabel> : null}
        <Select
          labelId="select-id"
          id="select-component"
          value={value}
          onChange={onChange}
          label={label}
        >
          {placeholder ? (
            <MenuItem disabled value="">
              <em>{placeholder}</em>
            </MenuItem> 
          ) : null}
          {items.map((item, index) => {
          return (
            <MenuItem  key={`select-${index}`} value={item.value}>{item.label}</MenuItem>
          );
        })}

        </Select>
      </FormControl>
  );
}

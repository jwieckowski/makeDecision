import React, {useState} from 'react';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Box, Typography, FormControl, InputLabel, MenuItem } from '@mui/material'

export default function Extension() {

  const [extension, setExtension] = useState<string>('crisp')
  const handleExtensionChange = (event: SelectChangeEvent) => {
    setExtension(event.target.value as string);
  }
  
  return (
    <Box sx={{margin: '10px 0'}}>
      <FormControl fullWidth>
        <InputLabel id="extension-input">Extension</InputLabel>
        <Select
          labelId="extension-input"
          id="extension"
          value={extension}
          label="Extension"
          onChange={handleExtensionChange}
        >
          <MenuItem value={'crisp'}>
            <Typography>
              Crisp
            </Typography>
          </MenuItem>
          <MenuItem value={'fuzzy'}>
            <Typography>
              Fuzzy
            </Typography>
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
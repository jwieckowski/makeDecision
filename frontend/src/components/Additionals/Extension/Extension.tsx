import React from 'react';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Box, Typography, FormControl, InputLabel, MenuItem } from '@mui/material'

import { RootState, useAppDispatch } from '../../../redux';
import { useSelector } from 'react-redux';
import { addBodyExtension } from '../../../redux/slices/calculationSlice';

export default function Extension() {
  const {extensions} = useSelector((state: RootState) => state.calculation.calculationBody)
  const {blocks, activeBlock} = useSelector((state: RootState) => state.blocks)
  const dispatch = useAppDispatch()

  const matrixBlocks = blocks.filter(b => b.type.toLowerCase() === 'matrix')

  const getBlockNumber = () => {
    return matrixBlocks.map(b => b._id === activeBlock?.id).indexOf(true)
  }
  
  const handleExtensionChange = (event: SelectChangeEvent) => {
    dispatch(addBodyExtension({extension: event.target.value as string, id: matrixBlocks.map(b => b._id).indexOf(activeBlock?.id as never)}));
  }

  return (
    <Box sx={{margin: '10px 0'}}>
      <FormControl fullWidth>
        <InputLabel id="extension-input">Extension</InputLabel>
        <Select
          labelId="extension-input"
          id="extension"
          value={extensions[getBlockNumber()]}
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
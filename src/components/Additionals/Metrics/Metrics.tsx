import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';

import { RootState } from '../../../redux';

import { Box, Typography, FormControl, InputLabel, MenuItem } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';

import {getFilteredMethods, getMethodData} from '../../../utilities/filtering'
import {capitalize} from '../../../utilities/formatting'

type MetricsType = {
    extension: string,
    method: string,
    parameter: string
}

export default function Metrics({extension, method, parameter}: MetricsType) {
  const [metric, setMetric] = useState<string>('')
  const { allMethods } = useSelector((state: RootState) => ({ ...state.dictionary }));

  useEffect(() => {
    setMetric('')
  }, [extension])

  const handleMetricChange = (event: SelectChangeEvent) => {
    setMetric(event.target.value as string);
  };

  return (
    getFilteredMethods(getMethodData(allMethods, method), extension).length !== 0 ?
        <Box>
            <FormControl fullWidth sx={{mt: 2}}>
                <InputLabel id={`${method}-select`}>
                    <Typography>
                        {capitalize(method)}
                    </Typography>
                </InputLabel>
                <Select
                    labelId={`${method}-select`}
                    id={`${method}-select`}
                    value={metric}
                    label={method}
                    onChange={handleMetricChange}
                >
                    {getFilteredMethods(getMethodData(allMethods, method), extension).map(item => {
                        return (
                            <MenuItem value={item.functionName}>
                                <Typography>
                                    {item.name}
                                </Typography>
                            </MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </Box>
    : <></>
    // <></>
)
}

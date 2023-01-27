import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'

import {RootState } from '../../redux/index'
import {Box, Grid, Typography, FormControl, InputLabel, MenuItem } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function CriteriaTypes() {
    const {criteria} = useSelector((state: RootState) => state.calculation)
    const [criteriaTypes, setCriteriaTypes] = useState<string[]>([])

    useEffect(() => {
        setCriteriaTypes(Array(criteria).fill('1'))
    }, [criteria])


    const handleTypeChange = (e: SelectChangeEvent, col: number) => {
        let copy = [...criteriaTypes];
        copy[col] = e.target.value as string
        setCriteriaTypes(copy);
      };

  return (
    <Box sx={{m: 4}}>
        <Typography textAlign='center' sx={{m:2}}>
            Criteria types
        </Typography>
        <Box>
            <Grid container spacing={1} alignItems="center" justifyContent="center" sx={{mt: 4}}>
                <Grid container item spacing={3}>
                    <Box sx={{width: '100%', display: 'flex', flexDirection: 'row', gap:2, margin: '10px'}} >
                        {(criteria < 12) && <Grid item xs={(12-criteria)/2}></Grid>}
                        {Array(criteria).fill(0).map((_, col) => {
                            return (
                                <Grid key={`weight-${col}`} item xs={1}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={criteriaTypes[col]}
                                            label="Type"
                                            onChange={(e) => handleTypeChange(e, col)}
                                        >
                                            <MenuItem value={'1'}>Profit</MenuItem>
                                            <MenuItem value={'-1'}>Cost</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )
                            })
                        }
                        {(criteria < 12) && <Grid item xs={(12-criteria)/2}></Grid>}
                    </Box>
                </Grid>   
            </Grid>
        </Box>
    </Box>
  )
}

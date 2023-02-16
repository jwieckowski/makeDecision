import React from 'react'
import { useSelector } from 'react-redux'

import {RootState, useAppDispatch } from '../../../redux/index'
import { setAlternatives, setCriteria } from '../../../redux/slices/calculationSlice'
import {Box, Typography, TextField } from '@mui/material'

export default function CriteriaAlternatives() {
    const dispatch = useAppDispatch()
    const {alternatives, criteria} = useSelector((state: RootState) => state.calculation)

    function changeAlternatives(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        dispatch(setAlternatives(+e.target.value >= 0 ? +e.target.value : 0))
    }

    function changeCriteria(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        dispatch(setCriteria(+e.target.value >= 0 ? +e.target.value : 0))
    }

    return (
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, m: 2}}>
            <Typography>Alternatives</Typography>
            <TextField value={alternatives} id="outlined-basic" label="Outlined" variant="outlined" type='number' onChange={(e) => changeAlternatives(e)} />
            <Typography>Criteria</Typography>
            <TextField value={criteria} id="outlined-basic" label="Outlined" variant="outlined" type='number' onChange={(e) => changeCriteria(e)}/>
        </Box>
    )
}
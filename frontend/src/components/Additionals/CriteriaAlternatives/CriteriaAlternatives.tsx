import React from 'react'
import { useSelector } from 'react-redux'

import {RootState, useAppDispatch } from '../../../redux/index'
import { setAlternatives, setCriteria } from '../../../redux/slices/calculationSlice'
import {Box, Typography, TextField } from '@mui/material'

export default function CriteriaAlternatives() {
    const dispatch = useAppDispatch()
    const {alternatives, criteria} = useSelector((state: RootState) => state.calculation)

    function changeAlternatives(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        dispatch(setAlternatives(+e.target.value >= 0 ? +e.target.value > 20 ? 20 : +e.target.value: 0 ))
    }

    function changeCriteria(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        dispatch(setCriteria(+e.target.value >= 0 ? +e.target.value > 15 ? 15 : +e.target.value: 0 ))
    }

    return (
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, m: 2}}>
            <TextField 
                style={{width: '100px'}}
                value={alternatives} 
                id="alternatives-input" 
                label="Alternatives"
                variant="outlined"
                type='number'
                onChange={(e) => changeAlternatives(e)}
                />
            <TextField 
                style={{width: '100px'}}
                value={criteria}
                id="criteria-input"
                label="Criteria"
                variant="outlined"
                type='number'
                onChange={(e) => changeCriteria(e)}
            />
        </Box>
    )
}
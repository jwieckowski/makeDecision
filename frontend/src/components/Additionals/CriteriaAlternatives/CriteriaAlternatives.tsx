import React, {useEffect} from 'react'
import { useSelector } from 'react-redux'

import {RootState, useAppDispatch } from '../../../redux/index'
import { setAlternatives, setCriteria } from '../../../redux/slices/calculationSlice'
import { setBlockRandomMatrix } from '../../../redux/slices/blocksSlice'
import {Box, TextField } from '@mui/material'

export default function CriteriaAlternatives() {
    const dispatch = useAppDispatch()
    const {alternatives, criteria} = useSelector((state: RootState) => state.calculation)
    const {activeBlock, blocks} = useSelector((state: RootState) => state.blocks)

    function changeAlternatives(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        dispatch(setAlternatives(+e.target.value >= 2 ? +e.target.value > 20 ? 20 : +e.target.value: 2 ))
    }

    function changeCriteria(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        dispatch(setCriteria(+e.target.value >= 1 ? +e.target.value > 15 ? 15 : +e.target.value: 1 ))
    }

    useEffect(() => {
        dispatch(setBlockRandomMatrix({id: activeBlock?.id, data: [alternatives, criteria]}))
    }, [alternatives, criteria])

    useEffect(() => {
        const block = blocks.filter(b => b._id === activeBlock?.id)
        if (block.length === 0) return
        if (block[0].data.randomMatrix.length === 0) {
            dispatch(setAlternatives(3))
            dispatch(setCriteria(3))
        } else {
            dispatch(setAlternatives(block[0].data.randomMatrix[0]))
            dispatch(setCriteria(block[0].data.randomMatrix[1]))
        }
    }, [activeBlock])

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
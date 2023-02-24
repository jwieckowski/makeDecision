import React, {useEffect} from 'react'
import { useSelector } from 'react-redux'

import {RootState, useAppDispatch } from '../../../redux/index'
import { setAlternatives, setCriteria } from '../../../redux/slices/calculationSlice'
import { setBlockRandomMatrix } from '../../../redux/slices/blocksSlice'
import {Box, TextField } from '@mui/material'
import { MIN_ALTERNATIVES, MAX_ALTERNATIVES, MIN_CRITERIA, MAX_CRITERIA } from '../../../common/const'

export default function CriteriaAlternatives() {
    const dispatch = useAppDispatch()
    const {alternatives, criteria} = useSelector((state: RootState) => state.calculation)
    const {activeBlock, blocks} = useSelector((state: RootState) => state.blocks)

    function validateInput(value: number, min: number, max: number, cb: Function) {
        dispatch(cb(value >= min ? value > max ? max : +value: min ))
    }

    function changeAlternatives(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        let value = e.target.value
        if (isNaN(+value)) return
        dispatch(setAlternatives(+value))
    }
    
    function changeCriteria(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        let value = e.target.value
        if (isNaN(+value)) return
        dispatch(setCriteria(+value))
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
                onChange={(e) => changeAlternatives(e)}
                onBlur={() => validateInput(alternatives, MIN_ALTERNATIVES, MAX_ALTERNATIVES, setAlternatives)}
                />
            <TextField 
                style={{width: '100px'}}
                value={criteria}
                id="criteria-input"
                label="Criteria"
                variant="outlined"
                onChange={(e) => changeCriteria(e)}
                onBlur={() => validateInput(criteria, MIN_CRITERIA, MAX_CRITERIA, setCriteria)}
            />
        </Box>
    )
}
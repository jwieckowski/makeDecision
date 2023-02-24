import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'

import {Box, Grid, Typography, TextField } from '@mui/material'
import {RootState, useAppDispatch } from '../../../redux/index'
import {setBlockWeights} from '../../../redux/slices/blocksSlice'
import {MAX_CRITERIA} from '../../../common/const'

type ParamType = {
    extension: string
}

export default function InputWeights({extension}: ParamType) {
    const dispatch = useAppDispatch()
    const {criteria} = useSelector((state: RootState) => state.calculation)
    const {activeBlock, blocks} = useSelector((state: RootState) => state.blocks)
    const [userWeights, setUserWeights] = useState<string[]>([])

    useEffect(() => {
        let value = ''
        if (extension === 'crisp') value = '0'
        else if (extension === 'fuzzy') value = '0, 0, 0'
        setUserWeights(Array(criteria <= MAX_CRITERIA ? criteria : MAX_CRITERIA).fill(value))
    }, [criteria, extension])

    useEffect(() => {
        if (activeBlock?.id === undefined) return
        const block = blocks.filter(b => b._id === activeBlock?.id)
        if (block[0].data.weights.length === 0) return 

        if (criteria > 0) {
            
            let copy = Array(criteria <= MAX_CRITERIA ? criteria : MAX_CRITERIA).fill('0')
            copy = copy.map((r, idx) => {
                return idx < block[0].data.weights.length ? block[0].data.weights[idx].toString() : r
            })
            setUserWeights([...copy])
        }
    }, [])

    function validateCrispInput (value: any) {
        if (extension === 'fuzzy') return true

        if (!isNaN(+value)) return true
        return false
    }

    function convertCrispInput(value: string) {
        return value.includes('.') ? value : Number(value).toString()
    }

    function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, col: number) {
        e.preventDefault()

        // validate input
        // if (!validateCrispInput(e.target.value) || !validateFuzzyInput(e.target.value)) return 
        if (!validateCrispInput(e.target.value)) return 
        
        let copy = [...userWeights];
        copy = copy.map((w, idx) => {
            return idx === col
                ? extension === 'crisp' ?
                    convertCrispInput(e.target.value)
                    :
                    e.target.value
                : w
        })

        setUserWeights(copy);
        console.log(copy)
        dispatch(setBlockWeights({id: activeBlock?.id, data: copy}))
    }

  return (
    <Box sx={{m: 4}}>
        <Typography textAlign='center' sx={{m: 2}}>
            Weights
        </Typography>
        <Box sx={{width: '100%', maxWidth: '50vw', overflow: 'auto'}}>
            <Grid container spacing={1} alignItems="center" justifyContent="center" sx={{mt: 4}}>
                <Grid container item spacing={3}>
                    <Box sx={{width: '100%', display: 'flex', flexDirection: 'row', gap:4, margin: '10px'}} >
                        {(criteria < 12) && <Grid item xs={(12-criteria)/2}></Grid>}
                        {Array(criteria <= MAX_CRITERIA ? criteria : MAX_CRITERIA).fill(0).map((_, col) => {
                            return (
                                <Grid key={`weight-${col}`} item xs={2}>
                                    <TextField
                                        style={{width: '80px'}}
                                        key={`${col}`} 
                                        value={userWeights.length === criteria ? userWeights[col]: '0'}
                                        onChange={(e) => handleInputChange(e, col)}
                                        label={`C${col+1}`}
                                    />
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

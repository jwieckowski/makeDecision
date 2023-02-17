import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'

import {RootState } from '../../../redux/index'
import {Box, Grid, Typography, TextField } from '@mui/material'

type ParamType = {
    extension: string
}

export default function InputWeights({extension}: ParamType) {
    const {criteria} = useSelector((state: RootState) => state.calculation)
    const [userWeights, setUserWeights] = useState<string[]>([])
    const [error, setError] = useState<null | string>(null)

    useEffect(() => {
        if (extension === 'crisp') setUserWeights(Array(criteria).fill('0'))
        if (extension === 'fuzzy') setUserWeights(Array(criteria).fill('0, 0, 0'))
    }, [criteria, extension])

    function validateCrispInput (value: any) {
        if (extension === 'fuzzy') return true

        if (!isNaN(+value)) return true
        return false
    }

    function validateInput (arr: string[]) {
        if (extension === 'fuzzy') return
        const sum = arr.reduce((total, value) => Number(total) + Number(value), 0);

        if (arr.some(w => +w === 0)) setError('None of weights should equal 0')
        else if (arr.some(w => +w < 0)) setError('None of weights should equal less than 0')
        else if (Math.round(sum * 100) / 100 !== 1)setError('Weights should sum up to 1')
        else setError(null)
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
        copy[col] = extension === 'crisp' ?
            convertCrispInput(e.target.value)
            :
            e.target.value
        // convertFuzzyInput(e.target.value)
        setUserWeights(copy);
        validateInput(copy)
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
                        {Array(criteria).fill(0).map((_, col) => {
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
        {error && <Typography>{error}</Typography>}
    </Box>
  )
}

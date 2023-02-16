import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'

import {RootState } from '../../../redux/index'
import {Box, Grid, TextField } from '@mui/material'


type ParamType = {
    extension: string
}
  
export default function InputMatrix({extension} : ParamType) {
    const {alternatives, criteria} = useSelector((state: RootState) => state.calculation)
    const [matrix, setMatrix] = useState<string[][]>([])

    function validateCrispInput (value: any) {
        if (extension === 'fuzzy') return true

        if (!isNaN(+value)) return true
        return false
    }

    function validateFuzzyInput(value: any) {
        if (extension === 'crisp') return true

        return false
    }

    function convertCrispInput(value: string) {
        return value.includes('.') ? value : Number(value).toString()
    }

    function convertFuzzyInput(value: string) {
        let splitted = value.split(',')
        // console.log(splitted)
    }

    function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, row: number, col: number) {
        e.preventDefault()

        // validate input
        // if (!validateCrispInput(e.target.value) || !validateFuzzyInput(e.target.value)) return 
        if (!validateCrispInput(e.target.value)) return 
        
        let copy = [...matrix];
        copy[row][col] = extension === 'crisp' ?
            convertCrispInput(e.target.value)
            :
            e.target.value
        // convertFuzzyInput(e.target.value)
        setMatrix(copy);
    }


    useEffect(() => {
        if (extension === 'crisp') setMatrix(Array(alternatives).fill(null).map(()=>Array(criteria).fill('0')))
        if (extension === 'fuzzy') setMatrix(Array(alternatives).fill(null).map(()=>Array(criteria).fill('0, 0, 0')))
    }, [alternatives, criteria, extension])
      
    return (
        <Box sx={{minWidth: '100%', maxWidth: '50vw', maxHeight: '40vh', overflow: 'auto'}}>

            <Box>
                <Grid container spacing={1} alignItems="center" justifyContent="center" sx={{mt: 4}}>
                    <Grid container item spacing={3}>
                        {(matrix.length > 0 && matrix[0].length > 0) && Array(alternatives).fill(0).map((_, row) => {
                            return (
                                <Box sx={{width: '100%', display: 'flex', flexDirection: 'row', gap:5, margin: '10px'}} >
                                    {(criteria < 12) && <Grid item xs={(12-criteria)/2}></Grid>}
                                    {Array(criteria).fill(0).map((_, col) => {
                                        return (
                                            <Grid key={`row-${row}-${col}`} item xs={2}>
                                                <TextField
                                                    key={`${row}-${col}`} 
                                                    value={matrix.length === alternatives ? matrix[row][col]: '0'}
                                                    onChange={(e) => handleInputChange(e, row, col)}
                                                />
                                            </Grid>
                                        )
                                        })
                                    }
                                    {(criteria < 12) && <Grid item xs={(12-criteria)/2}></Grid>}
                                </Box>
                            )})
                        }
                    </Grid>   
                </Grid>
            </Box>

        </Box>
    )
}
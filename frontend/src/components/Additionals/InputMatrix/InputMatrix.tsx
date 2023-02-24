import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'

import {RootState, useAppDispatch } from '../../../redux/index'
import {Box, Grid, TextField, Typography } from '@mui/material'
import {setBlockMatrix} from '../../../redux/slices/blocksSlice'
import {MAX_ALTERNATIVES, MAX_CRITERIA} from '../../../common/const'

type ParamType = {
    extension: string
}

export default function InputMatrix({extension} : ParamType) {
    const dispatch = useAppDispatch()
    const {alternatives, criteria} = useSelector((state: RootState) => state.calculation)
    const {activeBlock, blocks} = useSelector((state: RootState) => state.blocks)
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
        copy = copy.map((r, idx) => {
            return idx === row
                ? r.map((c, idxx) => {
                    return idxx === col
                        ? extension === 'crisp' ?
                            convertCrispInput(e.target.value)
                            :
                            e.target.value
                        : c
                })
                : r
        })
        setMatrix([...copy]);
        dispatch(setBlockMatrix({id: activeBlock?.id, data: [...copy.map(r => {
            return r.map(c => +c)
        })]}))
    }

    useEffect(() => {
        let value = ''
        if (extension === 'crisp') value = '0'
        else if (extension === 'fuzzy') value = '0, 0, 0'
        setMatrix(Array(alternatives <= MAX_ALTERNATIVES ? alternatives : MAX_ALTERNATIVES).fill(null).map(()=>Array(criteria <= MAX_CRITERIA ? criteria : MAX_CRITERIA).fill(value)))
    }, [alternatives, criteria, extension])
    
    useEffect(() => {
        if (activeBlock?.id === undefined) return
        const block = blocks.filter(b => b._id === activeBlock?.id)
        if (block[0].data.matrix.length === 0) return 

        if (alternatives > 0 && criteria > 0) {
            
            let copy = Array(alternatives <= MAX_ALTERNATIVES ? alternatives : MAX_ALTERNATIVES).fill(null).map(()=>Array(criteria <= MAX_CRITERIA ? criteria : MAX_CRITERIA).fill('0'))
            copy = copy.map((r, idx) => {
                return r.map((c, idxx) => {
                    return idx < block[0].data.matrix.length && idxx < block[0].data.matrix[0].length ? block[0].data.matrix[idx][idxx].toString() : c
                })
            })
            setMatrix([...copy])
        }
    }, [])

    return (
        <Box sx={{minWidth: '100%', maxWidth: '50vw', maxHeight: '35vh', overflow: 'auto'}}>
            <Box>
                <Grid container spacing={1} alignItems="center" justifyContent="center" sx={{mt: 1}}>
                    <Grid container item spacing={3}>
                        <Box sx={{width: '100%', display: 'flex', flexDirection: 'row', gap: 2, margin: '10px'}} >
                            {(criteria < 12) && <Grid item xs={(12-criteria)/2}></Grid>}
                                {(matrix.length > 0 && matrix[0].length > 0) && Array(criteria+1 <= MAX_CRITERIA+1 ? criteria+1 : MAX_CRITERIA+1).fill(0).map((_, col) => {
                                    return (
                                        <Grid key={`col-label-${col}`} item xs={2}>
                                            <Typography sx={{width: '80px'}} align='center'>
                                                {col === 0 ? '' : `C${col}`}
                                            </Typography>
                                        </Grid>
                                    )
                                })}
                            {(criteria < 12) && <Grid item xs={(12-criteria)/2}></Grid>}
                        </Box>
                        {(matrix.length > 0 && matrix[0].length > 0) && Array(alternatives <= MAX_ALTERNATIVES ? alternatives : MAX_ALTERNATIVES).fill(0).map((_, row) => {
                            return (
                                <Box sx={{width: '100%', display: 'flex', flexDirection: 'row', gap:2, margin: '10px'}} >
                                    {(criteria < 12) && <Grid item xs={(12-criteria)/2}></Grid>}
                                    {Array(criteria+1 <= MAX_CRITERIA+1 ? criteria+1 : MAX_CRITERIA+1).fill(0).map((_, col) => {
                                        return (
                                            <Grid key={`row-${row}-${col}`} item xs={2}>
                                                {
                                                    col === 0
                                                        ?
                                                            <Typography sx={{width: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                                                                A{row+1}
                                                            </Typography>
                                                        :
                                                            <TextField
                                                                style={{width: '80px'}}
                                                                key={`${row}-${col}`} 
                                                                value={matrix.length === alternatives ? matrix[row][col-1]: '0'}
                                                                onChange={(e) => handleInputChange(e, row, col-1)}
                                                            />
                                                }
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
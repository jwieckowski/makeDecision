import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'

import {Box, Grid, Typography, FormControl, InputLabel, MenuItem } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {RootState, useAppDispatch } from '../../../redux/index'
import { setBlockTypes } from '../../../redux/slices/blocksSlice';
import { MAX_CRITERIA } from '../../../common/const';
import { BlockType } from '../../../redux/types';

export default function CriteriaTypes() {
  const dispatch = useAppDispatch()
  const {criteria} = useSelector((state: RootState) => state.calculation)
  const {blocks, activeBlock} = useSelector((state: RootState) => state.blocks)
  const [criteriaTypes, setCriteriaTypes] = useState<string[]>([])
  const [block, setBlock] = useState<BlockType | null>(null)

  useEffect(() => {
    setBlock(blocks.filter(b => b._id === activeBlock?.id)[0])
  }, [blocks])

  useEffect(() => {
    if (activeBlock?.id === undefined) return
    if (criteria > MAX_CRITERIA) return
    if (block === null) {
      setCriteriaTypes(Array(criteria).fill('1'))
      return
    }
    else dispatch(setBlockTypes({id: activeBlock?.id, data: block.data.types.filter((c, idx) => idx < criteria)}))
  }, [criteria])

  useEffect(() => {
    if (activeBlock?.id === undefined) return
    if (criteria > MAX_CRITERIA) return
    if (block === null) return
    if (block.data.types.length === 0) return 

    if (criteria > 0) {            
      let copy = Array(criteria <= MAX_CRITERIA ? criteria : MAX_CRITERIA).fill('1')
      copy = copy.map((r, idx) => {
        return idx < block.data.types.length ? block.data.types[idx] : r
      })
      setCriteriaTypes([...copy])
    }
  }, [])

  const handleTypeChange = (e: SelectChangeEvent, col: number) => {
    let copy = [...criteriaTypes];
    copy[col] = e.target.value as string
    setCriteriaTypes(copy);
    dispatch(setBlockTypes({id: activeBlock?.id, data: copy}))
  };

  return (
    <Box sx={{m: 4}}>
      <Typography textAlign='center' sx={{m:2}}>
        Criteria types
      </Typography>
      <Box sx={{width: '100%', maxWidth: '50vw', overflow: 'auto'}}>
        <Grid container spacing={1} alignItems="center" justifyContent="center" sx={{mt: 2}}>
            <Grid container item spacing={3}>
                <Box sx={{width: '100%', display: 'flex', flexDirection: 'row', gap:4, margin: '10px'}} >
                  {(criteria < 12) && <Grid item xs={(12-criteria)/2}></Grid>}
                  {Array(criteria <= MAX_CRITERIA ? criteria : MAX_CRITERIA).fill(0).map((_, col) => {
                    return (
                      <Grid key={`weight-${col}`} item xs={2}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">C{col+1}</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={block === null ? '1' : block.data.types[col]}
                            label={`C${col+1}`}
                            style={{width: '80px'}}
                            onChange={(e) => handleTypeChange(e, col)}
                          >
                            <MenuItem value={'1'}>
                              <Typography variant='body2'>
                                Profit
                              </Typography>
                            </MenuItem>
                            <MenuItem value={'-1'}>
                              <Typography variant='body2'>
                                Cost
                              </Typography>
                            </MenuItem>
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
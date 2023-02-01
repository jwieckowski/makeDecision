import React from 'react'
import {Box, Typography} from '@mui/material'

import DragStory from '../../components/DragAndDrop/DragStory'
import CustomModal from '../../components/CustomModal'

import {useSelector} from 'react-redux'
import {RootState} from '../../redux'
import { ResultsType } from '../../redux/types'

import CorrelationTable from '../../components/CorrelationTable'

export default function CalculationPage() {
  const {results} = useSelector((state: RootState) => state.calculation)

  const areResultsAvailable = (results: [] | ResultsType) => {
    if (Array.isArray(results)) return false

    const l1 = results.method.length === 0
    const l2 = results.methodCorrelations.length === 0
    const l3 = results.methodRankings.length === 0
    const l4 = results.rankingCorrelations.length === 0

    return [l1, l2, l3, l4].some(l => l === true) || [l1, l2, l3, l4].every(l => l === false)
  } 

  return (
    <Box
      sx={{height:'60vh', minHeight:'90%'}}
    >
      <DragStory />
      <CustomModal />
      {
        areResultsAvailable(results) &&
        <Box sx={{width: '90%', mx: 'auto', marginTop: '100px', backgroundColor: 'grey', borderRadius: 5}}>
          <Box sx={{p:4}}>
            <Typography textAlign='center' variant='h6'>
              Results
            </Typography>

            {/* METHODS PREFERENCES */}
            <Typography>PREFERENCES</Typography>
            {!Array.isArray(results) && results.method.map(result => {
              return result.map(r => {
                return (
                  <Box sx={{m: '5px 0'}}>
                    <Typography>MCDA method: {r.method}</Typography>
                    <Typography>Weights method: {r.weights}</Typography>
                    <Typography>Weights: {r.weights_value.map(value => value.toFixed(4)).join(', ')}</Typography>
                    <Typography>Preferences: {r.preference.map(value => value.toFixed(4)).join(', ')}</Typography>
                    {!r.error && <Typography>{r.error}</Typography>}
                  </Box>
                )
                })
              })
            }
          
            {/* PREFERENCES CORRELATIONS */}
            <Typography>CORRELATIONS OF PREFERENCES</Typography>
            {!Array.isArray(results) && results.methodCorrelations.map(result => {
              return result.map(r => {
                return (
                  <Box sx={{m: '5px 0'}}>
                    <CorrelationTable correlation={r.correlation} methods={r.methods} results={r.results}/>
                    {!r.error && <Typography>{r.error}</Typography>}
                  </Box>
                )
                })
              })
            }

            {/* METHODS RANKINGS */}
            <Typography>RANKINGS</Typography>
            {!Array.isArray(results) && results.methodRankings.map(result => {
              return result.map(res => {
                return res.map(r => {
                    return (
                      <Box sx={{m: '5px 0'}}>
                        <Typography>MCDA method: {r.methods.method.toUpperCase()}</Typography>
                        <Typography>Weights method: {r.methods.weights.toUpperCase()}</Typography>
                        <Typography>Ranking: {r.ranking.join(', ')}</Typography>
                        {!r.error && <Typography>{r.error}</Typography>}
                      </Box>
                  )
                })
                })
              })
            }

            {/* RANKINGS CORRELATIONS */}
            <Typography>CORRELATIONS OF RANKINGS</Typography>
            {!Array.isArray(results) && results.rankingCorrelations.map(result => {
              return result.map(r => {
                return (
                  <Box sx={{m: '5px 0'}}>
                    <CorrelationTable correlation={r.correlation} methods={r.methods} results={r.results}/>
                    {!r.error && <Typography>{r.error}</Typography>}
                  </Box>
                )
                })
              })
            }

          </Box>
        </Box>
      }
    </Box>
  )
}

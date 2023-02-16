import React from 'react'
import {Box, Typography} from '@mui/material'

import DragStory from '../../components/DragAndDrop/DragStory'
import CustomModal from '../../components/CustomModal'

import {useSelector} from 'react-redux'
import {RootState} from '../../redux'
import { ResultsType } from '../../redux/types'

import PreferencesResults from '../../components/Results/Preferences'
import PreferencesCorrelationsResults from '../../components/Results/PreferencesCorrelations'
import RankingResults from '../../components/Results/Ranking'
import RankingCorrelationsResults from '../../components/Results/RankingCorrelations'

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

            <PreferencesResults />
            <PreferencesCorrelationsResults />
            <RankingResults />
            <RankingCorrelationsResults />

          </Box>
        </Box>
      }
    </Box>
  )
}

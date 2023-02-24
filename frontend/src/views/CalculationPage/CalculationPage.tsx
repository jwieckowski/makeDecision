import React, {useEffect} from 'react'
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

import Loader from '../../components/Loader'
import ErrorContent from '../../components/ErrorContent'

export default function CalculationPage() {
  const {results, loading, error} = useSelector((state: RootState) => state.calculation)

  useEffect(() => {
    if (error === null) return
    const element = document.getElementById('calculation-error');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [error])

  const areResultsAvailable = (results: [] | ResultsType) => {
    if (Array.isArray(results)) return false

    const l1 = results.method.length === 0
    const l2 = results.methodCorrelations.length === 0
    const l3 = results.methodRankings.length === 0
    const l4 = results.rankingCorrelations.length === 0

    return [l1, l2, l3, l4].some(l => l === false)
  } 

  let content = <Loader />
  if (!loading) {
    if (!error) {
      content =
      <Box sx={{width: '90%', mx: 'auto', marginTop: '300px', backgroundColor: 'grey', borderRadius: 5}}>
        {areResultsAvailable(results) && 
        <Box sx={{p:4}}>
          <Typography textAlign='center' variant='h6'>
            Results
          </Typography>

          <>
          <PreferencesResults />
          <PreferencesCorrelationsResults />
          <RankingResults />
          <RankingCorrelationsResults />
          </>
        </Box>
        }
      </Box>
    } else {
      content = 
        <Box sx={{width: '80%', margin: '0px 10%'}} id='calculation-error'>
          <ErrorContent message={error}/>
        </Box>
    }
  }

  return (
    <Box
      sx={{minHeight:'90%', height: '60vh'}}
    >
      <DragStory />
      <CustomModal />
      {content}
    </Box>
  )
}

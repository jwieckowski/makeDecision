import React from 'react'
import {Box, Typography} from '@mui/material'

import {useSelector} from 'react-redux'
import {RootState} from '../../../redux'

import PreferenceTable from '../../Tables/PreferenceTable'

export default function PreferencesResults() {
  const {results} = useSelector((state: RootState) => state.calculation)

  return !Array.isArray(results)
    ? 
      <Box>
        {results.method.length > 0 && <Typography variant='h6'>PREFERENCES</Typography>}
        {
          results.method.map((result, idx)=> {
            return (
              <Box sx={{m: '5px 0'}}>
                <PreferenceTable results={result} idx={idx}/>
              </Box>
            ) 
          })
        }
      </Box>
    :
      <></>
}

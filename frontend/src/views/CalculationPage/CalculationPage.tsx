import React from 'react'
import {Box} from '@mui/material'

import DragStory from '../../components/DragAndDrop/DragStory'
import CustomModal from '../../components/CustomModal'


export default function CalculationPage() {

  return (
    <Box
      sx={{height:'60vh', minHeight:'90%'}}
    >
      <DragStory />
      <CustomModal />
      <Box sx={{width: '90%', mx: 'auto', marginTop: '100px', backgroundColor: 'grey', borderRadius: 5}}>
        Results
      </Box>
    </Box>
  )
}

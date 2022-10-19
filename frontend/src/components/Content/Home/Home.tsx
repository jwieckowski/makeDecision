import React from 'react'

import Grid from '@mui/material/Grid';
import DnD from '../../UI/DnD'

export default function Home() {

  return (
    <Grid
      container
      direction='column'
      justifyContent='start'
      alignItems='center'
      flexDirection='row'
      style={{width: '100%', height: '90%', border: '3px solid black', backgroundColor: '#EEE'}}
    >
      <DnD />
   </Grid>
  )
}
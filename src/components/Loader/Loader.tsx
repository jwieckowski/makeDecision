import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loader() {
  return (
    <Box sx={{height: '700px', display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
      <CircularProgress size='80px'/>
    </Box>
  );
}
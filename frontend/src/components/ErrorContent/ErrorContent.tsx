import * as React from 'react';
import Box from '@mui/material/Box';
import { Typography, Button } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import {useAppDispatch} from '../../redux/'

type ErrorContentProps = {
  cb: Function
}

export default function ErrorContent({cb}: ErrorContentProps) {
  const dispatch = useAppDispatch()

  return (
    <Box sx={{height: '700px', display: 'flex', flexGrow: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <Typography variant='h3' textAlign='center'>
        Error occured...
      </Typography>
      <Button sx={{margin: '20px 0'}} variant='contained' onClick={() => dispatch(cb())}>
          <ReplayIcon />
          Reload
        </Button>
    </Box>
  );
}
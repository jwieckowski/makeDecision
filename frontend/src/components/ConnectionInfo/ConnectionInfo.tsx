import React from 'react'
import { useSelector } from 'react-redux';

import { RootState, useAppDispatch } from '../../redux';
import { Box, Typography, Button } from '@mui/material'
import { deleteConnection, setModalOpen } from '../../redux/slices/blocksSlice';

export default function ConnectionInfo() {
  const dispatch = useAppDispatch()  
  const { connectionToDelete } = useSelector((state: RootState) => ({ ...state.blocks }));

  const handleDelete = () => {
    dispatch(deleteConnection(connectionToDelete))
    dispatch(setModalOpen(false))
  }

  const handleNoDelete = () => {
    dispatch(setModalOpen(false))
  }

  return (
    <Box sx={{width: '100%', margin: 'auto', border: '1px solid black', borderRadius: 2, p: 4}}>
        <Box sx={{m: 1}}>
          <Typography textAlign='center' variant='h6'>
            Usuwanie połączenia
          </Typography>
          <Typography textAlign='center' variant='body1' sx={{mt:3}}>
            Czy na pewno chcesz usunąć to połączenie?
          </Typography>
          <Box sx={{width: '100%', display: 'flex', justifyContent:'space-around', mt:3}}>
            <Button onClick={handleDelete}>
                Tak
            </Button>
            <Button onClick={handleNoDelete}>
                Nie
            </Button>
          </Box>
        </Box>
    </Box>
  )
}

import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box'

import { setModalOpen } from '../../redux/slices/blocksSlice';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux'

import Additionals from '../Additionals';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function CustomModal() {
  const dispatch = useAppDispatch()
  const { modalOpen } = useSelector((state: RootState) => state.blocks)
  const handleClose = () => dispatch(setModalOpen(false));

  return (
    <div>
      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Additionals/>
        </Box>
      </Modal>
    </div>
  );
}
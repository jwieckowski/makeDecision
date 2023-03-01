import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box'

import { setModalOpen, setModalType } from '../../redux/slices/blocksSlice';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux'

import Additionals from '../Additionals';
import ConnectionInfo from '../ConnectionInfo';

import { MODAL_MIN_WIDTH, MODAL_MAX_WIDTH } from '../../common/const';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: MODAL_MIN_WIDTH,
  maxWidth: MODAL_MAX_WIDTH,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: 5,
  boxShadow: 24,
  p: 2,
};

export default function CustomModal() {
  const dispatch = useAppDispatch()
  const { modalOpen, modalType } = useSelector((state: RootState) => state.blocks)
  
  const handleClose = () => {
    dispatch(setModalOpen(false));
    dispatch(setModalType(null))
  }

  return (
    <div>
      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal"
        aria-describedby="modal with additional parameters for multi-criteria calculations"
      >
        <Box sx={style}>
          {modalType === 'additionals' && <Additionals/>}
          {modalType === 'connection' && <ConnectionInfo />}
        </Box>
      </Modal>
    </div>
  );
}
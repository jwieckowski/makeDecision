import { MouseEvent } from 'react';
import { Box, DialogContent, DialogTitle, Divider, PaperProps, Typography, Paper } from '@mui/material';
import Draggable from 'react-draggable';
import OpenWithIcon from '@mui/icons-material/OpenWith';

import { useTranslation } from 'react-i18next';

// COMPONENTS
import ErrorsList from './ErrorsList';
import Button from '@/components/Button';
import { useAppDispatch } from '@/state';
import { setErrorModalOpen } from '@/state/slices/calculationSlice';

const DraggableBoxComponent = (props: PaperProps) => {
  return (
    <Draggable
      defaultPosition={{ x: -200, y: -200 }}
      bounds={{
        top: -window.innerHeight / 2,
        right: window.innerWidth / 3,
        bottom: window.innerHeight / 2,
        left: -window.innerWidth / 2,
      }}
    >
      <Paper {...props} sx={{ bgcolor: '#eaeaea', border: '2px solid black', cursor: 'move' }} />
    </Draggable>
  );
};

export default function DraggableModal() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(setErrorModalOpen(false));
  };

  return (
    <Box
      onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      component={DraggableBoxComponent}
      aria-labelledby="draggable-modal-structure-error"
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1300,
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography style={{ textTransform: 'uppercase', fontSize: 16, fontWeight: 'bold' }}>
          {t('results:model-structure-errors')}
        </Typography>
        <OpenWithIcon />
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ padding: 0, margin: 0 }}>
        <ErrorsList />
      </DialogContent>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <Button text={t('common:close')} onClick={handleClose} variant="contained" />
      </Box>
    </Box>
  );
}

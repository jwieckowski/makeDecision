import React, { useState, useEffect, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

// REDUX
import { useAppSelector } from '@/state';

// TYPES
import { BlockType } from '@/types';

// COMPONENTS
import Button from '@/components/Button';
import ModalContent from './ModalContent';

type ModalProps = {
  open: boolean;
  content: string;
  closeModal: () => void;
  handleClose: () => void;
  handleSave: () => void;
  textSave?: null | string;
  textCancel?: null | string;
  fullScreen?: boolean;
  closeButton?: boolean;
};

type Dictionary = {
  [key: string]: string;
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomModal({
  open,
  content,
  closeModal,
  handleClose,
  handleSave,
  textSave,
  textCancel,
  fullScreen,
}: ModalProps) {
  const { blocks, activeBlock } = useAppSelector((state) => state.blocks);
  const [block, setBlock] = useState<BlockType | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!activeBlock?.id) return;
    if (blocks.filter((b) => b.id === activeBlock?.id).length === 0) return;
    setBlock(() => blocks.filter((b) => b.id === activeBlock?.id)[0]);
  }, [blocks, activeBlock]);

  const titles: Dictionary = {
    matrix: t('results:matrix'),
    weights: t('results:weights'),
    method: t('results:method'),
    connection: t('results:connection'),
    usage: t('common:application-purpose'),
  };

  return (
    <BootstrapDialog
      onClick={(e) => e.stopPropagation()}
      onClose={closeModal}
      aria-labelledby="custom-modal"
      open={open}
      maxWidth="md"
      fullWidth={fullScreen}
      TransitionComponent={Transition}
      scroll="paper"
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'flex-start',
        },
      }}
      PaperProps={{ sx: { mt: '50px' } }}
    >
      <DialogTitle sx={{ m: 0, p: 2, textAlign: 'center' }} id="custom-modal">
        <Typography id="modal-title" align="center" sx={{ fontWeight: 'bold', fontSize: '20px' }}>
          {titles[content] ? titles[content] : null}
        </Typography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={closeModal}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'black',
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <ModalContent content={content} data={block} />
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          gap={2}
          justifyContent="flex-end"
          onClick={(e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
          }}
        >
          <Button text={textCancel ? textCancel : t('common:cancel')} onClick={handleClose} />
          <Button variant="contained" text={textSave ? textSave : t('common:save')} onClick={handleSave} />
        </Stack>
      </DialogActions>
    </BootstrapDialog>
  );
}

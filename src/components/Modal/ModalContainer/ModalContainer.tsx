import React from 'react';
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

// COMPONENTS
import Button from '@/components/Button';

type ModalProps = {
  title: string;
  open: boolean;
  children: React.ReactElement;
  closeModal: () => void;
  handleClose: () => void;
  handleSave: () => void;
  textSave?: null | string;
  textCancel?: null | string;
  fullScreen?: boolean;
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
  title,
  open,
  children,
  closeModal,
  handleClose,
  handleSave,
  textSave,
  textCancel,
  fullScreen,
}: ModalProps) {
  const { t } = useTranslation();

  return (
    <BootstrapDialog
      onClick={(e) => e.stopPropagation()}
      onClose={closeModal}
      aria-labelledby="custom-modal"
      open={open}
      maxWidth="md"
      fullWidth={fullScreen}
      TransitionComponent={Transition}
    >
      <DialogTitle sx={{ m: 0, p: 2, textAlign: 'center' }} id="custom-modal">
        <Typography id="modal-title" align="center" sx={{ fontWeight: 'bold', fontSize: '20px' }}>
          {title}
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
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Stack direction="row" gap={2} justifyContent="flex-end">
          <Button text={textCancel ? textCancel : t('common:cancel')} onClick={handleClose} />
          <Button variant="contained" text={textSave ? textSave : t('common:save')} onClick={handleSave} />
        </Stack>
      </DialogActions>
    </BootstrapDialog>
  );
}

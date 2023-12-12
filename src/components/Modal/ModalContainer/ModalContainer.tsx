import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@mui/styles';
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
  handleSave: () => void;
  textSave?: null | string;
  textCancel?: null | string;
  fullScreen?: boolean;
  errorText?: string;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  topScrollPaper: {
    alignItems: 'flex-start',
  },
  topPaperScrollBody: {
    verticalAlign: 'top',
  },
});

export default function ModalContainer({
  title,
  open,
  children,
  closeModal,
  handleSave,
  textSave,
  textCancel,
  fullScreen,
  errorText,
}: ModalProps) {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Dialog
      onClick={(e) => e.stopPropagation()}
      onClose={closeModal}
      aria-labelledby="custom-modal"
      open={open}
      maxWidth="md"
      fullWidth={fullScreen}
      TransitionComponent={Transition}
      scroll="paper"
      classes={{
        scrollPaper: classes.topScrollPaper,
        paperScrollBody: classes.topPaperScrollBody,
      }}
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
        <Stack
          direction="row"
          gap={2}
          justifyContent={errorText ? 'space-between' : 'flex-end'}
          alignItems="center"
          sx={{ width: '100%' }}
        >
          {errorText ? (
            <Typography align="center" sx={{ color: 'error.main', fontSize: 16, pl: 2 }}>
              {errorText}
            </Typography>
          ) : null}
          <Stack direction="row" gap={2} justifyContent="flex-end">
            <Button text={textCancel ? textCancel : t('common:cancel')} onClick={closeModal} />
            <Button
              variant="contained"
              text={textSave ? textSave : t('common:save')}
              onClick={handleSave}
              disabled={errorText ? true : false}
            />
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

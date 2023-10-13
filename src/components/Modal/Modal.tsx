import React, { useState, useEffect, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

// ICONS
import CloseIcon from '@mui/icons-material/Close';

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
  handleClose?: () => void;
  handleSave?: () => void;
  textSave?: null | string;
  textCancel?: null | string;
  fullScreen?: boolean;
  closeButton?: boolean;
};

type Dictionary = {
  [key: string]: string;
};

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 400,
  minHeight: 300,
  maxWidth: 800,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function CustomModal({
  open,
  content,
  closeModal,
  handleClose,
  handleSave,
  textSave,
  textCancel,
  fullScreen,
  closeButton,
}: ModalProps) {
  const { blocks, activeBlock } = useAppSelector((state) => state.blocks);
  const [block, setBlock] = useState<BlockType | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!activeBlock?.id) return;
    if (blocks.filter((b) => b._id === activeBlock?.id).length === 0) return;
    setBlock(() => blocks.filter((b) => b._id === activeBlock?.id)[0]);
  }, [blocks, activeBlock]);

  const titles: Dictionary = {
    matrix: t('results:matrix'),
    weights: t('results:weights'),
    method: t('results:method'),
    connection: t('results:connection'),
    usage: t('common:application-purpose'),
  };

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <Modal
        aria-labelledby="modal"
        aria-describedby="modal"
        open={open}
        onClose={closeModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Paper sx={style} elevation={4}>
            <Stack direction="column">
              <Stack direction="row" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ width: '20px' }}></Box>
                <Typography id="modal-title" variant="h5" align="center" sx={{ fontWeight: 'bold' }}>
                  {titles[content] ? titles[content] : null}
                </Typography>
                <Box sx={{ width: '20px' }}>
                  {closeButton ? <CloseIcon onClick={closeModal} sx={{ cursor: 'pointer' }} /> : null}
                </Box>
              </Stack>
              <Container id="modal-body" sx={{ mt: 2 }}>
                <ModalContent content={content} data={block} />
              </Container>
              {handleClose || handleSave ? (
                <Stack
                  direction="row"
                  gap={2}
                  justifyContent="flex-end"
                  onClick={(e: MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                  }}
                >
                  {handleClose ? (
                    <Button text={textCancel ? textCancel : t('common:cancel')} onClick={handleClose} />
                  ) : null}
                  {handleSave ? (
                    <Button variant="contained" text={textSave ? textSave : t('common:save')} onClick={handleSave} />
                  ) : null}
                </Stack>
              ) : null}
            </Stack>
          </Paper>
        </Fade>
      </Modal>
    </Box>
  );
}

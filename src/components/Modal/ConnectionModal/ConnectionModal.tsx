import { useTranslation } from 'react-i18next';
import { Container, Typography } from '@mui/material';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';

// SLICES
import { deleteConnection, clearBlockData, setBlockError, deleteDataKwargs } from '@/state/slices/blocksSlice';

// UTILS
import useBlocksConnection from '@/utils/connections';

// COMPONENTS
import ModalContainer from '../ModalContainer';

type ModalProps = {
  open: boolean;
  closeModal: () => void;
  textSave?: null | string;
  textCancel?: null | string;
  fullScreen?: boolean;
};

export default function ConnectionModal({ open, closeModal, textSave, textCancel, fullScreen }: ModalProps) {
  const { connectionToDelete } = useAppSelector((state) => state.blocks);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { deleteKwargsFromMatrix, deleteConnectionArrow } = useBlocksConnection();

  const handleSave = () => {
    if (connectionToDelete?.length !== 2) return;

    deleteConnectionArrow(connectionToDelete);

    // delete kwargs if last connected weights from given matrix removed
    deleteKwargsFromMatrix(connectionToDelete);

    dispatch(deleteConnection(connectionToDelete));

    closeModal();
  };

  return (
    <ModalContainer
      title={t('results:connection')}
      open={open}
      closeModal={closeModal}
      handleSave={handleSave}
      textSave={textSave}
      textCancel={textCancel}
      fullScreen={fullScreen}
    >
      <Container>
        <Typography align="center" my={3}>
          {t('common:connection-delete-confirm')}
        </Typography>
      </Container>
    </ModalContainer>
  );
}

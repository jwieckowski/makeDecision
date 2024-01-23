import { useTranslation } from 'react-i18next';
import { Container, Typography } from '@mui/material';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';

// SLICES
import { deleteConnection, clearBlockData, setBlockError, deleteDataKwargs } from '@/state/slices/blocksSlice';

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
  const { connectionToDelete, connections, blocks } = useAppSelector((state) => state.blocks);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleSave = () => {
    if (connectionToDelete?.length !== 2) return;

    connectionToDelete.forEach((connection) => {
      if (connections.filter((con) => con.includes(connection)).length === 1) {
        dispatch(
          setBlockError({
            id: +connection,
            error: true,
          }),
        );
      }
    });
    const outputBlock = blocks.find((block) => block.id === +connectionToDelete[1]);
    // delete kwargs if last connected weights from given matrix removed
    if (outputBlock?.type.toLowerCase() === 'method') {
      const weightsConnections = connections.filter((c) => c[1] === connectionToDelete[1]).map((c) => c[0]);
      const matricesId = connections.filter((c) => c[1] === connectionToDelete[0]).map((c) => c[0]);
      const matrixConnections = connections.filter((c) => matricesId.includes(c[0]));

      matrixConnections.forEach((matrix) => {
        if (matrixConnections.filter((m) => weightsConnections.includes(m[1])).length === 1) {
          dispatch(
            deleteDataKwargs({
              id: +connectionToDelete[1],
              matrixId: +matrix[0],
            }),
          );
        }
      });
    } else {
      dispatch(clearBlockData({ id: +connectionToDelete[1] }));
    }

    dispatch(deleteConnection(connectionToDelete));

    // CLEAR DATA IN SECOND NODE
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

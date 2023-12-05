import { useTranslation } from 'react-i18next';
import { Container, Typography } from '@mui/material';

// COMPONENTS
import ModalContainer from '../ModalContainer';

type ModalProps = {
  open: boolean;
  closeModal: () => void;
  confirmModal: () => void;
};

export default function ModificationModal({ open, closeModal, confirmModal }: ModalProps) {
  const { t } = useTranslation();

  return (
    <ModalContainer
      title={t('results:unsaved-data')}
      open={open}
      closeModal={closeModal}
      handleSave={confirmModal}
      textSave={t('common:yes')}
      textCancel={t('common:no')}
    >
      <Container>
        <Typography align="center" my={3}>
          {t('results:cancel-modified-data')}
        </Typography>
      </Container>
    </ModalContainer>
  );
}

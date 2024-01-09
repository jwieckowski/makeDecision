import { t } from 'i18next';
import { Container, Typography, Alert, AlertTitle } from '@mui/material';

type ErrorProps = {
  message?: string;
};

export default function Error({ message }: ErrorProps) {
  return (
    <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5 }}>
      <Alert severity="error">
        <AlertTitle>
          <Typography variant="h5">{message ?? t('common:general-error')}</Typography>
        </AlertTitle>
        <Typography variant="h6">{t('common:try-again-later')}</Typography>
      </Alert>
    </Container>
  );
}

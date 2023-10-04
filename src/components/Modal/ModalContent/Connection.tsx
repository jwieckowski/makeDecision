import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Typography } from '@mui/material';

export default function Connection() {
  const { t } = useTranslation();
  return (
    <Container>
      <Typography align="center" my={3}>
        {t('common:connection-delete-confirm')}
      </Typography>
    </Container>
  );
}

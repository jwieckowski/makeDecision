import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Stack, Typography, Divider } from '@mui/material';

// COMPONENTS
import Image from '@/components/Image';
import LinedSubheader from '@/components/LinedSubheader';

// HOOKS
import { useLocale } from '@/hooks';

// ASSETS
import fc1_EN from '@/assets/img/MCDA_EN.png';
import fc1_PL from '@/assets/img/MCDA_PL.png';
import fc2_EN from '@/assets/img/APP_FLOW_EN.png';
import fc2_PL from '@/assets/img/APP_FLOW_PL.png';

export default function MCDA() {
  const { locale } = useLocale();
  const { t } = useTranslation();

  return (
    <Container sx={{ my: '50px' }}>
      <Typography variant="h5" mb={4} sx={{ fontWeight: 'bold' }}>
        {t('about:tab-1').toUpperCase()}
      </Typography>

      <Stack gap={4}>
        <LinedSubheader label={t('about:mcda-problems')} />

        <Typography align="justify">{t('about:mcda-description-text-1')}</Typography>

        <Typography align="justify">{t('about:mcda-description-text-2')}</Typography>

        <Container sx={{ display: 'flex', justifyContent: 'center' }}>
          <Image
            src={locale === 'en' ? fc1_EN : fc1_PL}
            alt={t('home:fig-alt-mcda-flow')}
            width={600}
            maxWidth={'100%'}
          />
        </Container>

        <Typography align="justify">{t('about:mcda-description-text-3')}</Typography>
      </Stack>

      <Stack gap={4} mt={3}>
        <LinedSubheader label={t('about:app-mcda')} />

        <Typography align="justify">{t('about:app-functions-text-1')}</Typography>

        <Typography align="justify">{t('about:app-functions-text-2')}</Typography>

        <Container sx={{ display: 'flex', justifyContent: 'center' }}>
          <Image
            src={locale === 'en' ? fc2_EN : fc2_PL}
            alt={t('home:fig-alt-app-flow')}
            width={800}
            maxWidth={'100%'}
          />
        </Container>

        <Typography align="justify">{t('about:app-functions-text-3')}</Typography>
      </Stack>
    </Container>
  );
}

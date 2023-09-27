import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Container, Stack, Typography } from '@mui/material';

// COMPONENTS
import Image from '@/components/Image';
import Button from '@/components/Button';

// HOOKS
import { useLocale } from '@/hooks';

// ASSETS
import fc1_EN from '@/assets/img/APP_BLOCKS_EN.png';
import fc1_PL from '@/assets/img/APP_BLOCKS_PL.png';
import structure1_PL from '@/assets/img/STRUCTURE_1_PL.png';
import structure1_EN from '@/assets/img/STRUCTURE_1_EN.png';
import structure2_PL from '@/assets/img/STRUCTURE_2_PL.png';
import structure2_EN from '@/assets/img/STRUCTURE_2_EN.png';
import structure3_PL from '@/assets/img/STRUCTURE_3_PL.png';
import structure3_EN from '@/assets/img/STRUCTURE_3_EN.png';
import structure4_PL from '@/assets/img/STRUCTURE_4_PL.png';
import structure4_EN from '@/assets/img/STRUCTURE_4_EN.png';

export default function Instruction() {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Container sx={{ my: '50px' }}>
      <Typography variant="h5" mb={4} sx={{ fontWeight: 'bold' }}>
        {t('about:tab-2').toUpperCase()}
      </Typography>

      <Stack gap={5}>
        {/* APPLICATION BLOCKS */}
        <Stack gap={3}>
          <Typography align="justify">{t('about:instructions-text-1')}</Typography>

          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {t('about:connections-structure').toUpperCase()}
          </Typography>

          <Typography align="justify">{t('about:connections-structure-text-1')}</Typography>

          <Typography align="justify">{t('about:connections-structure-text-2')}</Typography>

          <Typography align="justify">{t('about:connections-structure-text-3')}</Typography>

          <Container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Image
              src={locale === 'en' ? fc1_EN : fc1_PL}
              alt={t('home:fig-alt-app-flow')}
              width={500}
              maxWidth={'100%'}
            />
          </Container>
        </Stack>

        {/* BASIC STRUCTURE */}
        <Stack gap={3}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {t('about:basic-structure').toUpperCase()}
          </Typography>

          <Typography align="justify">{t('about:basic-structure-text-1')}</Typography>

          <Typography align="justify">{t('about:basic-structure-text-2')}</Typography>

          <Container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Image
              src={locale === 'en' ? structure1_EN : structure1_PL}
              alt={t('home:fig-alt-app-flow')}
              width={800}
              maxWidth={'100%'}
            />
          </Container>
        </Stack>

        {/* MULTIPLE METHODS STRUCTURE */}
        <Stack gap={3}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {t('about:multiple-mcda-structure').toUpperCase()}
          </Typography>

          <Typography align="justify">{t('about:multiple-mcda-structure-text-1')}</Typography>

          <Container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Image
              src={locale === 'en' ? structure2_EN : structure2_PL}
              alt={t('home:fig-alt-app-flow')}
              width={800}
              maxWidth={'100%'}
            />
          </Container>
        </Stack>

        {/* MULTIPLE WEIGHTS STRUCTURE */}
        <Stack gap={3}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {t('about:multiple-weights-structure').toUpperCase()}
          </Typography>

          <Typography align="justify">{t('about:multiple-weights-structure-text-1')}</Typography>

          <Container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Image
              src={locale === 'en' ? structure3_EN : structure3_PL}
              alt={t('home:fig-alt-app-flow')}
              width={800}
              maxWidth={'100%'}
            />
          </Container>
        </Stack>

        {/* COMPLEX STRUCTURE */}
        <Stack gap={3}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {t('about:complex-structure').toUpperCase()}
          </Typography>

          <Typography align="justify">{t('about:complex-structure-text-1')}</Typography>

          <Typography align="justify">{t('about:complex-structure-text-2')}</Typography>

          <Container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Image
              src={locale === 'en' ? structure4_EN : structure4_PL}
              alt={t('home:fig-alt-app-flow')}
              width={800}
              maxWidth={'100%'}
            />
          </Container>

          <Typography align="justify">{t('about:complex-structure-text-3')}</Typography>

          <Typography align="justify">{t('about:complex-structure-text-4')}</Typography>
        </Stack>

        <Typography align="justify">{t('about:application-tutorial')}</Typography>

        <Button text={t('home:home-button-calculation')} onClick={() => navigate(`/calculations`)} />
      </Stack>
    </Container>
  );
}

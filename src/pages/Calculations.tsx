import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Stack, Typography } from '@mui/material';

// ICONS
import AspectRatioIcon from '@mui/icons-material/AspectRatio';

// REDUX
import { useAppSelector } from '@/state';

// COMPONENTS
import SettingsBar from './CalculationContent/SettingsBar';
import DragStory from './CalculationContent/DragStory';
import Results from './CalculationContent/Results';

// UTILS
import { scrollToElement } from '@/utils/scroll';

export default function Calculations() {
  const { t } = useTranslation();
  const { results } = useAppSelector((state) => state.calculation);

  useEffect(() => {
    if (results == null) return;

    scrollToElement('resultsContainer');
  }, [results]);

  return (
    <Container maxWidth={false} sx={{ mb: '50px' }} disableGutters>
      <Container maxWidth={false} sx={{ display: { xs: 'none', md: 'block' } }} disableGutters>
        <Container maxWidth={false} disableGutters sx={{ minHeight: '60px', backgroundColor: 'white' }}>
          <SettingsBar />
        </Container>
        <Container maxWidth={false} disableGutters sx={{ minHeight: '70vh', marginTop: 2 }}>
          <DragStory />
        </Container>
        {results !== null ? (
          <Container maxWidth={false} disableGutters sx={{ marginTop: 2 }}>
            <Results />
          </Container>
        ) : null}
      </Container>
      <Container
        sx={{
          display: { xs: 'flex', md: 'none' },
        }}
      >
        <Stack gap={3} sx={{ marginTop: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography align="center" variant="h4">
            {t('results:work-area')}
          </Typography>
          <AspectRatioIcon sx={{ fontSize: 60 }} />
          <Typography align="center" variant="h6">
            {t('results:work-area-size')}
          </Typography>
          <Typography align="center" variant="h6">
            {t('results:bigger-screen')}
          </Typography>
        </Stack>
      </Container>
    </Container>
  );
}

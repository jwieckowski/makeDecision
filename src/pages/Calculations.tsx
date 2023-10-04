import { useTranslation } from 'react-i18next';
import { Container, Stack, Typography, Divider } from '@mui/material';

// COMPONENTS
import SettingsBar from './CalculationContent/SettingsBar';
import DragStory from './CalculationContent/DragStory';

export default function Calculations() {
  const { t } = useTranslation();

  return (
    <Container maxWidth={false} sx={{ mb: '50px' }} disableGutters>
      <Container maxWidth={false} sx={{ display: { xs: 'none', md: 'block' } }} disableGutters>
        <Container maxWidth={false} disableGutters sx={{ minHeight: '60px', backgroundColor: 'white' }}>
          <SettingsBar />
        </Container>
        <Container maxWidth={false} disableGutters sx={{ minHeight: '70vh', marginTop: 2 }}>
          <DragStory />
        </Container>
      </Container>
      <Container
        sx={{
          display: { xs: 'flex', md: 'none' },
        }}
      >
        <Stack gap={3}>
          <Typography align="center">{t('results:work-area')}</Typography>
          <Typography align="center">{t('results:work-area-size')}</Typography>
          <Typography align="center">{t('results:bigger-screen')}</Typography>
        </Stack>
      </Container>
    </Container>
  );
}

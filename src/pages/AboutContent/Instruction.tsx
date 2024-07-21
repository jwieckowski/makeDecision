import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Container, Stack, Typography } from '@mui/material';

// COMPONENTS
import Image from '@/components/Image';
import Button from '@/components/Button';
import LinedSubheader from '@/components/LinedSubheader';

// ASSETS
import appBlocks from '@/assets/img/APP_BLOCKS.png';
import struct1 from '@/assets/img/Struct1.png';
import struct2 from '@/assets/img/Struct2.png';
import struct3 from '@/assets/img/Struct3.png';
import struct4 from '@/assets/img/Struct4.png';
import struct5 from '@/assets/img/Struct5.png';

export default function Instruction() {
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

          <LinedSubheader label={t('about:connections-structure').toUpperCase()} />

          <Typography align="justify">{t('about:connections-structure-text-1')}</Typography>

          <Typography align="justify">{t('about:connections-structure-text-2')}</Typography>

          <Typography align="justify">{t('about:connections-structure-text-3')}</Typography>

          <Container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Image src={appBlocks} alt={t('home:fig-alt-app-flow')} width={800} maxWidth={'100%'} />
          </Container>
        </Stack>

        {/* BASIC STRUCTURE */}
        <Stack gap={3}>
          <LinedSubheader label={t('about:basic-structure').toUpperCase()} />

          <Typography align="justify">{t('about:basic-structure-text-1')}</Typography>

          <Container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Image src={struct1} alt={t('home:fig-alt-app-flow')} width={800} maxWidth={'100%'} />
          </Container>
        </Stack>

        {/* MULTIPLE METHODS STRUCTURE */}
        <Stack gap={3}>
          <LinedSubheader label={t('about:multiple-mcda-structure').toUpperCase()} />

          <Typography align="justify">{t('about:multiple-mcda-structure-text-1')}</Typography>
          <Typography align="justify">{t('about:multiple-mcda-structure-text-2')}</Typography>

          <Container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Image src={struct2} alt={t('home:fig-alt-app-flow')} width={800} maxWidth={'100%'} />
          </Container>
        </Stack>

        {/* MULTIPLE WEIGHTS STRUCTURE */}
        <Stack gap={3}>
          <LinedSubheader label={t('about:multiple-weights-structure').toUpperCase()} />

          <Typography align="justify">{t('about:multiple-weights-structure-text-1')}</Typography>

          <Container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Image src={struct3} alt={t('home:fig-alt-app-flow')} width={800} maxWidth={'100%'} />
          </Container>
        </Stack>

        {/* COMPLEX STRUCTURE */}
        <Stack gap={3}>
          <LinedSubheader label={t('about:complex-structure').toUpperCase()} />

          <Typography align="justify">{t('about:complex-structure-text-1')}</Typography>

          <Container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Image src={struct4} alt={t('home:fig-alt-app-flow')} width={800} maxWidth={'100%'} />
          </Container>

          <Typography align="justify">{t('about:complex-structure-text-2')}</Typography>

          <Container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Image src={struct5} alt={t('home:fig-alt-app-flow')} width={800} maxWidth={'100%'} />
          </Container>
        </Stack>

        <Typography align="justify">{t('about:application-tutorial')}</Typography>

        <Button
          variant="contained"
          text={t('home:home-button-calculation')}
          onClick={() => navigate(`/calculations`)}
        />
      </Stack>
    </Container>
  );
}

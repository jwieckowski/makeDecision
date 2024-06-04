import { useTranslation } from 'react-i18next';
import { Container, Stack, Typography, Divider, Grid } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// ICONS
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

// HOOKS
import { useLocale } from '@/hooks';
import useSnackbars from '@/hooks/useSnackbars';

// COMPONENTS
import Image from '@/components/Image';
import LinedSubheader from '@/components/LinedSubheader';
import BibtexItem from '@/components/BibtexItem';

// CONST
import { bibtexData } from '@/common/packages';

// ASSETS
import fc1_EN from '@/assets/img/MCDA_EN.png';
import fc1_PL from '@/assets/img/MCDA_PL.png';
import fc2_EN from '@/assets/img/APP_FLOW_EN.png';
import fc2_PL from '@/assets/img/APP_FLOW_PL.png';
import CardItem from '@/components/CardItem';

export default function Dashboard() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { showSnackbar } = useSnackbars();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bibtexData).then(() => {
      showSnackbar(t('contact:text-copied'), 'success');
    });
  };

  const keywords = [
    {
      id: 1,
      text: t('common:app-keyword-1'),
      color: '#BFC8D7',
    },
    {
      id: 2,
      text: t('common:app-keyword-2'),
      color: '#E2D2D2',
    },
    {
      id: 3,
      text: t('common:app-keyword-3'),
      color: '#E3E2B4',
    },
    {
      id: 4,
      text: t('common:app-keyword-4'),
      color: '#A2B59F',
    },
  ];

  const items = [
    {
      id: 1,
      text: t('home:home-text-mcda-item-1'),
    },
    {
      id: 2,
      text: t('home:home-text-mcda-item-2'),
    },
    {
      id: 3,
      text: t('home:home-text-mcda-item-3'),
    },
    {
      id: 4,
      text: t('home:home-text-mcda-item-4'),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ my: '50px' }}>
      <Divider textAlign="left">
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {t('common:keywords-header').toUpperCase()}
        </Typography>
      </Divider>
      <Grid container spacing={2} mt={1}>
        {keywords.map((item) => {
          return (
            <Grid key={item.id} item xs={12} sm={6} md={3}>
              <CardItem
                sx={{
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: item.color,
                }}
              >
                <Typography sx={{ fontWeight: 'bold' }}>{item.text}</Typography>
              </CardItem>
            </Grid>
          );
        })}
      </Grid>

      <Container sx={{ mt: 4 }}>
        <BibtexItem bibtexData={bibtexData} copyToClipboard={copyToClipboard} titleUppercase={true} />
        <LinedSubheader label={t('home:home-heading-1')} />

        <Stack gap={3} mt={2}>
          <Typography align="justify">{t('home:home-text-mcda-1')}</Typography>

          <Typography align="justify">{t('home:home-text-mcda-2')}</Typography>
          <List>
            {items.map((item) => {
              return (
                <ListItem disablePadding key={item.id}>
                  <ListItemIcon>
                    <ArrowRightAltIcon />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              );
            })}
          </List>

          <Container maxWidth={false} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Image
              src={locale === 'en' ? fc1_EN : fc1_PL}
              alt={t('home:fig-alt-mcda-flow')}
              width={600}
              maxWidth={'100%'}
            />
          </Container>

          <Typography align="justify">{t('home:home-text-mcda-3')}</Typography>

          <Typography align="justify">{t('home:home-text-mcda-4')}</Typography>
        </Stack>
      </Container>
      <Container maxWidth={false} sx={{ mt: 4 }}>
        <LinedSubheader label={t('home:home-heading-2')} />
        <Stack gap={3} mt={2}>
          <Typography align="justify">{t('home:home-text-app-1')}</Typography>

          <Container maxWidth={false} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Image
              src={locale === 'en' ? fc2_EN : fc2_PL}
              alt={t('home:fig-alt-app-flow')}
              width={800}
              maxWidth={'100%'}
            />
          </Container>

          <Typography align="justify">{t('home:home-text-app-2')}</Typography>
        </Stack>
      </Container>
    </Container>
  );
}

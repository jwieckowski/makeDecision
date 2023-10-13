import { useTranslation } from 'react-i18next';
import { Container, Stack, Typography, Box, Divider } from '@mui/material';

// ICONS
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import TerminalIcon from '@mui/icons-material/Terminal';
import ArticleIcon from '@mui/icons-material/Article';
import JavascriptIcon from '@mui/icons-material/Javascript';
import PanToolIcon from '@mui/icons-material/PanTool';
import OpenWithIcon from '@mui/icons-material/OpenWith';

// CONST
import {
  PYMCDM_LABEL,
  PYMCDM_LINK,
  PYMCDM_APA,
  PYMCDM_DOI,
  PYFDM_LABEL,
  PYFDM_LINK,
  PYFDM_APA,
  PYFDM_DOI,
  API_DOCUMENTATION,
  REACT_LINK,
  RTK_LINK,
  DRAGGABLE_LINK,
  XARROWS_LINK,
} from '@/common/const';

export default function Technology() {
  const { t } = useTranslation();

  const packages = [
    {
      link: PYMCDM_LINK,
      label: PYMCDM_LABEL,
      apa: PYMCDM_APA,
      doi: PYMCDM_DOI,
    },
    {
      link: PYFDM_LINK,
      label: PYFDM_LABEL,
      apa: PYFDM_APA,
      doi: PYFDM_DOI,
    },
  ];

  const webAppItems = [
    {
      id: 1,
      link: REACT_LINK,
      icon: <JavascriptIcon />,
      text: t('about:app-description-text-1'),
    },
    {
      id: 2,
      link: RTK_LINK,
      icon: <StorageIcon />,
      text: t('about:app-description-text-2'),
    },
    {
      id: 3,
      link: DRAGGABLE_LINK,
      icon: <PanToolIcon />,
      text: t('about:app-description-text-3'),
    },
    {
      id: 4,
      link: XARROWS_LINK,
      icon: <OpenWithIcon />,
      text: t('about:app-description-text-4'),
    },
  ];

  return (
    <Container sx={{ my: '50px' }}>
      <Typography variant="h5" mb={4} sx={{ fontWeight: 'bold' }}>
        {t('about:tab-4').toUpperCase()}
      </Typography>

      {/* SERVER */}
      <Stack gap={3}>
        <Divider textAlign="left">
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {t('about:server')}
          </Typography>
        </Divider>

        <Box sx={{ display: 'flex', gap: '16px' }}>
          <StorageIcon />
          <Typography align="justify">{t('about:server-description-text-1')}</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: '16px' }}>
          <TerminalIcon />
          <Typography align="justify">{t('about:server-description-text-2')}</Typography>
        </Box>

        <a
          href={API_DOCUMENTATION}
          target="_blank"
          rel="noreferrer"
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              transition: 'color 200ms ease-in',
              '&:hover': {
                color: 'primary.light',
              },
            }}
          >
            <ArticleIcon />
            <Typography align="justify">{t('about:api-docs')}</Typography>
          </Box>
        </a>
      </Stack>

      {/* PACKAGES*/}
      <Stack gap={3} mt={3}>
        <Divider textAlign="left">
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {t('common:packages')}
          </Typography>
        </Divider>

        <Typography align="justify">{t('about:server-description-text-3')}</Typography>

        {packages.map((item, idx) => {
          return (
            <Box key={idx}>
              <a href={item.link} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                <Box sx={{ display: 'flex', gap: '16px' }}>
                  <CodeIcon />
                  <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>{item.label}</Typography>
                </Box>
              </a>
              <Box>
                <Typography>{item.apa}</Typography>
                <Box>
                  <a
                    href={item.doi}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        transition: 'color 200ms ease-in',
                        '&:hover': {
                          color: 'primary.light',
                        },
                      }}
                    >
                      {item.doi}
                    </Typography>
                  </a>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Stack>

      {/* APPLICATION */}
      <Stack gap={3} mt={3}>
        <Divider textAlign="left">
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {t('about:application')}
          </Typography>
        </Divider>

        {webAppItems.map((item) => {
          return (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: '16px',
                  transition: 'color 200ms ease-in',
                  '&:hover': {
                    color: 'primary.light',
                  },
                }}
              >
                {item.icon}
                <Typography align="justify">{item.text}</Typography>
              </Box>
            </a>
          );
        })}
      </Stack>
    </Container>
  );
}

import { useTranslation } from 'react-i18next';
import { Container, Box, Stack, Typography } from '@mui/material';

// ICONS
import AdjustIcon from '@mui/icons-material/Adjust';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import LanguageIcon from '@mui/icons-material/Language';

// COMPONENTS
import LinedSubheader from '@/components/LinedSubheader';

// CONST
import { allPackages } from '@/common/packages';
import {
  GITHUB_PROFILE_LABEL,
  GITHUB_PROFILE_LINK,
  GITHUB_ISSUES_LINK,
  EMAIL_LABEL,
  EMAIL_LINK,
  COMET_LABEL,
  COMET_LINK,
  MCDA_IT_LABEL,
  MCDA_IT_LINK,
} from '@/common/socials';

export default function Contact() {
  const { t } = useTranslation();

  const websites = [
    {
      label: COMET_LABEL,
      link: COMET_LINK,
    },
    {
      label: MCDA_IT_LABEL,
      link: MCDA_IT_LINK,
    },
  ];

  const contacts = [
    {
      label: 'Github Issues',
      link: GITHUB_ISSUES_LINK,
      icon: <AdjustIcon />,
    },
    {
      label: GITHUB_PROFILE_LABEL,
      link: GITHUB_PROFILE_LINK,
      icon: <GitHubIcon />,
    },
    {
      label: EMAIL_LABEL,
      link: EMAIL_LINK,
      icon: <EmailIcon />,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ my: '50px' }}>
      <Container sx={{ marginBottom: '50px' }}>
        <Stack spacing={3}>
          <Typography align="justify" variant="subtitle1">
            {t('contact:contact-text-1')}
          </Typography>
          <Typography align="justify">{t('contact:contact-text-2')}</Typography>
          <Typography align="justify">{t('contact:contact-text-3')}</Typography>
        </Stack>
      </Container>

      <Container>
        <Stack spacing={3}>
          <LinedSubheader label={t('common:report-bugs')} />
          <Typography align="justify">{t('contact:bugs-text-1')}</Typography>
          {contacts.map((item, idx) => {
            return (
              <Box key={idx}>
                <a
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '16px',
                      transition: 'color 200ms ease-in',
                      '&:hover': {
                        color: 'primary.light',
                      },
                    }}
                  >
                    {item.icon}
                    <Typography> {item.label}</Typography>
                  </Box>
                </a>
              </Box>
            );
          })}
          <Typography align="justify">{t('contact:bugs-text-2')}</Typography>
        </Stack>
      </Container>

      <Container sx={{ marginTop: '50px' }}>
        {/* RECOMMENDED SITES */}
        <Stack spacing={3} sx={{ marginTop: '25px' }}>
          <LinedSubheader label={t('common:recommended-sites')} />

          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {t('common:packages')}
          </Typography>

          {allPackages.map((item, idx) => {
            return (
              <Box key={idx}>
                <a
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {' '}
                    {item.label}
                  </Typography>
                </a>
                <Box>
                  <Typography>{item.apa}</Typography>
                  <Box>
                    <a
                      style={{ color: 'inherit', textDecoration: 'none' }}
                      href={item.doi}
                      target="_blank"
                      rel="noreferrer"
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
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {t('common:websites')}
          </Typography>
          {websites.map((item, idx) => {
            return (
              <Box key={idx}>
                <a
                  style={{ color: 'inherit', textDecoration: 'none' }}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '16px',
                      transition: 'color 200ms ease-in',
                      '&:hover': {
                        color: 'primary.light',
                      },
                    }}
                  >
                    <LanguageIcon />
                    <Typography> {item.label}</Typography>
                  </Box>
                </a>
              </Box>
            );
          })}
        </Stack>

        {/* AFFILIATION */}
        <Stack spacing={3} sx={{ marginTop: '25px' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {t('common:affiliation')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
            <HomeWorkIcon />
            <Typography>{t('common:research-team-1')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
            <HomeWorkIcon />
            <Typography>{t('common:research-team-2')}</Typography>
          </Box>
        </Stack>
      </Container>
    </Container>
  );
}

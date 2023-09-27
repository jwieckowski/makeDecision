import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// ICONS
import DashboardIcon from '@mui/icons-material/Dashboard';
import LaptopIcon from '@mui/icons-material/Laptop';
import SubjectIcon from '@mui/icons-material/Subject';
import InfoIcon from '@mui/icons-material/Info';
import ContactPageIcon from '@mui/icons-material/ContactPage';

// COMPONENTS
import Language from '@/components/Language';
import { AboutMenu, CalculationsMenu } from './SubMenu';

// CONST
import { TITLE, MENU_ITEMS } from '@/common/const';

export default function Sidebar() {
  const location = useLocation();
  const { t } = useTranslation();

  const PAGES = [
    t('common:nav-page-1'),
    t('common:nav-page-2'),
    t('common:nav-page-3'),
    t('common:nav-page-4'),
    t('common:nav-page-5'),
  ];

  const ICONS = [
    <DashboardIcon key={'icon-1'} />,
    <LaptopIcon key={'icon-2'} />,
    <SubjectIcon key={'icon-3'} />,
    <InfoIcon key={'icon-4'} />,
    <ContactPageIcon key={'icon-5'} />,
  ];

  const getSubMenu = () => {
    if (location.pathname === MENU_ITEMS[1].href) return <CalculationsMenu />;
    else if (location.pathname === MENU_ITEMS[3].href) return <AboutMenu />;
    return null;
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'secondary.main',
        color: 'primary.contrastText',
        overflowY: 'auto',
      }}
    >
      <Box
        sx={{
          marginTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, fontSize: 18 }}>
          {TITLE}
          <Language />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', pl: 1, fontSize: 14, textTransform: 'uppercase' }}>
            <Typography variant="body2">{t('common:menu')}</Typography>
          </Box>
          <List>
            {MENU_ITEMS.map((item) => (
              <Link to={item.href} key={item.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItem
                  disablePadding
                  sx={
                    location.pathname === item.href
                      ? {
                          color: 'inherit',
                          backgroundColor: 'primary.light',
                        }
                      : {}
                  }
                >
                  <ListItemButton>
                    <ListItemIcon sx={{ '& .MuiSvgIcon-root': { fontSize: 20, color: 'white' } }}>
                      {ICONS[item.id]}
                    </ListItemIcon>
                    <ListItemText primary={PAGES[item.id]} primaryTypographyProps={{ fontSize: 14 }} />
                  </ListItemButton>
                </ListItem>
                <Divider sx={{ backgroundColor: '#6a6a6a' }} />
              </Link>
            ))}
          </List>
        </Box>
        {getSubMenu()}
      </Box>
    </Box>
  );
}

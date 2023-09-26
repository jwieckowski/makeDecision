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
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

// COMPONENTS
import Language from '@/components/Language';
import { AboutMenu, CalculationsMenu } from './SubMenu';

// CONST
import { TITLE, MENU_ITEMS } from '@/common/const';

export default function Sidebar() {
  const location = useLocation();
  const { t } = useTranslation();

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
        backgroundColor: 'secondary.light',
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
                      {item.id % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14 }} />
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

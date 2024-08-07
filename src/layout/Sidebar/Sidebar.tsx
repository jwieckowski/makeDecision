// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState } from 'react';
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
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

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
import { TITLE } from '@/common/const';
import { MENU_ITEMS } from '@/common/menu';

import pkg from '/package.json';

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

  const [openMenu, setOpenMenu] = useState(true);

  const handleCollapse = () => {
    setOpenMenu(!openMenu);
  };

  const getSubMenu = () => {
    if (location.pathname === MENU_ITEMS[1].href) return <CalculationsMenu />;
    else if (location.pathname === MENU_ITEMS[3].href) return <AboutMenu />;
    return null;
  };

  return (
    <Box
      className="tour-step-two"
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, fontSize: 18 }}>
          <Box sx={{ m: 0, p: 0 }}>
            <Typography sx={{ fontWeight: 'bold' }}>{TITLE}</Typography>
            <Typography sx={{ fontSize: 10 }}>v{pkg.version}</Typography>
          </Box>

          <Language />
        </Box>

        <Box>
          <List>
            <ListItem
              sx={{
                p: 0,
                minWidth: 32,
                bgcolor: 'secondary.dark',
              }}
            >
              <ListItemButton
                onClick={handleCollapse}
                sx={{
                  py: openMenu ? 0 : 1,
                  pl: 1,
                  pr: 2,
                  minWidth: 32,
                  display: 'flex',
                  justifyContent: 'space-between',
                  transition: 'padding 0.3s',
                }}
              >
                <Typography variant="body2" sx={{ fontSize: openMenu ? 12 : 16, transition: 'font-size 0.3s' }}>
                  {t('common:menu').toUpperCase()}
                </Typography>
                {openMenu ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openMenu} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {MENU_ITEMS.map((item, index) => (
                  <Link to={item.href} key={item.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListItem
                      className={index === 3 ? 'tour-step-thirteen' : ''}
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
            </Collapse>
          </List>
        </Box>
        {getSubMenu()}
      </Box>
    </Box>
  );
}

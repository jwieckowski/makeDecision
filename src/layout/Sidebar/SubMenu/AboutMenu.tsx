import React from 'react';
import { useTranslation } from 'react-i18next';
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

export default function AboutMenu() {
  const { t } = useTranslation();

  const TABS = [t('about:tab-1'), t('about:tab-2'), t('about:tab-3'), t('about:tab-4')];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', pl: 1, fontSize: 14, textTransform: 'uppercase' }}>
        <Typography variant="body2">{t('common:bookmarks')}</Typography>
      </Box>
      <List>
        {TABS.map((item) => (
          <Box key={item}>
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
                <ListItemText primary={item} primaryTypographyProps={{ fontSize: 14 }} />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ backgroundColor: '#6a6a6a' }} />
          </Box>
        ))}
      </List>
    </Box>
  );
}

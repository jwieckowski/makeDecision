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

// REDUX
import { useAppDispatch, useAppSelector } from '@/state';

// SLICES
import { setMenuItemIndex } from '@/state/slices/menuSlice';

export default function AboutMenu() {
  const { menuItemIndex } = useAppSelector((state) => state.menu);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const TABS = [t('about:tab-1'), t('about:tab-2'), t('about:tab-3'), t('about:tab-4')];

  const handleItemClick = (index: number) => {
    dispatch(setMenuItemIndex(index));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', pl: 1, fontSize: 14, textTransform: 'uppercase' }}>
        <Typography variant="body2">{t('common:bookmarks')}</Typography>
      </Box>
      <List>
        {TABS.map((item, index) => (
          <Box key={item}>
            <ListItem
              onClick={() => handleItemClick(index)}
              disablePadding
              sx={
                index === menuItemIndex
                  ? {
                      color: 'black',
                      backgroundColor: 'white',
                    }
                  : {}
              }
            >
              <ListItemButton>
                <ListItemIcon
                  sx={{ '& .MuiSvgIcon-root': { fontSize: 20, color: index === menuItemIndex ? 'black' : 'white' } }}
                >
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

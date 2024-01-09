import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// ICONS
import CallSplitIcon from '@mui/icons-material/CallSplit';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FolderIcon from '@mui/icons-material/Folder';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import UpdateIcon from '@mui/icons-material/Update';
import GradeIcon from '@mui/icons-material/Grade';

// REDUX
import { useAppDispatch, useAppSelector } from '@/state';

// SLICES
import { setMenuItemIndex } from '@/state/slices/menuSlice';

export default function AboutMenu() {
  const { menuItemIndex } = useAppSelector((state) => state.menu);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const TABS = [
    t('about:tab-1'),
    t('about:tab-2'),
    t('about:tab-3'),
    t('about:tab-4'),
    t('about:tab-5'),
    t('about:tab-6'),
  ];

  const ICONS = [
    <CallSplitIcon key={'icon-1'} />,
    <MenuBookIcon key={'icon-2'} />,
    <FolderIcon key={'icon-3'} />,
    <DeveloperBoardIcon key={'icon-4'} />,
    <UpdateIcon key={'icon-5'} />,
    <GradeIcon key={'icon-6'} />,
  ];

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
                  {ICONS[index]}
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

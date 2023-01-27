import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import DrawerHeader from '../DrawerHeader'
import MenuList from './MenuList'

import { useDispatch, useSelector } from 'react-redux'
import { menuClose } from '../../../data/actions/menu'
import { RootState } from '../../../redux/reducer'
import { drawerWidth } from '../../../common/constants';

export default function LeftMenu() {
    const { open } = useSelector((state: RootState) => state.menu)
    const dispatch = useDispatch()
    const theme = useTheme();

    const handleDrawerClose = () => {
        dispatch(menuClose())
      };
    

    return (
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <MenuList />
      </Drawer>
    )
}
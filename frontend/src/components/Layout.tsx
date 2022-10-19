import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import { useSelector } from 'react-redux'
import { RootState } from '../redux/reducer'

import LeftMenu from './Navigation/LeftMenu'
import DrawerHeader  from './Navigation/DrawerHeader';
import TopBar from './Navigation/TopBar'
import MainArea from './Navigation/MainArea'
import MethodsDrawer from './MethodsDrawer'

interface LayoutChildren {
    children: React.ReactNode | React.ReactFragment
}

export default function Layout({children}: LayoutChildren) {
  const { open } = useSelector((state: RootState) => state.menu)

  return (
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
      <TopBar />
      <LeftMenu />
      <MethodsDrawer />

      <MainArea open={open} style={{width: '100%', height: '100vh', backgroundColor: '#CCC'}}>
        <DrawerHeader />
        { children }
      </MainArea>
    </Box>
  );
}
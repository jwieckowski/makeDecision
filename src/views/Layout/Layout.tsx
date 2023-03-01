import { useState, useEffect } from 'react';
import {useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { useSnackbar, SnackbarKey } from 'notistack';

import NavigationMenu from '../../components/NavigationMenu'
import MethodDrawer from '../../components/MethodDrawer'

import { useOnlineStatus } from '../../hooks'

interface LayoutChildren {
    children: React.ReactNode | React.ReactFragment
}

export default function Layout({children}: LayoutChildren) {
  const isOnline = useOnlineStatus()
  const [snackbarKey, setSnackbarKey] = useState<SnackbarKey>(0)
  const location = useLocation()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const HIDE_DURATION = 4000

  useEffect(() => {
    if (!isOnline) {
      const key = enqueueSnackbar(`No internet connection`, {variant: 'info', 'persist': !isOnline});
      setSnackbarKey(key)
    } else if(snackbarKey !== 0) {
      closeSnackbar(snackbarKey)
      setSnackbarKey(0)
      enqueueSnackbar(`Back online`, {variant: 'success', 'autoHideDuration': HIDE_DURATION});
    }
  }, [isOnline]);

  return (
    <Box sx={{ display: 'flex', maxWidth: '100vw', minHeight: '100vh', height: '100%', flexDirection: 'column'}}>
      <NavigationMenu />
      <CssBaseline />
      <NavigationMenu />
      {location.pathname === '/calculation' && <MethodDrawer />}
      <Box component="main" style={{width: location.pathname === '/calculation' ? '80%' : '100%'}}>
        <Toolbar />
        { children }
      </Box>
    </Box>
  );
}



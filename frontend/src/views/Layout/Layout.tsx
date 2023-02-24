import { useState, useEffect } from 'react';
import {useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { useSnackbar, SnackbarKey } from 'notistack';

import NavigationMenu from '../../components/NavigationMenu'
import MethodDrawer from '../../components/MethodDrawer'

interface LayoutChildren {
    children: React.ReactNode | React.ReactFragment
}

export default function Layout({children}: LayoutChildren) {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [snackbarKey, setSnackbarKey] = useState<SnackbarKey>(0)
  const location = useLocation()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const HIDE_DURATION = 4000

  useEffect(() => {
    // Update network status
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    // Listen to the online status
    window.addEventListener('online', handleStatusChange);

    // Listen to the offline status
    window.addEventListener('offline', handleStatusChange);

    if (!isOnline) {
      const key = enqueueSnackbar(`No internet connection`, {variant: 'info', 'persist': !isOnline});
      setSnackbarKey(key)
    } else if(snackbarKey !== 0) {
      closeSnackbar(snackbarKey)
      enqueueSnackbar(`Back online`, {variant: 'success', 'autoHideDuration': HIDE_DURATION});
    }
    // Specify how to clean up after this effect for performance improvment
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
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



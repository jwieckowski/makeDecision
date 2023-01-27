import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';

import NavigationMenu from '../../components/NavigationMenu'
import MethodDrawer from '../../components/MethodDrawer'

interface LayoutChildren {
    children: React.ReactNode | React.ReactFragment
}

export default function Layout({children}: LayoutChildren) {
  const location = useLocation()
  return (
    <Box sx={{ display: 'flex', maxWidth: '100vw', minHeight: '100vh', height: '100%', flexDirection: 'column'}}>
        <NavigationMenu />
        <CssBaseline />
      <NavigationMenu />
      {location.pathname === '/calculation' && <MethodDrawer />}
      <Box component="main" style={{width: location.pathname === '/calculation' ? '80%' : '100%' }}>
        <Toolbar />
        { children }
      </Box>
    </Box>
  );
}



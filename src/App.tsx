import { useState, useEffect } from 'react';
import { SnackbarProvider, useSnackbar, SnackbarKey } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useLocation, Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';

// LAYOUT
import Header from '@/layout/Header';
import Sidebar from '@/layout/Sidebar';

// PAGES
import Dashboard from '@/pages/Dashboard';
import Calculations from '@/pages/Calculations';
import Methods from '@/pages/Methods';
import About from '@/pages/About';
import Contact from '@/pages/Contact';

// HOOKS
import { useOnlineStatus } from '@/hooks';

// CONST
import { DRAWER_WIDTH, HIDE_DURATION, MENU_ITEMS, APP_NAME_PATH } from '@/common/const';

type AppLayoutProps = {
  children: React.ReactElement;
};

function AppLayout({ children }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbarKey, setSnackbarKey] = useState<SnackbarKey>(0);

  const isOnline = useOnlineStatus();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const location = useLocation();

  const handleMenuClick = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (!isOnline) {
      const key = enqueueSnackbar(t('common:no-internet'), {
        variant: 'info',
        persist: !isOnline,
      });
      setSnackbarKey(key);
    } else if (snackbarKey !== 0) {
      closeSnackbar(snackbarKey);
      setSnackbarKey(0);

      enqueueSnackbar(t('common:back-online'), {
        variant: 'success',
        autoHideDuration: HIDE_DURATION,
      });
    }
  }, [isOnline]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          display: { sm: 'none' },
        }}
      >
        <Header onMenuClick={handleMenuClick} />
      </AppBar>
      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleMenuClick}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          <Sidebar />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar sx={{ display: { sm: 'none' } }} />
        {/* CONTENT */}
        <Container
          maxWidth={false}
          disableGutters
          className="content-wrapper"
          sx={{ padding: location.pathname === MENU_ITEMS[1].href ? 0 : 2 }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <HashRouter basename={`${APP_NAME_PATH}`}>
      <SnackbarProvider maxSnack={4}>
        <AppLayout>
          <Routes>
            <Route path={`/`} element={<Dashboard />} />
            <Route path={`/calculations`} element={<Calculations />} />
            <Route path={`/methods`} element={<Methods />} />
            <Route path={`/about`} element={<About />} />
            <Route path={`/contact`} element={<Contact />} />
            <Route path="*" element={<Navigate to={`/`} replace={true} />} />
          </Routes>
        </AppLayout>
      </SnackbarProvider>
    </HashRouter>
  );
}

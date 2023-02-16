import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

import { Link } from "react-router-dom";

export default function NavigationMenu() {
  const pages = ['Home', 'Calculations', 'Methods', 'About', 'Contact'];
  const urls = [
    '/home',
    '/calculation',
    '/methods',
    '/about',
    '/contact'
  ]
  
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>

        {/* LOGO FOR BIG SCREEN */}
        <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
        <Typography
            variant="h6"
            noWrap
            component="a"
            href="/home"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
        >
            DECISION MAKING APP
        </Typography>

        {/* MENU ITEMS FOR BIG SCREEN */}
        <Box sx={{ flexGrow: 1, justifyContent: 'flex-end', marginRight: 10, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, index) => (
                <Link to={urls[index]} style={{color: 'inherit', textDecoration: 'none'}} key={`${page}-link`}>
                    <Button
                        key={`${page}-big`}
                        sx={{color: 'white', display: 'block' }}
                      >
                        {page}
                    </Button>
                </Link>
            ))}
        </Box>

        {/* MENU ITEMS FOR SMALL SCREEN */}
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
            >
                <MenuIcon />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                    vertical: 'bottom',
                horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                display: { xs: 'block', md: 'none' },
                }}
            >
                {pages.map((page) => (
                <MenuItem key={`${page}-small`} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                </MenuItem>
                ))}
            </Menu>
        </Box>
        
          
        {/* LOGO FOR SMALL SCREEN */}
        <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
        <Typography
            variant="h5"
            noWrap
            component="a"
            href="/home"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
        >
            DECISION MAKING APP
        </Typography>

        </Toolbar>
      </Container>
    </AppBar>
  );
};


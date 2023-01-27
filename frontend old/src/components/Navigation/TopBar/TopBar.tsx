import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import WidgetsIcon from '@mui/icons-material/Widgets';

import AppBar from './AppBar'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../redux/reducer'
import { menuOpen, methodsMenuOpen } from '../../../data/actions/menu'



export default function TopBar() {
  const { open } = useSelector((state: RootState) => state.menu)
  const dispatch = useDispatch()

  const handleMenuOpen = () => {
    dispatch(menuOpen())
  };

  const handleMethodsMenuOpen = () => {
    dispatch(methodsMenuOpen())
  };

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
            color="inherit"
            aria-label="Open navigation menu"
            onClick={handleMenuOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        <Grid container style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>  
          <Typography variant="h6" noWrap component="div">
              Persistent drawer
          </Typography>
          <IconButton
              color="inherit"
              aria-label="Open methods menu"
              onClick={handleMethodsMenuOpen}
              edge="start"
              >
            <WidgetsIcon />
          </IconButton>
        </Grid>
      </Toolbar>
    </AppBar>
    
  );
}
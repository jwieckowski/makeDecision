import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import SearchBar from '../SearchBar';
import MethodsList from '../MethodsList';

export default function MethodsDrawer() {
    const drawerWidth = 20;

    return (
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: `${drawerWidth}%`, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', m: 2}}>
          <Typography variant="h5">
            Functionalities
          </Typography>
          <SearchBar />
          <MethodsList />
        </Box>
      </Drawer>
    )
}
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import SearchBar from '../SearchBar';
import MethodsList from '../MethodsList';

import { DRAWER_WIDTH } from '../../common/const';

export default function MethodsDrawer() {
    return (
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          display: {
            xs: 'none',
            md: "block"
          },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: `${DRAWER_WIDTH}%`, boxSizing: 'border-box' },
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
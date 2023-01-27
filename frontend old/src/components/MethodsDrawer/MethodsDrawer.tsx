import * as React from 'react';
import Drawer from '@mui/material/Drawer';
// import Paper from '@mui/material/Paper';

import Header from './Header'
import SearchBar from './SearchBar'
import MethodsList from './MethodsList'

import { useSelector } from 'react-redux'
import { RootState } from '../../redux/reducer'



export default function MethodsDrawer() {
  const { methodsOpen } = useSelector((state: RootState) => state.menu)

    return (
      <Drawer
        sx={{
          width: '250px',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '250px',
            boxSizing: 'border-box',
          },
          position: 'absolute',
          zIndex: 10000,
        }}
        variant="persistent"
        anchor="right"
        open={methodsOpen}
      >
        <Header />
        <SearchBar />
        <MethodsList />
      </Drawer>
    )
}
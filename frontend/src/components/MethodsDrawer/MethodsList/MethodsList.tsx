import React, { useState } from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { useDispatch  } from 'react-redux';
import { addBlock } from '../../../data/actions/blocks'

export default function MethodsList() {
  const dispatch = useDispatch()
  const initialState = [false, false, false, false, false, false, false]

  const [open, setOpen] = useState(initialState);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    e.preventDefault()
    setOpen(prevState => prevState.map((s, idx)=> idx === index ? !s : s));
  };

  function handleMethodClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>, type: string, method: string) {
    e.preventDefault()
    const block = {
      position: {
        x: 0,
        y: 0
      },
      type: type.toLowerCase(),
      method: method.toLowerCase()
    }
    dispatch(addBlock(block))
  }


  interface optionsProps {
    [key: string]: string[]
  }

  const options: optionsProps = {
    'Method' : [
      'ARAS',
      'EDAS',
      'CODAS',
      'COPRAS',
      'COMET',
      'TOPSIS',
      'VIKOR',
      'OCRA',
      'MOORA',
      'MAIRCA',
      'MARCOS',
      'PROMETHEE'
    ],
    'Criteria': [
      'Random',
      'Input',
      'File'
    ],
    'Alternative': [
      'Random',
      'Input',
      'File'
    ],
    'Weight': [
      'Input',
      'Equal',
      'Entropy',
      'Standard deviation',
      'Variance'
    ],
    'Ranking': [
      'Descending',
      'Ascending'
    ],
    'Visualization': [
      'A',
      'B',
      'C'
    ],
    'Correlation': [
      'Pearson',
      'Spearman',
      'Weighted Spearman',
      'WS rank similarity',
      'Goodman-Kruskal'
    ]
  }

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper', overflowX: 'hidden' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Decision making methods
        </ListSubheader>
      }
    >
      {Object.keys(options).map((option, index) => {
        return (
          <>
          <ListItemButton onClick={(e) => handleClick(e, index)}>
            <ListItemText primary={option} />
            {open[index] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open[index]} timeout="auto" unmountOnExit>
             <List component="div" disablePadding>
               {options[option].map((opt) => {
                  return (
                    <ListItemButton sx={{ pl: 4 }} onClick={(e) => handleMethodClick(e, option, opt)}>
                     <ListItemText secondary={opt} />
                   </ListItemButton>
                  )
               })}
             </List>
          </Collapse>
          </>
        )
      })}
      </List>
  );
}

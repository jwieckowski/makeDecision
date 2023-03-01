import React, { useState, useMemo, useEffect } from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux';
import { AllMethodsItem } from '../../redux/types'
import { addBlock } from '../../redux/slices/blocksSlice'
import { fetchAllMethods } from '../../redux/slices/dictionarySlice'
import { filterMethodsType } from '../../utilities/filtering';

export default function MethodsList() {
  const dispatch = useAppDispatch()
  const { query } = useSelector((state: RootState) => state.search)
  const { allMethods} = useSelector((state: RootState) => state.dictionary)

  const initialState = [false, false, false, false, false, false]
  const [open, setOpen] = useState(initialState);


  useEffect(() => {
    if (allMethods.length === 0) dispatch(fetchAllMethods())
  }, [])

  const handleItemClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    e.preventDefault()
    setOpen(prevState => prevState.map((s, idx)=> idx === index ? !s : s));
  };

  function handleMethodItemClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>, type: string, method: string, inputConnections: [] | string[], outputConnections: [] | string[]) {
    e.preventDefault()

    const block = {
      type: type.includes('matrix') ? type.split(' ')[1].toLowerCase() : type.toLowerCase(),
      method: method.toLowerCase(),
      inputConnections,
      outputConnections,
      data: {
        matrix: [],
        matrixFile: [],
        fileName: null,
        randomMatrix: [],
        types: [],
        weights: [],
        extension: 'crisp'
      }
    }
    dispatch(addBlock(block))
  }

  const filteredData: [] | AllMethodsItem[] = useMemo(() => {
    let temp: [] | AllMethodsItem[] = []

    filterMethodsType(allMethods, 'primary').map(methods => {
        if (methods.key.toLowerCase().includes(query.toLowerCase())) {
            temp = [...temp, methods]
        } else {
            const filteredMethods = { ...methods} 
            filteredMethods.data = []
            methods.data.map(method => {
                if (method.name.toLowerCase().includes(query.toLowerCase())) {
                    filteredMethods.data = [...filteredMethods.data, method] 
                }
            })
            if (filteredMethods.data.length > 0 ) temp = [...temp, filteredMethods]
        }  
    })

    return temp
  }, [allMethods, query])

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper', overflowX: 'hidden' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Techniques
        </ListSubheader>
      }
    >
      {filteredData.map((methods, index) => {
        return (
          <>
          <ListItemButton key={`${methods.key}-key`} onClick={(e) => handleItemClick(e, index)}>
            <ListItemText primary={methods.key} />
            
            {query !== '' ? '' : open[index] ? <ExpandLess /> : <ExpandMore />}
            
          </ListItemButton>
          <Collapse in={query !== '' || open[index]} timeout="auto" unmountOnExit>
             <List key={`${index}-list`} component="div" disablePadding>
               {methods.data.map((method) => {
                  return (
                    <ListItemButton key={`${method.name}-key`} sx={{ pl: 4 }} onClick={(e) => handleMethodItemClick(e, methods.key, method.name, methods.inputConnections, methods.outputConnections)}>
                     <ListItemText secondary={method.name} />
                   </ListItemButton>
                  )
               })}
             </List>
          </Collapse>
          </>
        )
      })}
      {filteredData.length === 0 && 
        <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary='No methods found' />
        </ListItemButton>
      }
      </List>
  );
}
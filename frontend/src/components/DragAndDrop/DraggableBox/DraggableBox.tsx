import React from 'react'
import {useXarrow} from 'react-xarrows';

import {Box, Typography, IconButton} from '@mui/material'
import Draggable from 'react-draggable';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import blockStyles from './styles'

import { RootState, useAppDispatch } from '../../../redux'
import { deleteBlock, deleteClickedBlock, setModalOpen, changeDraggedItemStatus } from '../../../redux/slices/blocksSlice'
import { setMethodItem } from '../../../redux/slices/dictionarySlice';
import { useSelector } from 'react-redux';

import {getMethodData, getSingleItemByName} from '../../../utilities/filtering'

type BoxType = {
    id: string;
    type: string;
    method: string;
    handleClick: Function
}

export default function DraggableBox({id, type, method, handleClick}: BoxType) {
    const { allMethods } = useSelector((state: RootState) => ({ ...state.dictionary }));
    const { clickedBlockId, activeBlock } = useSelector((state: RootState) => ({ ...state.blocks }));
    const dispatch = useAppDispatch()
    const updateXarrow = useXarrow();

    function handleSettingsClick (e: React.MouseEvent<HTMLElement>) {
        e.preventDefault()
        dispatch(setModalOpen(true))
        dispatch(setMethodItem(getSingleItemByName(getMethodData(allMethods, 'Method'), method)))
    }

    function handleDeleteClick (e: React.MouseEvent<HTMLElement>, id: string) {
        e.preventDefault()
        dispatch(deleteBlock(+id))
        dispatch(deleteClickedBlock(id))
    }

    function drag() {
        updateXarrow()
        dispatch(changeDraggedItemStatus(id))
    }
    
    function stop() {
        updateXarrow()
        setTimeout(() => {
            dispatch(changeDraggedItemStatus(null))
        }, 250)
    }
    
    function isActiveBlock() {
        if (activeBlock === null) return false
        return activeBlock.name.toLowerCase() === method.toLowerCase() && clickedBlockId === +id
    }

    return (
        <Draggable onDrag={drag} onStop={stop} bounds="parent" grid={[25, 25]}>
            <Box 
                id={id} 
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                    ...blockStyles(type, isActiveBlock()),
                }}
                onClick={(e) => handleClick(e, id, type, method)}
            >
                <Box style={{width: '100%', height: '20%', display: 'flex', justifyContent: 'end'}} id='close'>
                    <IconButton onClick={(e) => handleDeleteClick(e, id)}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box style={{width: '100%', height: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Typography variant='h5'>{method.toUpperCase()}</Typography>
                    <Typography variant='body2'>{type.toUpperCase()}</Typography>
                </Box>
                <Box style={{width: '100%', height: '20%', display: 'flex', justifyContent: 'end'}} id='settings'>
                    {/* <IconButton onClick={(e) => handleSettingsClick(e)}> */}
                    <IconButton >
                        <SettingsIcon />
                    </IconButton>
                </Box>
            </Box>
        </Draggable>
    );
}

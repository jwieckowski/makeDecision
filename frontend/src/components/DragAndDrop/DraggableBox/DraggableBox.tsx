import React from 'react'
import {useXarrow} from 'react-xarrows';

import {Box, Typography, IconButton} from '@mui/material'
import Draggable from 'react-draggable';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import blockStyles from './styles'

import { RootState, useAppDispatch } from '../../../redux'
import { deleteBlock, deleteClickedBlock, setModalOpen, setModalType, changeDraggedItemStatus } from '../../../redux/slices/blocksSlice'
import { deleteBodyExtension, deleteMatrixFileName } from '../../../redux/slices/calculationSlice';
import { useSelector } from 'react-redux';


type BoxType = {
    id: string;
    type: string;
    method: string;
    handleClick: Function
}

export default function DraggableBox({id, type, method, handleClick}: BoxType) {
    const { clickedBlockId, activeBlock, blocks, connections } = useSelector((state: RootState) => ({ ...state.blocks }));
    const { matrixFileNames } = useSelector((state: RootState) => ({ ...state.calculation }));
    const dispatch = useAppDispatch()
    const updateXarrow = useXarrow();
    
    const getNumberOfFileMatrix = () => {
        return blocks.filter(b => b.type.toLowerCase() === 'matrix' && b.method.toLowerCase() === 'file').map(b => b._id === activeBlock?.id).indexOf(true)
    }

    const matrixBlocks = blocks.filter(b => b.type.toLowerCase() === 'matrix')
    const getBlockNumber = (bId: string) => {
        return matrixBlocks.map(b => b._id === +bId).indexOf(true)
    }

    const getBlockInputConnections = () => {
        return connections.filter(c => c[1] === id)
    }

    function handleSettingsClick (e: React.MouseEvent<HTMLElement>) {
        e.preventDefault()
        dispatch(setModalType('additionals'))
        dispatch(setModalOpen(true))
    }

    function handleDeleteClick (e: React.MouseEvent<HTMLElement>, id: string) {
        e.preventDefault()
        dispatch(deleteBlock(+id))
        dispatch(deleteClickedBlock(id))

        if (type.toLowerCase() === 'matrix') {
            dispatch(deleteBodyExtension({id: getBlockNumber(id)}))

            if (method.toLowerCase() === 'file') {
                dispatch(deleteMatrixFileName({id: getNumberOfFileMatrix()}))
            }
        }
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
                    { (type.toLowerCase() === 'matrix' && method.toLowerCase() === 'file' && matrixFileNames.length > 0) &&
                        <Typography variant='body2' textAlign='start'>
                            {matrixFileNames[getNumberOfFileMatrix()] !== undefined && matrixFileNames[getNumberOfFileMatrix()].split('.')[1]} file
                        </Typography>
                    }
                    { type.toLowerCase() === 'matrix' && 
                        <IconButton onClick={(e) => handleSettingsClick(e)}>
                            <SettingsIcon />
                        </IconButton>
                    }
                    { (type.toLowerCase() === 'weights' && ((getBlockInputConnections().length > 1 && type.toLowerCase() !== 'input') || (getBlockInputConnections().length > 0 && method.toLowerCase() === 'input'))) && 
                        <IconButton onClick={(e) => handleSettingsClick(e)}>
                            <SettingsIcon />
                        </IconButton>
                    }
                    {/* TODO change function to show settings only it there are techniques to set */}
                    { (type.toLowerCase() === 'method' && getBlockInputConnections().length > 0) && 
                        <IconButton onClick={(e) => handleSettingsClick(e)}>
                            <SettingsIcon />
                        </IconButton>
                    }
                </Box>
            </Box>
        </Draggable>
    );
}

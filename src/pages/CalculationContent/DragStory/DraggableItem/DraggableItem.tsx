import React, { useState, useMemo, MouseEvent } from 'react';
import Draggable, { DraggableEvent } from 'react-draggable';
import { Container, Typography, Stack, Box } from '@mui/material';
// import { useTour } from "@reactour/tour";

// ICONS
import SettingsIcon from '@mui/icons-material/Settings';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';

// SLICES
import { deleteBlock, deleteClickedBlock, changeDraggedItemStatus, setActiveBlock } from '@/state/slices/blocksSlice';

// UTILS
import { getFilteredMethods, getMethodData } from '@/utils/filtering';
import useBlocksConnection from '@/utils/connections';
import { capitalize, convertTextLength } from '@/utils/formatting';

// TYPES
import { BlockPosition } from '@/types';

// STYLES
import blockStyles from './DraggableItem.styles';

type DraggableProps = {
  id: string;
  type: string;
  name: string;
  handleClick: (e: any, id: string, type: string, method: string) => void;
  setModalOpen: (val: boolean) => void;
  scale: number;
  extension: string;
  onDrag: () => void;
  onStop: () => void;
  error: boolean;
  position: BlockPosition;
  inputConnections: string[];
};

export default function CustomDraggable({
  id,
  type,
  name,
  handleClick,
  setModalOpen,
  scale,
  extension,
  onDrag,
  onStop,
  error,
  position,
  inputConnections,
}: DraggableProps) {
  const { allMethods } = useAppSelector((state) => state.dictionary);
  const { activeBlock, blocks, connections } = useAppSelector((state) => state.blocks);

  // const { isOpen, currentStep } = useTour();
  const dispatch = useAppDispatch();
  const { getMethodsConnectedBlocksExtensions } = useBlocksConnection();

  const connectedExtensions = useMemo(() => {
    if (type.toLowerCase() !== 'methods') return [];
    return getMethodsConnectedBlocksExtensions(blocks.filter((b) => b.id === +id)[0]).map((i) => i.extension);
  }, [blocks, connections]);

  function handleSettingsClick(e: React.MouseEvent<SVGElement>) {
    e.stopPropagation();
    setModalOpen(true);

    dispatch(setActiveBlock(id));
  }

  function handleDeleteClick(e: React.MouseEvent<SVGElement>, id: string) {
    e.stopPropagation();
    dispatch(deleteBlock(+id));
    dispatch(deleteClickedBlock(id));
  }

  function drag(e: DraggableEvent) {
    e.stopPropagation();
    onDrag();
    dispatch(changeDraggedItemStatus(id));
  }

  function stop(e: DraggableEvent) {
    // onStop(id, position.x + e.offsetX, position.y + e.offsetY);
    onStop();
    setTimeout(() => {
      dispatch(changeDraggedItemStatus(null));
    }, 250);
  }

  const isActiveBlock = () => {
    if (activeBlock === null) return false;
    return activeBlock.id === +id;
  };

  const getBlockInputConnections = () => {
    return connections.filter((c) => c[1] === id);
  };

  const hasAdditionals = () => {
    const additionals = getFilteredMethods(getMethodData(allMethods, type), extension)
      .find((item) => item.name.toLowerCase() === name)
      ?.additional?.filter((item) => connectedExtensions.includes(item.extension));
    return additionals !== undefined && additionals.length > 0;
  };

  const showSettingsIcon = () => {
    if (
      type.toLowerCase() === 'matrix' ||
      (type.toLowerCase() === 'weights' && name.toLowerCase() === 'input' && getBlockInputConnections().length > 0) ||
      (type.toLowerCase() === 'methods' && getBlockInputConnections().length > 0 && hasAdditionals())
    )
      return true;
    return false;
  };

  return (
    <Draggable
      onDrag={(e: DraggableEvent) => drag(e)}
      // onStop={stop}
      onStop={(e: DraggableEvent) => stop(e)}
      scale={scale}
      // position={{ x: position.x, y: position.y }}
      defaultPosition={{ x: position.x, y: position.y }}
      // defaultPosition={id === '2' && isOpen ? { x: 240, y: 0 } : { x: 0, y: 0 }}
    >
      <Container
        id={id}
        disableGutters
        sx={{
          borderRadius: '8px',
          display: 'flex',
          position: 'fixed',
          flexDirection: 'column',
          ...blockStyles(type, isActiveBlock(), error),
        }}
        onClick={(e) => handleClick(e, id, type, name)}
        // className={`${id === '1' ? (currentStep === 6 ? 'tour-step-seven' : 'tour-step-nine') : ''} ${
        //   id === '2' ? 'tour-step-ten' : ''
        // }`}
      >
        <Stack gap={1}>
          <Container
            maxWidth={false}
            disableGutters
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: '4px' }}
          >
            <Typography sx={{ fontSize: '10px' }}>ID {id}</Typography>
            <Typography sx={{ fontSize: '10px' }}>{type.toUpperCase()}</Typography>
            <HighlightOffIcon
              fontSize="small"
              onClick={(e) => handleDeleteClick(e, id)}
              sx={{
                transition: 'color 200ms ease-in',
                color: 'rgba(0, 0, 0, 0.6)',
                '&:hover': {
                  color: 'rgb(0, 0, 0)',
                },
              }}
            />
          </Container>
          <Container
            maxWidth={false}
            disableGutters
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: '4px' }}
          >
            <ArrowRightIcon fontSize="small" />
            <Typography align="center" sx={{ fontWeight: 'bold', fontSize: '10px' }}>
              {name.toUpperCase()}
            </Typography>
            <ArrowRightIcon fontSize="small" />
          </Container>
          <Container
            maxWidth={false}
            disableGutters
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: '4px' }}
          >
            <Stack>
              {inputConnections.map((item) => {
                return (
                  <Typography key={item} sx={{ fontSize: '10px' }}>
                    {capitalize(item)}
                  </Typography>
                );
              })}
            </Stack>

            {type.toLowerCase() === 'matrix' &&
            name.toLowerCase() === 'file' &&
            blocks.filter((b) => b.id === +id).length > 0 &&
            blocks.filter((b) => b.id === +id)[0].data.fileName !== null ? (
              <Typography
                align="center"
                sx={{
                  fontSize: '8px',
                }}
              >
                {convertTextLength(blocks.filter((b) => b.id === +id)[0].data.fileName)}
              </Typography>
            ) : null}

            {showSettingsIcon() ? (
              <SettingsIcon
                fontSize="small"
                onClick={(e) => handleSettingsClick(e)}
                sx={{
                  transition: 'color 200ms ease-in',
                  color: 'rgba(0, 0, 0, 0.6)',
                  '&:hover': {
                    color: 'rgb(0, 0, 0)',
                  },
                }}
              />
            ) : null}
          </Container>
        </Stack>
      </Container>
    </Draggable>
  );
}

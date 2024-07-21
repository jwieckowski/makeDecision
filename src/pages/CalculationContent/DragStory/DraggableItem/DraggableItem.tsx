// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useState, useEffect, useMemo, MouseEvent } from 'react';
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';
import { Container, Typography, Stack, Box } from '@mui/material';
import { useTour } from '@reactour/tour';

// ICONS
import SettingsIcon from '@mui/icons-material/Settings';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';

// SLICES
import {
  deleteBlock,
  changeDraggedItemStatus,
  setActiveBlock,
  setBlockError,
  setBlockKwargs,
} from '@/state/slices/blocksSlice';

// HOOKS
import { useConnectionList } from '@/hooks';

// UTILS
import { getFilteredMethods, getMethodData } from '@/utils/filtering';
import useBlocksConnection from '@/utils/connections';
import { capitalize, convertTextLength } from '@/utils/formatting';

// TYPES
import { BlockPosition, MethodKwargs } from '@/types';

// STYLES
import blockStyles from './DraggableItem.styles';

type DraggableProps = {
  id: string;
  type: string;
  name: string;
  handleClick: (e: MouseEvent<HTMLElement>, id: string) => void;
  setModalOpen: (val: boolean) => void;
  scale: number;
  extension: string;
  onDrag: () => void;
  onStop: (id: number, x: number, y: number) => void;
  error: boolean;
  position: BlockPosition;
  inputConnections: string[];
  typeKwargs: [] | MethodKwargs[];
};

export default function DraggableItem({
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
  typeKwargs,
}: DraggableProps) {
  const { allMethods } = useAppSelector((state) => state.dictionary);
  const { activeBlock, blocks } = useAppSelector((state) => state.blocks);
  const { connections, removeListNode, deleteClickedListItem } = useConnectionList();

  const { isOpen, currentStep, setCurrentStep } = useTour();
  const dispatch = useAppDispatch();

  function handleSettingsClick(e: MouseEvent<SVGElement>) {
    e.stopPropagation();
    setModalOpen(true);

    dispatch(setActiveBlock(id));
  }

  const deleteKwargsFromMethodByMatrixId = () => {
    if (type !== 'matrix') return;
    const methods = blocks
      .filter((block) => block.type === 'method')
      .map((block) => {
        return {
          ...block,
          data: {
            ...block.data,
            kwargs: block.data.kwargs.filter((item) => item.matrixId !== +id),
          },
        };
      });
    methods.forEach((block) => {
      dispatch(
        setBlockKwargs({
          id: block.id,
          data: block.data.kwargs,
        }),
      );
    });
  };

  function handleDeleteClick(e: MouseEvent<SVGElement>, id: string) {
    e.stopPropagation();
    deleteKwargsFromMethodByMatrixId();
    dispatch(deleteBlock(+id));
    deleteClickedListItem(id);
    removeListNode(id);
  }

  function drag(e: DraggableEvent) {
    e.stopPropagation();
    onDrag();
    dispatch(changeDraggedItemStatus(id));
  }

  function stop(e: DraggableEvent, data: DraggableData) {
    onStop(id, data.x, data.y);
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

  const hasKwargs = () => {
    if (type.toLowerCase() !== 'method') return false;
    const inputConnections = connections.filter((connection) => connection[1] === id);
    const matricesID = connections
      .filter((connection) => inputConnections.map((c) => c[0]).includes(connection[1]))
      .map((item) => +item[0]);
    const extensions = blocks.filter((block) => matricesID.includes(block.id)).map((block) => block.data.extension);
    return typeKwargs.filter((t) => extensions.includes(t.extension)).length > 0;
  };

  const isMethodConnectedToMatrix = () => {
    if (type.toLowerCase() !== 'method') return false;
    const inputConnections = connections.filter((connection) => connection[1] === id);
    return inputConnections.filter((connection) => connections.map((c) => c[1]).includes(connection[0])).length > 0;
  };

  const showSettingsIcon = () => {
    if (type.toLowerCase() === 'matrix') return true;
    else if (
      type.toLowerCase() === 'weights' &&
      name.toLowerCase() === 'input' &&
      getBlockInputConnections().length > 0
    )
      return true;
    else if (
      type.toLowerCase() === 'method' &&
      (name.toLowerCase() === 'input' ||
        (getBlockInputConnections().length > 0 && hasKwargs() && isMethodConnectedToMatrix()))
    )
      return true;
    else if (type.toLowerCase() === 'ranking' && name.toLowerCase() === 'input') return true;
    return false;
  };

  return (
    <Draggable
      onDrag={(e: DraggableEvent) => drag(e)}
      onStop={(e: DraggableEvent, data) => stop(e, data)}
      scale={scale}
      position={{ x: position.x, y: position.y }}
      defaultPosition={{ x: position.x, y: position.y }}
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
        onClick={(e) => handleClick(e, id)}
        className={`${id === '1' ? (currentStep === 6 ? 'tour-step-seven' : 'tour-step-nine') : ''} ${
          id === '2' ? 'tour-step-ten' : ''
        }`}
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

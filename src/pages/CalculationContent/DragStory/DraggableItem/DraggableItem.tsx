import React, { useState, useMemo, MouseEvent } from 'react';
import Draggable from 'react-draggable';
import { Container, Typography, Stack, Box } from '@mui/material';
// import { useTour } from "@reactour/tour";

// ICONS
import SettingsIcon from '@mui/icons-material/Settings';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';

// SLICES
import { deleteBlock, deleteClickedBlock, changeDraggedItemStatus, setActiveBlock } from '@/state/slices/blocksSlice';

// UTILS
import { getFilteredMethods, getMethodData } from '@/utils/filtering';
import useBlocksConnection from '@/utils/connections';
import { convertTextLength } from '@/utils/formatting';

// STYLES
import blockStyles from './DraggableItem.styles';

type DraggableProps = {
  id: string;
  type: string;
  typeLabel: string;
  method: string;
  label: string;
  handleClick: (e: any, id: string, type: string, method: string) => void;
  setModalOpen: (val: boolean) => void;
  scale: number;
  extension: string;
  onDrag: () => void;
  onStop: () => void;
};

export default function CustomDraggable({
  id,
  type,
  typeLabel,
  method,
  label,
  handleClick,
  setModalOpen,
  scale,
  extension,
  onDrag,
  onStop,
}: DraggableProps) {
  const { allMethods } = useAppSelector((state) => state.dictionary);
  const { clickedBlockId, activeBlock, blocks, connections } = useAppSelector((state) => state.blocks);
  const [hoverSettings, setHoverSettings] = useState<boolean>(false);
  const [hoverDelete, setHoverDelete] = useState<boolean>(false);

  // const { isOpen, currentStep } = useTour();
  const dispatch = useAppDispatch();
  const { getMethodsConnectedBlocksExtensions } = useBlocksConnection();

  const connectedExtensions = useMemo(() => {
    if (type.toLowerCase() !== 'method') return [];
    return getMethodsConnectedBlocksExtensions(blocks.filter((b) => b._id === +id)[0]).map((i) => i.extension);
  }, [blocks, connections]);

  function handleSettingsClick(e: React.MouseEvent<SVGElement>) {
    e.stopPropagation();
    setModalOpen(true);

    allMethods.forEach((methods) => {
      if (methods.key.toLowerCase().includes(type.toLowerCase())) {
        dispatch(
          setActiveBlock({
            ...methods.data.filter((item) => item.name.toLowerCase() === method.toLowerCase())[0],
            id: +id,
          }),
        );
      }
    });
  }

  function handleDeleteClick(e: React.MouseEvent<SVGElement>, id: string) {
    e.stopPropagation();
    dispatch(deleteBlock(+id));
    dispatch(deleteClickedBlock(id));
  }

  function drag() {
    onDrag();
    dispatch(changeDraggedItemStatus(id));
  }

  function stop() {
    onStop();
    setTimeout(() => {
      dispatch(changeDraggedItemStatus(null));
    }, 250);
  }

  const isActiveBlock = () => {
    if (activeBlock === null) return false;
    return clickedBlockId === +id;
  };

  const getBlockInputConnections = () => {
    return connections.filter((c) => c[1] === id);
  };

  const hasAdditionals = () => {
    // REMOVE WHEN PREFERENCE FUNCTION AND PARAMETRS P & Q HANDLED
    if (method.toUpperCase() === 'PROMETHEE') return false;
    const additionals = getFilteredMethods(getMethodData(allMethods, type), extension)
      .find((item) => item.name.toLowerCase() === method)
      ?.additional?.filter((item) => connectedExtensions.includes(item.extension));
    return additionals !== undefined && additionals.length > 0;
  };

  const showSettingsIcon = () => {
    if (
      type.toLowerCase() === 'matrix' ||
      (type.toLowerCase() === 'weights' && method.toLowerCase() === 'input' && getBlockInputConnections().length > 0) ||
      (type.toLowerCase() === 'method' && getBlockInputConnections().length > 0 && hasAdditionals())
    )
      return true;
    return false;
  };

  return (
    <Draggable
      onDrag={drag}
      onStop={stop}
      scale={scale}
      // defaultPosition={id === '2' && isOpen ? { x: 240, y: 0 } : { x: 0, y: 0 }}
    >
      <Container
        id={id}
        disableGutters
        sx={{
          display: 'flex',
          position: 'fixed',
          flexDirection: 'column',
          ...blockStyles(type, isActiveBlock()),
        }}
        onClick={(e) => handleClick(e, id, type, method)}
        // className={`${id === '1' ? (currentStep === 6 ? 'tour-step-seven' : 'tour-step-nine') : ''} ${
        //   id === '2' ? 'tour-step-ten' : ''
        // }`}
      >
        <Container maxWidth={false} disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="subtitle2" sx={{ pl: 1 }}>
            ID {id}
          </Typography>
          <Stack direction="row">
            {showSettingsIcon() ? (
              <SettingsIcon
                fontSize="small"
                onClick={(e) => handleSettingsClick(e)}
                sx={{
                  transition: 'color 200ms ease-in',
                  color: hoverSettings ? 'rgb(0, 0, 0)' : 'rgba(0, 0, 0, 0.6)',
                }}
                onMouseEnter={() => setHoverSettings(true)}
                onMouseLeave={() => setHoverSettings(false)}
              />
            ) : null}
            <HighlightOffIcon
              fontSize="small"
              onClick={(e) => handleDeleteClick(e, id)}
              sx={{
                transition: 'color 200ms ease-in',
                color: hoverDelete ? 'rgb(0, 0, 0)' : 'rgba(0, 0, 0, 0.6)',
              }}
              onMouseEnter={() => setHoverDelete(true)}
              onMouseLeave={() => setHoverDelete(false)}
            />
          </Stack>
        </Container>
        <Container disableGutters>
          <Typography
            align="center"
            sx={{
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            {label.toUpperCase()}
          </Typography>
          <Typography align="center" sx={{ fontSize: '9px' }}>
            {typeLabel.toUpperCase()}
          </Typography>
        </Container>
        <Container disableGutters>
          {type.toLowerCase() === 'matrix' &&
          method.toLowerCase() === 'file' &&
          blocks.filter((b) => b._id === +id).length > 0 &&
          blocks.filter((b) => b._id === +id)[0].data.fileName !== null ? (
            <Typography
              align="center"
              sx={{
                fontSize: '8px',
              }}
            >
              {convertTextLength(blocks.filter((b) => b._id === +id)[0].data.fileName)}
            </Typography>
          ) : null}
        </Container>
      </Container>
    </Draggable>
  );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useState, useEffect, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Xarrow, { useXarrow } from 'react-xarrows';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Container, Typography, Paper } from '@mui/material';
import { useTour } from '@reactour/tour';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';

// SLICES
import {
  setActiveBlock,
  setConnectionToDelete,
  setBlockError,
  setBlocks,
  setBlockPosition,
} from '@/state/slices/blocksSlice';
import { clearErrors } from '@/state/slices/calculationSlice';

// COMPONENTS
import DraggableItem from './DraggableItem';
import MatrixModal from '@/components/Modal/MatrixModal';
import WeightsModal from '@/components/Modal/WeightsModal';
import ConnectionModal from '@/components/Modal/ConnectionModal';
import MethodModal from '@/components/Modal/MethodModal';
// import ScaleSettings from './ScaleSettings';

// CONST
import { DRAG_AREA_SPACE, NAV_HEIGHT, HIDE_DURATION } from '@/common/ui';

// UTILS
import useBlocksConnection from '@/utils/connections';
import UserInputModal from '@/components/Modal/UserInputModal';

// HOOKS
import { useConnectionList, useSurveyStatus } from '@/hooks';

type Position = {
  x: number;
  y: number;
};

export default function DragArea() {
  const { allMethods } = useAppSelector((state) => state.dictionary);
  const { blocks, draggedItem, activeBlock } = useAppSelector((state) => state.blocks);
  const { error, resultsError } = useAppSelector((state) => state.calculation);
  const { size, headSize, curveness, color, path, scale, gridOn, gridSize } = useAppSelector((state) => state.settings);

  const {
    nodes,
    connections,
    clickedItems,
    addListConnection,
    addClickedListItem,
    setClickedListItems,
    deleteClickedListItem,
    removeListConnection,
    clearListNodes,
  } = useConnectionList();

  const [isMoveable, setIsMoveable] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');

  const [initialPosition, setInitialPosition] = useState<Position>({ x: 0, y: 0 });

  const { isOpen, currentStep, setCurrentStep, setIsOpen } = useTour();
  const updateXarrow = useXarrow();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { surveyDate, isSurveyAnswered, isSurveyAnsweredToday } = useSurveyStatus();

  useEffect(() => {
    if (!isSurveyAnswered() && !isSurveyAnsweredToday()) return;
    if (window.localStorage.getItem('tour') || allMethods.length === 0) return;
    setIsOpen(true);
  }, [allMethods, surveyDate]);

  useEffect(() => {
    if (!error && !resultsError) return;
    dispatch(clearErrors());
  }, []);

  useEffect(() => {
    if (clickedItems.length !== 2) return;
    addListConnection(clickedItems[0], clickedItems[1]);
  }, [blocks, clickedItems]);

  useEffect(() => {
    updateXarrow();
  }, [scale]);

  useEffect(() => {
    if (activeBlock?.type.toLowerCase() === 'method' && activeBlock.name.toLowerCase() === 'input')
      setModalType('preference');
    else setModalType(() => (activeBlock ? activeBlock.type.toLowerCase() : ''));
  }, [activeBlock]);

  useEffect(() => {
    const currentBlocks = blocks.map((b) => b.id);

    clickedItems.forEach((b) => {
      if (!currentBlocks.includes(+b)) {
        deleteClickedListItem(b);
      }
    });
    connections.forEach((c) => {
      let blockId = null;
      if (!currentBlocks.includes(+c[0])) blockId = c[0];
      else if (!currentBlocks.includes(+c[1])) blockId = c[1];

      if (blockId !== null) {
        removeListConnection(c[0], c[1]);
      }
    });

    if (!currentBlocks.includes(activeBlock?.id as never)) {
      dispatch(setActiveBlock(null));
      setModalType('');
    }
  }, [blocks]);

  useEffect(() => {
    if (error === null && resultsError === null) return;
    const snackbarError = error ?? resultsError;
    enqueueSnackbar(snackbarError, {
      variant: 'error',
      autoHideDuration: HIDE_DURATION,
    });
  }, [error, resultsError]);

  useEffect(() => {
    if (modalOpen) return;
    setModalType('');
  }, [modalOpen]);

  const handleModalClose = () => {
    setModalOpen(false);
    dispatch(setActiveBlock(null));
    setClickedListItems([]);

    if (isOpen) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleGridClick = () => {
    setClickedListItems([]);
    dispatch(setActiveBlock(null));
    setModalType('');
  };

  const handleArrowClick = (e: any, c: string[]) => {
    e.stopPropagation();
    setModalOpen(true);
    setModalType('connection');
    dispatch(setConnectionToDelete(c));

    if (isOpen)
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 300);
  };

  const handleDraggableClick = (e: MouseEvent<HTMLElement>, id: string) => {
    e.stopPropagation();
    if (draggedItem !== null) return;
    if (clickedItems.includes(id as never)) return;
    addClickedListItem(id);

    dispatch(setActiveBlock(id));
    if (isOpen) setCurrentStep((prev) => prev + 1);
  };

  const onDrag = () => {
    setIsMoveable(true);
    updateXarrow();
  };
  const onStop = (id: number, x: number, y: number) => {
    dispatch(setBlockPosition({ id: +id, position: { x: x, y: y } }));
    setIsMoveable(false);
    updateXarrow();
  };

  const getModal = () => {
    if ((activeBlock === null && modalType !== 'connection') || modalType === '') return null;

    type ModalDict = {
      [key: string]: React.ReactNode;
    };

    const modals: ModalDict = {
      matrix: <MatrixModal open={modalOpen} closeModal={handleModalClose} />,
      weights: <WeightsModal open={modalOpen} closeModal={handleModalClose} />,
      method: <MethodModal open={modalOpen} closeModal={handleModalClose} />,
      preference: <UserInputModal open={modalOpen} type="preferences" closeModal={handleModalClose} />,
      ranking: <UserInputModal open={modalOpen} type="ranking" closeModal={handleModalClose} />,
      connection: (
        <ConnectionModal
          open={modalOpen}
          closeModal={handleModalClose}
          textCancel={t('common:no')}
          textSave={t('common:yes')}
        />
      ),
    };

    return modals[modalType];
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        position: 'relative',
        backgroundColor: 'secondary.light',
        padding: 2,
        boxShadow: '0 4px 2px -2px gray',
      }}
      onClick={handleGridClick}
      id="blockArea"
    >
      <Paper
        className="tour-step-one tour-step-seven"
        elevation={0}
        sx={{
          cursor: 'pointer',
        }}
        id="dragContainer"
      >
        <TransformWrapper
          initialScale={scale}
          disabled={isMoveable}
          minScale={0.5}
          maxScale={1.25}
          limitToBounds={false}
          wheel={{
            disabled: true,
          }}
          doubleClick={{
            disabled: true,
          }}
          pinch={{ step: 5 }}
          initialPositionX={initialPosition.x}
          initialPositionY={initialPosition.y}
        >
          <TransformComponent
            wrapperStyle={{
              width: '100%',
              height: `calc(100vh - ${NAV_HEIGHT}px - ${DRAG_AREA_SPACE}px)`,
              border: '1px solid black',
              background: gridOn
                ? `conic-gradient(from 90deg at 1px 1px,#0000 90deg,grey 0) 0 0/${gridSize}px ${gridSize}px`
                : '',
            }}
          >
            {blocks.map((block) => {
              return (
                <DraggableItem
                  key={block.id}
                  id={block.id.toString()}
                  name={block.name}
                  type={block.type}
                  handleClick={handleDraggableClick}
                  setModalOpen={setModalOpen}
                  extension={block.data.extension}
                  onDrag={onDrag}
                  onStop={onStop}
                  scale={scale}
                  error={block.error}
                  position={block.position}
                  inputConnections={block.inputConnections}
                  typeKwargs={block.typeKwargs}
                />
              );
            })}
            {connections.map((c, cIdx) => {
              return (
                <Xarrow
                  key={`arrow-${cIdx}`}
                  start={c[0]}
                  end={c[1]}
                  strokeWidth={size}
                  headSize={headSize}
                  path={path}
                  curveness={curveness}
                  color={color}
                  passProps={{
                    cursor: 'pointer',
                    onClick: (e) => handleArrowClick(e, c),
                    className: `${cIdx === 0 ? 'tour-step-eleven' : ''}`,
                  }}
                  zIndex={-1}
                  animateDrawing={0.3}
                />
              );
            })}
          </TransformComponent>
        </TransformWrapper>
      </Paper>
      <Typography
        mt={1}
        align="right"
        sx={{
          cursor: 'pointer',
          transition: 'all 0.5s ease-out',
          color: '#333',
          '&:hover': {
            color: 'primary.dark',
          },
        }}
        onClick={() => {
          dispatch(setBlocks([]));
          clearListNodes();
          setCurrentStep(0);
          setIsOpen(true);
        }}
      >
        {t('common:tutorial')}
      </Typography>
      {getModal()}
    </Container>
  );
}

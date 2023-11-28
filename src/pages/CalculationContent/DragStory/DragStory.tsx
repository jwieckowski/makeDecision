import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Xarrow, { useXarrow } from 'react-xarrows';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Container, Typography, Paper } from '@mui/material';
// import { useTour } from "@reactour/tour";

// REDUX
import { RootState, useAppDispatch } from '@/state';

// SLICES
import {
  addClickedBlock,
  setActiveBlock,
  setClickedBlocks,
  setClickedBlockId,
  setBlockStyles,
  setConnectionToDelete,
  deleteClickedBlock,
  deleteConnection,
  setBlocks,
  setBlockPosition,
} from '@/state/slices/blocksSlice';

// COMPONENTS
import DraggableItem from './DraggableItem';
import Modal from '@/components/Modal';
import MatrixModal from '@/components/Modal/MatrixModal';
// import ScaleSettings from './ScaleSettings';

// CONST
import { HIDE_DURATION, NAV_HEIGHT, DRAG_AREA_SPACE } from '@/common/const';

// UTILS
import useBlocksConnection from '@/utils/connections';

export default function DragArea() {
  const { allMethods } = useSelector((state: RootState) => state.dictionary);

  const { blocks, clickedBlocks, connections, draggedItem, activeBlock, connectionToDelete } = useSelector(
    (state: RootState) => state.blocks,
  );

  const { error } = useSelector((state: RootState) => state.calculation);

  const { size, headSize, curveness, color, path, scale, gridOn, gridSize } = useSelector(
    (state: RootState) => state.settings,
  );

  const [isMoveable, setIsMoveable] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('');

  // const { isOpen, currentStep, setCurrentStep, setIsOpen } = useTour();
  const { addBlockConnection, checkForWrongExtensionMethodConnection } = useBlocksConnection();
  const updateXarrow = useXarrow();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  useEffect(() => {
    addBlockConnection();
    checkForWrongExtensionMethodConnection(connections);
  }, [blocks, clickedBlocks]);

  useEffect(() => {
    updateXarrow();
  }, [scale]);

  // console.log(activeBlock);

  useEffect(() => {
    setModalType(() => (activeBlock ? activeBlock.type.toLowerCase() : ''));
  }, [activeBlock]);

  useEffect(() => {
    const currentBlocks = blocks.map((b) => b.id);

    clickedBlocks.forEach((b) => {
      if (!currentBlocks.includes(+b)) {
        dispatch(deleteClickedBlock(b));
      }
    });
    connections.forEach((c) => {
      let blockId = null;
      if (!currentBlocks.includes(+c[0])) blockId = c[0];
      else if (!currentBlocks.includes(+c[1])) blockId = c[1];

      if (blockId !== null) {
        dispatch(deleteConnection(c));
      }
    });

    if (!currentBlocks.includes(activeBlock?.id as never)) {
      dispatch(setActiveBlock(null));
      setModalType('');
    }
  }, [blocks]);

  useEffect(() => {
    if (error === null) return;
    enqueueSnackbar(error, {
      variant: 'error',
      autoHideDuration: HIDE_DURATION,
    });
  }, [error]);

  // useEffect(() => {
  //   if (!isOpen) return;
  //   if (currentStep === 10 && connections.length === 0) {
  //     dispatch(setClickedBlocks(['1', '2']));
  //     addBlockConnection();
  //   }
  //   if (currentStep === 11) {
  //     setModalOpen(true);
  //     setModalType('connection');
  //     dispatch(setConnectionToDelete(['1', '2']));
  //   }

  //   if (currentStep === 12 && connections.length > 0) {
  //     dispatch(deleteConnection(['1', '2']));
  //     handleModalClose();
  //   } else if (currentStep === 12) {
  //     handleModalClose();
  //   }
  // }, [currentStep]);

  // useEffect(() => {
  //   if (!isOpen && blocks.length > 0) {
  //     dispatch(setBlocks([]));
  //   }
  // }, [isOpen]);

  useEffect(() => {
    if (modalOpen) return;
    setModalType('');
  }, [modalOpen]);

  const handleModalClose = () => {
    setModalOpen(false);
    dispatch(setActiveBlock(null));
  };

  const handleGridClick = () => {
    dispatch(setClickedBlockId(null));
    dispatch(setClickedBlocks([]));
    dispatch(setActiveBlock(null));
    setModalType('');
  };

  const handleArrowClick = (e: any, c: string[]) => {
    e.stopPropagation();
    setModalOpen(true);
    setModalType('connection');
    dispatch(setConnectionToDelete(c));

    // if (isOpen)
    //   setTimeout(() => {
    //     setCurrentStep((prev) => prev + 1);
    //   }, 300);
  };

  const deleteBlockConnection = () => {
    dispatch(deleteConnection(connectionToDelete));
    handleModalClose();

    // if (isOpen) setCurrentStep((prev) => prev + 1);
  };

  // const handleSave = (type: string) => {
  //   type FunctionsDict = {
  //     [key: string]: () => void;
  //   };
  //   const saveFunctions: FunctionsDict = {
  //     connection: deleteBlockConnection,
  //     matrix: handleModalClose,
  //     weights: handleModalClose,
  //     method: handleModalClose,
  //   };

  //   return saveFunctions[type] || handleModalClose;
  // };

  const handleDraggableClick = (e: React.MouseEvent<HTMLElement>, id: string, type: string, method: string) => {
    e.stopPropagation();
    if (draggedItem !== null) return;
    if (clickedBlocks.includes(id as never)) return;
    dispatch(addClickedBlock(id));
    dispatch(setClickedBlockId(+id));

    dispatch(
      setBlockStyles({
        id: +id,
        data: null,
      }),
    );

    dispatch(setActiveBlock(id));
    // if (isOpen) setCurrentStep((prev) => prev + 1);
  };

  const onDrag = () => {
    // console.log('tu');
    setIsMoveable(true);
    updateXarrow();
  };
  const onStop = () => {
    // const onStop = (id: number, x: number, y: number) => {
    // dispatch(setBlockPosition({ id: +id, position: { x: x, y: y } }));
    setIsMoveable(false);
    updateXarrow();
  };

  console.log(activeBlock);

  return (
    <Container
      maxWidth={false}
      sx={{
        position: 'relative',
      }}
      onClick={handleGridClick}
      id="blockArea"
    >
      <Paper
        elevation={10}
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
        >
          {/* <ScaleSettings /> */}
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
        onClick={() => {
          // setCurrentStep(0);
          // setIsOpen(true);
        }}
      >
        {t('common:tutorial')}
      </Typography>
      {activeBlock !== null ? (
        <MatrixModal
          open={modalOpen}
          closeModal={handleModalClose}
          // handleSave={handleSave(modalType)}
          handleClose={handleModalClose}
          // textCancel={modalType === 'connection' ? t('common:no') : null}
          // textSave={modalType === 'connection' ? t('common:yes') : null}
        />
      ) : null}
    </Container>
  );
}

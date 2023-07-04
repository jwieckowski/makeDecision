import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Xarrow, { useXarrow } from "react-xarrows";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Container } from "react-bootstrap";

// REDUX
import { RootState, useAppDispatch } from "../../../../redux";

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
} from "../../../../redux/slices/blocksSlice";

// COMPONENTS
import Draggable from "../Draggable";
import ScaleSettings from "./ScaleSettings";
import Modal from "../../../../components/Modal";

// CONST
import {
  HIDE_DURATION,
  NAV_HEIGHT,
  DRAG_AREA_SPACE,
} from "../../../../common/const";

// UTILS
import useBlocksConnection from "../../../../utilities/connections";
import { t } from "i18next";

export default function DragArea() {
  const { allMethods } = useSelector((state: RootState) => state.dictionary);

  const {
    blocks,
    clickedBlocks,
    connections,
    draggedItem,
    activeBlock,
    connectionToDelete,
  } = useSelector((state: RootState) => state.blocks);

  const { error } = useSelector((state: RootState) => state.calculation);

  const { size, headSize, curveness, color, path, scale, gridOn, gridSize } =
    useSelector((state: RootState) => state.settings);

  const [isMoveable, setIsMoveable] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");

  const { addBlockConnection, checkForWrongExtensionMethodConnection } =
    useBlocksConnection();
  const updateXarrow = useXarrow();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    addBlockConnection();
    checkForWrongExtensionMethodConnection(connections);
  }, [blocks, clickedBlocks]);

  useEffect(() => {
    updateXarrow();
  }, [scale]);

  useEffect(() => {
    setModalType((prev) =>
      activeBlock ? activeBlock.type.toLowerCase() : prev
    );
  }, [activeBlock]);

  useEffect(() => {
    const currentBlocks = blocks.map((b) => b._id);

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
    }
  }, [blocks]);

  useEffect(() => {
    if (error === null) return;
    enqueueSnackbar(error, {
      variant: "error",
      autoHideDuration: HIDE_DURATION,
    });
  }, [error]);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleGridClick = () => {
    dispatch(setClickedBlockId(null));
    dispatch(setClickedBlocks([]));
    dispatch(setActiveBlock(null));
  };

  const handleArrowClick = (c: string[]) => {
    setModalOpen(true);
    setModalType("connection");
    dispatch(setConnectionToDelete(c));
  };

  const deleteBlockConnection = () => {
    dispatch(deleteConnection(connectionToDelete));
    handleModalClose();
  };

  const handleDraggableClick = (
    e: React.MouseEvent<HTMLElement>,
    id: string,
    type: string,
    method: string
  ) => {
    e.stopPropagation();
    if (draggedItem !== null) return;
    if (clickedBlocks.includes(id as never)) return;
    dispatch(addClickedBlock(id));
    dispatch(setClickedBlockId(+id));

    dispatch(
      setBlockStyles({
        id: +id,
        data: null,
      })
    );

    // TO SET BLOCK ACTIVE AFTER CONNECTION
    allMethods.forEach((methods) => {
      if (methods.key.toLowerCase().includes(type.toLowerCase())) {
        dispatch(
          setActiveBlock({
            ...methods.data.filter(
              (item) => item.name.toLowerCase() === method.toLowerCase()
            )[0],
            id: +id,
          })
        );
      }
    });
  };

  const onDrag = () => {
    setIsMoveable(true);
    updateXarrow();
  };
  const onStop = () => {
    setIsMoveable(false);
    updateXarrow();
  };

  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center m-0 p-0"
      style={{
        position: "relative",
        cursor: "pointer",
      }}
      onClick={handleGridClick}
      id="blockArea"
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
            width: "100%",
            height: `calc(100vh - ${NAV_HEIGHT}px - ${DRAG_AREA_SPACE}px)`,
            border: "3px solid black",
            background: gridOn
              ? `conic-gradient(from 90deg at 1px 1px,#0000 90deg,grey 0) 0 0/${gridSize}px ${gridSize}px`
              : "",
          }}
        >
          {blocks.map((block) => {
            return (
              <Draggable
                key={block._id}
                id={block._id.toString()}
                type={block.type}
                typeLabel={block.typeLabel}
                method={block.method}
                label={block.label}
                handleClick={handleDraggableClick}
                setModalOpen={setModalOpen}
                styles={block.data.styles}
                extension={block.data.extension}
                onDrag={onDrag}
                onStop={onStop}
                scale={scale}
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
                  cursor: "pointer",
                  onClick: () => handleArrowClick(c),
                }}
                zIndex={-1}
                animateDrawing={0.3}
              />
            );
          })}
        </TransformComponent>
      </TransformWrapper>
      <Modal
        show={modalOpen}
        content={modalType}
        closeModal={handleModalClose}
        handleSave={
          modalType === "connection" ? deleteBlockConnection : undefined
        }
        handleClose={modalType === "connection" ? handleModalClose : undefined}
        textCancel={modalType === "connection" ? t("common:no") : null}
        textSave={modalType === "connection" ? t("common:yes") : null}
      />
    </Container>
  );
}

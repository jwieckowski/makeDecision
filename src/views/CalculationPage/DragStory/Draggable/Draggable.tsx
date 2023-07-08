import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Draggable from "react-draggable";
import Container from "react-bootstrap/Container";
import { useTour } from "@reactour/tour";

import { XCircleFill, GearFill } from "react-bootstrap-icons";

// REDUX
import { RootState, useAppDispatch } from "../../../../redux";

// SLICES
import {
  deleteBlock,
  deleteClickedBlock,
  changeDraggedItemStatus,
  setActiveBlock,
} from "../../../../redux/slices/blocksSlice";

// UTILS
import {
  getFilteredMethods,
  getMethodData,
} from "../../../../utilities/filtering";
import useBlocksConnection from "../../../../utilities/connections";

// STYLES
import blockStyles from "./Draggable.styles";
import globalStyles from "../../../../common/globalStyles";

type DraggableProps = {
  id: string;
  type: string;
  typeLabel: string;
  method: string;
  label: string;
  handleClick: Function;
  setModalOpen: Function;
  scale: number;
  styles: null | React.CSSProperties;
  extension: string;
  onDrag: () => void;
  onStop: () => void;
};

export default function MyDraggable({
  id,
  type,
  typeLabel,
  method,
  label,
  handleClick,
  setModalOpen,
  scale,
  styles,
  extension,
  onDrag,
  onStop,
}: DraggableProps) {
  const { allMethods } = useSelector((state: RootState) => state.dictionary);
  const { clickedBlockId, activeBlock, blocks, connections } = useSelector(
    (state: RootState) => ({ ...state.blocks })
  );
  const [hoverSettings, setHoverSettings] = useState<boolean>(false);
  const [hoverDelete, setHoverDelete] = useState<boolean>(false);

  const { isOpen, currentStep } = useTour();
  const dispatch = useAppDispatch();
  const { getMethodsConnectedBlocksExtensions } = useBlocksConnection();

  const connectedExtensions = useMemo(() => {
    if (type.toLowerCase() !== "method") return [];
    return getMethodsConnectedBlocksExtensions(
      blocks.filter((b) => b._id === +id)[0]
    ).map((i) => i.extension);
  }, [blocks, connections]);

  function handleSettingsClick(e: React.MouseEvent<SVGElement>) {
    e.stopPropagation();
    setModalOpen(true);

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
    if (method.toUpperCase() === "PROMETHEE") return false;
    const additionals = getFilteredMethods(
      getMethodData(allMethods, type),
      extension
    )
      .find((item) => item.name.toLowerCase() === method)
      ?.additional?.filter((item) =>
        connectedExtensions.includes(item.extension)
      );
    return additionals !== undefined && additionals.length > 0;
  };

  const showSettingsIcon = () => {
    if (
      type.toLowerCase() === "matrix" ||
      (type.toLowerCase() === "weights" &&
        method.toLowerCase() === "input" &&
        getBlockInputConnections().length > 0) ||
      (type.toLowerCase() === "method" &&
        getBlockInputConnections().length > 0 &&
        hasAdditionals())
    )
      return true;
    return false;
  };

  return (
    <Draggable
      onDrag={drag}
      onStop={stop}
      scale={scale}
      defaultPosition={id === "2" && isOpen ? { x: 240, y: 0 } : { x: 0, y: 0 }}
    >
      <Container
        id={id}
        style={{
          position: "fixed",
          flexDirection: "column",
          ...blockStyles(type, isActiveBlock()),
          ...globalStyles.draggableItem,
          ...styles,
        }}
        onClick={(e) => handleClick(e, id, type, method)}
        className={`${
          id === "1"
            ? currentStep === 6
              ? "tour-step-seven"
              : "tour-step-nine"
            : ""
        } ${id === "2" ? "tour-step-ten" : ""}`}
      >
        <Container
          fluid
          className="p-0 m-0 d-flex pt-1 justify-content-between align-items-center"
        >
          <Container className="d-flex" style={{ fontSize: "12px" }}>
            ID {id}
          </Container>
          <Container className="d-flex justify-content-end gap-1 pe-1">
            {showSettingsIcon() ? (
              <GearFill
                onClick={(e) => handleSettingsClick(e)}
                style={{
                  transition: "color 200ms ease-in",
                  color: hoverSettings ? "rgb(0, 0, 0)" : "rgba(0, 0, 0, 0.6)",
                }}
                onMouseEnter={() => setHoverSettings(true)}
                onMouseLeave={() => setHoverSettings(false)}
              />
            ) : null}
            <XCircleFill
              onClick={(e) => handleDeleteClick(e, id)}
              style={{
                transition: "color 200ms ease-in",
                color: hoverDelete ? "rgb(0, 0, 0)" : "rgba(0, 0, 0, 0.6)",
              }}
              onMouseEnter={() => setHoverDelete(true)}
              onMouseLeave={() => setHoverDelete(false)}
            />
          </Container>
        </Container>
        <Container
          fluid
          className="p-0 m-0 d-flex flex-column justify-content-center align-items-center"
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {label.toUpperCase()}
          </div>
          <div style={{ fontSize: "10px" }}>{typeLabel.toUpperCase()}</div>
        </Container>
        <Container fluid className="p-1 m-0">
          {type.toLowerCase() === "matrix" &&
            method.toLowerCase() === "file" &&
            blocks.filter((b) => b._id === +id).length > 0 &&
            blocks.filter((b) => b._id === +id)[0].data.fileName !== null && (
              <div
                style={{
                  textAlign: "center",
                  fontSize: "10px",
                }}
              >
                {blocks.filter((b) => b._id === +id)[0].data.fileName}
              </div>
            )}
        </Container>
      </Container>
    </Draggable>
  );
}

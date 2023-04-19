import React from "react";
import { useXarrow } from "react-xarrows";
import { useSelector } from "react-redux";
import Draggable from "react-draggable";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography, IconButton } from "@mui/material";
import blockStyles from "./styles";

import { RootState, useAppDispatch } from "../../../redux";
import {
  deleteBlock,
  deleteClickedBlock,
  setModalOpen,
  setModalType,
  changeDraggedItemStatus,
  setActiveBlock,
} from "../../../redux/slices/blocksSlice";

type BoxType = {
  id: string;
  type: string;
  typeLabel: string;
  method: string;
  label: string;
  handleClick: Function;
  zoom: number;
};

export default function DraggableBox({
  id,
  type,
  typeLabel,
  method,
  label,
  handleClick,
  zoom,
}: BoxType) {
  const { allMethods } = useSelector((state: RootState) => state.dictionary);
  const { clickedBlockId, activeBlock, blocks, connections } = useSelector(
    (state: RootState) => ({ ...state.blocks })
  );
  const dispatch = useAppDispatch();
  const updateXarrow = useXarrow();

  const matrices = blocks.filter((block) => block.type.includes("matrix"));

  function handleSettingsClick(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation();
    dispatch(setModalType("additionals"));
    dispatch(setModalOpen(true));

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

  function handleDeleteClick(e: React.MouseEvent<HTMLElement>, id: string) {
    e.stopPropagation();
    dispatch(deleteBlock(+id));
    dispatch(deleteClickedBlock(id));
  }

  function drag() {
    updateXarrow();
    dispatch(changeDraggedItemStatus(id));
  }

  function stop() {
    updateXarrow();
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

  return (
    <Draggable
      onDrag={drag}
      onStop={stop}
      bounds="parent"
      grid={[4, 4]}
      scale={zoom}
    >
      <Box
        id={id}
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
          ...blockStyles(type, isActiveBlock()),
        }}
        onClick={(e) => handleClick(e, id, type, method)}
      >
        <Box
          style={{
            width: "100%",
            height: "20%",
            display: "flex",
            justifyContent: "end",
          }}
          id="close"
        >
          <IconButton onClick={(e) => handleDeleteClick(e, id)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          style={{
            width: "100%",
            height: "60%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">
            {label.toUpperCase()}
            {type.toLowerCase() === "matrix" &&
              ` ${matrices.map((m) => m._id).indexOf(+id) + 1}`}
          </Typography>
          <Typography variant="body2">{typeLabel.toUpperCase()}</Typography>
        </Box>
        <Box
          style={{
            width: "100%",
            height: "20%",
            display: "flex",
            justifyContent: "end",
          }}
          id="settings"
        >
          {type.toLowerCase() === "matrix" &&
            method.toLowerCase() === "file" &&
            blocks.filter((b) => b._id === +id).length > 0 &&
            blocks.filter((b) => b._id === +id)[0].data.fileName !== null && (
              <Typography variant="body2" textAlign="start">
                {
                  blocks
                    .filter((b) => b._id === +id)[0]
                    .data.fileName?.split(".")[1]
                }{" "}
                file
              </Typography>
            )}
          {type.toLowerCase() === "matrix" && (
            <IconButton onClick={(e) => handleSettingsClick(e)}>
              <SettingsIcon />
            </IconButton>
          )}
          {type.toLowerCase() === "weights" &&
            ((getBlockInputConnections().length > 1 &&
              type.toLowerCase() !== "input") ||
              (getBlockInputConnections().length > 0 &&
                method.toLowerCase() === "input")) && (
              <IconButton onClick={(e) => handleSettingsClick(e)}>
                <SettingsIcon />
              </IconButton>
            )}
          {/* TODO change function to show settings only it there are techniques to set */}
          {type.toLowerCase() === "method" &&
            getBlockInputConnections().length > 0 && (
              <IconButton onClick={(e) => handleSettingsClick(e)}>
                <SettingsIcon />
              </IconButton>
            )}
        </Box>
      </Box>
    </Draggable>
  );
}

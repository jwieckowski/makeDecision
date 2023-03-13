import React, { useState, useEffect } from "react";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";

import { RootState, useAppDispatch } from "../../../redux";
import { useSelector } from "react-redux";
import {
  setBlockExtension,
  setBlockWeights,
} from "../../../redux/slices/blocksSlice";
import { BlockType } from "../../../redux/types";

import { getMatrixWeightsConnections } from "../../../utilities/calculation";

export default function Extension() {
  const { blocks, activeBlock, connections } = useSelector(
    (state: RootState) => state.blocks
  );
  const dispatch = useAppDispatch();
  const [block, setBlock] = useState<BlockType | null>(null);

  const handleExtensionChange = (event: SelectChangeEvent) => {
    dispatch(
      setBlockExtension({
        id: activeBlock?.id,
        data: event.target.value as string,
      })
    );
    if (block !== null) {
      getMatrixWeightsConnections(blocks, connections, block).forEach((b) => {
        dispatch(
          setBlockWeights({
            id: b._id,
            data: [],
          })
        );
      });
    }
  };

  useEffect(() => {
    setBlock(blocks.filter((b) => b._id === activeBlock?.id)[0]);
  }, [blocks]);

  return (
    <Box sx={{ margin: "10px 0" }}>
      <FormControl fullWidth>
        <InputLabel id="extension-input">Extension</InputLabel>
        <Select
          labelId="extension-input"
          id="extension"
          value={block === null ? "crisp" : block.data.extension}
          label="Extension"
          onChange={handleExtensionChange}
        >
          <MenuItem value={"crisp"}>
            <Typography>Crisp</Typography>
          </MenuItem>
          <MenuItem value={"fuzzy"}>
            <Typography>Fuzzy</Typography>
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

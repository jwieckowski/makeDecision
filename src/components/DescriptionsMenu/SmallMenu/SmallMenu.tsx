import React from "react";
import Select from "@mui/material/Select";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";

import { MethodsDescriptionType } from "../../../redux/types";
import MarkdownText from "../../MarkdownText";

type SmallMenuProps = {
  methods: [] | MethodsDescriptionType[];
  typeIndex: number;
  methodIndex: number;
  handleTypeChange: (id: number) => void;
  handleMethodChange: (id: number) => void;
};

export default function SmallMenu({
  methods,
  typeIndex,
  methodIndex,
  handleTypeChange,
  handleMethodChange,
}: SmallMenuProps) {
  return (
    <Box
      sx={{
        width: "100%",
        display: { sx: "flex", md: "none" },
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          marginTop: 5,
          width: "70%",
          marginLeft: "15%",
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="Group of method-input">Group of method</InputLabel>
          <Select
            labelId="Group of method-input"
            id="Group of method"
            value={typeIndex}
            label="Group of method"
            onChange={(e) => handleTypeChange(+e.target.value)}
          >
            {methods.map((method, index) => {
              return (
                <MenuItem value={index} key={method.id}>
                  <Typography>{method.key}</Typography>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="Method-input">Method</InputLabel>
          <Select
            labelId="Method-input"
            id="Method"
            value={
              methodIndex < methods[typeIndex].data.length ? methodIndex : 0
            }
            label="Method"
            onChange={(e) => handleMethodChange(+e.target.value)}
          >
            {methods[typeIndex].data.map((method, index) => {
              return (
                <MenuItem value={index} key={method.id}>
                  <Typography>{method.name}</Typography>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          width: "60%",
          margin: "10% 20%",
        }}
      >
        {methods[typeIndex].data[
          methodIndex < methods[typeIndex].data.length ? methodIndex : 0
        ].description.map((d) => {
          return <MarkdownText text={d.text} key={`text${d.id}`} />;
        })}
        {methods[typeIndex].data[
          methodIndex < methods[typeIndex].data.length ? methodIndex : 0
        ].description.length === 0 && (
          <Typography justifyContent="center">
            No description available yet
          </Typography>
        )}
      </Box>
    </Box>
  );
}

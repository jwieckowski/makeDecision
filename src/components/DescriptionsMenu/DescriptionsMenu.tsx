import React, { useState, useEffect } from "react";
import { RootState } from "../../redux";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";

import BigMenu from "./BigMenu";
import SmallMenu from "./SmallMenu";

export default function DescriptionsMenu() {
  const { methods } = useSelector((state: RootState) => state.description);
  const [typeIndex, setTypeIndex] = useState(0);
  const [methodIndex, setMethodIndex] = useState(0);

  useEffect(() => {
    setMethodIndex(0);
  }, [typeIndex]);

  const handleTypeChange = (e: React.SyntheticEvent, newValue: number) => {
    setTypeIndex(newValue);
  };

  const handleMethodChange = (e: React.SyntheticEvent, newValue: number) => {
    setMethodIndex(newValue);
  };

  const handleTypeChangeSmall = (id: number) => {
    setTypeIndex(id);
  };

  const handleMethodChangeSmall = (id: number) => {
    setMethodIndex(id);
  };

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      {methods.length > 0 && (
        <>
          {/* BIG SCREEN items */}
          <BigMenu
            methods={methods}
            typeIndex={typeIndex}
            methodIndex={methodIndex}
            handleTypeChange={handleTypeChange}
            handleMethodChange={handleMethodChange}
          />
          {/* SMALL SCREEN ITEMS */}
          <SmallMenu
            methods={methods}
            typeIndex={typeIndex}
            methodIndex={methodIndex}
            handleTypeChange={handleTypeChangeSmall}
            handleMethodChange={handleMethodChangeSmall}
          />
        </>
      )}
    </Box>
  );
}

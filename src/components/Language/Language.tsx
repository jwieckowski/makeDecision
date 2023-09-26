import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { SelectChangeEvent } from "@mui/material";
import Box from '@mui/material/Box'

// REDUX
import { RootState, useAppDispatch } from "@/state";

// SLICES
import { getMethodsDescriptions } from "@/api/descriptions";
import { fetchAllMethods } from "@/api/dictionary";
import { setBlocks } from "@/state/slices/blocksSlice";

// COMPONENTS
import Select from "@/components/Select";

// UTILS
import { getUpdatedBlocksLanguage } from "@/utils/blocks";

// CONST
import { LANGUAGES } from "@/common/const";

export default function Language() {
  const { blocks } = useSelector((state: RootState) => state.blocks);
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const dispatch = useAppDispatch();

  const handleChange = async (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
    setLang(event.target.value as string);
    window.localStorage.setItem("locale", event.target.value as string);

    if (window.location.pathname.includes(`/calculations`)) {
      window.location.reload();
    }

    // reload application
    await dispatch(getMethodsDescriptions(event.target.value as string));
    await dispatch(fetchAllMethods(event.target.value as string)).then(
      (res) => {
        // reload blocks in workspace with updated labels
        const updatedBlocks = getUpdatedBlocksLanguage(blocks, res.payload);
        dispatch(setBlocks(updatedBlocks));
      }
    );
  };

  return (
    <Box>
      <Select items={LANGUAGES} value={lang} onChange={handleChange} />
    </Box>
  );
}

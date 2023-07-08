import React, { useState, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

// REDUX
import { RootState, useAppDispatch } from "../../../../redux";

// SLICES
import { getMethodsDescriptions } from "../../../../redux/slices/descriptionSlice";
import { fetchAllMethods } from "../../../../redux/slices/dictionarySlice";
import { setBlocks } from "../../../../redux/slices/blocksSlice";

// COMPONENTS
import Select from "../../../../components/Select";

// UTILS
import { getUpdatedBlocksLanguage } from "../../../../utilities/blocks";

// CONST
import { APP_URL, LANGUAGES } from "../../../../common/const";

export default function Language() {
  const { blocks } = useSelector((state: RootState) => state.blocks);
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const dispatch = useAppDispatch();

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    i18n.changeLanguage(event.target.value);
    setLang(event.target.value as string);
    window.localStorage.setItem("locale", event.target.value as string);
    // window.location.reload();
    window.location.href = APP_URL;

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
    <div
      style={{
        width: "50px",
      }}
    >
      <Select items={LANGUAGES} value={lang} onChange={handleChange} />
    </div>
  );
}

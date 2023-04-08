import React, { useState } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { useAppDispatch } from "../../redux";
import {
  getHomeDescriptions,
  getMethodsDescriptions,
} from "../../redux/slices/descriptionSlice";
import { getAboutDescription } from "../../redux/slices/aboutSlice";
import { fetchAllMethods } from "../../redux/slices/dictionarySlice";

import { useTranslation } from "react-i18next";

export default function LanguageSelection() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const dispatch = useAppDispatch();

  const handleChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
    setLang(event.target.value as string);
    window.localStorage.setItem("locale", event.target.value as string);

    // reload application
    dispatch(getMethodsDescriptions(event.target.value as string));
    dispatch(getAboutDescription(event.target.value as string));
    dispatch(getHomeDescriptions(event.target.value as string));
    dispatch(fetchAllMethods(event.target.value as string));
  };

  return (
    <Box sx={{ minWidth: 70 }}>
      <FormControl fullWidth>
        <Select
          value={lang}
          onChange={handleChange}
          inputProps={{
            MenuProps: {
              MenuListProps: {
                sx: {
                  backgroundColor: "grey",
                },
              },
            },
          }}
        >
          <MenuItem value={"en"}>
            <Typography sx={{ color: "white" }}>EN</Typography>
          </MenuItem>
          <MenuItem value={"pl"}>
            <Typography sx={{ color: "white" }}>PL</Typography>
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

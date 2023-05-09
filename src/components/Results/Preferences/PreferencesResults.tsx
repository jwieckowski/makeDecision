import React from "react";
import { Box, Typography } from "@mui/material";

import { useSelector } from "react-redux";
import { RootState } from "../../../redux";

import PreferenceTable from "../../Tables/PreferenceTable";

import { useTranslation } from "react-i18next";

export default function PreferencesResults() {
  const { results } = useSelector((state: RootState) => state.calculation);
  const { t } = useTranslation();

  return !Array.isArray(results) ? (
    <Box>
      {results.method.length > 0 && (
        <>
          <Typography variant="h6">{t("results:preferences")}</Typography>
          {results.method.map((result, idx) => {
            return result.length !== 0 ? (
              <Box sx={{ m: "5px 0" }} key={`preferences-box-${idx}`}>
                <PreferenceTable results={result} idx={idx} />
              </Box>
            ) : (
              t("common:general-error")
            );
          })}
        </>
      )}
    </Box>
  ) : (
    <></>
  );
}

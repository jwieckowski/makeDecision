import React from "react";
import { Box, Typography } from "@mui/material";

import { useSelector } from "react-redux";
import { RootState } from "../../../redux";

import CorrelationTable from "../../Tables/CorrelationTable";

import { useTranslation } from "react-i18next";

export default function PreferencesCorrelationsResults() {
  const { results } = useSelector((state: RootState) => state.calculation);
  const { t } = useTranslation();

  return !Array.isArray(results) ? (
    <Box>
      {results.methodCorrelations.length > 0 && (
        <Typography variant="h6">
          {t("results:correlation-preferences")}
        </Typography>
      )}
      {results.methodCorrelations.map((result) => {
        return result.map((r) => {
          return (
            <Box sx={{ m: "5px 0" }}>
              <CorrelationTable
                correlation={r.correlation}
                methods={r.methods}
                results={r.results}
              />
              {!r.error && <Typography>{r.error}</Typography>}
            </Box>
          );
        });
      })}
    </Box>
  ) : (
    <></>
  );
}

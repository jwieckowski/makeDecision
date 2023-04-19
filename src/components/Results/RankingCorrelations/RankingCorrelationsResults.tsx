import React from "react";
import { Box, Typography } from "@mui/material";

import { useSelector } from "react-redux";
import { RootState } from "../../../redux";

import CorrelationTable from "../../Tables/CorrelationTable";

import { useTranslation } from "react-i18next";

export default function RankingCorrelationsResults() {
  const { t } = useTranslation();
  const { results } = useSelector((state: RootState) => state.calculation);

  return !Array.isArray(results) ? (
    <Box>
      {results.rankingCorrelations.length > 0 && (
        <>
          <Typography variant="h6">
            {t("results:correlation-ranking")}
          </Typography>
          {results.rankingCorrelations.map((result, idx) => {
            return result.map((r) => {
              return (
                <Box sx={{ m: "5px 0" }} key={`ranking-correlation-box-${idx}`}>
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
        </>
      )}
    </Box>
  ) : (
    <></>
  );
}

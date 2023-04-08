import React from "react";
import { Box, Typography } from "@mui/material";

import { useSelector } from "react-redux";
import { RootState } from "../../../redux";

import RankingTable from "../../Tables/RankingTable";
import { useTranslation } from "react-i18next";

export default function RankingResults() {
  const { results } = useSelector((state: RootState) => state.calculation);
  const { t } = useTranslation();

  return !Array.isArray(results) ? (
    <Box>
      {results.methodRankings.length > 0 && (
        <Typography variant="h6">{t("results:rankings")}</Typography>
      )}
      {results.methodRankings.map((result, idx) => {
        return result.map((res) => {
          return (
            <Box sx={{ m: "5px 0" }}>
              <RankingTable results={res} idx={idx} />
            </Box>
          );
        });
      })}
    </Box>
  ) : (
    <></>
  );
}

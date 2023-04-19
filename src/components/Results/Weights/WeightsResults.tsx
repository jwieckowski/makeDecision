import React from "react";
import { Box, Typography } from "@mui/material";

import { useSelector } from "react-redux";
import { RootState } from "../../../redux";

import WeightsTable from "../../Tables/WeightsTable";

import { useTranslation } from "react-i18next";

export default function WeightsResults() {
  const { results } = useSelector((state: RootState) => state.calculation);
  const { t } = useTranslation();

  console.log(results);

  type Weights = {
    id: number;
    method: string;
    weights: number[];
  };

  const getWeights = () => {
    if (Array.isArray(results)) return [];
    let weights: [] | Weights[][] = [];
    results.method.forEach((result, idx) => {
      let tempWeights: [] | Weights[] = [];
      result.forEach((res) => {
        if (
          tempWeights.length === 0 ||
          !tempWeights.map((t: any) => t.method).includes(res.weights)
        ) {
          tempWeights = [
            ...tempWeights,
            {
              id: idx,
              method: res.weights,
              weights: res.weights_value,
            },
          ];
        }
      });
      if (tempWeights.length !== 0) {
        weights = [...weights, tempWeights];
      }
    });
    return weights;
  };

  return !Array.isArray(results) && getWeights().length !== 0 ? (
    <Box>
      {results.method.length > 0 && (
        <>
          <Typography variant="h6">{t("results:weights")}</Typography>
          {getWeights().map((weights, idx) => {
            return (
              <Box sx={{ m: "5px 0" }} key={`weights-box-${idx}`}>
                <WeightsTable weights={weights} idx={idx} />
              </Box>
            );
          })}
        </>
      )}
    </Box>
  ) : (
    <></>
  );
}

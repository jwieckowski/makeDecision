import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { Typography } from "@mui/material";

import { useTranslation } from "react-i18next";

type Weights = {
  id: number;
  method: string;
  weights: number[];
};

type WeightsTableParams = {
  weights: Weights[];
  idx: number;
};

export default function WeightsTable({ weights, idx }: WeightsTableParams) {
  const { t } = useTranslation();
  return (
    <TableContainer component={Paper}>
      <Table aria-label="Weights table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="body1" textAlign="center">
                {t("results:weights")}
              </Typography>
              <Typography variant="body2" textAlign="center">
                {t("results:matrix")} {idx + 1}
              </Typography>
            </TableCell>
            {weights[0].weights.map((_, idx) => {
              return (
                <TableCell>
                  <Typography variant="body1" textAlign="center">
                    A{idx + 1}
                  </Typography>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {weights.map((w, index) => {
            return (
              <TableRow key={index}>
                <TableCell>
                  <Typography variant="body1" textAlign="center">
                    {w.method.toUpperCase()}
                  </Typography>
                </TableCell>
                {w.weights.map((val) => {
                  return (
                    <TableCell>
                      <Typography variant="body2" textAlign="center">
                        {!Array.isArray(val) && val.toFixed(5)}
                        {Array.isArray(val) &&
                          `[${val.map((v) => v.toFixed(3)).join(", ")}]`}
                      </Typography>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

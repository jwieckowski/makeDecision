import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Box, Grid, Typography, TextField } from "@mui/material";
import { RootState, useAppDispatch } from "../../../redux/index";
import { setBlockWeights } from "../../../redux/slices/blocksSlice";
import { MAX_CRITERIA } from "../../../common/const";
import { BlockType } from "../../../redux/types";

import { useTranslation } from "react-i18next";

type ParamType = {
  extension: string;
};

export default function InputWeights({ extension }: ParamType) {
  const [block, setBlock] = useState<BlockType | null>(null);
  const dispatch = useAppDispatch();
  const { criteria } = useSelector((state: RootState) => state.calculation);
  const { activeBlock, blocks } = useSelector(
    (state: RootState) => state.blocks
  );
  const [userWeights, setUserWeights] = useState<string[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    setBlock(blocks.filter((b) => b._id === activeBlock?.id)[0]);
  }, [blocks]);

  useEffect(() => {
    if (block === null) return;
    if (activeBlock?.id === undefined) return;

    if (block.data.weights.length === 0) {
      let value;
      if (extension === "crisp") value = "0";
      else if (extension === "fuzzy") value = "0, 0, 0";

      let copy = Array(criteria <= MAX_CRITERIA ? criteria : MAX_CRITERIA).fill(
        value
      );
      setUserWeights([...copy]);
    } else setUserWeights([...block.data.weights]);
  }, [block]);

  useEffect(() => {
    if (block === null) return;

    let value = "";
    if (extension === "crisp") value = "0";
    else if (extension === "fuzzy") value = "0, 0, 0";

    if (criteria > 0) {
      let copy = Array(criteria <= MAX_CRITERIA ? criteria : MAX_CRITERIA).fill(
        value
      );

      if (block.data.weights.length > 0) {
        if (
          (extension === "crisp" &&
            !`${block.data.weights[0]}`.includes(",")) ||
          (extension === "fuzzy" && `${block.data.weights[0]}`.includes(","))
        )
          copy = copy.map((r, idx) => {
            return idx < block.data.weights.length
              ? `${block.data.weights[idx]}`
              : r;
          });
      }

      setUserWeights([...copy]);
      dispatch(
        setBlockWeights({
          id: activeBlock?.id,
          data: [...copy.map((r) => (extension === "crisp" ? +r : r))],
        })
      );
    }
  }, [criteria, extension]);

  function validateCrispInput(value: any) {
    if (extension === "fuzzy") return true;

    if (!isNaN(+value)) return true;
    return false;
  }

  function validateFuzzyInput(value: any) {
    if (block === null) return;
    if (extension === "crisp") return true;

    // check if three number separated by comma are given
    let splitted = value.split(",");
    // check if not a number value in fuzzy set
    if (splitted.some((item: string) => isNaN(+item))) return false;

    if (splitted.length !== 0) return true;

    let numbers = splitted.map((n: string) => +n);
    // check if values are given in ascending order or equal than previous value
    if (
      !numbers.every((v: number, i: number) => i === 0 || v >= numbers[i - 1])
    )
      return true;

    return false;
  }

  function convertCrispInput(value: string) {
    return value.includes(".") ? value : Number(value).toString();
  }

  function convertFuzzyInput(value: string) {
    return value;
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    col: number
  ) {
    e.preventDefault();

    // validate input
    if (
      !validateCrispInput(e.target.value) ||
      !validateFuzzyInput(e.target.value)
    )
      return;

    let copy = [...userWeights];
    copy = copy.map((w, idx) => {
      return idx === col
        ? extension === "crisp"
          ? convertCrispInput(e.target.value)
          : convertFuzzyInput(e.target.value)
        : w;
    });

    setUserWeights(copy);
    dispatch(setBlockWeights({ id: activeBlock?.id, data: copy }));
  }

  return (
    <Box sx={{ m: 4 }}>
      <Typography textAlign="center" sx={{ m: 2 }}>
        {t("results:weights").toUpperCase()}
      </Typography>
      <Box sx={{ width: "100%", maxWidth: "50vw", overflow: "auto" }}>
        <Grid
          container
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          <Grid container item spacing={3}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                gap: 4,
                margin: "10px",
              }}
            >
              {criteria < 12 && <Grid item xs={(12 - criteria) / 2}></Grid>}
              {Array(criteria <= MAX_CRITERIA ? criteria : MAX_CRITERIA)
                .fill(0)
                .map((_, col) => {
                  return (
                    <Grid key={`weight-${col}`} item xs={2}>
                      <TextField
                        style={{ width: "80px" }}
                        key={`${col}`}
                        value={
                          col < userWeights.length
                            ? userWeights[col]
                            : extension === "crisp"
                            ? "0"
                            : "0, 0, 0"
                        }
                        onChange={(e) => handleInputChange(e, col)}
                        label={`C${col + 1}`}
                      />
                    </Grid>
                  );
                })}
              {criteria < 12 && <Grid item xs={(12 - criteria) / 2}></Grid>}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

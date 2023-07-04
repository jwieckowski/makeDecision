import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";

// REDUX
import { useAppDispatch } from "../../../redux";
import { BlockType } from "../../../redux/types";

// SLICES
import { setBlockWeights } from "../../../redux/slices/blocksSlice";

// COMPONENTS
import Input from "../../Input";
import Tooltip from "../../Tooltip"; // TODO ADD TOOLTIP WITH HINTS

// CONST
import { MAX_CRITERIA } from "../../../common/const";

// UTILS
import useValidation from "../../../utilities/validation";
import {
  convertCrispInput,
  convertFuzzyInput,
} from "../../../utilities/formatting";

// STYLES
import styles from "./styles.js";

type WeightsProps = {
  data: null | BlockType;
};

export default function Weights({ data }: WeightsProps) {
  const [userWeights, setUserWeights] = useState<string[]>([]);

  const dispatch = useAppDispatch();
  const { validateCrispInput, validateFuzzyInput } = useValidation();

  useEffect(() => {
    if (data === null) return;

    if (data.data.weights.length === 0) {
      let value;
      if (data.data.extension === "crisp") value = "0";
      else if (data.data.extension === "fuzzy") value = "0, 0, 0";

      let copy = Array(
        data.data.criteria <= MAX_CRITERIA ? data.data.criteria : MAX_CRITERIA
      ).fill(value);

      setUserWeights([...copy]);
    } else setUserWeights([...data.data.weights]);
  }, [data]);

  useEffect(() => {
    if (data === null) return;

    let value = "";
    if (data.data.extension === "crisp") value = "0";
    else if (data.data.extension === "fuzzy") value = "0, 0, 0";

    if (data.data.criteria > 0) {
      let copy = Array(
        data.data.criteria <= MAX_CRITERIA ? data.data.criteria : MAX_CRITERIA
      ).fill(value);

      if (data.data.weights.length > 0) {
        if (
          (data.data.extension === "crisp" &&
            !`${data.data.weights[0]}`.includes(",")) ||
          (data.data.extension === "fuzzy" &&
            `${data.data.weights[0]}`.includes(","))
        )
          copy = copy.map((r, idx) => {
            return idx < data.data.weights.length
              ? `${data.data.weights[idx]}`
              : r;
          });
      }

      setUserWeights([...copy]);
      dispatch(
        setBlockWeights({
          id: data?._id,
          data: [
            ...copy.map((r) => (data.data.extension === "crisp" ? +r : r)),
          ],
        })
      );
    }
  }, [data?.data.criteria, data?.data.extension]);

  function handleInputChange(
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    col: number
  ) {
    e.preventDefault();
    if (data === null) return;

    // VALIDATE INPUT
    if (
      !validateCrispInput(data, e.target.value) ||
      !validateFuzzyInput(data, e.target.value)
    )
      return;

    // COPY WEIGHTS AND CHANGE SINGLE VALUE
    let copy = [...userWeights];
    copy = copy.map((w, idx) => {
      return idx === col
        ? data?.data.extension === "crisp"
          ? convertCrispInput(e.target.value)
          : convertFuzzyInput(e.target.value)
        : w;
    });

    setUserWeights(copy);
    dispatch(setBlockWeights({ id: data?._id, data: copy }));
  }

  return (
    <Container
      fluid
      style={{ ...styles.weightsWrapper, flexDirection: "column" }}
    >
      {data !== null ? (
        <Stack
          direction="horizontal"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: data.data.criteria < 6 ? "center" : "start",
          }}
        >
          {Array(
            data.data.criteria <= MAX_CRITERIA
              ? data?.data.criteria
              : MAX_CRITERIA
          )
            .fill(0)
            .map((_, col) => {
              return (
                <div key={`row-${col}`}>
                  <Input
                    type="string"
                    value={
                      col < userWeights.length
                        ? userWeights[col]
                        : data.data.extension === "crisp"
                        ? "0"
                        : "0, 0, 0"
                    }
                    label={`C${col + 1}`}
                    labelStyle={styles.weightsLabel}
                    onChange={(e) => handleInputChange(e, col)}
                    style={{
                      width: "80px",
                      textAlign: "center",
                      border: "1px solid black",
                    }}
                  />
                </div>
              );
            })}
        </Stack>
      ) : null}
    </Container>
  );
}

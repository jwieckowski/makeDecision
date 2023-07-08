import React, { ChangeEvent } from "react";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";

// COMPONENTS
import Input from "../Input";

// CONST
import { MAX_ALTERNATIVES, MAX_CRITERIA } from "../../common/const";

// STYLES
import styles from "./styles.js";

type MatrixProps = {
  matrix: string[][] | number[][];
  alternatives: number;
  criteria: number;
  extension: string;
  onChange: (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    row: number,
    col: number
  ) => void;
};

export default function Matrix({
  matrix,
  alternatives,
  criteria,
  extension,
  onChange,
}: MatrixProps) {
  return (
    <Container
      fluid
      style={{
        ...styles.wrapper,
        flexDirection: "column",
      }}
    >
      {/* MATRIX HEADER */}
      <Stack
        direction="horizontal"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: criteria < 4 ? "center" : "start",
        }}
      >
        {matrix.length > 0 &&
          matrix[0].length > 0 &&
          Array(
            criteria + 1 <= MAX_CRITERIA + 1 ? criteria + 1 : MAX_CRITERIA + 1
          )
            .fill(0)
            .map((_, col) => {
              return (
                <div key={`col-label-${col}`}>
                  <div
                    style={{
                      width: "80px",
                      textAlign: "center",
                    }}
                  >
                    {col === 0 ? "" : `C${col}`}
                  </div>
                </div>
              );
            })}
      </Stack>

      {/* MATRIX BODY */}
      {matrix.length > 0 &&
        matrix[0].length > 0 &&
        Array(
          alternatives <= MAX_ALTERNATIVES ? alternatives : MAX_ALTERNATIVES
        )
          .fill(0)
          .map((_, row) => {
            return (
              <Stack
                direction="horizontal"
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: criteria < 4 ? "center" : "start",
                }}
              >
                {Array(
                  criteria + 1 <= MAX_CRITERIA + 1
                    ? criteria + 1
                    : MAX_CRITERIA + 1
                )
                  .fill(0)
                  .map((_, col) => {
                    return (
                      <div key={`row-${row}-${col}`}>
                        {col === 0 ? (
                          <div
                            style={{
                              width: "80px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "100%",
                            }}
                          >
                            A{row + 1}
                          </div>
                        ) : (
                          <Input
                            type="string"
                            value={
                              matrix.length === alternatives
                                ? matrix[row][col - 1]
                                : extension === "crisp"
                                ? "0"
                                : "0, 0, 0"
                            }
                            onChange={(e) => {
                              onChange(e, row, col - 1);
                            }}
                            style={{
                              width: "80px",
                              fontSize: "13px",
                              textAlign: "center",
                              border: "1px solid black",
                              padding: 0,
                              margin: 0,
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
              </Stack>
            );
          })}
    </Container>
  );
}

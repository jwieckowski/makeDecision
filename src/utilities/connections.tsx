import { useMemo } from "react";
import { RootState, useAppDispatch } from "../redux";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import {
  getFilteredMethods,
  getMethodData,
  getSingleItemByName,
} from "./filtering";
import { getBlocksOfType } from "./blocks";
import {
  addConnection,
  deleteConnection,
  setClickedBlocks,
} from "../redux/slices/blocksSlice";

import { HIDE_DURATION } from "../common/const";
import { BlockDataType } from "../redux/types";

export default function useBlocksConnection() {
  const { allMethods } = useSelector((state: RootState) => state.dictionary);
  const { blocks, clickedBlocks, connections } = useSelector(
    (state: RootState) => state.blocks
  );
  const fuzzyMethods = useMemo(
    () =>
      allMethods.length > 0
        ? getFilteredMethods(getMethodData(allMethods, "method"), "fuzzy")
        : [],
    []
  );
  const fuzzyWeights = useMemo(
    () =>
      allMethods.length > 0
        ? getFilteredMethods(getMethodData(allMethods, "weights"), "fuzzy")
        : [],
    []
  );

  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const addBlockConnection = () => {
    if (clickedBlocks.length === 2) {
      if (
        connections.filter(
          (c) => c[0] === clickedBlocks[0] && c[1] === clickedBlocks[1]
        ).length === 0
      ) {
        const inputBlock = blocks.filter((b) => b._id === +clickedBlocks[0])[0];
        const outputBlock = blocks.filter(
          (b) => b._id === +clickedBlocks[1]
        )[0];

        if (inputBlock === undefined || outputBlock === undefined) return;

        if (outputBlock.inputConnections.includes(inputBlock.type as never)) {
          // check if newly connected matrix has the same number of criteria as already connected matrix
          if (outputBlock.type === "weights") {
          }

          // check for only one ranking connection
          if (outputBlock.type === "ranking") {
            const outConnections = connections
              .filter((c) => c[0] === inputBlock._id.toString())
              .map((c) => c[1]);
            const rankingBlocks = blocks.filter(
              (block) => block.type === "ranking"
            );

            if (
              outConnections.filter((c) =>
                rankingBlocks.map((b) => b._id).includes(+c)
              ).length === 0
            ) {
              dispatch(addConnection([clickedBlocks[0], clickedBlocks[1]]));
            } else {
              enqueueSnackbar(
                "Metodę można połączyć tylko z jednym rankingiem",
                { variant: "error", autoHideDuration: HIDE_DURATION }
              );
            }
          } else if (outputBlock.type === "correlation") {
            const requiredData = getSingleItemByName(
              getMethodData(allMethods, "correlation"),
              outputBlock.method
            ).requiredData;
            // method->correlation
            if (requiredData.includes("preferences" as never)) {
              if (inputBlock.type !== "method") {
                enqueueSnackbar(
                  "Ta metoda korelacji służy do obliczenia podobieństw preferencji, nie rankingów",
                  { variant: "error", autoHideDuration: HIDE_DURATION }
                );
              } else {
                dispatch(addConnection([clickedBlocks[0], clickedBlocks[1]]));
              }
            }
            // ranking-> correlation
            if (requiredData.includes("ranking" as never)) {
              if (inputBlock.type !== "ranking") {
                enqueueSnackbar(
                  "Ta metoda korelacji służy do obliczenia podobieństw rankingów, nie preferencji",
                  { variant: "error", autoHideDuration: HIDE_DURATION }
                );
              } else {
                dispatch(addConnection([clickedBlocks[0], clickedBlocks[1]]));
              }
            }
          } else {
            dispatch(addConnection([clickedBlocks[0], clickedBlocks[1]]));
          }
        } else {
          enqueueSnackbar("Nie można połączyc bloczków", {
            variant: "error",
            autoHideDuration: HIDE_DURATION,
          });
        }
      }
      dispatch(setClickedBlocks([clickedBlocks[1]]));
    }
  };

  const checkForWrongExtensionMethodConnection = (
    connections: [] | string[][]
  ) => {
    // check connections starting from the matrix blocks
    getBlocksOfType(blocks, "matrix").forEach((matrix, idx) => {
      let weightsID: [] | string[] = [];
      // save weights id
      connections.forEach((c) => {
        if (c[0] === matrix._id.toString()) {
          // check for fuzzy matrix and weights methods connections
          const weightBlock = blocks.filter((b) => b._id === +c[1])[0];

          if (weightBlock && matrix.data.extension === "fuzzy") {
            if (
              !fuzzyWeights
                .map((m) => m.name.toLowerCase())
                .includes(weightBlock.method.toLowerCase())
            ) {
              enqueueSnackbar(
                `Metoda ważenia ${weightBlock.method.toUpperCase()} nie może byc połączona z danymi w formie fuzzy. Połączenie zostanie usunięte`,
                { variant: "error", autoHideDuration: HIDE_DURATION }
              );
              dispatch(deleteConnection(c));
            }
          }
          weightsID = [...weightsID, c[1]];
        }
      });

      // check for fuzzy matrix and mcda methods connections
      weightsID.forEach((w) => {
        connections.forEach((c) => {
          if (c[0] === w) {
            const methodBlock = blocks.filter((b) => b._id === +c[1])[0];
            if (methodBlock && matrix.data.extension === "fuzzy") {
              if (
                !fuzzyMethods
                  .map((m) => m.name.toLowerCase())
                  .includes(methodBlock.method.toLowerCase())
              ) {
                enqueueSnackbar(
                  `Metoda ${methodBlock.method.toUpperCase()} nie może byc połączona z danymi w formie fuzzy. Połączenie zostanie usunięte`,
                  { variant: "error", autoHideDuration: HIDE_DURATION }
                );
                dispatch(deleteConnection(c));
              }
            }
          }
        });
      });
    });

    // TODO - AFTER LOADING MATRIX FROM FILE AS ARRAY IN APP
    // const getCriteriaSize = (data: BlockDataType) => {
    //   if (data.randomMatrix.length > 0) return data.randomMatrix[1];
    //   else if (data.matrixFile) return 3; // TODO
    //   else if (data.matrix)
    //     return data.matrix.length > 0 ? data.matrix[0].length : 1;
    //   return 0;
    // };

    // // check connections starting from the weights input blocks - TODO
    // getBlocksOfType(blocks, "weights").forEach((weights, idx) => {
    //   let matrixID: [] | number[] = [];
    //   let matrixConnections: [] | string[][] = [];
    //   connections.forEach((c) => {
    //     if (weights.method === "input" && c[1] === weights._id.toString()) {
    //       matrixID = [...matrixID, +c[0]];
    //       matrixConnections = [...matrixConnections, c];
    //     }
    //   });
    //   let criteriaSizes = blocks
    //     .filter((b) => matrixID.includes(b._id as never))
    //     .map((b) => getCriteriaSize(b.data));
    //   console.log(criteriaSizes);
    //   if (Array.from(new Set(criteriaSizes)).length === 1) return;
    //   else {
    //     criteriaSizes.forEach((item, index) => {
    //       console.log(item, index, matrixConnections[index]);
    //       if (item !== criteriaSizes[0]) {
    //         console.log("usuwamy", index);
    //         enqueueSnackbar(
    //           `Połączone macierze do jednego bloku wag muszą mieć jednakową ilość kryteriów. Połączenie zostanie usunięte`,
    //           { variant: "error", autoHideDuration: HIDE_DURATION }
    //         );
    //         dispatch(deleteConnection(matrixConnections[index]));
    //         criteriaSizes = criteriaSizes.filter((c, i) => i !== index);
    //       }
    //     });
    //   }
    // });
  };

  return {
    addBlockConnection,
    checkForWrongExtensionMethodConnection,
  };
}

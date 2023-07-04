import { useMemo } from "react";
import { RootState, useAppDispatch } from "../redux";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import useSnackbars from "./snackbars";

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
  setActiveBlock,
  setClickedBlockId,
} from "../redux/slices/blocksSlice";

import { BlockDataType, BlockType } from "../redux/types";

export default function useBlocksConnection() {
  const { allMethods } = useSelector((state: RootState) => state.dictionary);
  const { blocks, clickedBlocks, connections } = useSelector(
    (state: RootState) => state.blocks
  );
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbars();

  const fuzzyMethods = useMemo(
    () =>
      allMethods.length > 0
        ? getFilteredMethods(getMethodData(allMethods, "method"), "fuzzy")
        : [],
    [allMethods]
  );
  const fuzzyWeights = useMemo(
    () =>
      allMethods.length > 0
        ? getFilteredMethods(getMethodData(allMethods, "weights"), "fuzzy")
        : [],
    [allMethods]
  );

  const dispatch = useAppDispatch();

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
              showSnackbar(t("snackbar:method-ranking"), "error");
            }
          } else if (outputBlock.type === "correlation") {
            const requiredData = getSingleItemByName(
              getMethodData(allMethods, "correlation"),
              outputBlock.method
            ).requiredData;
            // method->correlation
            if (requiredData.includes("preferences" as never)) {
              if (inputBlock.type !== "method") {
                showSnackbar(t("snackbar:correlation-connection-1"), "error");
              } else {
                dispatch(addConnection([clickedBlocks[0], clickedBlocks[1]]));
              }
            }
            // ranking-> correlation
            if (requiredData.includes("ranking" as never)) {
              if (inputBlock.type !== "ranking") {
                showSnackbar(t("snackbar:correlation-connection-2"), "error");
              } else {
                dispatch(addConnection([clickedBlocks[0], clickedBlocks[1]]));
              }
            }
          } else {
            dispatch(addConnection([clickedBlocks[0], clickedBlocks[1]]));
          }
        } else {
          showSnackbar(t("snackbar:cannot-connect"), "error");
        }
      }
      // TO REMEMBER LAST CLICKED BLOCK IN THE CLICKED BLOCKS ARRAY
      // dispatch(setClickedBlocks([clickedBlocks[1]]));

      // TO RESET ACTIVE BLOCK AFTER MAKING THE CONNECTION
      dispatch(setClickedBlockId(null));
      dispatch(setClickedBlocks([]));
      dispatch(setActiveBlock(null));
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
              showSnackbar(
                t("snackbar:weights-extension", {
                  method: weightBlock.method.toUpperCase(),
                }),
                "error"
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
                showSnackbar(
                  t("snackbar:mcda-extension", {
                    method: methodBlock.method.toUpperCase(),
                  }),
                  "error"
                );
                dispatch(deleteConnection(c));
              }
            }
          }
        });
      });
    });

    // TODO - AFTER LOADING MATRIX FROM FILE AS ARRAY IN APP
    const getCriteriaSize = (data: BlockDataType) => {
      if (data.randomMatrix.length > 0) return data.randomMatrix[1];
      else if (data.matrix)
        return data.matrix.length > 0 ? data.matrix[0].length : 1;
      return 0;
    };

    getBlocksOfType(blocks, "weights").forEach((weights, idx) => {
      let matrixID: [] | number[] = [];
      let matrixConnections: [] | string[][] = [];
      connections.forEach((c) => {
        if (weights.method === "input" && c[1] === weights._id.toString()) {
          matrixID = [...matrixID, +c[0]];
          matrixConnections = [...matrixConnections, c];
        }
      });
      matrixID = matrixID.sort((a, b) => a - b);
      matrixConnections = matrixConnections.sort((a, b) => +a[0] - +b[0]);
      let criteriaSizes = blocks
        .filter((b) => matrixID.includes(b._id as never))
        .map((b) => getCriteriaSize(b.data));
      if (Array.from(new Set(criteriaSizes)).length === 1) return;
      else {
        criteriaSizes.forEach((item, index) => {
          if (item !== criteriaSizes[0]) {
            showSnackbar(t("snackbar:matrix-size"), "error");
            dispatch(
              deleteConnection(
                matrixConnections.filter((c) => +c[0] === matrixID[index])[0]
              )
            );
            criteriaSizes = criteriaSizes.filter((c, i) => i !== index);
          }
        });
      }
    });
  };

  const getMethodsConnectedBlocksExtensions = (data: null | BlockType) => {
    const matrices = blocks.filter((b) => b.type.toLowerCase() === "matrix");

    let indexes: [] | number[] = [];
    matrices.forEach((m, idx) => {
      let weightsID: [] | string[] = [];
      // save weights id
      connections.forEach((c) => {
        if (c[0] === m._id.toString()) {
          weightsID = [...weightsID, c[1]];
        }
      });

      // check weights to method connection
      weightsID.forEach((w) => {
        connections.forEach((c) => {
          if (c[0] === w && c[1] === data?._id.toString()) {
            indexes = indexes.includes(m._id as never)
              ? indexes
              : [...indexes, m._id];
          }
        });
      });
    });

    return matrices
      .map((m) => {
        return { extension: m.data.extension, id: m._id };
      })
      .filter((e) => indexes.includes(e.id as never));
  };

  return {
    addBlockConnection,
    checkForWrongExtensionMethodConnection,
    getMethodsConnectedBlocksExtensions,
  };
}

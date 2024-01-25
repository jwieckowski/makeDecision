// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';

// SLICES
import {
  addConnection,
  deleteConnection,
  setClickedBlocks,
  setActiveBlock,
  setClickedBlockId,
  setBlockWeights,
  setBlockCriteria,
  setBlockExtension,
  setBlockError,
  setBlockKwargs,
  setBlockFilled,
  deleteDataKwargs,
} from '@/state/slices/blocksSlice';

// UTILS
import useCalculation from './calculation';
import { getFilteredMethods, getMethodData, getSingleItemByName } from './filtering';
import { getBlocksOfType } from './blocks';
import useSnackbars from './snackbars';

// TYPES
import { BlockDataType, BlockType } from '@/types';

export default function useBlocksConnection() {
  const { allMethods } = useAppSelector((state) => state.dictionary);
  const { blocks, clickedBlocks, connections } = useAppSelector((state) => state.blocks);
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbars();
  const { getMatrixWeightsConnections, getWeightsMethodConnections } = useCalculation();

  const fuzzyMethods = useMemo(
    () => (allMethods.length > 0 ? getFilteredMethods(getMethodData(allMethods, 'methods'), 'fuzzy') : []),
    [allMethods],
  );

  const fuzzyWeights = useMemo(
    () => (allMethods.length > 0 ? getFilteredMethods(getMethodData(allMethods, 'weights'), 'fuzzy') : []),
    [allMethods],
  );

  const dispatch = useAppDispatch();

  const getInputConnections = (id: number) => {
    return connections.filter((c) => c[1] === `${id}`).map((c) => c[0]);
  };

  const getOutputConnections = (id: number) => {
    return connections.filter((c) => c[0] === `${id}`).map((c) => c[1]);
  };

  const isDataFilled = (block: BlockType) => {
    return block.isFilled;
  };

  const setForSingleMethodRankingConnection = (inputId: number) => {
    const outputConnections = getOutputConnections(inputId);
    const rankingBlocks = blocks.filter((block) => block.type === 'ranking');
    if (outputConnections.filter((c) => rankingBlocks.map((b) => b.id).includes(+c)).length === 0) {
      dispatch(addConnection([clickedBlocks[0], clickedBlocks[1]]));
      dispatch(
        setBlockError({
          id: +clickedBlocks[1],
          error: false,
        }),
      );
    } else {
      showSnackbar(t('snackbar:method-ranking'), 'error');
    }
  };

  const checkMatrixToInputWeightConnection = (inputBlock: BlockType, outputBlock: BlockType) => {
    if (
      inputBlock.type.toLowerCase() !== 'matrix' ||
      outputBlock.type.toLowerCase() !== 'weights' ||
      outputBlock.name.toLowerCase() !== 'input'
    )
      return;
    if (inputBlock.data.criteria === outputBlock.data.criteria) return;
    const inputConnections = getInputConnections(outputBlock.id);
    if (inputConnections.length > 0) return;

    // different number of weights and no connections, so clear current weights
    dispatch(
      setBlockWeights({
        id: outputBlock.id,
        data: [],
      }),
    );
    dispatch(
      setBlockFilled({
        id: outputBlock.id,
        isFilled: false,
      }),
    );
    dispatch(
      setBlockError({
        id: outputBlock.id,
        error: true,
      }),
    );
    dispatch(
      setBlockCriteria({
        id: outputBlock.id,
        data: inputBlock.data.criteria,
      }),
    );
  };

  const checkMatrixWeightsConnection = (inputBlock: BlockType, outputBlock: BlockType) => {
    if (
      inputBlock.type.toLowerCase() !== 'matrix' ||
      outputBlock.type.toLowerCase() !== 'weights' ||
      outputBlock.name.toLowerCase() !== 'input'
    )
      return true;
    if (inputBlock.data.criteria === outputBlock.data.criteria) return true;
    const inputConnections = getInputConnections(outputBlock.id);
    if (inputConnections.length === 0) return true;
    const size = blocks.filter((b) => inputConnections.includes(`${b.id}`)).map((b) => b.data.criteria);
    return +size[0] == inputBlock.data.criteria;
  };

  const checkIfNewMatrixConnectedToMethod = (inputBlock: BlockType, outputBlock: BlockType) => {
    if (inputBlock.type.toLowerCase() === 'weights' && outputBlock.type.toLowerCase() === 'method') {
      const matricesId = getInputConnections(inputBlock.id);
      const currentMatricesId = outputBlock.data.kwargs.map((item) => item.matrixId);
      if (matricesId.filter((mid) => currentMatricesId.includes(+mid)).length > 0) return;
      dispatch(
        setBlockError({
          id: outputBlock.id,
          error: true,
        }),
      );
      dispatch(
        setBlockFilled({
          id: outputBlock.id,
          isFilled: false,
        }),
      );
    } else if (inputBlock.type.toLowerCase() === 'matrix' && outputBlock.type.toLowerCase() === 'weights') {
      const currentMethodsId = getOutputConnections(outputBlock.id);
      blocks
        .filter((b) => currentMethodsId.includes(`${b.id}`))
        .forEach((b) => {
          const currentMatricesId = b.data.kwargs.map((item) => item.matrixId);
          if (!currentMatricesId.includes(inputBlock.id)) {
            dispatch(
              setBlockError({
                id: b.id,
                error: true,
              }),
            );
            dispatch(
              setBlockFilled({
                id: b.id,
                isFilled: false,
              }),
            );
          }
        });
    }
    return;
  };

  const addBlockConnection = () => {
    if (clickedBlocks.length === 2) {
      if (connections.filter((c) => c[0] === clickedBlocks[0] && c[1] === clickedBlocks[1]).length === 0) {
        const inputBlock = blocks.filter((b) => b.id === +clickedBlocks[0])[0];
        const outputBlock = blocks.filter((b) => b.id === +clickedBlocks[1])[0];

        if (inputBlock === undefined || outputBlock === undefined) return;

        if (outputBlock.inputConnections.includes(inputBlock.type as string)) {
          // check for only one ranking connection
          if (outputBlock.type.toLowerCase() === 'ranking') {
            setForSingleMethodRankingConnection(inputBlock.id);
          } else {
            if (inputBlock.type.toLowerCase() === 'matrix') {
              if (isDataFilled(inputBlock)) {
                dispatch(
                  setBlockError({
                    id: inputBlock.id,
                    error: false,
                  }),
                );
              }
            } else {
              if (isDataFilled(inputBlock)) {
                dispatch(
                  setBlockError({
                    id: inputBlock.id,
                    error: getInputConnections(inputBlock.id).length !== 1,
                  }),
                );
              }
            }

            if (outputBlock.type.toLowerCase() !== 'method') {
              if (isDataFilled(outputBlock)) {
                dispatch(
                  setBlockError({
                    id: outputBlock.id,
                    error: false,
                  }),
                );
              }
            }

            // weights with data and different number of criteria
            checkMatrixToInputWeightConnection(inputBlock, outputBlock);

            if (checkMatrixWeightsConnection(inputBlock, outputBlock)) {
              dispatch(addConnection([clickedBlocks[0], clickedBlocks[1]]));
            } else {
              showSnackbar(t('snackbar:matrix-size'), 'error');
            }

            checkIfNewMatrixConnectedToMethod(inputBlock, outputBlock);
          }
        } else {
          showSnackbar(t('snackbar:cannot-connect'), 'error');
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

  const deleteConnectionArrow = (connection: string[]) => {
    const inputBlock = blocks.find((block) => block.id === +connection[0]);
    const outputBlock = blocks.find((block) => block.id === +connection[1]);

    if (inputBlock.type.toLowerCase() !== 'matrix') {
      if (['method', 'ranking'].includes(inputBlock.type.toLowerCase()) && inputBlock?.name.toLowerCase() === 'input') {
      } else {
        console.log(getInputConnections(inputBlock.id).length);
        dispatch(
          setBlockError({
            id: inputBlock.id,
            error: getInputConnections(inputBlock.id).length === 0,
          }),
        );
      }
    }

    dispatch(
      setBlockError({
        id: outputBlock.id,
        error: getInputConnections(outputBlock.id).length <= 1,
      }),
    );
  };

  const deleteKwargsFromMatrix = (connection: string[]) => {
    const inputBlock = blocks.find((block) => block.id === +connection[0]);
    const outputBlock = blocks.find((block) => block.id === +connection[1]);

    if (inputBlock?.type.toLowerCase() === 'weights' && outputBlock?.type.toLowerCase() === 'method') {
      const weightsId = getInputConnections(connection[1]);
      const matricesId = getInputConnections(connection[0]);
      const matrixConnections = connections.filter((c) => matricesId.includes(c[0]));

      matrixConnections.forEach((matrix) => {
        if (matrixConnections.filter((m) => weightsId.includes(m[1])).length === 1) {
          dispatch(
            deleteDataKwargs({
              id: +connection[1],
              matrixId: +matrix[0],
            }),
          );
        }
      });
    } else if (inputBlock?.type.toLowerCase() === 'matrix' && outputBlock?.type.toLowerCase() === 'weights') {
      const methodsId = getOutputConnections(outputBlock.id);
      methodsId.forEach((methodId) => {
        const weightsConnections = getInputConnections(+methodId);
        const matrixConnections = weightsConnections.flatMap((weightsC) => getInputConnections(weightsC));
        if (matrixConnections.length === 1) {
          dispatch(
            deleteDataKwargs({
              id: +methodId,
              matrixId: inputBlock.id,
            }),
          );
        }
      });
    }
    return;
  };

  const checkForWrongExtensionMethodConnection = (connections: [] | string[][]) => {
    // check connections starting from the matrix blocks
    getBlocksOfType(blocks, 'matrix').forEach((matrix) => {
      let weightsID: [] | string[] = [];
      // save weights id
      connections.forEach((c) => {
        if (c[0] === matrix.id.toString()) {
          // check for fuzzy matrix and weights methods connections
          const weightBlock = blocks.filter((b) => b.id === +c[1])[0];

          if (weightBlock && matrix.data.extension === 'fuzzy') {
            if (!fuzzyWeights.map((m) => m.name.toLowerCase()).includes(weightBlock.name.toLowerCase())) {
              showSnackbar(
                t('snackbar:weights-extension', {
                  method: weightBlock.name.toUpperCase(),
                }),
                'error',
              );
              dispatch(deleteConnection(c));
              if (getOutputConnections(+c[0]).length === 1) {
                dispatch(
                  setBlockError({
                    id: +c[0],
                    error: true,
                  }),
                );
              }
              if (getInputConnections(+c[1]).length === 1) {
                dispatch(
                  setBlockError({
                    id: +c[1],
                    error: true,
                  }),
                );
              }
            }
          }
          weightsID = [...weightsID, c[1]];
        }
      });

      // check for fuzzy matrix and mcda methods connections
      weightsID.forEach((w) => {
        connections.forEach((c) => {
          if (c[0] === w) {
            const methodBlock = blocks.filter((b) => b.id === +c[1])[0];
            if (methodBlock && matrix.data.extension === 'fuzzy') {
              if (!fuzzyMethods.map((m) => m.name.toLowerCase()).includes(methodBlock.name.toLowerCase())) {
                showSnackbar(
                  t('snackbar:mcda-extension', {
                    method: methodBlock.name.toUpperCase(),
                  }),
                  'error',
                );
                dispatch(deleteConnection(c));
                if (getInputConnections(+c[1]).length === 1) {
                  dispatch(
                    setBlockError({
                      id: +c[1],
                      error: true,
                    }),
                  );
                }
              }
            }
          }
        });
      });
    });

    // TODO - AFTER LOADING MATRIX FROM FILE AS ARRAY IN APP
    const getCriteriaSize = (data: BlockDataType) => {
      if (data.matrix) return data.matrix.length > 0 ? data.matrix[0].length : 1;
      return 0;
    };

    getBlocksOfType(blocks, 'weights').forEach((weights) => {
      let matrixID: number[] = [];
      let matrixConnections: [] | string[][] = [];
      connections.forEach((c) => {
        if (weights.name === 'input' && c[1] === weights.id.toString()) {
          matrixID = [...matrixID, +c[0]];
          matrixConnections = [...matrixConnections, c];
        }
      });
      matrixID = matrixID.sort((a, b) => a - b);
      matrixConnections = matrixConnections.sort((a, b) => +a[0] - +b[0]);
      let criteriaSizes = blocks.filter((b) => matrixID.includes(b.id as never)).map((b) => getCriteriaSize(b.data));
      if (Array.from(new Set(criteriaSizes)).length === 1) return;
      else {
        criteriaSizes.forEach((item, index) => {
          if (item !== criteriaSizes[0]) {
            showSnackbar(t('snackbar:matrix-size'), 'error');
            dispatch(deleteConnection(matrixConnections.filter((c) => +c[0] === matrixID[index])[0]));
            criteriaSizes = criteriaSizes.filter((_, i) => i !== index);
          }
        });
      }
    });
  };

  const getMethodsConnectedBlocksExtensions = (data: null | BlockType) => {
    const matrices = blocks.filter((b) => b.type.toLowerCase() === 'matrix');

    let indexes: [] | number[] = [];
    matrices.forEach((m) => {
      let weightsID: [] | string[] = [];
      // save weights id
      connections.forEach((c) => {
        if (c[0] === m.id.toString()) {
          weightsID = [...weightsID, c[1]];
        }
      });

      // check weights to method connection
      weightsID.forEach((w) => {
        connections.forEach((c) => {
          if (c[0] === w && c[1] === data?.id.toString()) {
            indexes = indexes.includes(m.id as never) ? indexes : [...indexes, m.id];
          }
        });
      });
    });

    return matrices
      .map((m) => {
        return { extension: m.data.extension, id: m.id };
      })
      .filter((e) => indexes.includes(e.id as never));
  };

  return {
    getInputConnections,
    getOutputConnections,
    addBlockConnection,
    deleteKwargsFromMatrix,
    deleteConnectionArrow,
    checkForWrongExtensionMethodConnection,
    getMethodsConnectedBlocksExtensions,
  };
}

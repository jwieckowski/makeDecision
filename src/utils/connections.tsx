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

  const addBlockConnection = () => {
    if (clickedBlocks.length === 2) {
      if (connections.filter((c) => c[0] === clickedBlocks[0] && c[1] === clickedBlocks[1]).length === 0) {
        const inputBlock = blocks.filter((b) => b.id === +clickedBlocks[0])[0];
        const outputBlock = blocks.filter((b) => b.id === +clickedBlocks[1])[0];

        if (inputBlock === undefined || outputBlock === undefined) return;

        if (outputBlock.inputConnections.includes(inputBlock.type as never)) {
          // check if newly connected matrix has the same number of criteria as already connected matrix
          // if (outputBlock.type === 'weights') {
          // }

          // check for only one ranking connection
          if (outputBlock.type === 'ranking') {
            const outConnections = connections.filter((c) => c[0] === inputBlock.id.toString()).map((c) => c[1]);
            const rankingBlocks = blocks.filter((block) => block.type === 'ranking');

            if (outConnections.filter((c) => rankingBlocks.map((b) => b.id).includes(+c)).length === 0) {
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
          } else {
            dispatch(addConnection([clickedBlocks[0], clickedBlocks[1]]));
            //
            [inputBlock, outputBlock].map((item) => {
              // used isFilled param
              console.log('item.isFilled');
              console.log(item.isFilled);
              if (!['matrix', 'method'].includes(item.type.toLowerCase()) && item.name.toLowerCase() !== 'input') {
                dispatch(
                  setBlockError({
                    id: item.id,
                    error: false,
                  }),
                );
              } else {
                console.log('tu');
                console.log(item);
                // new matrix connected to method
                if (item.type.toLowerCase() === 'method') {
                  const matricesId = connections.filter((c) => c.includes(`${inputBlock.id}`)).map((c) => +c[0]);
                  const inputMatricesId = outputBlock.data.kwargs.map((k) => k.matrixId);
                  matricesId.forEach((mid) => {
                    if (!inputMatricesId.includes(mid)) {
                      dispatch(
                        setBlockError({
                          id: item.id,
                          error: true,
                        }),
                      );
                    }
                  });
                } else {
                  dispatch(
                    setBlockError({
                      id: item.id,
                      error: !item.isFilled,
                    }),
                  );
                }
              }
            });

            const currentConnections = [...connections, [clickedBlocks[0], clickedBlocks[1]]];
            // UPDATE EXTENSIONS IN WEIGHTS AND METHODS BLOCKS CONNECTED TO MATRIX
            if (inputBlock.type === 'matrix') {
              const weightsBlock = getMatrixWeightsConnections(blocks, currentConnections, inputBlock);
              console.log(weightsBlock);
              weightsBlock.forEach((b) => {
                if (b.data.criteria !== inputBlock.data.criteria) {
                  console.log('czyścimy wagi');
                  dispatch(
                    setBlockWeights({
                      id: b.id,
                      data: [],
                    }),
                  );
                }
                dispatch(
                  setBlockCriteria({
                    id: b.id,
                    data: inputBlock.data.criteria,
                  }),
                );
              });
            }
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
      let matrixID: [] | number[] = [];
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
    addBlockConnection,
    checkForWrongExtensionMethodConnection,
    getMethodsConnectedBlocksExtensions,
  };
}

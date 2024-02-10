// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// REDUX
import { useAppSelector, useAppDispatch } from '@/state';

// SLICES
import {
  setActiveBlock,
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
import useSnackbars from '../hooks/useSnackbars';

// TYPES
import { BlockDataType, BlockType } from '@/types';

export default function useBlocksConnection() {
  const { clickedItems, connections } = useAppSelector((state) => state.connections);
  const { allMethods } = useAppSelector((state) => state.dictionary);
  const { blocks } = useAppSelector((state) => state.blocks);
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbars();
  const { getMatrixWeightsConnections, getWeightsMethodConnections } = useCalculation();

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
    deleteKwargsFromMatrix,
    getMethodsConnectedBlocksExtensions,
  };
}

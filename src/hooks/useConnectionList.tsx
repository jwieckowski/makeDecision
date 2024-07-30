import { useTranslation } from 'react-i18next';

// STATE
import { useAppSelector, useAppDispatch } from '@/state';

// HOOKS
import useSnackbars from '@/hooks/useSnackbars';

// TYPES
import { StructureErrorItem } from '@/types';

// SLICE
import {
  addNode,
  removeNode,
  addConnection,
  removeConnection,
  clearNodes,
  setClickedItems,
  addClickedItem,
  deleteClickedItem,
} from '@/state/slices/connectionsSlice';
import { setActiveBlock, clearBlockData, setBlockFilled } from '@/state/slices/blocksSlice';

// UTILS
import { getKwargsFromDictionary } from '@/utils/filtering';

// HELPERS
import {
  isMethodConnectedToRanking,
  isConnectionExtensionValid,
  isCriteriaSizeEqual,
  getMethodsBlocksWithNewMatrixConnected,
} from './helpers/connectionList';

export default function UseConnectionList() {
  const { allMethods } = useAppSelector((state) => state.dictionary);
  const { blocks } = useAppSelector((state) => state.blocks);
  const { nodes, connections, clickedItems } = useAppSelector((state) => state.connections);
  const dispatch = useAppDispatch();
  const { showSnackbar } = useSnackbars();
  const { t } = useTranslation();

  const addListNode = (
    id: string,
    type: string,
    name: string,
    allowedInput: string[],
    allowedOutput: string[],
    extensions: string[],
  ): void => {
    if (nodes[id]) {
      throw new Error(`Node with the same ID (${id}) already exists`);
    }

    dispatch(
      addNode({
        id,
        type: type.toLowerCase(),
        name: name.toLowerCase(),
        inputConnections: [],
        outputConnections: [],
        allowedInput,
        allowedOutput,
        extensions,
      }),
    );
  };

  const removeListNode = (nodeId: string): void => {
    for (const id in nodes) {
      removeListConnection(nodeId, id, nodeId);
      removeListConnection(id, nodeId);
    }
    dispatch(removeNode(nodeId));
  };

  const addListConnection = (from: string, to: string): void => {
    if (connections.filter((con) => con[0] === from && con[1] === to).length === 0) {
      if (nodes[to].allowedInput.includes(nodes[from].type)) {
        const methodsBlocksWithNewMatrix = getMethodsBlocksWithNewMatrixConnected(nodes, connections, from, to);
        if (nodes[from].type === 'weights' && nodes[to].type === 'visualization') {
          if (
            nodes[from].inputConnections.filter(
              (item) => blocks.filter((b) => b.id === +item && b.data.extension === 'fuzzy').length > 0,
            ).length > 0
          ) {
            showSnackbar(t('snackbars:crisp-weights-visualization'), 'error');
          } else {
            dispatch(addConnection({ from, to }));
          }
        } else if (!isConnectionExtensionValid(nodes, blocks, from, to)) {
          if (nodes[to].type === 'weights' && nodes[to].outputConnections.length === 0) {
            showSnackbar(
              t('snackbar:weights-extension', {
                method: nodes[to].name.toUpperCase(),
              }),
              'error',
            );
          } else if (nodes[to].type === 'weights' && nodes[to].outputConnections.length > 0) {
            nodes[to].outputConnections
              .filter(() => nodes[to].extensions.includes('fuzzy'))
              .map((item) => {
                showSnackbar(
                  t('snackbar:weights-mcda-extension', {
                    method: nodes[item].name.toUpperCase(),
                  }),
                  'error',
                );
              });
          } else {
            showSnackbar(
              t('snackbar:mcda-extension', {
                method: nodes[to].name.toUpperCase(),
              }),
              'error',
            );
          }
        } else if (!isCriteriaSizeEqual(nodes, blocks, from, to)) {
          showSnackbar(t('snackbar:matrix-size'), 'error');
        } else if (methodsBlocksWithNewMatrix.length > 0) {
          methodsBlocksWithNewMatrix.forEach((methodBlock) => {
            const methodBlockData = blocks.find((b) => b.id === +methodBlock.methodID);
            const matrixBlockData = blocks.find((b) => b.id === +methodBlock.matrixID);
            let methodIsFilled = methodBlockData?.isFilled;

            const kwargs = getKwargsFromDictionary(allMethods, nodes[methodBlock.methodID].name)?.filter(
              (item) => item.extension === matrixBlockData?.data.extension,
            );
            if (kwargs?.length) {
              methodIsFilled = methodIsFilled && kwargs.length === 0;
            }
            dispatch(setBlockFilled({ id: +methodBlock.methodID, isFilled: methodIsFilled }));
          });
          dispatch(addConnection({ from, to }));
        } else if (isMethodConnectedToRanking(blocks, nodes[from], nodes[to])) {
          showSnackbar(t('snackbar:method-ranking'), 'error');
        } else {
          dispatch(addConnection({ from, to }));
        }
      } else {
        showSnackbar(t('snackbar:cannot-connect'), 'error');
      }
    }

    dispatch(setClickedItems([]));
    dispatch(setActiveBlock(null));
  };

  const removeListConnection = (from: string, to: string, deletedNode?: string): void => {
    // if method ('to') and no other connections -> set data filled to true
    if (nodes[to].type === 'method' && connections.filter((conn) => conn[1] === to).length === 1) {
      dispatch(setBlockFilled({ id: to, isFilled: true }));
    }
    // if matrix ('from') -> check if is filled is for other matrices
    if (nodes[from].type === 'matrix' && deletedNode && from === deletedNode) {
      const connectedWeights = connections.filter((conn) => conn[0] === from).map((conn) => conn[1]);
      const connectedMethods = connections
        .filter((conn) => connectedWeights.includes(conn[0]) && nodes[conn[0]].type === 'weights')
        .map((conn) => conn[1]);

      const otherWeights = connections
        .filter((conn) => connectedMethods.includes(conn[1]) && nodes[conn[1]].type === 'method')
        .map((conn) => conn[0]);
      const otherMatrices = connections
        .filter((conn) => otherWeights.includes(conn[1]) && nodes[conn[1]].type === 'weights' && conn[0] !== from)
        .map((conn) => conn[0]);

      connectedMethods.forEach((methodID) => {
        const methodBlock = blocks.find((block) => block.id === +methodID);
        if (
          methodBlock?.data.kwargs.filter((item) => otherMatrices.includes(`${item.matrixId}`)).length !==
          otherMatrices.length
        ) {
          let isFilled = true;
          const kwargsMatricesID = methodBlock?.data.kwargs.map((item) => +item.matrixId);

          otherMatrices.forEach((matrixID) => {
            const matrixBlock = blocks.find((block) => block.id === +matrixID);
            const kwargs = getKwargsFromDictionary(allMethods, nodes[methodID].name)?.filter(
              (item) => item.extension === matrixBlock?.data.extension,
            );

            if (kwargs && kwargs.length > 0 && kwargsMatricesID) {
              isFilled = isFilled && kwargsMatricesID.includes(+matrixID);
            }
          });

          dispatch(setBlockFilled({ id: methodID, isFilled: isFilled }));
        }
      });
    }
    dispatch(removeConnection({ from, to }));
  };

  const clearListNodes = (): void => {
    dispatch(clearNodes());
  };

  const checkMatrixConnection = (id: string, extension: string) => {
    // WEIGHTS
    nodes[id].outputConnections.forEach((weightNodeID) => {
      if (!nodes[weightNodeID].extensions.includes(extension)) {
        removeListConnection(id, weightNodeID);
        // clear params in weights
        dispatch(clearBlockData({ id: id }));

        showSnackbar(
          t('snackbar:weights-extension', {
            method: nodes[weightNodeID].name.toUpperCase(),
          }),
          'error',
        );
      }
      checkWeightsMethodConnection(weightNodeID, extension);
    });
  };

  const checkWeightsMethodConnection = (id: string, extension: string) => {
    // WEIGHTS -> MCDA METHOD
    nodes[id].outputConnections.forEach((methodNodeID) => {
      const block = blocks.find((block) => block.id === +methodNodeID);
      if (block?.data.extension !== extension) {
        dispatch(clearBlockData({ id: +methodNodeID }));
        dispatch(setBlockFilled({ id: +methodNodeID, isFilled: false }));
      }

      if (!nodes[methodNodeID].extensions.includes(extension)) {
        removeListConnection(id, methodNodeID);
        // clear params in method
        dispatch(clearBlockData({ id: +methodNodeID }));
        dispatch(setBlockFilled({ id: +methodNodeID, isFilled: false }));
        showSnackbar(
          t('snackbar:mcda-extension', {
            method: nodes[methodNodeID].name.toUpperCase(),
          }),
          'error',
        );
      }
    });
  };

  const getInputConnections = (id: string) => {
    return nodes[id].inputConnections.length;
  };

  const getOutputConnections = (id: string) => {
    return nodes[id].outputConnections.length;
  };

  const hasInputConnections = (id: string, input = true) => {
    if (input) return true;
    return getInputConnections(id) !== 0;
  };

  const hasOutputConnections = (id: string) => {
    return getOutputConnections(id) !== 0;
  };

  const isInputRequired = (type: string, name: string) => {
    if (type === 'matrix') return false;
    if (['weights', 'correlation', 'visualization'].includes(type)) return true;
    if (['method', 'ranking'].includes(type)) return name !== 'input';
    return false;
  };

  const isOutputRequired = (type: string, name: string) => {
    if (type === 'matrix') return true;
    if (['method', 'ranking'].includes(type)) return name === 'input';
    if (['weights', 'correlation', 'visualization'].includes(type)) return false;
    return true;
  };

  const addClickedListItem = (id: string) => {
    dispatch(addClickedItem(id));
  };
  const setClickedListItems = (data: string[]) => {
    dispatch(setClickedItems(data));
  };

  const deleteClickedListItem = (id: string) => {
    dispatch(deleteClickedItem(id));
  };

  const hasDifferentCriteriaTypesIfRequired = (id: string, name: string) => {
    let errors: StructureErrorItem[] = [];

    if (['copras', 'moora', 'ocra'].includes(name.toLowerCase())) {
      const weightsBlocks = nodes[id].inputConnections;
      weightsBlocks.forEach((weightsBlockId) => {
        const matrixBlocks = nodes[weightsBlockId].inputConnections;
        matrixBlocks.forEach((matrixBlockId) => {
          const matrixBlock = blocks.find((block) => block.id === +matrixBlockId);
          if (
            (name.toLowerCase() === 'copras' || matrixBlock?.data.extension === 'fuzzy') &&
            [...new Set(matrixBlock?.data?.criteriaTypes.map((item) => +item))].length === 1
          ) {
            errors = [
              ...errors,
              {
                id: id,
                type: nodes[id].type,
                message: t('snackbar:methods-same-criteria-types', { name: name.toUpperCase(), id: matrixBlockId }),
              },
            ];
          }
        });
      });
    }

    return errors;
  };

  const hasScatterRankingTwoInputs = (id: string, name: string) => {
    let errors: StructureErrorItem[] = [];

    if (name.toLowerCase().includes('scatter')) {
      // 1. More than 2 rankings
      if (nodes[id].inputConnections.length > 2) {
        errors = [
          ...errors,
          {
            id: id,
            type: nodes[id].type,
            message: t('snackbar:scatter-ranking-inputs', { id: id, counter: nodes[id].inputConnections.length }),
          },
        ];
      } else {
        // 2. All inputs from MCDA methods and weights methods
        let counterInputs = 0;

        nodes[id].inputConnections.forEach((rankId) => {
          nodes[rankId].inputConnections.forEach((methodId) => {
            counterInputs += nodes[methodId].inputConnections.length;
          });
        });

        if (counterInputs !== 2) {
          errors = [
            ...errors,
            {
              id: id,
              type: nodes[id].type,
              message: t('snackbar:scatter-ranking-inputs', { id: id, counter: counterInputs }),
            },
          ];
        }
      }
    }
    return errors;
  };

  const isDataFilled = (id: string) => {
    return blocks.find((block) => block.id === +id)?.isFilled ?? true;
  };

  const getStructureErrors = () => {
    let errorList: StructureErrorItem[] = [];
    Object.keys(nodes).map((id) => {
      // 1. Missing input connections
      if (isInputRequired(nodes[id].type, nodes[id].name) && !hasInputConnections(id)) {
        if (!['method', 'ranking'].includes(nodes[id].type.toLowerCase()) && nodes[id].name.toLowerCase() !== 'input') {
          errorList = [...errorList, { id: id, type: nodes[id].type, message: t('results:missing-input') }];
        }
      }
      // 2. Missing output connections
      if (isOutputRequired(nodes[id].type, nodes[id].name) && !hasOutputConnections(id)) {
        if (!['method', 'ranking'].includes(nodes[id].type.toLowerCase()) && nodes[id].name.toLowerCase() !== 'input') {
          errorList = [...errorList, { id: id, type: nodes[id].type, message: t('results:missing-output') }];
        }
      }
      // 3. Input data is not filled
      if (!isDataFilled(id)) {
        errorList = [...errorList, { id: id, type: nodes[id].type, message: t('results:missing-data-filled') }];
      }

      // 4. Criteria types are the same
      const criteriaTypesErrors = hasDifferentCriteriaTypesIfRequired(id, nodes[id].name);
      if (criteriaTypesErrors.length > 0) {
        errorList = [...errorList, ...criteriaTypesErrors];
      }

      // 5. Scatter ranking with only two inputs
      const scatterErrors = hasScatterRankingTwoInputs(id, nodes[id].name);
      if (scatterErrors.length > 0) {
        errorList = [...errorList, ...scatterErrors];
      }
    });
    return errorList;
  };

  return {
    nodes,
    connections,
    clickedItems,
    addListNode,
    removeListNode,
    addListConnection,
    removeListConnection,
    clearListNodes,
    addClickedListItem,
    setClickedListItems,
    deleteClickedListItem,
    getInputConnections,
    getOutputConnections,
    getStructureErrors,
    checkMatrixConnection,
  };
}

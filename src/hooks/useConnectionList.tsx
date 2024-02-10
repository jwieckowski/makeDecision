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
import { setActiveBlock } from '@/state/slices/blocksSlice';

// HELPERS
import { isMethodConnectedToRanking, isConnectionExtensionValid, isCriteriaSizeEqual } from './helpers/connectionList';

export default function UseConnectionList() {
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
      dispatch(removeConnection({ from: nodeId, to: id }));
      dispatch(removeConnection({ from: id, to: nodeId }));
    }
    dispatch(removeNode(nodeId));
  };

  const addListConnection = (from: string, to: string): void => {
    if (connections.filter((con) => con[0] === from && con[1] === to).length === 0) {
      if (nodes[to].allowedInput.includes(nodes[from].type)) {
        if (!isConnectionExtensionValid(nodes, blocks, from, to)) {
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
        }
        // TODO
        // check if new matrix connected to change filled data status
        else if (isMethodConnectedToRanking(blocks, nodes[from], nodes[to])) {
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

  const removeListConnection = (from: string, to: string): void => {
    dispatch(removeConnection({ from, to }));
  };

  const clearListNodes = (): void => {
    dispatch(clearNodes());
  };

  const getInputConnections = (id: string) => {
    return nodes[id].inputConnections.length;
  };

  const getOutputConnections = (id: string) => {
    return nodes[id].outputConnections.length;
  };

  const hasInputConnections = (id: string) => {
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

  const isDataFilled = (id: string) => {
    return blocks.find((block) => block.id === +id)?.isFilled ?? true;
  };

  const getStructureErrors = () => {
    let errorList: StructureErrorItem[] = [];
    Object.keys(nodes).map((id) => {
      // 1. Missing input connections
      if (isInputRequired(nodes[id].type, nodes[id].name) && !hasInputConnections(id)) {
        errorList = [...errorList, { id: id, type: nodes[id].type, message: t('results:missing-input') }];
      }
      // 2. Missing output connections
      if (isOutputRequired(nodes[id].type, nodes[id].name) && !hasOutputConnections(id)) {
        errorList = [...errorList, { id: id, type: nodes[id].type, message: t('results:missing-output') }];
      }
      // 3. Input data is not filled
      if (!isDataFilled(id)) {
        errorList = [...errorList, { id: id, type: nodes[id].type, message: t('results:missing-data-filled') }];
      }
    });
    return errorList;
  };

  //   useEffect(() => {
  //     // Perform any side effects related to the ConnectionList state here
  //     // This effect will run when the component mounts or when the nodes state changes
  //   }, [nodes]);

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
  };
}

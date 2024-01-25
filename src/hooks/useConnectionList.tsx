import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// STATE
import { useAppSelector, useAppDispatch } from '@/state';

// HOOKS
import useSnackbars from '@/hooks/useSnackbars';

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
import { isMethodConnectedToRanking } from './helpers/connectionList';

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
        // TODO
        // check for matrix size connection to weights
        // check if new matrix connected
        if (isMethodConnectedToRanking(blocks, nodes[from], nodes[to])) {
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

  const hasInputConnections = (id: string) => {
    return nodes[id].inputConnections.length !== 0;
  };

  const hasOutputConnections = (id: string) => {
    return nodes[id].outputConnections.length !== 0;
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
  };
}

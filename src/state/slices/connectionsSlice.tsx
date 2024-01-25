import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConnectionsSliceState, Node } from '@/types';

const initialState: ConnectionsSliceState = {
  nodes: {},
  connections: [],
  clickedItems: [],
};

const connectionsSlice = createSlice({
  name: 'connections',
  initialState: initialState,
  reducers: {
    addNode: (state, action: PayloadAction<Node>) => {
      const { id } = action.payload;
      if (state.nodes[id]) {
        throw new Error('Node with the same ID already exists');
      }
      state.nodes[id] = action.payload;
    },
    removeNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;

      delete state.nodes[nodeId];
    },
    addConnection: (state, action: PayloadAction<{ from: string; to: string }>) => {
      const { from, to } = action.payload;

      state.nodes[from].outputConnections.push(to);
      state.nodes[to].inputConnections.push(from);

      state.connections = [...state.connections, [from, to]];
    },
    removeConnection: (state, action: PayloadAction<{ from: string; to: string }>) => {
      const { from, to } = action.payload;

      state.nodes[from].outputConnections = state.nodes[from].outputConnections.filter((id) => id !== to);
      state.nodes[to].inputConnections = state.nodes[to].inputConnections.filter((id) => id !== from);

      state.connections = state.connections.filter((connection) => !(connection[0] === from && connection[1] === to));
    },
    clearNodes: (state) => {
      state.nodes = {};
      state.connections = [];
    },
    setClickedItems: (state, action) => {
      state.clickedItems = action.payload;
    },
    addClickedItem: (state, action) => {
      state.clickedItems = [...state.clickedItems, action.payload];
    },
    deleteClickedItem: (state, action) => {
      state.clickedItems = state.clickedItems.filter((item) => item !== action.payload);
    },
  },
});
const { actions, reducer } = connectionsSlice;
export const {
  addNode,
  removeNode,
  addConnection,
  removeConnection,
  clearNodes,
  setClickedItems,
  addClickedItem,
  deleteClickedItem,
} = actions;
export default reducer;

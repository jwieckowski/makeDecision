import { createSlice } from '@reduxjs/toolkit';
import { BlocksSliceState } from '../types'

const initialState: BlocksSliceState = {
  blocks: [],
  clickedBlocks: [],
  connections: [],
  activeBlock: null,
  clickedBlockId: null,
  draggedItem: null,
  modalOpen: false,
  modalType: null,
  connectionToDelete: null
}

const blocksSlice = createSlice({
  name: 'blocks',
  initialState: initialState,
  reducers: {
    addBlock: (state, action) => {
      state.blocks = [...state.blocks, {
        ...action.payload,
        _id: state.blocks.length === 0 ? 1 : Math.max(...state.blocks.map(block => block._id))+1
      }]
    },
    deleteBlock: (state, action) => {
      state.blocks = state.blocks.filter(block => action.payload !== block._id)
    },
    setBlocks: (state, action) => {
      state.blocks = action.payload
    },
    setModalOpen: (state, action) => {
      state.modalOpen = action.payload
    },
    setModalType: (state, action) => {
      state.modalType = action.payload
    },
    setConnectionToDelete: (state, action) => {
      state.connectionToDelete = action.payload
    },
    setClickedBlocks: (state, action) => {
      state.clickedBlocks = action.payload
    },
    addClickedBlock: (state, action) => {
      state.clickedBlocks = [...state.clickedBlocks, action.payload]
    },
    changeDraggedItemStatus: (state, action) => {
      state.draggedItem = action.payload
    },
    deleteClickedBlock: (state, action) => {
      state.clickedBlocks = state.clickedBlocks.filter(block => block !== action.payload)
    },
    addConnection: (state, action) => {
      state.connections = [...state.connections, action.payload]
    },
    deleteConnection: (state, action) => {
      state.connections = state.connections.filter(connection => !((connection[0] === action.payload[0]) && (connection[1] === action.payload[1])))
      if (state.connectionToDelete !== null) state.connectionToDelete = null
    },
    setConnections: (state, action) => {
      state.connections = action.payload
    },
    setActiveBlock: (state, action) => {
      state.activeBlock = action.payload
    },
    setClickedBlockId: (state, action) => {
      state.clickedBlockId = action.payload
    }
  },
  extraReducers: (builder) => {
  }
});
const { actions, reducer } = blocksSlice
export const { 
  addBlock,
  deleteBlock, 
  setBlocks,
  setClickedBlocks,
  addClickedBlock,
  deleteClickedBlock,
  changeDraggedItemStatus,
  addConnection,
  deleteConnection,
  setConnections,
  setModalOpen,
  setModalType,
  setActiveBlock,
  setClickedBlockId,
  setConnectionToDelete
} = actions;
export default reducer;

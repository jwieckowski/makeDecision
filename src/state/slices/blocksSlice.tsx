import { createSlice } from '@reduxjs/toolkit';
import { BlocksSliceState, BlockDataType } from '@/types';
import { DEFAULT_ALTERNATIVES, DEFAULT_CRITERIA } from '@/common/const';

const initialState: BlocksSliceState = {
  blocks: [],
  clickedBlocks: [],
  connections: [],
  activeBlock: null,
  clickedBlockId: null,
  draggedItem: null,
  modalOpen: false,
  modalType: null,
  connectionToDelete: null,
};

const initialBlockData: BlockDataType = {
  extension: 'crisp',
  matrix: [],
  criteriaTypes: [],
  fileName: null,
  weights: [],
  alternatives: DEFAULT_ALTERNATIVES,
  criteria: DEFAULT_CRITERIA,
  kwargs: [],
  preference: [],
};

const blocksSlice = createSlice({
  name: 'blocks',
  initialState: initialState,
  reducers: {
    addBlock: (state, action) => {
      state.blocks = [
        ...state.blocks,
        {
          ...action.payload,
          id: state.blocks.length === 0 ? 1 : Math.max(...state.blocks.map((block) => block.id)) + 1,
        },
      ];
    },
    deleteBlock: (state, action) => {
      state.blocks = state.blocks.filter((block) => action.payload !== block.id);
    },
    setBlocks: (state, action) => {
      state.blocks = action.payload;
    },
    setModalOpen: (state, action) => {
      state.modalOpen = action.payload;
    },
    setModalType: (state, action) => {
      state.modalType = action.payload;
    },
    setConnectionToDelete: (state, action) => {
      state.connectionToDelete = action.payload;
    },
    setClickedBlocks: (state, action) => {
      state.clickedBlocks = action.payload;
    },
    addClickedBlock: (state, action) => {
      state.clickedBlocks = [...state.clickedBlocks, action.payload];
    },
    changeDraggedItemStatus: (state, action) => {
      state.draggedItem = action.payload;
    },
    deleteClickedBlock: (state, action) => {
      state.clickedBlocks = state.clickedBlocks.filter((block) => block !== action.payload);
    },
    addConnection: (state, action) => {
      state.connections = [...state.connections, action.payload];
    },
    deleteConnection: (state, action) => {
      state.connections = state.connections.filter(
        (connection) => !(connection[0] === action.payload[0] && connection[1] === action.payload[1]),
      );
      if (state.connectionToDelete !== null) state.connectionToDelete = null;
    },
    setConnections: (state, action) => {
      state.connections = action.payload;
    },
    setActiveBlock: (state, action) => {
      state.activeBlock =
        action.payload !== null ? state.blocks.filter((block) => block.id === +action.payload)[0] : null;
    },
    setClickedBlockId: (state, action) => {
      state.clickedBlockId = action.payload;
    },
    setBlockMatrix: (state, action) => {
      state.blocks = state.blocks.map((b) => {
        return b.id === action.payload.id
          ? {
              ...b,
              data: {
                ...b.data,
                matrix: action.payload.data,
              },
            }
          : b;
      });
    },
    setBlockMatrixFile: (state, action) => {
      state.blocks = state.blocks.map((b) => {
        return b.id === action.payload.id
          ? {
              ...b,
              data: {
                ...b.data,
                matrixFile: action.payload.data,
              },
            }
          : b;
      });
    },
    setBlockFileName: (state, action) => {
      state.blocks = state.blocks.map((b) => {
        return b.id === action.payload.id
          ? {
              ...b,
              data: {
                ...b.data,
                fileName: action.payload.data,
              },
            }
          : b;
      });
    },
    setBlockRandomMatrix: (state, action) => {
      state.blocks = state.blocks.map((b) => {
        return b.id === action.payload.id
          ? {
              ...b,
              data: {
                ...b.data,
                randomMatrix: action.payload.data,
              },
            }
          : b;
      });
    },
    setBlockTypes: (state, action) => {
      state.blocks = state.blocks.map((b) => {
        return b.id === action.payload.id
          ? {
              ...b,
              data: {
                ...b.data,
                criteriaTypes: action.payload.data,
              },
            }
          : b;
      });
    },
    setBlockWeights: (state, action) => {
      state.blocks = state.blocks.map((b) => {
        return b.id === action.payload.id
          ? {
              ...b,
              data: {
                ...b.data,
                weights: action.payload.data,
              },
            }
          : b;
      });
    },
    setBlockExtension: (state, action) => {
      state.blocks = state.blocks.map((b) => {
        return b.id === action.payload.id
          ? {
              ...b,
              data: {
                ...b.data,
                extension: action.payload.data,
              },
            }
          : b;
      });
    },
    setBlockKwargs: (state, action) => {
      state.blocks = state.blocks.map((b) => {
        return b.id === action.payload.id
          ? {
              ...b,
              data: {
                ...b.data,
                kwargs: action.payload.data,
              },
            }
          : b;
      });
    },
    setBlockAlternatives: (state, action) => {
      state.blocks = state.blocks.map((b) => {
        return b.id === action.payload.id
          ? {
              ...b,
              data: {
                ...b.data,
                alternatives: action.payload.data,
              },
            }
          : b;
      });
    },
    setBlockCriteria: (state, action) => {
      state.blocks = state.blocks.map((b) => {
        return b.id === action.payload.id
          ? {
              ...b,
              data: {
                ...b.data,
                criteria: action.payload.data,
              },
            }
          : b;
      });
    },
    setBlockStyles: (state, action) => {
      state.blocks = state.blocks.map((b) => {
        return b.id === action.payload.id
          ? {
              ...b,
              data: {
                ...b.data,
                styles: action.payload.data,
              },
            }
          : b;
      });
    },
    blockFileDelete: (state, action) => {
      state.blocks = state.blocks.map((b) => {
        return b.id === action.payload.id
          ? {
              ...b,
              data: {
                ...b.data,
                fileName: null,
                matrix: [],
                criteriaTypes: [],
                criteria: 3,
                alternatives: 3,
              },
            }
          : b;
      });
    },
    setBlockPosition: (state, action) => {
      state.blocks = state.blocks.map((b) => {
        return b.id === action.payload.id
          ? {
              ...b,
              position: action.payload.position,
            }
          : b;
      });
    },
    setBlockError: (state, action) => {
      state.blocks = state.blocks.map((b) => {
        return b.id === action.payload.id
          ? {
              ...b,
              error: action.payload.error,
            }
          : b;
      });
    },
    setBlockData: (state, action) => {
      state.blocks = state.blocks.map((b) => {
        {
          return b.id === action.payload.id
            ? {
                ...b,
                data: {
                  ...b.data,
                  ...action.payload.data,
                },
              }
            : b;
        }
      });
    },
    clearBlockData: (state, action) => {
      state.blocks = state.blocks.map((b) => {
        return b.id === action.payload.id
          ? {
              ...b,
              data: initialBlockData,
            }
          : b;
      });
    },
  },
});
const { actions, reducer } = blocksSlice;
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
  setConnectionToDelete,
  setBlockMatrix,
  setBlockMatrixFile,
  setBlockFileName,
  setBlockRandomMatrix,
  setBlockTypes,
  setBlockWeights,
  setBlockExtension,
  setBlockKwargs,
  setBlockAlternatives,
  setBlockCriteria,
  setBlockStyles,
  blockFileDelete,
  setBlockPosition,
  setBlockError,
  setBlockData,
  clearBlockData,
} = actions;
export default reducer;

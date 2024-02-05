import { createSlice } from '@reduxjs/toolkit';
import { BlocksSliceState, BlockDataType } from '@/types';
import { DEFAULT_ALTERNATIVES, DEFAULT_CRITERIA } from '@/common/calculations';

const initialState: BlocksSliceState = {
  blocks: [],
  activeBlock: null,
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
    changeDraggedItemStatus: (state, action) => {
      state.draggedItem = action.payload;
    },
    setActiveBlock: (state, action) => {
      state.activeBlock =
        action.payload !== null ? state.blocks.filter((block) => block.id === +action.payload)[0] : null;
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
    setBlockFilled: (state, action) => {
      state.blocks = state.blocks.map((b) => {
        return b.id === action.payload.id
          ? {
              ...b,
              isFilled: action.payload.isFilled,
            }
          : b;
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
    deleteDataKwargs: (state, action) => {
      state.blocks = state.blocks.map((b) => {
        return b.id === action.payload.id
          ? {
              ...b,
              data: {
                ...b.data,
                kwargs: b.data.kwargs.filter((item) => item.matrixId !== action.payload.matrixId),
              },
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
  changeDraggedItemStatus,
  setModalOpen,
  setModalType,
  setActiveBlock,
  setConnectionToDelete,
  setBlockMatrix,
  setBlockMatrixFile,
  setBlockFileName,
  setBlockTypes,
  setBlockWeights,
  setBlockExtension,
  setBlockKwargs,
  setBlockAlternatives,
  setBlockCriteria,
  setBlockStyles,
  setBlockPosition,
  setBlockError,
  setBlockData,
  setBlockFilled,
  clearBlockData,
  deleteDataKwargs,
} = actions;
export default reducer;

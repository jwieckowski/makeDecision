import { ResultsAdditional } from './results';

export type BlockPosition = {
  x: number;
  y: number;
};

export type BlockDataType = {
  extension: string;
  matrix: [] | any;
  criteriaTypes: string[];
  fileName: null | string;
  weights: string[];
  alternatives: number;
  criteria: number;
  kwargs: any;
};

export type BlockType = {
  id: number;
  type: string;
  name: string;
  inputConnections: [] | string[];
  outputConnections: [] | string[];
  data: BlockDataType;
  error: boolean;
  errorMessage: null | string;
  position: BlockPosition;
};

export type BlocksSliceState = {
  blocks: [] | BlockType[];
  clickedBlocks: [] | string[];
  connections: [] | string[][];
  activeBlock: null | BlockType;
  clickedBlockId: null | number;
  draggedItem: null | string;
  modalOpen: boolean;
  modalType: null | string;
  connectionToDelete: null | string[];
};

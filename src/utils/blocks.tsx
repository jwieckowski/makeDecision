// TYPES
import { BlockType } from '@/types';

export const getNotConnectedBlocks = (blocks: [] | BlockType[], connections: [] | string[][]) => {
  return blocks.filter((block) => connections.filter((c) => c.includes(block.id.toString())).length === 0);
};

export const getBlocksOfType = (blocks: [] | BlockType[], type: string) => {
  return blocks.filter((b) => b.type.toLowerCase() === type);
};

import { Node, BlockType } from '@/types';

export const isMethodConnectedToRanking = (blocks: BlockType[], nodeFrom: Node, nodeTo: Node) => {
  if (nodeTo.type !== 'ranking') return false;
  const rankingsID = blocks.filter((block) => block.type === 'ranking').map((block) => block.id);
  return nodeFrom.outputConnections.filter((con) => rankingsID.includes(+con)).length > 0;
};

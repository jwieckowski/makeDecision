import { Node, BlockType } from '@/types';

type Nodes = {
  [key: string]: Node;
};

export const isMethodConnectedToRanking = (blocks: BlockType[], nodeFrom: Node, nodeTo: Node) => {
  if (nodeTo.type !== 'ranking') return false;
  const rankingsID = blocks.filter((block) => block.type === 'ranking').map((block) => block.id);
  return nodeFrom.outputConnections.filter((con) => rankingsID.includes(+con)).length > 0;
};

export const isConnectionExtensionValid = (nodes: Nodes, blocks: BlockType[], from: string, to: string) => {
  if (nodes[to].extensions.length === 0) return true;
  const inputBlock = blocks.find((block) => block.id === +from);

  // matrix to weights
  if (nodes[to].type === 'weights') {
    if (nodes[to].outputConnections.length === 0) {
      // weights without method connection
      return nodes[to].extensions.includes(inputBlock?.data.extension ?? '');
    } else {
      // weights with method connection
      return (
        nodes[to].outputConnections.filter((item) => {
          return nodes[item].extensions.includes(inputBlock?.data.extension ?? '');
        }).length > 0
      );
    }
  }

  // weights to method
  if (nodes[to].type === 'method') {
    if (nodes[from].inputConnections.length === 0) {
      // weights without matrix connection
      return nodes[to].extensions.filter((item) => nodes[from].extensions.includes(item)).length > 0;
    } else {
      // weights with matrix connection
      return (
        nodes[from].inputConnections.filter(() => {
          return nodes[to].extensions.includes(inputBlock?.data.extension ?? '');
        }).length > 0
      );
    }
  }

  return true;
};

export const isCriteriaSizeEqual = (nodes: Nodes, blocks: BlockType[], from: string, to: string) => {
  if (nodes[from].type !== 'matrix' || nodes[to].name !== 'input') return true;

  if (nodes[to].inputConnections.length === 0) return true;

  const newBlockCriteriaSize = blocks.find((block) => block.id === +from)?.data.criteria ?? 0;
  return (
    Array.from(
      new Set([
        ...nodes[to].inputConnections.map((item) => {
          const inputBlock = blocks.find((block) => block.id === +item);
          return inputBlock?.data.criteria ?? 0;
        }),
        newBlockCriteriaSize,
      ]),
    ).length === 1
  );
};

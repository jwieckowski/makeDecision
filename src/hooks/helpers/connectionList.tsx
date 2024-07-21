import { Node, BlockType } from '@/types';

type Nodes = {
  [key: string]: Node;
};

type MethodBlock = {
  methodID: string;
  matrixID: string;
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

export const getMethodsBlocksWithNewMatrixConnected = (
  nodes: Nodes,
  connections: [string, string][],
  from: string,
  to: string,
) => {
  if (nodes[from].type !== 'matrix' && nodes[from].type !== 'weights') return [];

  let methodsBlocksID: string[] = [];
  let methodsBlocksData: MethodBlock[] = [];

  if (nodes[to].type === 'weights') {
    const methodsBlocks = connections.filter((conn) => conn[0] === to).map((conn) => conn[1]);
    methodsBlocks.forEach((methodBlockID) => {
      const otherWeightsBlocks = connections
        .filter((conn) => conn[1] === methodBlockID && conn[0] !== to)
        .map((conn) => conn[0]);
      const allMatricesBlocks = connections
        .filter((conn) => otherWeightsBlocks.includes(conn[1]))
        .map((item) => item[0]);
      if (!allMatricesBlocks.includes(from)) {
        methodsBlocksID = [...methodsBlocksID, methodBlockID];
        methodsBlocksData = [
          ...methodsBlocksData,
          {
            methodID: methodBlockID,
            matrixID: from,
          },
        ];
      }
    });
  } else if (nodes[to].type === 'method') {
    // currently connected
    const connectedWeightsBlocks = connections.filter((conn) => conn[1] === to).map((conn) => conn[0]);
    if (connectedWeightsBlocks.length === 0) {
      methodsBlocksID = [...methodsBlocksID, to];
      connections
        .filter((conn) => conn[1] === from)
        .forEach((conn) => {
          methodsBlocksData = [
            ...methodsBlocksData,
            {
              methodID: to,
              matrixID: conn[0],
            },
          ];
        });
    } else {
      let connectedMatricesBlocks: string[] = [];
      connectedWeightsBlocks.forEach((weightBlockID) => {
        connectedMatricesBlocks = [
          ...connectedMatricesBlocks,
          ...connections.filter((conn) => conn[1] === weightBlockID).map((item) => item[0]),
        ];
      });

      // newly come to connect
      const newMatrixConnections = connections.filter((conn) => conn[1] === from).map((conn) => conn[0]);
      newMatrixConnections.forEach((matrixBlockID) => {
        if (!connectedMatricesBlocks.includes(matrixBlockID)) {
          methodsBlocksID = [...methodsBlocksID, to];
          methodsBlocksData = [
            ...methodsBlocksData,
            {
              methodID: to,
              matrixID: matrixBlockID,
            },
          ];
        }
      });
    }
  }

  // return methodsBlocksID;
  return methodsBlocksData;
};

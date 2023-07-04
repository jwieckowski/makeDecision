// TYPES
import { BlockType, AllMethodsItem } from "../redux/types";

export const getNotConnectedBlocks = (
  blocks: [] | BlockType[],
  connections: [] | string[][]
) => {
  return blocks.filter(
    (block) =>
      connections.filter((c) => c.includes(block._id.toString())).length === 0
  );
};

export const getBlocksOfType = (blocks: [] | BlockType[], type: string) => {
  return blocks.filter((b) => b.type.toLowerCase() === type);
};

export const getUpdatedBlocksLanguage = (
  blocks: [] | BlockType[],
  methods: [] | AllMethodsItem[]
) => {
  if (blocks.length === 0) return [];

  return blocks.map((block) => {
    const blockMethodInfo = methods.find((item) =>
      item.key.toLowerCase().includes(block.type.toLowerCase())
    );
    const blockMethodDataInfo = blockMethodInfo?.data.find(
      (item) => item.name.toLowerCase() === block.method.toLowerCase()
    );

    return {
      ...block,
      type: blockMethodInfo?.key.includes("matrix")
        ? blockMethodInfo?.key.split(" ")[1].toLowerCase()
        : blockMethodInfo?.key.toLowerCase(),
      label: blockMethodDataInfo?.label.toLowerCase(),
      method: blockMethodDataInfo?.name.toLowerCase(),
      typeLabel: blockMethodInfo?.label.toLocaleLowerCase(),
    };
  });
};

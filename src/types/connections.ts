export type Node = {
  id: string;
  type: string;
  name: string;
  inputConnections: string[];
  outputConnections: string[];
  allowedInput: string[];
  allowedOutput: string[];
  extensions: string[];
};

export type ConnectionsSliceState = {
  nodes: { [key: string]: Node };
  connections: Array<[string, string]>;
  clickedItems: string[];
};

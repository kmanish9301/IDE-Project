export const convertFileStructureToTree = (fileStructure) => {
  let nodeId = 0; // Keep track of node IDs

  const generateNodeId = () => `${nodeId++}`;

  const createTreeNode = (node) => ({
    id: generateNodeId(),
    name: node.name,
    type: node.type,
    children: node.files ? node.files.map(createTreeNode) : [],
  });

  return {
    id: "root",
    name: "Root",
    children: fileStructure.map(createTreeNode),
  };
};

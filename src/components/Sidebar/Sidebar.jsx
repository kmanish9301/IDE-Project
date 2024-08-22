import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { AddCircleOutline, Folder, InsertDriveFile } from "@mui/icons-material";

const Sidebar = ({
  fileStructure,
  onFileUpload,
  onAddFile,
  onAddFolder,
  onSelectFile,
}) => {
  const [data, setData] = useState(fileStructure);

  const handleFileUpload = (e) => {
    const files = e.target.files;
    const updatedStructure = [...data];

    const processFile = (file) => {
      const pathParts = file.webkitRelativePath.split("/");
      let currentLevel = updatedStructure;

      for (let i = 0; i < pathParts.length - 1; i++) {
        const folderName = pathParts[i];
        let folder = currentLevel.find(
          (item) => item.name === folderName && item.type === "folder"
        );
        if (!folder) {
          folder = { name: folderName, type: "folder", children: [] };
          currentLevel.push(folder);
        }
        currentLevel = folder.children;
      }

      currentLevel.push({ name: file.name, type: "file", content: file });
    };

    Array.from(files).forEach(processFile);
    onFileUpload(updatedStructure);
    setData(updatedStructure);
  };

  const handleAddFile = () => {
    const newFileName = prompt("Enter file name:");
    if (newFileName) {
      onAddFile(null, newFileName); // Pass null for parentFolderName
      setData([...data]); // Refresh tree view
    }
  };

  const handleAddFolder = () => {
    const newFolderName = prompt("Enter folder name:");
    if (newFolderName) {
      onAddFolder(null, newFolderName); // Pass null for parentFolderName
      setData([...data]); // Refresh tree view
    }
  };

  const TreeNode = ({ node, onToggle }) => (
    <div>
      <span
        style={{
          cursor: "pointer",
          fontWeight: node.toggled ? "bold" : "normal",
        }}
        onClick={() => {
          if (node.type === "folder") {
            onToggle(node);
          } else if (node.type === "file") {
            onSelectFile(node);
          }
        }}
      >
        {node.type === "folder" ? <Folder /> : <InsertDriveFile />}
        {node.name}
      </span>
      {node.toggled && node.children && (
        <div style={{ paddingLeft: 20 }}>
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );

  const handleToggle = (node) => {
    node.toggled = !node.toggled;
    setData([...data]);
  };

  return (
    <Box sx={{ width: 250, backgroundColor: "#3e3e3e" }}>
      <input
        type="file"
        webkitdirectory="true"
        directory="true"
        multiple
        style={{ display: "none" }}
        id="upload-folder"
        onChange={handleFileUpload}
      />
      <label htmlFor="upload-folder">
        <IconButton component="span">
          <AddCircleOutline />
        </IconButton>
      </label>
      <IconButton onClick={handleAddFolder}>
        <Folder />
      </IconButton>
      <IconButton onClick={handleAddFile}>
        <InsertDriveFile />
      </IconButton>
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {data.map((item, index) => (
          <TreeNode key={index} node={item} onToggle={handleToggle} />
        ))}
      </Box>
    </Box>
  );
};

export default Sidebar;

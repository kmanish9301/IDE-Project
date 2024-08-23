import { AddCircleOutline, Folder, InsertDriveFile } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";

const Sidebar = ({
  fileStructure,
  onFileUpload,
  onAddFile,
  onAddFolder,
  onSelectFile,
}) => {
  const [data, setData] = useState(fileStructure);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const sidebarRef = useRef(null);

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
      const updatedStructure = addItemToStructure(data, selectedFolder?.name, {
        name: newFileName,
        type: "file",
      });
      onAddFile(selectedFolder ? selectedFolder.name : null, newFileName);
      setData(updatedStructure);
    }
  };

  const handleAddFolder = () => {
    const newFolderName = prompt("Enter folder name:");
    if (newFolderName) {
      let updatedStructure;
      if (selectedFolder) {
        updatedStructure = addItemToStructure(data, selectedFolder.name, {
          name: newFolderName,
          type: "folder",
          children: [],
          toggled: false,
        });
      } else {
        updatedStructure = [
          ...data,
          {
            name: newFolderName,
            type: "folder",
            children: [],
            toggled: false,
          },
        ];
      }
      onAddFolder(selectedFolder ? selectedFolder.name : null, newFolderName);
      setData(updatedStructure);
      setSelectedFolder(null); // Deselect any previously selected folder
    }
  };

  const addItemToStructure = (structure, folderName, newItem) => {
    if (!folderName) return [...structure, newItem];

    return structure.map((item) => {
      if (item.type === "folder" && item.name === folderName) {
        return {
          ...item,
          children: [...(item.children || []), newItem],
          toggled: true,
        };
      } else if (item.children) {
        return {
          ...item,
          children: addItemToStructure(item.children, folderName, newItem),
        };
      }
      return item;
    });
  };

  const TreeNode = ({ node, onToggle }) => (
    <div>
      <span
        style={{
          cursor: "pointer",
          fontWeight: selectedFolder?.name === node.name ? "bold" : "normal",
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (node.type === "folder") {
            if (selectedFolder?.name === node.name) {
              setSelectedFolder(null); // Deselect if clicking on the already selected folder
            } else {
              onToggle(node);
              setSelectedFolder(node);
            }
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

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setSelectedFolder(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box
      ref={sidebarRef}
      sx={{
        width: 250,
        backgroundColor: "#3e3e3e",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <input
        type="file"
        webkitdirectory="true"
        directory="true"
        multiple
        style={{ display: "none" }}
        id="upload-folder"
        onChange={handleFileUpload}
      />
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <label htmlFor="upload-folder">
          <IconButton component="span">
            <AddCircleOutline />
          </IconButton>
        </label>

        <Box>
          <IconButton onClick={handleAddFolder}>
            <Folder />
          </IconButton>
          <IconButton onClick={handleAddFile}>
            <InsertDriveFile />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {data.map((item, index) => (
          <TreeNode key={index} node={item} onToggle={handleToggle} />
        ))}
      </Box>
    </Box>
  );
};

export default Sidebar;

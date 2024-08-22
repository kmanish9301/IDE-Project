import { Box } from "@mui/material";
import React, { useCallback, useState } from "react";
import Editor from "./Editor/Editor";
import Sidebar from "./Sidebar/Sidebar";
import Terminal from "./Terminal/Terminal";

const IdeContainer = () => {
  const [fileStructure, setFileStructure] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle file upload and update file structure
  const handleFileUpload = useCallback((updatedStructure) => {
    console.log("File Upload Received:", updatedStructure); // Debugging log
    setFileStructure(updatedStructure);
  }, []);

  // Add a file to the structure
  const addFile = useCallback(
    (parentFolderName, newFileName) => {
      const addFileRecursively = (structure, parentFolderName, newFile) => {
        if (parentFolderName === null) {
          // Add file at the root level
          return [...structure, { name: newFile, type: "file", content: "" }];
        }
        return structure.map((item) => {
          if (item.name === parentFolderName && item.type === "folder") {
            return {
              ...item,
              children: [
                ...(item.children || []),
                { name: newFile, type: "file", content: "" },
              ],
            };
          }
          if (item.type === "folder" && item.children) {
            return {
              ...item,
              children: addFileRecursively(
                item.children,
                parentFolderName,
                newFile
              ),
            };
          }
          return item;
        });
      };

      const updatedStructure = addFileRecursively(
        fileStructure,
        parentFolderName,
        newFileName
      );
      console.log("Updated File Structure with New File:", updatedStructure); // Debugging log
      setFileStructure(updatedStructure);
    },
    [fileStructure]
  );

  // Add a folder to the structure
  const addFolder = useCallback(
    (parentFolderName, newFolderName) => {
      const addFolderRecursively = (structure, parentFolderName, newFolder) => {
        if (parentFolderName === null) {
          // Add folder at the root level
          return [
            ...structure,
            { name: newFolder, type: "folder", children: [] },
          ];
        }
        return structure.map((item) => {
          if (item.name === parentFolderName && item.type === "folder") {
            return {
              ...item,
              children: [
                ...(item.children || []),
                { name: newFolder, type: "folder", children: [] },
              ],
            };
          }
          if (item.type === "folder" && item.children) {
            return {
              ...item,
              children: addFolderRecursively(
                item.children,
                parentFolderName,
                newFolder
              ),
            };
          }
          return item;
        });
      };

      const updatedStructure = addFolderRecursively(
        fileStructure,
        parentFolderName,
        newFolderName
      );
      console.log("Updated File Structure with New Folder:", updatedStructure); // Debugging log
      setFileStructure(updatedStructure);
    },
    [fileStructure]
  );

  // Handle file selection
  const handleSelectFile = useCallback((file) => {
    console.log("File Selected:", file); // Debugging log
    setSelectedFile(file);
  }, []);

  return (
    <Box display="flex" height="100vh">
      <Sidebar
        fileStructure={fileStructure}
        onFileUpload={handleFileUpload}
        onAddFile={addFile}
        onAddFolder={addFolder}
        onSelectFile={handleSelectFile}
      />
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        sx={{ width: "100vw" }}
      >
        <Box flexGrow={1} overflow="hidden">
          <Editor selectedFile={selectedFile} />
        </Box>
        <Box flexShrink={0} height="20vh">
          <Terminal />
        </Box>
      </Box>
    </Box>
  );
};

export default IdeContainer;

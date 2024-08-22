import { Editor as MonacoEditor } from "@monaco-editor/react";
import React, { useEffect, useState } from "react";

const Editor = ({ selectedFile }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target.result);
      };
      reader.readAsText(selectedFile.content); // Assuming file.content is a File object
    }
  }, [selectedFile]);

  return (
    <div style={{ flexGrow: 1, padding: 20 }}>
      <h2>Editor</h2>
      <MonacoEditor
        height="100vh"
        language="javascript" // You can set this dynamically based on file extension
        value={content}
        theme="vs-dark"
        // options={{ readOnly: true }}
        className="editorArea"
      />
    </div>
  );
};

export default Editor;

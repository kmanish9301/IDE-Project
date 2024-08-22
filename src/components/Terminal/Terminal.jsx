import { Box, TextField } from "@mui/material";
import React, { useState } from "react";

const Terminal = () => {
  const [command, setCommand] = useState("");

  const handleCommandInput = (event) => {
    if (event.key === "Enter") {
      console.log(`Executing command: ${command}`);
      setCommand("");
    }
  };

  return (
    <Box
      bgcolor="black"
      color="white"
      p={2}
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="flex-end"
    >
      <TextField
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyPress={handleCommandInput}
        variant="outlined"
        fullWidth
        InputProps={{
          style: { color: "white", backgroundColor: "black" },
        }}
      />
    </Box>
  );
};

export default Terminal;

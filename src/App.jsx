import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import IDEContainer from "./components/IDEContainer";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resets CSS to ensure consistency across browsers */}
      <IDEContainer />
    </ThemeProvider>
  );
}

export default App;

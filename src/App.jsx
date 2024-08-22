import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import IdeContainer from "./components/IdeContainer";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resets CSS to ensure consistency across browsers */}
      <IdeContainer />
    </ThemeProvider>
  );
}

export default App;

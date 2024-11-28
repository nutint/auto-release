import "./App.css";
import { AppTheme } from "./theme/AppTheme";
import { content } from "./content.ts";
import { CssBaseline } from "@mui/material";
import Hero from "./components/Hero.tsx";
import AppAppBar from "./components/AppAppBar.tsx";

function App(props: { disableCustomTheme?: boolean }) {
  const { heroSection } = content;
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme>
        <AppAppBar />
        <Hero heroSection={heroSection} />
        {JSON.stringify(content.heroSection)}
      </CssBaseline>
    </AppTheme>
  );
}

export default App;

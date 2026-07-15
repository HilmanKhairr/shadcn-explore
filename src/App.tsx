import PlaygroundShell from "./components/playground/PlaygroundShell";
import { ThemeProvider } from "./providers/ThemeProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="shadcn-explore-theme">
      <PlaygroundShell />
    </ThemeProvider>
  );
}

export default App;

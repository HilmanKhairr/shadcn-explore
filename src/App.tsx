import "./App.css";
import { Button } from "./components/ui/button";

import { ThemeProvider } from "./providers/ThemeProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Button className="bg-amber-500 text-black hover:bg-amber-600" loading fullWidth={false}>
        Halo
      </Button>
    </ThemeProvider>
  );
}

export default App;

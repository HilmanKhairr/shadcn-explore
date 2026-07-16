import { createBrowserRouter } from "react-router";
import App from "./App";
import ReactflowShowcase from "./pages/reactflow-showcase";
import ShadcnShowcase from "./pages/shadcn-showcase";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "shadcn-showcase",
        element: <ShadcnShowcase />,
      },
      {
        path: "reactflow-showcase",
        element: <ReactflowShowcase />,
      },
    ],
  },
]);

export default router;

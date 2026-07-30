import { createBrowserRouter } from "react-router";
import App from "./App";
import ReactflowShowcaseIndex from "./pages/reactflow-showcase";
import GraphTraversalShowcase from "./pages/reactflow-showcase/graph-traversal";
import PushDataflowShowcase from "./pages/reactflow-showcase/push-dataflow";
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
        children: [
          {
            index: true,
            element: <ReactflowShowcaseIndex />,
          },
          {
            path: "graph-traversal",
            element: <GraphTraversalShowcase />,
          },
          {
            path: "push-dataflow",
            element: <PushDataflowShowcase />,
          },
        ],
      },
    ],
  },
]);

export default router;

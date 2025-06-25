import { createBrowserRouter } from "react-router";

import App from "@/App";
import Settings from "@/components/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "settings",
        Component: Settings,
      },
    ],
  },
]);

export default router;

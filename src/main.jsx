import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./css/index.css";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Share } from "./Share";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/share",
    element: <Share />,
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

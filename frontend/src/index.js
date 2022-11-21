import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";
import "./index.scss";
import FeedbackMessage from "./components/FeedbackMessage";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  /* <React.StrictMode> */
  <Provider store={store}>
    <App />
    <FeedbackMessage />
  </Provider>
  /* </React.StrictMode> */
);

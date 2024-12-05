import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "./components/ui/sonner";
import { persistor, store } from "./redux/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <React.StrictMode>
        <BrowserRouter>
          <App />
          <Toaster visibleToasts={1} position="top-right" richColors />
        </BrowserRouter>
      </React.StrictMode>
    </PersistGate>
  </Provider>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "./components/ui/sonner";
import { persistor, store } from "./redux/store.ts";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "next-themes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider attribute="class" defaultTheme="system">
      <PersistGate persistor={persistor} loading={null}>
        <React.StrictMode>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <App />
              <Toaster visibleToasts={5} position="top-right" richColors />
            </QueryClientProvider>
          </BrowserRouter>
        </React.StrictMode>
      </PersistGate>
    </ThemeProvider>
  </Provider>
);

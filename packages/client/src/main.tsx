import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import client from "./app/apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { AuthProvider } from "./app/providers/AuthProvider";
import "./styles/theme.css";
import "./index.css";



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
);

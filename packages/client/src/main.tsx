import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import client from "./apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { AuthProvider } from "./app/providers/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
      <App />
    </AuthProvider>
  </ApolloProvider>
  </React.StrictMode>
);

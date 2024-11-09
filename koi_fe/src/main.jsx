import ReactDOM from "react-dom";
import React from "react";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  ApolloLink,
} from "@apollo/client";
import { createTheme, ThemeProvider } from "@mui/material";
import { setContext } from "@apollo/client/link/context";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const httpLink = createUploadLink({
  uri: import.meta.env.VITE_HTTP_LINK,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("sessionToken");

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
      "Apollo-Require-Preflight": "true",
    },
  };
});

// Connect API with backend
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

//customizing mui themes
const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
      light: "#F1F2F3",
    },
    secondary: {
      main: "#C15445",
    },
  },
});

// Render
ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

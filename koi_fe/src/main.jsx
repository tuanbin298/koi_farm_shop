import ReactDOM from "react-dom";
import React from "react";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { createTheme, ThemeProvider } from "@mui/material";

// HTTP Link to connect API
const httpLink = createHttpLink({
  uri: "http://localhost:3000/api/graphql",
});

// Attach sessionToken into header when POST
const authLink = setContext((_, { headers }) => {
  const sessionToken = localStorage.getItem("sessionToken");

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: sessionToken ? `Bearer ${sessionToken}` : "",
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

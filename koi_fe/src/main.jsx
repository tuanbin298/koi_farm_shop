import ReactDOM from "react-dom";
import React from "react";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { createTheme, ThemeProvider } from "@mui/material";

// Connect API with backend
const client = new ApolloClient({
  uri: "http://localhost:3000/api/graphql",
  cache: new InMemoryCache(),
});
//customizing mui themes
const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
      light: "#F1F2F3"
    },
    secondary:{
      main:"#C15445",
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

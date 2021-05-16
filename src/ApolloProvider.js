import React from "react";
import App from "./App";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, location, path }) => {
      return console.log(`Graphql error ${message}`);
    });
  }
});

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const link = from([errorLink, new HttpLink({ uri: "http://localhost:5000" })]);

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URL || "http://localhost:4000/graphql",
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});

export default client;

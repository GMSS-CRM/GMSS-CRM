import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { auth } from "../config/firebase";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || "http://localhost:4000/graphql",
  credentials: "include",
});

const authLink = new SetContextLink(async (prevContext) => {
  let token: string | null = null;
  try {
    token = (await auth.currentUser?.getIdToken()) ?? null;
  } catch {
    // not logged in yet — server falls back to demo token in dev
  }
  return {
    ...prevContext,
    headers: {
      ...(prevContext.headers as Record<string, string> | undefined),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;

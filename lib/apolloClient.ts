// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "/api/graphql", // trỏ về API proxy
    credentials: "include", // cookie HttpOnly sẽ tự động gửi đi
  }),
  cache: new InMemoryCache(),
});

export default client;

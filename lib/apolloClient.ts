/*eslint complexity: ["error", 8]*/

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Minimal Apollo client for cart with cookie-based session via proxy
const client = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: new HttpLink({
    uri: '/api/graphql-proxy',
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
});

export default client;
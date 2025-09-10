// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, Observable } from "@apollo/client";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
});

const sessionLink = new ApolloLink((operation, forward) => {
  const tokenInStorage = typeof window !== "undefined" ? localStorage.getItem("woo-session") : null;
  const sessionToken = tokenInStorage ? `Session ${tokenInStorage}` : undefined;

  if (sessionToken) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        "woocommerce-session": sessionToken,
      },
    }));
  }

  return new Observable(observer => {
    const sub = forward(operation)?.subscribe({
      next: result => {
        const context: any = operation.getContext();
        const rawToken = context.response?.headers?.get("woocommerce-session");
        if (rawToken) {
          // Xóa prefix "Session " trước khi lưu
          const tokenWithoutPrefix = rawToken.replace(/^Session\s+/, "");
          if (typeof window !== "undefined") localStorage.setItem("woo-session", tokenWithoutPrefix);
        }
        observer.next(result);
      },
      error: err => observer.error(err),
      complete: () => observer.complete(),
    });

    return () => sub?.unsubscribe();
  });
});

const client = new ApolloClient({
  link: sessionLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;

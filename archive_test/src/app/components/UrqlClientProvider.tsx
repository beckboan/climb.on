import React from "react";
import {
  cacheExchange,
  createClient,
  fetchExchange,
  ssrExchange,
  UrqlProvider,
} from "@urql/next";
import { cacheExchangeInstance } from "@/utils/urql/cacheExchangeInstance";

export async function UrqlClientProvider({
  children,
}: React.PropsWithChildren) {
  const ssr = ssrExchange({
    isClient: false,
  });

  const client = createClient({
    url: "http://localhost:4000/graphql",
    exchanges: [cacheExchangeInstance, ssr, fetchExchange],
    fetchOptions: {
      credentials: "include",
    },
    suspense: true,
  });
  return (
    <UrqlProvider client={client} ssr={ssr}>
      {children}
    </UrqlProvider>
  );
}

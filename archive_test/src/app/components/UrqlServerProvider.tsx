"use client";

import React, { useMemo } from "react";
import {
  cacheExchange,
  createClient,
  fetchExchange,
  ssrExchange,
  UrqlProvider,
} from "@urql/next";
import { cacheExchangeInstance } from "@/utils/urql/cacheExchangeInstance";

export function UrqlServerProvider({ children }: React.PropsWithChildren) {
  const [client, ssr] = useMemo(() => {
    const isClient = typeof window !== "undefined";
    const _ssr = ssrExchange({
      isClient,
    });
    const _client = createClient({
      url: "http://localhost:4000/graphql",
      exchanges: [cacheExchangeInstance, _ssr, fetchExchange],
      fetchOptions: {
        credentials: "include",
      },
      suspense: true,
    });
    return [_client, _ssr];
  }, []);

  return (
    <UrqlProvider client={client} ssr={ssr}>
      {" "}
      {children}
    </UrqlProvider>
  );
}

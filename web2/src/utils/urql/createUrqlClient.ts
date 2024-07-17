import { Client, fetchExchange, ssrExchange } from "urql";
import {
  LoginMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LogoutMutation,
} from "../../generated/graphql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { typedQuery } from "../typedQuery";
import { registerUrql } from "@urql/next/rsc";
import { createClient } from "urql";
import { useMemo } from "react";
import { cacheExchangeInstance } from "./cacheExchangeInstance";

export function createUrqlClient() {
  const { client, ssr } = useMemo(() => {
    const ssrExchangeInstance = ssrExchange({
      isClient: typeof window !== "undefined",
    });

    const clientInstance = createClient({
      url: "http://localhost:4000/graphql",
      exchanges: [cacheExchangeInstance, ssrExchangeInstance, fetchExchange],
      fetchOptions: {
        credentials: "include",
      },
    });

    return { client: clientInstance, ssr: ssrExchangeInstance };
  }, []);

  return { client, ssr };
}

import React from "react";
import {
  cacheExchange,
  Client,
  createClient,
  fetchExchange,
  Provider,
  ssrExchange,
  UrqlProvider,
} from "@urql/next";
import { cacheExchangeInstance } from "./cacheExchangeInstance";

export const urqlClient = createClient({
  url: "http://localhost:4000/graphql",
  exchanges: [cacheExchangeInstance, fetchExchange],
  fetchOptions: {
    credentials: "include",
  },
  suspense: true,
});

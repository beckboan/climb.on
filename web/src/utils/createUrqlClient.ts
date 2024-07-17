import { Client, fetchExchange, ssrExchange } from "urql";
import {
  LoginMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LogoutMutation,
} from "../generated/graphql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { typedQuery } from "./typedQuery";
import { createClient } from "urql";
import { useMemo } from "react";

export function createUrqlClient() {
  const { client, ssr } = useMemo(() => {
    const ssrExchangeInstance = ssrExchange({
      isClient: typeof window !== "undefined",
    });

    const clientInstance = createClient({
      url: "http://localhost:4000/graphql",
      exchanges: [
        cacheExchange({
          updates: {
            Mutation: {
              logout: (_result, args, cache, info) => {
                //Updat me query to return null
                typedQuery<LogoutMutation, MeQuery>(
                  cache,
                  { query: MeDocument },
                  _result,
                  () => ({ me: null })
                );
              },
              login: (_result, args, cache, info) => {
                typedQuery<LoginMutation, MeQuery>(
                  cache,
                  {
                    query: MeDocument,
                  },
                  _result,
                  (result, query) => {
                    if (result.login.errors) {
                      return query;
                    } else {
                      return {
                        me: result.login.user,
                      };
                    }
                  }
                );
              },
              register: (_result, args, cache, info) => {
                typedQuery<RegisterMutation, MeQuery>(
                  cache,
                  { query: MeDocument },
                  _result,
                  (result, query) => {
                    if (result.register.errors) {
                      return query;
                    } else {
                      return {
                        me: result.register.user,
                      };
                    }
                  }
                );
              },
            },
          },
        }),
        ssrExchangeInstance,
        fetchExchange,
      ],
      fetchOptions: {
        credentials: "include",
      },
    });

    return { client: clientInstance, ssr: ssrExchangeInstance };
  }, []);

  return { client, ssr };
}

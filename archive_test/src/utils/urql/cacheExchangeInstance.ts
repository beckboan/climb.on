import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
} from "@/generated/graphql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { typedQuery } from "../typedQuery";

export const cacheExchangeInstance = cacheExchange({
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
});

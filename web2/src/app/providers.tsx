"use client";

import { createUrqlClient } from "@/utils/urql/createUrqlClient";
import { ChakraProvider } from "@chakra-ui/react";
import { UrqlProvider } from "@urql/next";

export function Providers({ children }: { children: React.ReactNode }) {
  const { client, ssr } = createUrqlClient();
  return (
    <ChakraProvider>
      {" "}
      <UrqlProvider client={client} ssr={ssr}>
        {children}
      </UrqlProvider>
    </ChakraProvider>
  );
}

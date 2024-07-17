"use client";

import { createUrqlClient } from "../utils/urql/createUrqlClient";
import { ChakraProvider } from "@chakra-ui/react";
import { UrqlProvider } from "@urql/next";
import { UrqlClientProvider } from "./components/UrqlClientProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const { client, ssr } = createUrqlClient();
  return (
    <ChakraProvider>
      {" "}
      <UrqlClientProvider>{children}</UrqlClientProvider>
    </ChakraProvider>
  );
}

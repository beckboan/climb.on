"use client";

import React from "react";
import { urqlClient } from "@/utils/urql/urqlClient";
import { Provider } from "urql";
import { ChakraProvider } from "@chakra-ui/react";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <ChakraProvider>
      <Provider value={urqlClient}>{children}</Provider>
    </ChakraProvider>
  );
}

"use client";

import { createUrqlClient } from "@/utils/createUrqlClient";
import { UrqlProvider } from "@urql/next";
import React from "react";

export default function Layout({ children }: React.PropsWithChildren) {
  const { client, ssr } = createUrqlClient();
  return (
    <UrqlProvider client={client} ssr={ssr}>
      {children}
    </UrqlProvider>
  );
}

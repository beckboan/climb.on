import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import theme from "../theme";
import { Provider, UrqlProvider } from "@urql/next";
import { createUrqlClient } from "../utils/createUrqlClient";

function MyApp({ Component, pageProps }: AppProps) {
  const { client, ssr } = createUrqlClient();

  return (
    <ChakraProvider theme={theme}>
      <UrqlProvider client={client} ssr={ssr}>
        <Component {...pageProps} />
      </UrqlProvider>
    </ChakraProvider>
  );
}

export default MyApp;

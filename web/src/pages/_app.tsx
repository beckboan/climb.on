import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import theme from "../theme";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Provider } from "urql";

function MyApp({ Component, pageProps }: AppProps) {
  const { client, ssr } = createUrqlClient();

  return (
    <ChakraProvider theme={theme}>
      <Provider value={client}>
        <Component {...pageProps} />
      </Provider>
    </ChakraProvider>
  );
}

export default MyApp;

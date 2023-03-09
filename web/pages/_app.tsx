import "@fontsource/roboto/400.css";
import type { AppProps } from "next/app";
import { trpc } from "../utils/trpc";
import { AuthProvider } from "../context/auth";
import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import Navbar from "../components/Navbar";

const theme = extendTheme({
  fonts: {
    heading: `'Roboto', sans-serif`,
    body: `'Roboto', sans-serif`,
  },
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Navbar />
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
};

export default trpc.withTRPC(App);

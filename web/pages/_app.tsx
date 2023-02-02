import type { AppProps } from "next/app";
import { trpc } from "../utils/trpc";
import { AuthProvider } from "../context/auth";
import { ChakraProvider } from "@chakra-ui/react";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  );
};

export default trpc.withTRPC(App);

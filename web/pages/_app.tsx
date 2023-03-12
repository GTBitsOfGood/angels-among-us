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
  colors: {
    angelsGray: "#7D7E82",
    angelsBlue: "#57A0D5",
    lighterBlue: "#C6E3F9",
    outlineGray: "#BBBBBB",
  },
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Box h="100vh" w="100vw">
          <Navbar />
          <Component {...pageProps} />
        </Box>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default trpc.withTRPC(App);

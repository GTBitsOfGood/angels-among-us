import "@fontsource/roboto";
import type { AppProps } from "next/app";
import { trpc } from "../utils/trpc";
import { AuthProvider } from "../context/auth";
import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import NextAdapterPages from "next-query-params/pages";
import { QueryParamProvider } from "use-query-params";
import { getAnalyticsLogger, getBrowserName } from '../utils/analytics-logger';
import React, { useEffect } from 'react';

const semanticTokens = {
  colors: {
    "bg-primary": "#d7e4ee",
    "btn-solid-primary-bg": "#57a0d5",
    "btn-solid-secondary-bg": "#7d7e82",
    "btn-outline-primary-border": "#57a0d5",
    "btn-outline-secondary-border": "#7d7e82",
    "btn-solid-primary-hover-bg": "#2e7eb8",
    "btn-solid-secondary-hover-bg": "#58585c",
    "tag-primary-bg": "#c6e3f9",
    "text-primary": "#57a0d5",
    "text-secondary": "#7d7e82",
    "border-color": "#bbbbbb",
    brand: {
      500: "text-primary",
    },
  },
} as const;

const fonts = {
  heading: `'Roboto', sans-serif`,
  body: `'Roboto', sans-serif`,
} as const;

const components = {
  Button: {
    baseStyle: {
      fontWeight: "semibold",
      borderRadius: "xl",
      _focus: {
        ring: "0px",
      },
    },
    variants: {
      "solid-primary": {
        backgroundColor: "btn-solid-primary-bg",
        color: "white",
        border: "2px solid transparent",
        _hover: {
          borderColor: "btn-outline-primary-border",
          color: "text-primary",
          backgroundColor: "white",
        },
      },
      "solid-secondary": {
        backgroundColor: "btn-solid-secondary-bg",
        color: "white",
        border: "2px solid transparent",
        _hover: {
          borderColor: "btn-outline-secondary-border",
          color: "text-secondary",
          backgroundColor: "white",
        },
      },
      "outline-primary": {
        borderWidth: "2px",
        borderColor: "btn-outline-primary-border",
        color: "text-primary",
        _hover: {
          color: "white",
          backgroundColor: "btn-solid-primary-bg",
        },
      },
      "outline-primary-inverted": {
        backgroundColor: "btn-solid-primary-bg",
        borderWidth: "thin",
        borderColor: "white",
        color: "white",
        _hover: {
          backgroundColor: "white",
          color: "text-primary",
          borderColor: "btn-outline-primary-border",
        },
      },
      "outline-secondary": {
        borderWidth: "2px",
        borderColor: "btn-outline-secondary-border",
        color: "text-secondary",
        _hover: {
          color: "white",
          backgroundColor: "btn-solid-secondary-bg",
        },
      },
    },
  },
  Progress: {
    baseStyle: {
      track: {
        backgroundColor: "bg-primary",
      },
      filledTrack: {
        backgroundColor: "btn-solid-primary-bg",
      },
    },
  },
};

const theme = extendTheme({
  fonts,
  semanticTokens,
  components,
});

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {

    const logUserAgent = async () => {
      const logger = getAnalyticsLogger();

      logger.logVisitEvent({
        userId: getBrowserName(navigator.userAgent),
        pageUrl: '/'
      });
    }

    logUserAgent()

  }, [])

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <QueryParamProvider adapter={NextAdapterPages}>
          <Box h="100dvh" w="100dvw">
            <Navbar />
            <Component {...pageProps} />
          </Box>
        </QueryParamProvider>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default trpc.withTRPC(App);

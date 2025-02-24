import { useAuth } from "../../context/auth";
import { Pages } from "../../utils/consts";
import { Role } from "../../utils/types/account";
import React from "react";
import { Box, Text, Center, Flex, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import PageNotFoundError from "../404";
import Head from "next/head";
import Navbar from "../Navbar";

const unrestricted = new Set([Role.Volunteer, Role.ContentCreator, Role.Admin]);
const restricted = new Set([Role.Admin]);

const pageAccess: Record<Pages, Set<Role>> = {
  [Pages.ONBOARDING]: unrestricted,
  [Pages.ACCESS_MANAGEMENT]: restricted,
  [Pages.REQUEST_MANAGEMENT]: restricted,
  [Pages.PROFILE]: unrestricted,
  [Pages.FEED]: unrestricted,
  [Pages.RESOURCES]: unrestricted,
  [Pages.USERS]: restricted,
  [Pages.POST]: unrestricted,
};

const pageTitles: Record<Pages, string> = {
  [Pages.ONBOARDING]: "Onboarding",
  [Pages.ACCESS_MANAGEMENT]: "Access Management",
  [Pages.REQUEST_MANAGEMENT]: "Request Management",
  [Pages.PROFILE]: "Profile",
  [Pages.FEED]: "Feed",
  [Pages.RESOURCES]: "Resources",
  [Pages.USERS]: "Volunteer Search",
  [Pages.POST]: "Post",
};

const pageAccessHOC = <P extends object>(Component: React.FC<P>) => {
  const WrappedComponent = (props: P) => {
    const router = useRouter();
    const { loading, userData, authorized, user } = useAuth();
    const role = userData?.role;

    if (!user && !loading) {
      router.push(Pages.FEED);
    }

    if (loading) {
      return (
        <>
          <Head>
            <title>Loading</title>
          </Head>
          <Center w="100dvw" h="100dvh">
            <Spinner size="xl" />
          </Center>
        </>
      );
    }

    if (!authorized) {
      return (
        <>
          <Navbar />
          <Flex display="flex" bgColor="bg-primary" justifyContent="center">
            <Box
              width={{ base: "100%", lg: "80%" }}
              p={8}
              bgColor="white"
              borderRadius={{ base: 0, lg: 12 }}
              mt={{ base: "65px", lg: 100 }}
              mb={{ base: 0, lg: 50 }}
            >
              <Box w="100%" textAlign="left">
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  lineHeight="24px"
                  letterSpacing="wide"
                >
                  Sorry!
                </Text>
              </Box>
              <Flex
                direction="column"
                bgColor="white"
                borderRadius={12}
                paddingTop={2}
                width="100%"
                marginTop={{ md: "6px", lg: "20px" }}
              >
                <Box w="100%" textAlign="left" marginBottom={4}>
                  <Text fontSize="xl" fontWeight="normal" lineHeight="20px">
                    Your request to join our platform has been received, and
                    admins have been notified of the request. Once your request
                    has been approved, please visit our website again!
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </>
      );
    }

    if (pageAccess[router.pathname as Pages].has(role!)) {
      return (
        <>
          <Head>
            <title>{pageTitles[router.pathname as Pages]}</title>
          </Head>
          <Component {...props} />
        </>
      );
    } else {
      return (
        <>
          <Head>
            <title>Page Not Found</title>
          </Head>
          <PageNotFoundError />
        </>
      );
    }
  };

  Object.defineProperty(WrappedComponent, "displayName", {
    value: `withPageAccess(${Component.displayName || Component.name})`,
  });

  return WrappedComponent;
};

export default pageAccessHOC;

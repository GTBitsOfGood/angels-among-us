import { useAuth } from "../context/auth";
import { Pages } from "./consts";
import { Role } from "./types/account";
import React from "react";
import { Center, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";

export const pageAccess = {
  [Pages.ONBOARDING]: Role.Volunteer,
  [Pages.ACCESS_MANAGEMENT]: Role.Admin,
};

export const pageAccessHOC =
  <P extends object>(Component: React.ComponentType<P>) =>
  (props: any) => {
    const router = useRouter();
    const { loading, userData } = useAuth();
    const role = userData?.role;
    if (loading) {
      return (
        <Center w="100vw" h="100vh">
          <Spinner size="xl" />
        </Center>
      );
    }
    if (Pages.ACCESS_MANAGEMENT === router.pathname && role === Role.Admin) {
      return <Component {...props} />;
    } else if (
      Pages.ONBOARDING === router.pathname &&
      role === Role.Volunteer
    ) {
      return <Component {...props} />;
    } else {
      router.push("/404");
    }
  };

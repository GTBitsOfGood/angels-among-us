import { useAuth } from "../../context/auth";
import { Pages } from "../../utils/consts";
import { Role } from "../../utils/types/account";
import React from "react";
import { Center, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import PageNotFoundError from "../404";

const unrestricted = new Set([Role.Volunteer, Role.ContentCreator, Role.Admin]);
const restricted = new Set([Role.Admin]);

const pageAccess: Record<Pages, Set<Role>> = {
  [Pages.ONBOARDING]: unrestricted,
  [Pages.ACCESS_MANAGEMENT]: restricted,
  [Pages.PROFILE]: unrestricted,
  [Pages.FEED]: unrestricted,
  [Pages.RESOURCES]: unrestricted,
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
        <Center w="100vw" h="100vh">
          <Spinner size="xl" />
        </Center>
      );
    }

    if (!authorized) {
      return <PageNotFoundError />;
    }

    if (pageAccess[router.pathname as Pages].has(role!)) {
      return <Component {...props} />;
    } else {
      return <PageNotFoundError />;
    }
  };

  Object.defineProperty(WrappedComponent, "displayName", {
    value: `withPageAccess(${Component.displayName || Component.name})`,
  });

  return WrappedComponent;
};

export default pageAccessHOC;

import NextLink from "next/link";
import {
  Link,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Image,
  Stack,
  Text,
  IconButton,
  useDisclosure,
  Box,
  useBreakpointValue,
  MenuDivider,
  MenuItem,
} from "@chakra-ui/react";
import { BsPerson } from "react-icons/bs";
import { PiSignOut } from "react-icons/pi";
import {
  ChevronDownIcon,
  HamburgerIcon,
  CloseIcon,
  Icon,
} from "@chakra-ui/icons";
import { useAuth } from "../context/auth";
import { Role } from "../utils/types/account";
import { useRouter } from "next/router";
import { navbarVisiblity } from "../utils/visibility";
import { Pages } from "../utils/consts";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase/firebaseClient";

interface AvatarProps {
  user: typeof auth.currentUser | null;
}
function Avatar({ user }: AvatarProps) {
  const { userData } = useAuth();
  const router = useRouter();
  const isMd = useBreakpointValue({
    base: false,
    md: true,
  });

  return (
    <Menu autoSelect={false}>
      {({ isOpen, onClose }) => (
        <>
          <MenuButton
            as={Button}
            bgColor="white"
            p={{ base: 0, md: 4 }}
            _hover={{ bgColor: "white" }}
            _active={{ bgColor: "white" }}
            borderLeft={{ md: "1px solid black" }}
            borderRadius={0}
            onClick={isOpen ? onClose : () => {}}
            rightIcon={isMd ? <ChevronDownIcon /> : undefined}
          >
            <Image
              borderRadius="100%"
              boxSize={10}
              src={user?.photoURL ?? undefined} //TODO: Replace with default avatar
              alt="User photo"
            ></Image>
          </MenuButton>
          <MenuList mt={2} maxW={20}>
            <Box paddingX={3} pb={2}>
              <Text as="em" color="text-secondary">
                Signed in as:
              </Text>
              <Text
                display="block"
                whiteSpace="nowrap"
                w="100%"
                fontWeight="semibold"
                letterSpacing="wide"
                textOverflow="ellipsis"
                overflow="hidden"
              >
                {userData?.name ?? user?.displayName ?? ""}
              </Text>
              <Text fontSize="sm">{user?.email}</Text>
            </Box>
            <Link
              as={NextLink}
              href={Pages.PROFILE}
              style={{ textDecoration: "none" }}
            >
              <MenuItem icon={<Icon boxSize={5} as={BsPerson} />}>
                Profile
              </MenuItem>
            </Link>
            <MenuDivider />
            <MenuItem
              icon={<Icon boxSize={5} as={PiSignOut} />}
              onClick={() => {
                router.push(Pages.FEED);
                signOut(auth);
              }}
            >
              Sign out
            </MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
}

export default function Navbar() {
  const router = useRouter();
  const { user, loading, userData, authorized } = useAuth();
  const role = userData?.role;

  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure();

  const visible = navbarVisiblity[router.pathname as Pages] ?? false;

  if (!loading && visible && userData && !userData.hasCompletedOnboarding) {
    return <></>;
  }

  if (loading || !authorized || !visible) {
    return <></>;
  }

  return (
    <Flex
      id="navbar"
      bgColor="white"
      width="100%"
      zIndex={10}
      flexDir="column"
      position="absolute"
      top={0}
      borderBottom={{
        base: isMenuOpen ? "1px solid" : "none",
        lg: "none",
      }}
      borderBottomColor={{ base: "text-secondary" }}
    >
      <Flex
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        w="100%"
        minH="64px"
        p={2}
      >
        <IconButton
          size={"md"}
          icon={isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isMenuOpen ? onMenuClose : onMenuOpen}
        />

        <Link as={NextLink} href={Pages.FEED}>
          <Image
            src="https://angelsrescue.org/wp-content/uploads/2020/05/A-Mark.svg"
            alt="logo"
            boxSize={{ base: 8, md: 10 }}
            w={46}
          ></Image>
        </Link>

        <Stack
          display={{ base: "none", md: "flex" }}
          justifyContent="flex-end"
          direction="row"
          alignItems="center"
          spacing={10}
        >
          <Link
            as={NextLink}
            href={Pages.FEED}
            _hover={{
              textDecoration: "underline",
              textDecorationColor:
                router.pathname === Pages.FEED ? "text-primary" : "black",
            }}
          >
            <Text
              color={router.pathname === Pages.FEED ? "text-primary" : "black"}
            >
              Feed
            </Text>
          </Link>
          {role === Role.Admin && (
            <>
              <Link
                as={NextLink}
                href={Pages.ACCESS_MANAGEMENT}
                _hover={{
                  textDecoration: "underline",
                  textDecorationColor:
                    router.pathname === Pages.ACCESS_MANAGEMENT
                      ? "text-primary"
                      : "black",
                }}
              >
                <Text
                  color={
                    router.pathname === Pages.ACCESS_MANAGEMENT
                      ? "text-primary"
                      : "black"
                  }
                >
                  Access Management
                </Text>
              </Link>
              <Link
                as={NextLink}
                href={Pages.USERS}
                _hover={{
                  textDecoration: "underline",
                  textDecorationColor:
                    router.pathname === Pages.USERS ? "text-primary" : "black",
                }}
              >
                <Text
                  color={
                    router.pathname === Pages.USERS ? "text-primary" : "black"
                  }
                >
                  Volunteer Search
                </Text>
              </Link>
            </>
          )}
          <Link
            as={NextLink}
            href={Pages.RESOURCES}
            _hover={{
              textDecoration: "underline",
              textDecorationColor:
                router.pathname === Pages.RESOURCES ? "text-primary" : "black",
            }}
          >
            <Text
              color={
                router.pathname === Pages.RESOURCES ? "text-primary" : "black"
              }
            >
              Resources
            </Text>
          </Link>
          <Avatar user={user} />
        </Stack>

        <Box display={{ base: "block", md: "none" }}>
          <Avatar user={user} />
        </Box>
      </Flex>

      {isMenuOpen ? (
        <Box display={{ md: "none" }} p={2}>
          <Stack spacing={4}>
            <Link as={NextLink} href={Pages.FEED} onClick={onMenuClose}>
              <Text
                color={
                  router.pathname === Pages.FEED ? "text-primary" : "black"
                }
              >
                Feed
              </Text>
            </Link>
            {role === Role.Admin && (
              <>
                <Link
                  as={NextLink}
                  href={Pages.ACCESS_MANAGEMENT}
                  onClick={onMenuClose}
                >
                  <Text
                    color={
                      router.pathname === Pages.ACCESS_MANAGEMENT
                        ? "text-primary"
                        : "black"
                    }
                  >
                    Access Management
                  </Text>
                </Link>
                <Link as={NextLink} href={Pages.USERS} onClick={onMenuClose}>
                  <Text
                    color={
                      router.pathname === Pages.USERS ? "text-primary" : "black"
                    }
                  >
                    Volunteer Search
                  </Text>
                </Link>
              </>
            )}
            <Link as={NextLink} href={Pages.RESOURCES} onClick={onMenuClose}>
              <Text
                color={
                  router.pathname === Pages.RESOURCES ? "text-primary" : "black"
                }
              >
                Resources
              </Text>
            </Link>
          </Stack>
        </Box>
      ) : null}
    </Flex>
  );
}

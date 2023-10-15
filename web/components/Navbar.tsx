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
} from "@chakra-ui/react";
import { ChevronDownIcon, HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
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
  const router = useRouter();
  const isMd = useBreakpointValue({
    base: false,
    md: true,
  });

  return (
    <Menu>
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
          <MenuList marginTop={4} marginRight={2}>
            <Stack
              direction="column"
              paddingRight={5}
              paddingLeft={2}
              paddingTop={2}
              spacing={5}
            >
              <Stack direction="row">
                <Image
                  borderRadius="100%"
                  boxSize={10}
                  src={user?.photoURL ?? undefined}
                  alt="User photo"
                />

                <Stack direction="column">
                  <Text fontWeight="bold" color="gray">
                    {user?.displayName}
                  </Text>
                  <Text fontWeight="semibold" color="gray" fontSize="sm">
                    {user?.email}
                  </Text>
                </Stack>
              </Stack>
              <Stack direction="row" justifyContent="flex-end">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  fontWeight="thin"
                  borderWidth="thin"
                  onClick={() => {
                    onClose();
                    router.push(Pages.FEED);
                    signOut(auth);
                  }}
                >
                  Logout
                </Button>
                <Link
                  as={NextLink}
                  href={Pages.PROFILE}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant="solid-primary"
                    size="sm"
                    fontWeight="thin"
                    borderWidth="thin"
                    onClick={onClose}
                  >
                    View Profile
                  </Button>
                </Link>
              </Stack>
            </Stack>
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
      zIndex="1"
      flexDir="column"
      position="absolute"
      top={0}
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
          <Link as={NextLink} href={Pages.FEED}>
            <Text>Feed</Text>
          </Link>
          {role === Role.Admin && (
            <>
              <Link as={NextLink} href={Pages.ACCESS_MANAGEMENT}>
                <Text>Access Management</Text>
              </Link>
              <Link as={NextLink} href={Pages.USERS}>
                <Text>Search Users</Text>
              </Link>
            </>
          )}
          <Link as={NextLink} href={Pages.RESOURCES}>
            <Text>Resources</Text>
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
              <Text>Feed</Text>
            </Link>
            {role === Role.Admin && (
              <>
                <Link
                  as={NextLink}
                  href={Pages.ACCESS_MANAGEMENT}
                  onClick={onMenuClose}
                >
                  <Text>Access Management</Text>
                </Link>
                <Link as={NextLink} href={Pages.USERS} onClick={onMenuClose}>
                  <Text>Search Users</Text>
                </Link>
              </>
            )}
            <Link as={NextLink} href={Pages.RESOURCES} onClick={onMenuClose}>
              <Text>Resources</Text>
            </Link>
          </Stack>
        </Box>
      ) : null}
    </Flex>
  );
}

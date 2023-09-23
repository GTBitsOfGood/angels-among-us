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
  AccordionButton,
  AccordionItem,
  Accordion,
  AccordionPanel,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/auth";
import { Role } from "../utils/types/account";
import { useRouter } from "next/router";
import { navbarVisiblity } from "../utils/visibility";
import { Pages } from "../utils/consts";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase/firebaseClient";

export default function Navbar() {
  const router = useRouter();
  const { user, loading, userData, authorized } = useAuth();
  const role = userData?.role;

  const { isOpen, onOpen, onClose } = useDisclosure();

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
      minH="64px"
      position="absolute"
      top={0}
      zIndex="1"
    >
      <Flex
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        w="100%"
        marginLeft={[0, 2]}
      >
        <Link as={NextLink} href={Pages.FEED} display={["none", "flex"]}>
          <Image
            src="https://angelsrescue.org/wp-content/uploads/2020/05/A-Mark.svg"
            alt="logo"
            boxSize={[8, 10]}
            w={46}
          ></Image>
        </Link>

        <Stack
          display={["none", "flex"]}
          width="50%"
          justifyContent="flex-end"
          direction="row"
          alignItems="center"
          spacing={10}
        >
          <Link as={NextLink} href={Pages.FEED}>
            <Text>Feed</Text>
          </Link>
          {role === Role.Admin && (
            <Link as={NextLink} href={Pages.ACCESS_MANAGEMENT}>
              <Text>Access Management</Text>
            </Link>
          )}
          <Link as={NextLink} href={Pages.RESOURCES}>
            <Text>Resources</Text>
          </Link>
          <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <MenuButton
              as={Button}
              bgColor="white"
              _hover={{ bgColor: "white" }}
              _active={{ bgColor: "white" }}
              borderLeft="1px solid black"
              borderRadius="0%"
            >
              <Stack direction="row" alignItems="center">
                <Image
                  borderRadius="100%"
                  boxSize={10}
                  src={user?.photoURL ?? undefined}
                  alt="User photo"
                ></Image>

                <ChevronDownIcon />
              </Stack>
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
          </Menu>
        </Stack>

        <Accordion
          display={["flex", "none"]}
          allowToggle
          width="100%"
          zIndex={10}
        >
          <AccordionItem width="100%">
            <Stack
              direction="row"
              width="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Link as={NextLink} href={Pages.FEED}>
                <Image
                  src="https://angelsrescue.org/wp-content/uploads/2020/05/A-Mark.svg"
                  alt="logo"
                  boxSize={[8, 10]}
                  w={46}
                ></Image>
              </Link>
              <AccordionButton
                as={Button}
                height="70px"
                width="10%"
                alignItems="center"
                justifyContent="flex-end"
                bgColor="white"
                _hover={{ bgColor: "white" }}
                _active={{ bgColor: "white" }}
                cursor="default"
              >
                <HamburgerIcon fontSize="30px" color="gray" />
              </AccordionButton>
            </Stack>
            <AccordionPanel bgColor="white">
              <Stack direction="column">
                <Stack direction="column">
                  <Link as={NextLink} href={Pages.FEED}>
                    <Text>Feed</Text>
                  </Link>
                  <Divider border="1px solid angelsGray.100" />
                  <Link as={NextLink} href={Pages.RESOURCES}>
                    <Text>Resources</Text>
                  </Link>
                  <Divider border="1px solid angelsGray.100" />
                  {role === Role.Admin && (
                    <>
                      <Link>
                        <Text>Access Management</Text>
                      </Link>
                      <Divider border="1px solid angelsGray.100" />
                    </>
                  )}
                </Stack>
                <Stack
                  direction="column"
                  paddingRight={5}
                  paddingLeft={2}
                  paddingTop={2}
                  paddingBottom={2}
                  spacing={5}
                  borderRadius="12px"
                  border="1px solid angels.Gray"
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
                      fontWeight="thin"
                      borderWidth="thin"
                      size="sm"
                      onClick={() => {
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
                      >
                        View Profile
                      </Button>
                    </Link>
                  </Stack>
                </Stack>
              </Stack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
    </Flex>
  );
}

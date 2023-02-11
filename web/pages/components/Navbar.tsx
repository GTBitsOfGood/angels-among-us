import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Image,
  Stack,
  Text,
  Link,
  AccordionButton,
  AccordionItem,
  Accordion,
  AccordionPanel,
  Divider,
} from "@chakra-ui/react";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useAuth } from "../../context/auth";
import { trpc } from "../../utils/trpc";
export default function Navbar() {
  const { user } = useAuth();
  const userRole = trpc.user.getRole.useQuery({ uid: user?.uid ?? null });
  if (user !== null) {
    return (
      <Flex
        bgColor="white"
        width="100%"
        maxH="70px"
        position="absolute"
        top="0%"
        bottom="90%"
        height="auto"
      >
        <Stack
          display={["none", "flex"]}
          direction="row"
          width="50%"
          alignItems="center"
          paddingLeft={2}
        >
          <Image
            src="https://angelsrescue.org/wp-content/uploads/2020/05/A-Mark.svg"
            alt="logo"
            boxSize={[8, 10]}
          ></Image>
        </Stack>
        <Stack
          display={["none", "flex"]}
          width="50%"
          justifyContent="flex-end"
          direction="row"
          alignItems="center"
          spacing={10}
        >
          {userRole.data == "admin" && (
            <Link>
              <Text>Access Management</Text>
            </Link>
          )}
          <Link>
            <Text>Resources</Text>
          </Link>
          <Menu>
            <MenuButton
              as={Button}
              bgColor="white"
              _hover={{ bgColor: "white" }}
              _active={{ bgColor: "white" }}
              borderLeft="1px solid black"
              borderRadius="0%"
            >
              <Stack direction="row" alignItems="center">
                <Box bgColor="#57A0D5" borderRadius="100%" boxSize={10}></Box>
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
                  <Box bgColor="#57A0D5" borderRadius="100%" boxSize={10}></Box>
                  <Stack direction="column">
                    <Text fontWeight="bold" color="#7D7E82">
                      {user.displayName}
                    </Text>
                    <Text fontWeight="semibold" color="#7D7E82" fontSize="sm">
                      {user.email}
                    </Text>
                  </Stack>
                </Stack>
                <Stack direction="row" justifyContent="flex-end">
                  <Button
                    bgColor="#57A0D5"
                    borderRadius="16px"
                    color="white"
                    size="sm"
                    _hover={{ bgColor: "rgb(87, 161, 213, 0.5)" }}
                  >
                    Edit Profile
                  </Button>
                </Stack>
              </Stack>
            </MenuList>
          </Menu>
        </Stack>

        <Accordion display={["flex", "none"]} allowToggle width="100%">
          <AccordionItem width="100%">
            <Stack direction="row" width="100%">
              <Flex width="90%" alignItems="center" paddingLeft={2}>
                <Image
                  src="https://angelsrescue.org/wp-content/uploads/2020/05/A-Mark.svg"
                  alt="logo"
                  boxSize={[8, 10]}
                ></Image>
              </Flex>
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
                <HamburgerIcon fontSize="30px" color="#969696" />
              </AccordionButton>
            </Stack>
            <AccordionPanel bgColor="white">
              <Stack direction="column">
                <Stack direction="column">
                  <Link>
                    <Text cursor="default">Resources</Text>
                  </Link>
                  <Divider border="1px solid #7D7E82" />
                  {userRole.data == "admin" && (
                    <>
                      <Link>
                        <Text cursor="default">Access Management</Text>
                      </Link>
                      <Divider border="1px solid #7D7E82" />
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
                  border="1px solid #7D7E82"
                >
                  <Stack direction="row">
                    <Box
                      bgColor="#57A0D5"
                      borderRadius="100%"
                      boxSize={10}
                    ></Box>
                    <Stack direction="column">
                      <Text fontWeight="bold" color="#7D7E82">
                        {user.displayName}
                      </Text>
                      <Text fontWeight="semibold" color="#7D7E82" fontSize="sm">
                        {user.email}
                      </Text>
                    </Stack>
                  </Stack>
                  <Stack direction="row" justifyContent="flex-end">
                    <Button
                      bgColor="#57A0D5"
                      cursor="default"
                      borderRadius="16px"
                      color="white"
                      size="sm"
                      _hover={{ bgColor: "rgb(87, 161, 213, 0.5)" }}
                    >
                      Edit Profile
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
    );
  }
  return <></>;
}

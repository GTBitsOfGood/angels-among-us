import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  Button,
  Flex,
  Stack,
  Text,
  Divider,
  Image,
  Link,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { auth } from "../utils/firebase/firebaseClient";
import React from "react";
import { useAuth } from "../context/auth";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import CreatePost from "../components/CreatePost";

export default function Home() {
  const { user, loading } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function handleLoginFacebook() {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
  }

  async function handleLoginGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
  }

  if (loading) {
    return (
      <Center w="100vw" h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // if (user !== null) {
  return (
    <Flex height="100vh">
      <Flex width="100%" justifyContent="center" alignItems="center">
        <Button
          cursor={["default", "pointer"]}
          bgColor="#D9D9D9"
          onClick={() => {
            signOut(auth);
          }}
        >
          Logout
        </Button>
        <CreatePost />
      </Flex>
    </Flex>
  );
  // }

  return (
    <Flex height="100vh">
      <Stack direction="row" width="100%" height="100%">
        <Flex bgColor="#D9D9D9" width={["0%", "50%"]}></Flex>
        <Flex bgColor="#FFFFFF" width={["100%", "50%"]} justifyContent="center">
          <Stack direction="column" width="100%" alignItems="center">
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              width="100%"
              padding="2%"
              marginBottom={["50%", "15%"]}
            >
              <Image
                position="absolute"
                right={["165px", "30px"]}
                top={["120px", "20px"]}
                src="https://angelsrescue.org/wp-content/uploads/2020/05/A-Mark.svg"
                alt="logo"
              ></Image>
            </Stack>
            <Stack
              direction="column"
              alignItems={["center", "flex-start"]}
              width={["75%", "35%"]}
              spacing="10"
            >
              <Text
                color="#000000"
                fontWeight="bold"
                fontSize="4xl"
                lineHeight="10"
                textAlign={["center", "left"]}
              >
                Welcome to the page message!
              </Text>
              <Text
                color="#000000"
                fontWeight="semibold"
                fontSize={["sm", "lg"]}
                textAlign={["center", "left"]}
                paddingBottom={["120px", "0px"]}
              >
                Subtitle and further description of the site.
              </Text>
              <Button
                bgColor="#D9D9D9"
                width="100%"
                borderRadius={["6px", "16px"]}
                cursor={["default", "pointer"]}
                onClick={handleLoginFacebook}
              >
                continue with facebook
              </Button>
              <Stack direction="row" width="100%" alignItems="center">
                <Divider width="45%" border="1px solid black"></Divider>
                <Text>or</Text>
                <Divider width="45%" border="1px solid black"></Divider>
              </Stack>
              <Button
                bgColor="#D9D9D9"
                width="100%"
                borderRadius={["6px", "16px"]}
                cursor={["default", "pointer"]}
                onClick={handleLoginGoogle}
              >
                continue with Google
              </Button>
            </Stack>
            <Stack
              direction="row"
              width="48%"
              position="absolute"
              alignItems="center"
              justifyContent="flex-end"
              overflow="clip"
              bottom="30px"
              right="20px"
              display={["none", "flex"]}
            >
              <Text color="#6D6D6D" fontSize="small">
                what is this site?
              </Text>
              <Tooltip
                placement="top-start"
                closeDelay={2000}
                bgColor="#B5B5B5"
                label={
                  <Stack
                    direction="column"
                    paddingRight={2}
                    paddingLeft={2}
                    paddingTop={5}
                    paddingBottom={5}
                  >
                    <Text color="black">
                      The purpose of this site is to provide a space for
                      confirmed Angels Among Us fosters to get matched with pets
                      in need.
                    </Text>
                    <Text color="black">
                      If you have not yet applied to become a foster, fill out{" "}
                      <Link>
                        <Text as="span" color="#0085FF">
                          {" "}
                          this application{" "}
                        </Text>
                      </Link>
                      to apply.
                    </Text>
                    <Text color="black">
                      For any other questions or concerns please email{" "}
                      <Link>
                        <Text as="span" color="#0085FF">
                          person@aau.com.
                        </Text>
                      </Link>
                    </Text>
                    <Text color="black">Thanks!</Text>
                  </Stack>
                }
              >
                <QuestionOutlineIcon />
              </Tooltip>
            </Stack>
            <Stack
              direction="row"
              width="48%"
              position="absolute"
              alignItems="center"
              justifyContent="flex-end"
              overflow="clip"
              bottom="30px"
              right="20px"
              display={["flex", "none"]}
            >
              <Text color="#6D6D6D" fontSize="small">
                what is this site?
              </Text>
              <IconButton
                bgColor="white"
                aria-label="info"
                cursor="default"
                icon={<QuestionOutlineIcon />}
                onClick={onOpen}
              ></IconButton>

              <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent width="80%" bgColor="#D9D9D9">
                  <ModalBody>
                    <Stack
                      direction="column"
                      paddingRight={2}
                      paddingLeft={2}
                      paddingTop={5}
                      paddingBottom={5}
                      bgColor="#D9D9D9"
                    >
                      <Text color="black">
                        The purpose of this site is to provide a space for
                        confirmed Angels Among Us fosters to get matched with
                        pets in need.
                      </Text>
                      <Text color="black">
                        If you have not yet applied to become a foster, fill out{" "}
                        <Link>
                          <Text as="span" color="#0085FF" cursor="default">
                            {" "}
                            this application{" "}
                          </Text>
                        </Link>
                        to apply.
                      </Text>
                      <Text color="black">
                        For any other questions or concerns please email{" "}
                        <Link>
                          <Text as="span" color="#0085FF" cursor="default">
                            person@aau.com.
                          </Text>
                        </Link>
                      </Text>
                      <Text color="black">Thanks!</Text>
                    </Stack>
                  </ModalBody>
                </ModalContent>
              </Modal>
            </Stack>
          </Stack>
        </Flex>
      </Stack>
    </Flex>
  );
}

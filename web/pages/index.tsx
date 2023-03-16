import React, { useState } from "react";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  Heading,
  Button,
  Flex,
  Stack,
  Text,
  Divider,
  Image,
  Link,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
  Spinner,
  Center,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { auth } from "../utils/firebase/firebaseClient";
import { useAuth } from "../context/auth";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import PostCreationModal from "../components/PostCreationModal/PostCreationModal";
import Feed from "../components/Feed";

export default function Home() {
  const { loading, authorized } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function handleLoginFacebook() {
    const provider = new FacebookAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function handleLoginGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  const [filterDisplayed, setFilterDisplayed] = useState<boolean>(false);

  if (loading) {
    return (
      <Center w="100vw" h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (authorized) {
    /*return (
      <Flex height="100vh">
        <Flex width="100%" justifyContent="center" alignItems="center">
          <Button
            cursor={["default", "pointer"]}
            bgColor="#D9D9D9"
            onClick={() => signOut(auth)}
          >
            Logout
          </Button>
          <Button onClick={onOpen}>Open Post Creation Modal</Button>
          <PostCreationModal
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
          />
        </Flex>
      </Flex>
    );*/

    return (
      <Feed
        filterDisplayed={filterDisplayed}
        setFilterDisplayed={setFilterDisplayed}
      />
    );
  }

  return (
    <Flex height="100vh">
      <Stack direction="row" width="100%" height="100%">
        <Flex bgColor="#D9D9D9" width={["0%", "50%"]}></Flex>
        <Link
          href="https://www.netlify.com"
          position="absolute"
          left="10px"
          bottom="0px"
          display={{ base: "none", lg: "initial" }}
        >
          <Image
            boxSize={{ base: "50px", lg: "80px" }}
            src="https://www.netlify.com/v3/img/components/netlify-dark.svg"
            alt="Deploys by Netlify"
          />
        </Link>
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
              <Heading size="xl" lineHeight="10" textAlign={["center", "left"]}>
                Welcome to the page message!
              </Heading>
              <Text
                color="#000000"
                fontWeight="semibold"
                fontSize={["sm", "lg"]}
                textAlign={["center", "left"]}
                paddingBottom={["100px", "0px"]}
              >
                Subtitle and further description of the site.
              </Text>
              <Button
                bgColor="#D9D9D9"
                width="100%"
                borderRadius={["6px", "16px"]}
                cursor={["default", "pointer"]}
                onClick={() => handleLoginFacebook()}
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
              position="fixed"
              bottom="30px"
              right="20px"
              alignItems="center"
              justifyContent="flex-end"
              display={["none", "flex"]}
            >
              <Popover trigger="hover">
                <Text color="#6D6D6D" fontSize="sm">
                  what is this site?
                </Text>
                <PopoverTrigger>
                  <Button
                    backgroundColor="#FFFFFF"
                    _hover={{ background: "#FFFFFF" }}
                  >
                    <QuestionOutlineIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent backgroundColor="#D9D9D9">
                  <PopoverArrow bgColor="#D9D9D9" />
                  <PopoverCloseButton />
                  <PopoverBody>
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
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Stack>
            <Flex
              direction="row"
              display={["flex", "none"]}
              width="80%"
              justifyContent="space-between"
              paddingTop="20px"
              paddingBottom="20px"
            >
              <Link href="https://www.netlify.com" alignSelf="flex-start">
                <Image
                  boxSize={{ base: "50px", lg: "80px" }}
                  src="https://www.netlify.com/v3/img/components/netlify-dark.svg"
                  alt="Deploys by Netlify"
                />
              </Link>
              <Stack direction="row" alignItems="center">
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
              </Stack>

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
            </Flex>
          </Stack>
        </Flex>
      </Stack>
    </Flex>
  );
}

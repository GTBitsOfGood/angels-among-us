import React from "react";
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
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
  Spinner,
  Center,
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionPanel,
  AccordionIcon,
  Card,
  CardHeader,
  Checkbox,
  CardBody,
} from "@chakra-ui/react";
import { auth } from "../utils/firebase/firebaseClient";
import { useAuth } from "../context/auth";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import PostCreationModal from "../components/PostCreationModal/PostCreationModal";

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
      <Flex height="100vh" backgroundColor="#DFDFDF">
        <Stack
          spacing={8}
          direction="row"
          marginTop="100px"
          marginBottom="50px"
          marginX="40px"
        >
          <Flex
            width="500px"
            borderRadius="10px"
            backgroundColor="#FFFFFF"
            direction="column"
          >
            <Text fontWeight="semibold" margin="16px">
              Filter By:
            </Text>
            <Flex justifyContent="flex-end" margin="12px" gap="8px">
              <Button
                backgroundColor="#FFFFFF"
                fontWeight="normal"
                color="#7D7E82"
                borderWidth="1px"
                borderColor="#7D7E82"
                borderRadius="12px"
              >
                Clear All
              </Button>
              <Button
                backgroundColor="#8F9294"
                fontWeight="normal"
                color="#FFFFFF"
                borderRadius="12px"
              >
                Use My Preferences
              </Button>
            </Flex>
            <Accordion allowMultiple={true}>
              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    <Text fontWeight="semibold">General Information</Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} marginRight="40px">
                  <Text>Which types of fosters can you help with?</Text>
                  <Flex
                    direction="column"
                    borderWidth="2px"
                    borderColor="#D9D9D9"
                    borderRadius="6px"
                    gap="10px"
                    padding="16px"
                    marginTop="16px"
                  >
                    <Checkbox>Return</Checkbox>
                    <Checkbox>Boarding</Checkbox>
                    <Checkbox>Temporary</Checkbox>
                    <Checkbox>Foster Move</Checkbox>
                    <Checkbox>Shelter</Checkbox>
                    <Checkbox>Owner Surrender</Checkbox>
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Flex>
          <Flex
            width="900px"
            borderRadius="10px"
            backgroundColor="#C1C1C1"
            direction="column"
            alignItems="center"
          >
            <Text marginTop="20px" fontWeight="bold" fontSize="18px">
              Latest Posts
            </Text>
            <Card margin="20px" width="95%" padding="16px">
              <Flex gap="20px">
                <Image
                  width="150px"
                  height="150px"
                  backgroundColor="#D9D9D9"
                  borderRadius="10px"
                ></Image>
                <Flex
                  direction="column"
                  width="80%"
                  marginTop="8px"
                  marginRight="20px"
                >
                  <Text fontSize="14px">MM/DD/YYYY XX:XX PM</Text>
                  <Text
                    margin="0px"
                    paddingY="0px"
                    fontWeight="bold"
                    fontSize="18px"
                  >
                    Pet Name
                  </Text>
                  <Text
                    margin="0px"
                    backgroundColor="#C6E3F9"
                    width="fit-content"
                    paddingX="16px"
                    paddingY="4px"
                    borderRadius="20px"
                    marginTop="5px"
                    marginBottom="10px"
                    fontSize="15px"
                    fontWeight="semibold"
                  >
                    Foster Move
                  </Text>
                  <Text fontSize="14px" lineHeight="18px" color="#656565">
                    Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor
                    sit amet consectetur. Lorem ipsum dolor sit amet
                    consectetur.
                  </Text>
                </Flex>
              </Flex>
            </Card>
            <Card>
              <CardHeader>Pet Name</CardHeader>
              <Text>
                Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit
                amet consectetur. Lorem ipsum dolor sit amet consectetur.
              </Text>
            </Card>
          </Flex>
        </Stack>
      </Flex>
    );
  }

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
              <Heading size="xl" lineHeight="10" textAlign={["center", "left"]}>
                Welcome to the page message!
              </Heading>
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
              position="absolute"
              alignItems="center"
              justifyContent="flex-end"
              overflow="clip"
              bottom="30px"
              right="20px"
              display={["none", "flex"]}
            >
              <Text color="#6D6D6D" fontSize="sm">
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

import React, { useState } from "react";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
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
  useToast,
} from "@chakra-ui/react";
import { auth } from "../utils/firebase/firebaseClient";
import { useAuth } from "../context/auth";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import PostCreationModal from "../components/PostCreationModal/PostCreationModal";
import Feed from "../components/Feed/Feed";
import backgroundImage from "../public/backgroundImage.png";

function Home() {
  const { loading, setLoading, authorized } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  async function handleLoginFacebook() {
    const provider = new FacebookAuthProvider();
    provider.addScope("email");
    provider.addScope("public_profile");
    try {
      await signInWithPopup(auth, provider);
      setLoading!(true);
    } catch (error: any) {
      setLoading!(false);
      toast({
        title: error.code,
        description: error.message,
        status: "error",
        duration: 30000,
        isClosable: true,
        position: "top",
      });
    }
  }

  async function handleLoginGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setLoading!(true);
    } catch (error: any) {
      setLoading!(false);
      toast({
        title: error.code,
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    }
  }

  const [filterDisplayed, setFilterDisplayed] = useState<boolean>(false);

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

    if (loading) setLoading!(false);
    return (
      <Feed
        filterDisplayed={filterDisplayed}
        setFilterDisplayed={setFilterDisplayed}
      />
    );
  }

  if (loading) {
    return (
      <Center w="100vw" h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Flex height="100vh" bgColor="black">
      <Flex
        display={["flex", "none"]}
        position="absolute"
        height="50%"
        bottom={0}
      >
        <Image src={backgroundImage.src} objectFit="cover" />
      </Flex>
      <Flex display={["none", "flex"]}>
        <Image src={backgroundImage.src} />
      </Flex>

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
      <Flex
        bgColor={["none", "black"]}
        justifyContent={["center", "flex-start"]}
        alignItems="center"
        height="100%"
        position="absolute"
        right={0}
        width={["100%", "50%"]}
      >
        <Stack
          direction="column"
          alignItems={["center", "center"]}
          width={["80%", "60%"]}
          spacing="6"
        >
          <Image
            display={["flex", "none"]}
            src="https://angelsrescue.org/wp-content/uploads/2020/05/A-Mark.svg"
            alt="logo"
            boxSize={16}
          />
          <Heading
            size="lg"
            lineHeight="8"
            textAlign={["center", "left"]}
            color="white"
          >
            Welcome to the Angels Among Us Pet Rescue Placements Platform
          </Heading>
          <Text
            color="white"
            fontWeight="semibold"
            fontSize={["sm", "lg"]}
            textAlign={["center", "left"]}
            paddingBottom={["140px", "0px"]}
          >
            The goal is for all fosters to see the dogs that are the most likely
            to be a fit for their home without having to look through dozens of
            Facebook posts. We hope this will make it easier for you to choose
            your foster dogs.
          </Text>
          <Stack width="100%">
            <Button variant="solid-primary" onClick={handleLoginFacebook}>
              Continue with Facebook
            </Button>

            <Stack
              direction="row"
              width="100%"
              alignItems="center"
              justifyContent="center"
            >
              <Divider width="45%" border="1px solid white"></Divider>
              <Text color="white">or</Text>
              <Divider width="45%" border="1px solid white"></Divider>
            </Stack>
            <Button variant="solid-primary" onClick={handleLoginGoogle}>
              Continue with Google
            </Button>
          </Stack>
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
            <Text color="#BBBBBB" fontSize="sm">
              what is this tool?
            </Text>
            <PopoverTrigger>
              <Flex bgColor="#D9D9D9" borderRadius="100%">
                <QuestionOutlineIcon boxSize={5} />
              </Flex>
            </PopoverTrigger>
            <PopoverContent backgroundColor="#D9D9D9">
              <PopoverArrow bgColor="#D9D9D9" />
              <PopoverCloseButton />
              <PopoverBody>
                <Text color="black">
                  If it has been awhile since you fostered, please email{" "}
                  <Link>
                    <Text as="span" color="#0085FF">
                      rechecks@angelsrescue.org
                    </Text>
                  </Link>
                  {
                    " to find out what you need to do to get current. Then, when you find your match, you'll be ready!"
                  }
                </Text>

                <Text color="black">
                  For questions about fostering, email The Foster Team at{" "}
                  <Link>
                    <Text as="span" color="#0085FF">
                      foster@angelsrescue.org.
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
          width="90%"
          justifyContent="space-between"
          position="absolute"
          bottom={0}
          paddingBottom="20px"
          marginTop={10}
        >
          <Link href="https://www.netlify.com" alignSelf="flex-start">
            <Image
              boxSize={{ base: "50px", lg: "80px" }}
              src="https://www.netlify.com/v3/img/components/netlify-dark.svg"
              alt="Deploys by Netlify"
            />
          </Link>
          <Stack direction="row" alignItems="center">
            <Text color="#BBBBBB" fontSize="small">
              what is this tool?
            </Text>
            <Flex bgColor="#D9D9D9" borderRadius="100%" onClick={onOpen}>
              <QuestionOutlineIcon boxSize={5} />
            </Flex>
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
                    If it has been awhile since you fostered, please email{" "}
                    <Link>
                      <Text as="span" color="#0085FF">
                        rechecks@angelsrescue.org
                      </Text>
                    </Link>
                    {
                      " to find out what you need to do to get current. Then, when you find your match, you'll be ready!"
                    }
                  </Text>
                  <Text color="black">
                    For questions about fostering, email The Foster Team at{" "}
                    <Link>
                      <Text as="span" color="#0085FF">
                        foster@angelsrescue.org.
                      </Text>
                    </Link>
                  </Text>

                  <Text color="black">Thanks!</Text>
                </Stack>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Home;

import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import {
  Button,
  Flex,
  Stack,
  Text,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Link,
} from "@chakra-ui/react";
import { auth } from "../utils/firebase/firebaseClient";
import React from "react";
//import { trpc } from "../utils/trpc";
import { useAuth } from "../context/auth";

export default function Home() {
  const { user } = useAuth();

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

  //const listPosts = trpc.post.list.useQuery();
  //console.log(listPosts.data);

  if (user !== null) {
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
        </Flex>
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
              width="100%"
              padding="2%"
              marginBottom={["30%", "15%"]}
            >
              <Flex
                bgColor="#D9D9D9"
                position="absolute"
                paddingRight="30px"
                paddingLeft="30px"
                paddingTop="10px"
                paddingBottom="10px"
              >
                logo
              </Flex>
            </Stack>
            <Stack
              direction="column"
              alignItems={["center", "flex-start"]}
              width={["85%", "35%"]}
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
              <Text color="#000000" fontWeight="semibold" fontSize="lg">
                Subtitle and further description of the site.
              </Text>
              <Button
                bgColor="#D9D9D9"
                width="100%"
                borderRadius="16px"
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
                borderRadius="16px"
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
              paddingTop="700px"
            >
              <Text color="#6D6D6D" fontSize="small">
                what is this site?
              </Text>
              <Popover>
                <PopoverTrigger>
                  <Button
                    bgColor="#D9D9D9"
                    borderRadius="100%"
                    cursor={["default", "pointer"]}
                    size="xs"
                    color="#6D6D6D"
                  >
                    ?
                  </Button>
                </PopoverTrigger>
                <PopoverContent marginRight={10}>
                  <Flex background={"rgba(217, 217, 217, 0.5)"} padding="5%">
                    <Stack
                      direction="column"
                      fontWeight="medium"
                      lineHeight="5"
                      spacing={4}
                    >
                      <Text>
                        The purpose of this site is to provide a space for
                        confirmed Angels Among Us fosters to get matched with
                        pets in need.
                      </Text>
                      <Text>
                        If you have not yet applied to become a foster, fill out{" "}
                        <Link>
                          <Text as="span" color="#0085FF">
                            {" "}
                            this application{" "}
                          </Text>
                        </Link>
                        to apply.
                      </Text>
                      <Text>
                        For any other questions or concerns please email{" "}
                        <Link>
                          <Text as="span" color="#0085FF">
                            person@aau.com.
                          </Text>
                        </Link>
                      </Text>
                      <Text>Thanks!</Text>
                    </Stack>
                  </Flex>
                </PopoverContent>
              </Popover>
            </Stack>
          </Stack>
        </Flex>
      </Stack>
    </Flex>
  );
}

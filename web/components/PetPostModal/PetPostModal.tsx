import { ArrowBackIcon, CheckIcon } from "@chakra-ui/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  Button,
  Center,
  Flex,
  Modal,
  ModalContent,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import ImageSlider from "./ImageSlider";

const PetPostModal: React.FC<{
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}> = ({ isOpen, onOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} size={"full"} onClose={onClose}>
      <ModalContent>
        <Stack direction="column" display={["none", "flex"]}>
          <Button
            onClick={onClose}
            bgColor="white"
            _hover={{ bgColor: "white" }}
            width="10%"
            color="#7D7E82"
            marginBottom={10}
            marginTop={5}
          >
            <Stack direction="row" spacing={2}>
              <ArrowBackIcon boxSize={"20px"}></ArrowBackIcon>
              <Text>Back to Pet Feed</Text>
            </Stack>
          </Button>
          <Stack direction="row" width="100%">
            <Flex
              w="50%"
              paddingRight={10}
              paddingLeft={10}
              color="white"
              maxHeight="75vh"
            >
              <ImageSlider />
            </Flex>
            <Stack direction="column" width="50%" spacing={4}>
              <Text fontWeight="bold" fontSize="4xl" fontFamily="sans-serif">
                Pet Name
              </Text>
              <Stack direction="column">
                <Text fontWeight="bold" fontSize="xl" fontFamily="sans-serif">
                  About
                </Text>
                <Text>
                  Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit
                  amet consectetur. Lorem ipsum dolor sit amet consectetur.
                  Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit
                  amet consectetur.
                </Text>
                <Text>
                  I am a foster move dog. My previous foster parents
                  weren&apos;t able to care for me anymore.
                </Text>
              </Stack>
              <Stack direction="column" width="50%" spacing={6}>
                <Stack direction="column">
                  <Text fontWeight="bold" fontSize="xl" fontFamily="sans-serif">
                    Main Characteristics
                  </Text>
                  <Wrap>
                    <WrapItem>
                      <Center bgColor="#C6E3F9" borderRadius="25px">
                        <Stack
                          direction="row"
                          alignItems="center"
                          marginLeft={2}
                          marginRight={2}
                          marginTop={1}
                          marginBottom={1}
                        >
                          <CheckIcon />
                          <Text>Male</Text>
                        </Stack>
                      </Center>
                    </WrapItem>
                    <WrapItem>
                      <Center bgColor="#C6E3F9" borderRadius="25px">
                        <Stack
                          direction="row"
                          alignItems="center"
                          marginLeft={2}
                          marginRight={2}
                          marginTop={1}
                          marginBottom={1}
                        >
                          <CheckIcon />
                          <Text>Australian Shepherd</Text>
                        </Stack>
                      </Center>
                    </WrapItem>
                    <WrapItem>
                      <Center bgColor="#C6E3F9" borderRadius="25px">
                        <Stack
                          direction="row"
                          alignItems="center"
                          marginLeft={2}
                          marginRight={2}
                          marginTop={1}
                          marginBottom={1}
                        >
                          <CheckIcon />
                          <Text>Adult</Text>
                        </Stack>
                      </Center>
                    </WrapItem>
                    <WrapItem>
                      <Center bgColor="#C6E3F9" borderRadius="25px">
                        <Stack
                          direction="row"
                          alignItems="center"
                          marginLeft={2}
                          marginRight={2}
                          marginTop={1}
                          marginBottom={1}
                        >
                          <CheckIcon />
                          <Text>Medium-sized</Text>
                        </Stack>
                      </Center>
                    </WrapItem>
                  </Wrap>
                </Stack>
                <Stack direction="column">
                  <Text fontWeight="bold" fontSize="xl" fontFamily="sans-serif">
                    Behavioral and Medical Info
                  </Text>
                  <Wrap>
                    <WrapItem>
                      <Center bg="#C6E3F9" borderRadius="25px">
                        <Stack
                          direction="row"
                          alignItems="center"
                          marginLeft={2}
                          marginRight={2}
                          marginTop={1}
                          marginBottom={1}
                        >
                          <CheckIcon />
                          <Text>House-trained</Text>
                        </Stack>
                      </Center>
                    </WrapItem>
                    <WrapItem>
                      <Center bg="#C6E3F9" borderRadius="25px">
                        <Stack
                          direction="row"
                          alignItems="center"
                          marginLeft={2}
                          marginRight={2}
                          marginTop={1}
                          marginBottom={1}
                        >
                          <CheckIcon />
                          <Text>Spayed/Neutered</Text>
                        </Stack>
                      </Center>
                    </WrapItem>
                    <WrapItem>
                      <Center bg="#C6E3F9" borderRadius="25px">
                        <Stack
                          direction="row"
                          alignItems="center"
                          marginLeft={2}
                          marginRight={2}
                          marginTop={1}
                          marginBottom={1}
                        >
                          <CheckIcon />
                          <Text>Friendly</Text>
                        </Stack>
                      </Center>
                    </WrapItem>
                    <WrapItem>
                      <Center bg="#C6E3F9" borderRadius="25px">
                        <Stack
                          direction="row"
                          alignItems="center"
                          marginLeft={2}
                          marginRight={2}
                          marginTop={1}
                          marginBottom={1}
                        >
                          <CheckIcon />
                          <Text>Heartworms</Text>
                        </Stack>
                      </Center>
                    </WrapItem>
                    <WrapItem>
                      <Center bg="#C6E3F9" borderRadius="25px">
                        <Stack
                          direction="row"
                          alignItems="center"
                          marginLeft={2}
                          marginRight={2}
                          marginTop={1}
                          marginBottom={1}
                        >
                          <CheckIcon />
                          <Text>Flight Risk</Text>
                        </Stack>
                      </Center>
                    </WrapItem>
                  </Wrap>
                </Stack>
                <Stack direction="column">
                  <Text fontWeight="bold" fontSize="xl" fontFamily="sans-serif">
                    I&apos;m comfortable with
                  </Text>
                  <Wrap>
                    <WrapItem>
                      <Center bgColor="#C6E3F9" borderRadius="25px">
                        <Stack
                          direction="row"
                          alignItems="center"
                          marginLeft={2}
                          marginRight={2}
                          marginTop={1}
                          marginBottom={1}
                        >
                          <CheckIcon />
                          <Text>Cats</Text>
                        </Stack>
                      </Center>
                    </WrapItem>
                    <WrapItem>
                      <Center bgColor="#C6E3F9" borderRadius="25px">
                        <Stack
                          direction="row"
                          alignItems="center"
                          marginLeft={2}
                          marginRight={2}
                          marginTop={1}
                          marginBottom={1}
                        >
                          <CheckIcon />
                          <Text>Young Children</Text>
                        </Stack>
                      </Center>
                    </WrapItem>
                  </Wrap>
                </Stack>
                <Stack direction="column">
                  <Text fontWeight="bold" fontSize="xl" fontFamily="sans-serif">
                    I&apos;m not comfortable with
                  </Text>
                  <Wrap>
                    <WrapItem>
                      <Center bgColor="#C6E3F9" borderRadius="25px">
                        <Stack
                          direction="row"
                          alignItems="center"
                          marginLeft={2}
                          marginRight={2}
                          marginTop={1}
                          marginBottom={1}
                        >
                          <CheckIcon />
                          <Text>Cats</Text>
                        </Stack>
                      </Center>
                    </WrapItem>
                    <WrapItem>
                      <Center bgColor="#C6E3F9" borderRadius="25px">
                        <Stack
                          direction="row"
                          alignItems="center"
                          marginLeft={2}
                          marginRight={2}
                          marginTop={1}
                          marginBottom={1}
                        >
                          <CheckIcon />
                          <Text>Young Children</Text>
                        </Stack>
                      </Center>
                    </WrapItem>
                  </Wrap>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack width="100%" alignItems="flex-end">
            <Button
              bgColor="angelsBlue.100"
              color="white"
              fontWeight="medium"
              position="absolute"
              borderRadius="20px"
              right={10}
              paddingLeft={10}
              paddingRight={10}
            >
              Foster Me!
            </Button>
          </Stack>
        </Stack>
        <Stack direction="column" width="100%" display={["flex", "none"]}>
          <Stack
            direction="column"
            width="100%"
            bgColor="white"
            padding={4}
            position="sticky"
            top={0}
            zIndex={3}
          >
            <Button
              onClick={onClose}
              bgColor="white"
              _hover={{ bgColor: "white" }}
              width="40%"
              color="#7D7E82"
            >
              <Stack direction="row" spacing={2}>
                <ArrowBackIcon boxSize={"20px"}></ArrowBackIcon>
                <Text>Back to Pet Feed</Text>
              </Stack>
            </Button>
          </Stack>
          <Stack direction="column" width="90%" alignSelf="center" spacing={8}>
            <Stack direction="column" spacing={4}>
              <Text fontWeight="bold" fontSize="4xl" fontFamily="sans-serif">
                Pet Name
              </Text>
              <Flex color="white">
                <ImageSlider />
              </Flex>
              <Stack direction="column">
                <Text fontWeight="bold" fontSize="xl" fontFamily="sans-serif">
                  About
                </Text>
                <Text>
                  Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit
                  amet consectetur. Lorem ipsum dolor sit amet consectetur.
                </Text>
                <Text>
                  I am a foster move dog. My previous foster parents
                  weren&apos;t able to care for me anymore.
                </Text>
              </Stack>
            </Stack>

            <Stack direction="column" width="100%" spacing={6}>
              <Stack direction="column">
                <Text fontWeight="bold" fontSize="xl" fontFamily="sans-serif">
                  Main Characteristics
                </Text>
                <Wrap>
                  <WrapItem>
                    <Center bgColor="#C6E3F9" borderRadius="25px">
                      <Stack
                        direction="row"
                        alignItems="center"
                        marginLeft={2}
                        marginRight={2}
                        marginTop={1}
                        marginBottom={1}
                      >
                        <CheckIcon />
                        <Text>Male</Text>
                      </Stack>
                    </Center>
                  </WrapItem>
                  <WrapItem>
                    <Center bgColor="#C6E3F9" borderRadius="25px">
                      <Stack
                        direction="row"
                        alignItems="center"
                        marginLeft={2}
                        marginRight={2}
                        marginTop={1}
                        marginBottom={1}
                      >
                        <CheckIcon />
                        <Text>Australian Shepherd</Text>
                      </Stack>
                    </Center>
                  </WrapItem>
                  <WrapItem>
                    <Center bgColor="#C6E3F9" borderRadius="25px">
                      <Stack
                        direction="row"
                        alignItems="center"
                        marginLeft={2}
                        marginRight={2}
                        marginTop={1}
                        marginBottom={1}
                      >
                        <CheckIcon />
                        <Text>Adult</Text>
                      </Stack>
                    </Center>
                  </WrapItem>
                  <WrapItem>
                    <Center bgColor="#C6E3F9" borderRadius="25px">
                      <Stack
                        direction="row"
                        alignItems="center"
                        marginLeft={2}
                        marginRight={2}
                        marginTop={1}
                        marginBottom={1}
                      >
                        <CheckIcon />
                        <Text>Medium-sized</Text>
                      </Stack>
                    </Center>
                  </WrapItem>
                </Wrap>
              </Stack>
              <Stack direction="column">
                <Text fontWeight="bold" fontSize="xl" fontFamily="sans-serif">
                  Behavioral and Medical Info
                </Text>
                <Wrap>
                  <WrapItem>
                    <Center bg="#C6E3F9" borderRadius="25px">
                      <Stack
                        direction="row"
                        alignItems="center"
                        marginLeft={2}
                        marginRight={2}
                        marginTop={1}
                        marginBottom={1}
                      >
                        <CheckIcon />
                        <Text>House-trained</Text>
                      </Stack>
                    </Center>
                  </WrapItem>
                  <WrapItem>
                    <Center bg="#C6E3F9" borderRadius="25px">
                      <Stack
                        direction="row"
                        alignItems="center"
                        marginLeft={2}
                        marginRight={2}
                        marginTop={1}
                        marginBottom={1}
                      >
                        <CheckIcon />
                        <Text>Spayed/Neutered</Text>
                      </Stack>
                    </Center>
                  </WrapItem>
                  <WrapItem>
                    <Center bg="#C6E3F9" borderRadius="25px">
                      <Stack
                        direction="row"
                        alignItems="center"
                        marginLeft={2}
                        marginRight={2}
                        marginTop={1}
                        marginBottom={1}
                      >
                        <CheckIcon />
                        <Text>Friendly</Text>
                      </Stack>
                    </Center>
                  </WrapItem>
                  <WrapItem>
                    <Center bg="#C6E3F9" borderRadius="25px">
                      <Stack
                        direction="row"
                        alignItems="center"
                        marginLeft={2}
                        marginRight={2}
                        marginTop={1}
                        marginBottom={1}
                      >
                        <CheckIcon />
                        <Text>Heartworms</Text>
                      </Stack>
                    </Center>
                  </WrapItem>
                  <WrapItem>
                    <Center bg="#C6E3F9" borderRadius="25px">
                      <Stack
                        direction="row"
                        alignItems="center"
                        marginLeft={2}
                        marginRight={2}
                        marginTop={1}
                        marginBottom={1}
                      >
                        <CheckIcon />
                        <Text>Flight Risk</Text>
                      </Stack>
                    </Center>
                  </WrapItem>
                </Wrap>
              </Stack>
              <Stack direction="column">
                <Text fontWeight="bold" fontSize="xl" fontFamily="sans-serif">
                  I&apos;m comfortable with
                </Text>
                <Wrap>
                  <WrapItem>
                    <Center bgColor="#C6E3F9" borderRadius="25px">
                      <Stack
                        direction="row"
                        alignItems="center"
                        marginLeft={2}
                        marginRight={2}
                        marginTop={1}
                        marginBottom={1}
                      >
                        <CheckIcon />
                        <Text>Cats</Text>
                      </Stack>
                    </Center>
                  </WrapItem>
                  <WrapItem>
                    <Center bgColor="#C6E3F9" borderRadius="25px">
                      <Stack
                        direction="row"
                        alignItems="center"
                        marginLeft={2}
                        marginRight={2}
                        marginTop={1}
                        marginBottom={1}
                      >
                        <CheckIcon />
                        <Text>Young Children</Text>
                      </Stack>
                    </Center>
                  </WrapItem>
                </Wrap>
              </Stack>
              <Stack direction="column">
                <Text fontWeight="bold" fontSize="xl" fontFamily="sans-serif">
                  I&apos;m not comfortable with
                </Text>
                <Wrap>
                  <WrapItem>
                    <Center bgColor="#C6E3F9" borderRadius="25px">
                      <Stack
                        direction="row"
                        alignItems="center"
                        marginLeft={2}
                        marginRight={2}
                        marginTop={1}
                        marginBottom={1}
                      >
                        <CheckIcon />
                        <Text>Cats</Text>
                      </Stack>
                    </Center>
                  </WrapItem>
                  <WrapItem>
                    <Center bgColor="#C6E3F9" borderRadius="25px">
                      <Stack
                        direction="row"
                        alignItems="center"
                        marginLeft={2}
                        marginRight={2}
                        marginTop={1}
                        marginBottom={1}
                      >
                        <CheckIcon />
                        <Text>Young Children</Text>
                      </Stack>
                    </Center>
                  </WrapItem>
                </Wrap>
              </Stack>
            </Stack>
          </Stack>
          <Stack
            width="100%"
            justifyContent="center"
            direction="row"
            position="sticky"
            bottom={0}
            padding={4}
            bgColor="white"
          >
            <Button
              bgColor="angelsBlue.100"
              color="white"
              fontWeight="medium"
              borderRadius="20px"
              paddingLeft={40}
              paddingRight={40}
            >
              Foster Me!
            </Button>
          </Stack>
        </Stack>
      </ModalContent>
    </Modal>
  );
};

export default PetPostModal;

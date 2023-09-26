import { ArrowBackIcon, CheckIcon } from "@chakra-ui/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  Button,
  Flex,
  Modal,
  ModalContent,
  Stack,
  Text,
} from "@chakra-ui/react";
import ImageSlider from "./ImageSlider";
import PetPostTagGroup from "./PetPostTagGroup";
import { IFeedPost } from "../../utils/types/post";

const PetPostModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  postData: IFeedPost;
}> = ({ isOpen, onClose, postData }) => {
  return (
    <Modal isOpen={isOpen} size={"full"} onClose={onClose}>
      <ModalContent>
        <Stack
          direction="column"
          display={["none", "flex"]}
          spacing={8}
          paddingTop={6}
        >
          <Button
            h={8}
            w="fit-content"
            bgColor="tag-primary-bg"
            color="text-primary"
            marginLeft={10}
            _hover={{ bgColor: "tag-primary-bg" }}
            leftIcon={<ArrowBackIcon />}
            onClick={onClose}
          >
            Back to feed
          </Button>
          <Flex direction="row" width="100%">
            <Flex
              w="50%"
              paddingRight={10}
              paddingLeft={10}
              color="white"
              maxHeight="75vh"
            >
              <ImageSlider />
            </Flex>
            <Stack direction="column" width="50%" spacing={8}>
              <Text fontWeight="bold" fontSize="4xl" fontFamily="sans-serif">
                {postData.name}
              </Text>
              <Stack direction="column">
                <Text fontWeight="bold" fontSize="xl" fontFamily="sans-serif">
                  About
                </Text>
                <Text>{postData.description}</Text>
                {/* <Text>{fosterTypeLabels[postData.type]}</Text> */}
              </Stack>
              <Stack direction="column" spacing={8}>
                <Flex direction="row" width="100%">
                  <Flex width="50%">
                    <PetPostTagGroup
                      title={"Main Characteristics"}
                      tags={[
                        "Male",
                        "Australian Shepherd",
                        "Medium-sized",
                        "Adult",
                      ]}
                      icons={[CheckIcon, CheckIcon, CheckIcon, CheckIcon]}
                    />
                  </Flex>
                  <Flex width="50%">
                    <PetPostTagGroup
                      title={"Behavioral and Medical Info"}
                      tags={[
                        "House-trained",
                        "Friendly",
                        "Heartworms",
                        "Flight Risk",
                        "Spayed/Neutered",
                      ]}
                      icons={[
                        CheckIcon,
                        CheckIcon,
                        CheckIcon,
                        CheckIcon,
                        CheckIcon,
                      ]}
                    />
                  </Flex>
                </Flex>
                <Flex direction="row" width="100%">
                  <Flex width="50%">
                    <PetPostTagGroup
                      title={"I'm not comfortable with"}
                      tags={["Cats", "Young Children"]}
                      icons={[CheckIcon, CheckIcon]}
                    />
                  </Flex>
                  <Flex width="50%">
                    <PetPostTagGroup
                      title={"I'm comfortable with"}
                      tags={["Cats", "Young Children"]}
                      icons={[CheckIcon, CheckIcon]}
                    />
                  </Flex>
                </Flex>
                <Flex direction="row" width="100%">
                  <PetPostTagGroup
                    title={"I'm not sure about"}
                    tags={["Cats", "Young Children"]}
                    icons={[CheckIcon, CheckIcon]}
                  />
                </Flex>
              </Stack>
            </Stack>
          </Flex>
          <Flex
            width="100%"
            justifyContent="flex-end"
            paddingRight={5}
            paddingBottom={5}
          >
            <Button variant="solid-primary" size="lg">
              Foster Me!
            </Button>
          </Flex>
        </Stack>
        <Flex direction="column" width="100%" display={["flex", "none"]}>
          <Flex
            width="100%"
            paddingLeft={4}
            top={0}
            position="sticky"
            paddingTop={6}
            bgColor="white"
            zIndex={3}
          >
            <Stack
              direction="row"
              onClick={onClose}
              spacing={2}
              color="#7D7E82"
              alignItems="center"
              fontWeight="semibold"
            >
              <ArrowBackIcon boxSize={"20px"}></ArrowBackIcon>
              <Text>Back to Pet Feed</Text>
            </Stack>
          </Flex>
          <Stack
            direction="column"
            width="90%"
            alignSelf="center"
            spacing={8}
            paddingTop={4}
          >
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
                  {
                    "I am a foster move dog. My previous foster parents weren't able to care for me anymore."
                  }
                </Text>
              </Stack>
            </Stack>

            <Stack direction="column" width="100%" spacing={6}>
              <Flex width="100%">
                <PetPostTagGroup
                  title={"Main Characteristics"}
                  tags={[
                    "Male",
                    "Australian Shepherd",
                    "Medium-sized",
                    "Adult",
                  ]}
                  icons={[CheckIcon, CheckIcon, CheckIcon, CheckIcon]}
                />
              </Flex>
              <Flex width="100%">
                <PetPostTagGroup
                  title={"Behavioral and Medical Info"}
                  tags={[
                    "House-trained",
                    "Friendly",
                    "Heartworms",
                    "Flight Risk",
                    "Spayed/Neutered",
                  ]}
                  icons={[
                    CheckIcon,
                    CheckIcon,
                    CheckIcon,
                    CheckIcon,
                    CheckIcon,
                  ]}
                />
              </Flex>
              <Flex width="100%">
                <PetPostTagGroup
                  title={"I'm not comfortable with"}
                  tags={["Cats", "Young Children"]}
                  icons={[CheckIcon, CheckIcon]}
                />
              </Flex>
              <Flex width="100%">
                <PetPostTagGroup
                  title={"I'm comfortable with"}
                  tags={["Cats", "Young Children"]}
                  icons={[CheckIcon, CheckIcon]}
                />
              </Flex>
              <Flex width="100%">
                <PetPostTagGroup
                  title={"I'm not sure about"}
                  tags={["Cats", "Young Children"]}
                  icons={[CheckIcon, CheckIcon]}
                />
              </Flex>
            </Stack>
          </Stack>
          <Flex
            width="100%"
            justifyContent="center"
            direction="row"
            position="sticky"
            bottom={0}
            padding={4}
            bgColor="white"
          >
            <Button variant="solid-primary" size="lg">
              Foster Me!
            </Button>
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default PetPostModal;

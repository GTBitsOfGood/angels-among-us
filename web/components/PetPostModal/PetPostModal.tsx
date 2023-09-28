import { ArrowBackIcon } from "@chakra-ui/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  Button,
  Flex,
  Modal,
  ModalContent,
  ModalFooter,
  Stack,
  Text,
} from "@chakra-ui/react";
import ImageSlider from "./ImageSlider";
import PetPostListGroup from "./PetPostListGroup";
import {
  fosterTypeLabels,
  behavioralLabels,
  spayNeuterStatusLabels,
  IPost,
  medicalLabels,
  crateTrainedLabels,
  houseTrainedLabels,
  GoodWith,
  Trained,
  goodWithLabels,
  genderLabels,
  breedLabels,
  sizeLabels,
  ageLabels,
  fosterTypeDescriptions,
} from "../../utils/types/post";

const PetPostModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  postData: IPost;
}> = ({ isOpen, onClose, postData }) => {
  const {
    name,
    description,
    type,
    size,
    age,
    spayNeuterStatus,
    houseTrained,
    crateTrained,
    behavioral,
    medical,
    gender,
    breed,
    getsAlongWithOlderKids,
    getsAlongWithYoungKids,
    getsAlongWithLargeDogs,
    getsAlongWithSmallDogs,
    getsAlongWithWomen,
    getsAlongWithMen,
    getsAlongWithCats,
    attachments,
  } = postData;

  const behavioralMedicalAndTrainedTagLabels = [
    ...behavioral?.map((tag) => behavioralLabels[tag]),
    ...medical?.map((tag) => medicalLabels[tag]),
    spayNeuterStatusLabels[spayNeuterStatus],
    houseTrainedLabels[houseTrained],
    crateTrainedLabels[crateTrained],
  ];

  const goodWithLabelMap = {
    getsAlongWithMen: GoodWith.Men,
    getsAlongWithWomen: GoodWith.Women,
    getsAlongWithOlderKids: GoodWith.OlderChildren,
    getsAlongWithYoungKids: GoodWith.YoungChildren,
    getsAlongWithLargeDogs: GoodWith.LargeDogs,
    getsAlongWithSmallDogs: GoodWith.SmallDogs,
    getsAlongWithCats: GoodWith.Cats,
  };

  const goodWithValueMap = {
    getsAlongWithMen,
    getsAlongWithWomen,
    getsAlongWithOlderKids,
    getsAlongWithYoungKids,
    getsAlongWithLargeDogs,
    getsAlongWithSmallDogs,
    getsAlongWithCats,
  };

  const getsAlongWithFields = [
    "getsAlongWithMen",
    "getsAlongWithWomen",
    "getsAlongWithOlderKids",
    "getsAlongWithYoungKids",
    "getsAlongWithLargeDogs",
    "getsAlongWithSmallDogs",
    "getsAlongWithCats",
  ];

  const goodWithTagLabels: string[] = getsAlongWithFields
    .filter(
      (field: string) =>
        goodWithValueMap[field as keyof typeof goodWithLabelMap] === Trained.Yes
    )
    .map(
      (field) =>
        goodWithLabels[goodWithLabelMap[field as keyof typeof goodWithValueMap]]
    );

  const notGoodWithTagLabels = getsAlongWithFields
    .filter(
      (field) =>
        goodWithValueMap[field as keyof typeof goodWithLabelMap] === Trained.No
    )
    .map(
      (field) =>
        goodWithLabels[goodWithLabelMap[field as keyof typeof goodWithValueMap]]
    );

  const unsureAboutTagLabels = getsAlongWithFields
    .filter(
      (field) =>
        goodWithValueMap[field as keyof typeof goodWithLabelMap] ===
        Trained.Unknown
    )
    .map(
      (field) =>
        goodWithLabels[goodWithLabelMap[field as keyof typeof goodWithValueMap]]
    );

  return (
    <Modal
      isOpen={isOpen}
      size={"full"}
      onClose={onClose}
      scrollBehavior={"inside"}
    >
      <ModalContent>
        <Stack
          direction="column"
          display={["none", "flex"]}
          spacing={8}
          paddingTop={6}
          height={"inherit"}
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
              <ImageSlider attachments={attachments}></ImageSlider>
            </Flex>
            <Stack
              direction="column"
              width="50%"
              spacing={8}
              paddingLeft={10}
              paddingRight={10}
              height={"75vh"}
              overflowY={"scroll"}
            >
              <Text fontWeight="bold" fontSize="4xl" fontFamily="sans-serif">
                {name}
              </Text>
              <Stack direction="column">
                <Text fontWeight="bold" fontSize="xl" fontFamily="sans-serif">
                  About
                </Text>
                <Text>{description}</Text>
                <Text></Text>
                <Text>
                  I am a <b>{fosterTypeLabels[type].toLowerCase()}</b> dog.{" "}
                  {fosterTypeDescriptions[type]}
                </Text>
              </Stack>
              <Stack direction="column" spacing={8}>
                <Flex direction="row" width="100%">
                  <Flex direction={"column"} width="50%">
                    <PetPostListGroup
                      title={"Main Characteristics"}
                      tags={[]}
                    />
                    <Text>
                      <b>Gender: </b>
                      {genderLabels[gender]}
                    </Text>
                    <Text>
                      <b>Breed: </b>
                      {breed.map((breed) => breedLabels[breed]).join(", ")}
                    </Text>
                    <Text>
                      <b>Size: </b>

                      {sizeLabels[size]}
                    </Text>

                    <Text>
                      <b>Age: </b>
                      {ageLabels[age]}
                    </Text>
                  </Flex>
                  <Flex width="50%">
                    <PetPostListGroup
                      title={"Behavioral and Medical Info"}
                      tags={behavioralMedicalAndTrainedTagLabels}
                    />
                  </Flex>
                </Flex>
                <Flex direction="row" width="100%">
                  <Flex width="50%">
                    <PetPostListGroup
                      title={"I'm not comfortable with"}
                      tags={notGoodWithTagLabels}
                    />
                  </Flex>
                  <Flex width="50%">
                    <PetPostListGroup
                      title={"I'm comfortable with"}
                      tags={goodWithTagLabels}
                    />
                  </Flex>
                </Flex>
                <Flex direction="row" width="100%">
                  <PetPostListGroup
                    title={"I'm not sure about"}
                    tags={unsureAboutTagLabels}
                  />
                </Flex>
              </Stack>
            </Stack>
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
            height={"70vh"}
            overflowY={"scroll"}
          >
            <Stack direction="column" spacing={4}>
              <Text fontWeight="bold" fontSize="4xl" fontFamily="sans-serif">
                {name}
              </Text>
              <Flex color="white">
                <ImageSlider attachments={attachments}></ImageSlider>
              </Flex>
              <Stack direction="column">
                <Text fontWeight="bold" fontSize="xl" fontFamily="sans-serif">
                  About
                </Text>
                <Text>{description}</Text>
                <Text>
                  I am a <b>{fosterTypeLabels[type].toLowerCase()}</b> dog.{" "}
                  {fosterTypeDescriptions[type]}
                </Text>
              </Stack>
            </Stack>

            <Stack direction="column" width="100%" spacing={6}>
              <Flex width="100%" direction={"column"}>
                <PetPostListGroup title={"Main Characteristics"} tags={[]} />
                <Text>
                  <b>Gender: </b>
                  {genderLabels[gender]}
                </Text>
                <Text>
                  <b>Breed: </b>
                  {breed.map((breed) => breedLabels[breed]).join(", ")}
                </Text>
                <Text>
                  <b>Size: </b>
                  {sizeLabels[size]}
                </Text>
                <Text>
                  <b>Age: </b>
                  {ageLabels[age]}
                </Text>
              </Flex>
              <Flex width="100%">
                <PetPostListGroup
                  title={"Behavioral and Medical Info"}
                  tags={behavioralMedicalAndTrainedTagLabels}
                />
              </Flex>
              <Flex width="100%">
                <PetPostListGroup
                  title={"I'm not comfortable with"}
                  tags={notGoodWithTagLabels}
                />
              </Flex>
              <Flex width="100%">
                <PetPostListGroup
                  title={"I'm comfortable with"}
                  tags={goodWithTagLabels}
                />
              </Flex>
              <Flex width="100%">
                <PetPostListGroup
                  title={"I'm not sure about"}
                  tags={unsureAboutTagLabels}
                />
              </Flex>
            </Stack>
          </Stack>
        </Flex>
        <ModalFooter>
          <Flex
            width="100%"
            justifyContent={["center", "flex-end"]}
            paddingRight={{ lg: 5 }}
            paddingBottom={{ lg: 5 }}
            position={["sticky", "fixed"]}
            zIndex={1}
            bottom={0}
            padding={{ sm: 4 }}
            right={{ lg: 0 }}
            left={{ lg: 0 }}
            bgColor={"white"}
          >
            <Button
              variant="solid-primary"
              width={["100%", 60]}
              borderRadius={"20px"}
            >
              Foster Me!
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PetPostModal;

import { ArrowBackIcon } from "@chakra-ui/icons";
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

  const behavioralTagLabels: string[] = behavioral?.map(
    (tag) => behavioralLabels[tag]
  );

  const medicalTagLabels: string[] = medical.map((tag) => medicalLabels[tag]);

  const trainedTagLabels: string[] = [
    spayNeuterStatusLabels[spayNeuterStatus],
    houseTrainedLabels[houseTrained],
    crateTrainedLabels[crateTrained],
  ];

  const behavioralAndMedicalTagLabels =
    medicalTagLabels.concat(behavioralTagLabels);

  const behavioralMedicalAndTrainedTagLabels =
    behavioralAndMedicalTagLabels.concat(trainedTagLabels);

  const goodWithLabelsAndValues = [
    [goodWithLabels[GoodWith.Men], getsAlongWithMen],
    [goodWithLabels[GoodWith.Women], getsAlongWithWomen],
    [goodWithLabels[GoodWith.OlderChildren], getsAlongWithOlderKids],
    [goodWithLabels[GoodWith.YoungChildren], getsAlongWithYoungKids],
    [goodWithLabels[GoodWith.LargeDogs], getsAlongWithLargeDogs],
    [goodWithLabels[GoodWith.SmallDogs], getsAlongWithSmallDogs],
    [goodWithLabels[GoodWith.Cats], getsAlongWithCats],
  ];

  const goodWithTagLabels: string[] | undefined = goodWithLabelsAndValues
    .filter((goodWith) => goodWith[1] === Trained.Yes)
    .map((goodWith) => goodWith[0]);

  const notGoodWithTagLabels: string[] | undefined = goodWithLabelsAndValues
    .filter((goodWith) => goodWith[1] === Trained.No)
    .map((goodWith) => goodWith[0]);

  const unsureAboutTagLabels: string[] | undefined = goodWithLabelsAndValues
    .filter((goodWith) => goodWith[1] === Trained.Unknown)
    .map((goodWith) => goodWith[0]);

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
              <ImageSlider attachments={attachments}></ImageSlider>
            </Flex>
            <Stack direction="column" width="50%" spacing={8}>
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
                  I am a {fosterTypeLabels[type]} dog.{" "}
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
                    <Text>Gender: {genderLabels[gender]}</Text>
                    <Text>
                      Breed:{" "}
                      {breed.map((breed) => breedLabels[breed]).join(" ")}
                    </Text>
                    <Text>Size: {sizeLabels[size]}</Text>
                    <Text>Age: {ageLabels[age]}</Text>
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
                {name}
              </Text>
              <Flex color="white">
                <ImageSlider attachments={attachments} />
              </Flex>
              <Stack direction="column">
                <Text fontWeight="bold" fontSize="xl" fontFamily="sans-serif">
                  About
                </Text>
                <Text>{description}</Text>
                <Text>
                  I am a {fosterTypeLabels[type]} dog.{" "}
                  {fosterTypeDescriptions[type]}
                </Text>
              </Stack>
            </Stack>

            <Stack direction="column" width="100%" spacing={6}>
              <Flex width="100%">
                <PetPostListGroup title={"Main Characteristics"} tags={[]} />
                <Text>Gender: {genderLabels[gender]}</Text>
                <Text>
                  Breed: {breed.map((breed) => breedLabels[breed]).join(" ")}
                </Text>
                <Text>Size: {sizeLabels[size]}</Text>
                <Text>Age: {ageLabels[age]}</Text>
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

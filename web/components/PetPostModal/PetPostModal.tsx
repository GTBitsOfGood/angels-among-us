import { ArrowBackIcon } from "@chakra-ui/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import ImageSlider from "./ImageSlider";
import PetPostListGroup from "./PetPostListGroup";
import { FosterType } from "../../utils/types/post";
import {
  fosterTypeLabels,
  behavioralLabels,
  spayNeuterStatusLabels,
  IPostWithId,
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
import { trpc } from "../../utils/trpc";
import { ObjectId } from "mongoose";
import { useState } from "react";

type FosterTypeData = {
  [key in FosterType]: Array<{
    key: string;
    title: string;
  }>;
};

enum QuestionKeys {
  numOtherDogs = "numOtherDogs",
  maxDogs = "maxDogs",
}

type QuestionResponseData = {
  [key in QuestionKeys]?: string;
};

const data: FosterTypeData = {
  [FosterType.Return]: [
    {
      key: "maxDogs",
      title: "What is the maximum number of dogs you are willing to foster?",
    },
    {
      key: "numOtherDogs",
      title: "How many other fosters and personal dogs do you have?",
    },
  ],
  [FosterType.Boarding]: [
    {
      key: "numOtherDogs",
      title: "How many other fosters and personal dogs do you have?",
    },
  ],
  [FosterType.Temporary]: [
    {
      key: "numOtherDogs",
      title: "How many other fosters and personal dogs do you have?",
    },
  ],
  [FosterType.Shelter]: [
    {
      key: "numOtherDogs",
      title: "How many other fosters and personal dogs do you have?",
    },
  ],
  [FosterType.FosterMove]: [
    {
      key: "numOtherDogs",
      title: "How many other fosters and personal dogs do you have?",
    },
  ],
  [FosterType.OwnerSurrender]: [
    {
      key: "numOtherDogs",
      title: "How many other fosters and personal dogs do you have?",
    },
  ],
};

const FosterQuestionnaire = ({
  fosterType,
  postId,
  isFormViewOpen,
  onFormViewClose,
}: {
  fosterType: FosterType;
  postId: ObjectId;
  isFormViewOpen: boolean;
  onFormViewClose: () => void;
}) => {
  const initialQuestionResponseData: QuestionResponseData = data[
    fosterType
  ].reduce(
    (responses, question) =>
      ({
        ...responses,
        [question.key]: "",
      } as QuestionResponseData),
    {}
  );

  const [fosterQuestionResponses, setfosterQuestionResponses] = useState(
    initialQuestionResponseData
  );
  const mutation = trpc.post.offer.useMutation();
  const toast = useToast();

  function handleSubmission() {
    let formIsValid = true;
    for (const [key] of Object.entries(fosterQuestionResponses)) {
      if (fosterQuestionResponses[key as keyof typeof QuestionKeys] === "") {
        formIsValid = false;
        break;
      }
    }
    if (!formIsValid) {
      toast({
        title: "Please complete all required fields.",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    } else {
      const offer = {
        email: "laur3nm90@gmail.com",
        postOid: postId,
      };
      mutation.mutate(offer, {
        onSuccess: () => {
          onFormViewClose();
          toast({
            title:
              "Thank you for submitting a foster application with Angels Among Us! You will hear back from us soon!",
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "top",
          });
        },
        onError: () => {
          toast({
            title: "Request unsuccessful. Please try again later.",
            status: "error",
            duration: 9000,
            isClosable: true,
            position: "top",
          });
        },
      });
    }
  }

  return (
    <Modal
      isOpen={isFormViewOpen}
      onClose={onFormViewClose}
      isCentered
      scrollBehavior="inside"
      size={["full", "xl"]}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader display={["none", "block"]} px={10} mt={4}>
          Foster Questionnaire
        </ModalHeader>
        <ModalCloseButton display={["none", "block"]} mt={6} mr={6} />
        <Flex display={["none", "flex"]} flexDir="column" overflowY="scroll">
          <Flex paddingX={10} flexDir="column" gap={4}>
            {data[fosterType].map(({ key, title }) => {
              return (
                <Flex key={key} flexDir="column" gap={2}>
                  <FormControl
                    isRequired
                    isInvalid={
                      fosterQuestionResponses[
                        key as keyof typeof QuestionKeys
                      ] === ""
                    }
                  >
                    <FormLabel>{title}</FormLabel>
                    <Input
                      bgColor={"#FAFBFC"}
                      value={
                        fosterQuestionResponses[
                          key as keyof typeof QuestionKeys
                        ]
                      }
                      onChange={(event) => {
                        setfosterQuestionResponses({
                          ...fosterQuestionResponses,
                          [key as keyof typeof QuestionKeys]:
                            event.target.value,
                        });
                      }}
                    />
                    <FormErrorMessage>Field required.</FormErrorMessage>
                  </FormControl>
                </Flex>
              );
            })}
          </Flex>
        </Flex>
        <ModalFooter display={["none", "flex"]} mb={2}>
          <Button variant="outline-secondary" mr={3} onClick={onFormViewClose}>
            Cancel
          </Button>
          <Button variant="solid-primary" onClick={handleSubmission}>
            Submit
          </Button>
        </ModalFooter>
        <Flex
          direction="column"
          width="100%"
          height="100vh"
          display={["flex", "none"]}
        >
          <Stack
            marginTop={4}
            marginLeft={4}
            direction="row"
            onClick={onFormViewClose}
            spacing={2}
            color="text-secondary"
            alignItems="center"
            fontWeight="semibold"
          >
            <ArrowBackIcon boxSize={"20px"}></ArrowBackIcon>
            <Text>Back to Pet Post</Text>
          </Stack>
          <ModalHeader>Foster Questionnaire</ModalHeader>
          <Flex paddingX={6} flexDir="column" gap={4} overflowY="scroll">
            {data[fosterType].map(({ key, title }) => {
              return (
                <Flex key={key} flexDir="column" gap={2}>
                  <FormControl
                    isRequired
                    isInvalid={
                      fosterQuestionResponses[
                        key as keyof typeof QuestionKeys
                      ] === ""
                    }
                  >
                    <FormLabel>{title}</FormLabel>
                    <Input
                      bgColor={"#FAFBFC"}
                      value={
                        fosterQuestionResponses[
                          key as keyof typeof QuestionKeys
                        ]
                      }
                      onChange={(event) => {
                        setfosterQuestionResponses({
                          ...fosterQuestionResponses,
                          [key as keyof typeof QuestionKeys]:
                            event.target.value,
                        });
                      }}
                    />
                    <FormErrorMessage>Field required.</FormErrorMessage>
                  </FormControl>
                </Flex>
              );
            })}
          </Flex>
          <ModalFooter display={["flex", "none"]} mb={2}>
            <Button
              variant="solid-primary"
              width="full"
              paddingY={5}
              borderRadius="full"
              onClick={handleSubmission}
            >
              Submit
            </Button>
          </ModalFooter>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

const PetPostModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  postData: IPostWithId;
}> = ({ isOpen, onClose, postData }) => {
  const {
    isOpen: isFormViewOpen,
    onOpen: onFormViewOpen,
    onClose: onFormViewClose,
  } = useDisclosure();

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
          paddingTop={12}
          paddingX={12}
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
              alignItems={"center"}
              justifyContent={"center"}
            >
              <ImageSlider attachments={attachments}></ImageSlider>
            </Flex>
            <Stack
              direction="column"
              height={{ lg: "65vh" }}
              width="50%"
              spacing={8}
              paddingLeft={10}
              paddingRight={10}
              overflowY={"scroll"}
            >
              <Text fontWeight="bold" fontSize="4xl" fontFamily="sans-serif">
                {name}
              </Text>
              <Stack direction="column" spacing={3}>
                <Text fontWeight="bold" fontSize="xl" fontFamily="sans-serif">
                  About
                </Text>
                <Text>{description}</Text>
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
          <Flex
            width="100%"
            justifyContent={"flex-end"}
            alignItems={"flex-start"}
            bgColor={"white"}
            paddingRight={8}
          >
            <Button
              variant="solid-primary"
              width={60}
              borderRadius={"20px"}
              onClick={onFormViewOpen}
            >
              Foster Me!
            </Button>
            <FosterQuestionnaire
              fosterType={type}
              postId={postData._id}
              isFormViewOpen={isFormViewOpen}
              onFormViewClose={onFormViewClose}
            />
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
              color="text-secondary"
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
            height={"86vh"}
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

            <Stack direction="column" width="100%" spacing={4}>
              <Flex width="100%" direction={"column"}>
                <PetPostListGroup title={"Main Characteristics"} tags={[]} />
                <Stack direction={"row"}>
                  <Stack direction={"column"} spacing={0.5} width={"50%"}>
                    <Text>
                      <b>Gender: </b>
                      {genderLabels[gender]}
                    </Text>
                    <Text>
                      <b>Breed: </b>
                      {breed.map((breed) => breedLabels[breed]).join(", ")}
                    </Text>
                  </Stack>
                  <Stack direction={"column"} spacing={0.5} width={"50%"}>
                    <Text>
                      <b>Size: </b>
                      {sizeLabels[size]}
                    </Text>
                    <Text>
                      <b>Age: </b>
                      {ageLabels[age]}
                    </Text>
                  </Stack>
                </Stack>
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
            display={["flex", "none"]}
            width="100%"
            justifyContent={"center"}
            padding={{ sm: 4 }}
            position={"sticky"}
            zIndex={1}
            bottom={0}
            right={0}
            left={0}
            bgColor={"white"}
          >
            <Button
              variant="solid-primary"
              width={"100%"}
              borderRadius={"20px"}
              onClick={onFormViewOpen}
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

import {
  ArrowBackIcon,
  DeleteIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import ImageSlider from "./ImageSlider";
import PetPostListGroup from "./PetPostListGroup";
import { FosterType } from "../../utils/types/post";
import { useState } from "react";
import { z } from "zod";
import { Types } from "mongoose";
import { useAuth } from "../../context/auth";

type FosterTypeData = {
  [key in FosterType]: Array<{
    key: keyof typeof KEY_QUESTION_MAP;
    title: typeof KEY_QUESTION_MAP[keyof typeof KEY_QUESTION_MAP];
  }>;
};

type QuestionResponseData = {
  [key in keyof typeof KEY_QUESTION_MAP]?: string;
};

const NUM_OTHER_DOGS_KEY = "numOtherDogs";
const NUM_OTHER_DOGS_QUESTION =
  "How many other fosters and personal dogs do you have?";

const UNEXPECTED_MEDICAL_KEY = "unexpectedMedical";
const UNEXPECTED_MEDICAL_QUESTION =
  "If unexpected medical issues arise are you able to continue to foster?";

const HAS_CAT_KEY = "hasCat";
const HAS_CAT_QUESTION = "Do you have a cat?";

const TRAVEL_PLANS_KEY = "travelPlans";
const TRAVEL_PLANS_QUESTION = "Do you have travel plans within the next month?";

const FENCED_YARD_KEY = "fencedYard";
const FENCED_YARD_QUESTION =
  "Do you have a fenced yard? If so, what type of fence?";

const CHILD_AGE_KEY = "childAge";
const CHILD_AGE_QUESTION =
  "How old are the children living in the home or that would regularly be interacting with the foster dog?";

const TIME_UNATTENDED_KEY = "timeUnattended";
const TIME_UNATTENDED_QUESTION =
  "How many hours a day would the pet be alone/unattended?";

const CAN_QUARANTINE_KEY = "canQuarantine";
const CAN_QUARANTINE_QUESTION = "Are you able to quarantine?";

const KEY_QUESTION_MAP = {
  [NUM_OTHER_DOGS_KEY]: NUM_OTHER_DOGS_QUESTION,
  [UNEXPECTED_MEDICAL_KEY]: UNEXPECTED_MEDICAL_QUESTION,
  [HAS_CAT_KEY]: HAS_CAT_QUESTION,
  [TRAVEL_PLANS_KEY]: TRAVEL_PLANS_QUESTION,
  [FENCED_YARD_KEY]: FENCED_YARD_QUESTION,
  [CHILD_AGE_KEY]: CHILD_AGE_QUESTION,
  [TIME_UNATTENDED_KEY]: TIME_UNATTENDED_QUESTION,
  [CAN_QUARANTINE_KEY]: CAN_QUARANTINE_QUESTION,
};

const RETURN_KEYS: (keyof typeof KEY_QUESTION_MAP)[] = [
  NUM_OTHER_DOGS_KEY,
  UNEXPECTED_MEDICAL_KEY,
  TRAVEL_PLANS_KEY,
  HAS_CAT_KEY,
  FENCED_YARD_KEY,
  CHILD_AGE_KEY,
  TIME_UNATTENDED_KEY,
];

const BOARDING_KEYS: (keyof typeof KEY_QUESTION_MAP)[] = [
  NUM_OTHER_DOGS_KEY,
  HAS_CAT_KEY,
  FENCED_YARD_KEY,
  CHILD_AGE_KEY,
];

const TEMPORARY_KEYS: (keyof typeof KEY_QUESTION_MAP)[] = [
  NUM_OTHER_DOGS_KEY,
  HAS_CAT_KEY,
  FENCED_YARD_KEY,
  CHILD_AGE_KEY,
];

const SHELTER_KEYS: (keyof typeof KEY_QUESTION_MAP)[] = [
  NUM_OTHER_DOGS_KEY,
  CAN_QUARANTINE_KEY,
  UNEXPECTED_MEDICAL_KEY,
  TRAVEL_PLANS_KEY,
  HAS_CAT_KEY,
  TIME_UNATTENDED_KEY,
];

const FOSTER_MOVE_KEYS: (keyof typeof KEY_QUESTION_MAP)[] = [
  NUM_OTHER_DOGS_KEY,
  UNEXPECTED_MEDICAL_KEY,
  TRAVEL_PLANS_KEY,
  HAS_CAT_KEY,
  CAN_QUARANTINE_KEY,
  FENCED_YARD_KEY,
  CHILD_AGE_KEY,
  TIME_UNATTENDED_KEY,
];

const OWNER_SURRENDER_KEYS: (keyof typeof KEY_QUESTION_MAP)[] = [
  NUM_OTHER_DOGS_KEY,
  CAN_QUARANTINE_KEY,
  UNEXPECTED_MEDICAL_KEY,
  TRAVEL_PLANS_KEY,
  HAS_CAT_KEY,
  TIME_UNATTENDED_KEY,
];

function keysToData(
  keys: (keyof typeof KEY_QUESTION_MAP)[]
): FosterTypeData[keyof FosterTypeData] {
  return keys.map((k) => ({
    key: k,
    title: KEY_QUESTION_MAP[k],
  }));
}

const data: FosterTypeData = {
  [FosterType.Return]: keysToData(RETURN_KEYS),
  [FosterType.Boarding]: keysToData(BOARDING_KEYS),
  [FosterType.Temporary]: keysToData(TEMPORARY_KEYS),
  [FosterType.Shelter]: keysToData(SHELTER_KEYS),
  [FosterType.FosterMove]: keysToData(FOSTER_MOVE_KEYS),
  [FosterType.OwnerSurrender]: keysToData(OWNER_SURRENDER_KEYS),
};

/**TODO
 * Refactor component to eliminate duplicated form input logic.
 **/
const FosterQuestionnaire = ({
  fosterType,
  postId,
  isFormViewOpen,
  onFormViewClose,
}: {
  fosterType: FosterType;
  postId: Types.ObjectId;
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

  const [fosterQuestionResponses, setFosterQuestionResponses] = useState(
    initialQuestionResponseData
  );

  const formSchema = z.record(
    z.string().min(1, { message: "All fields required." })
  );

  const { userData, refetchUserData } = useAuth();
  const mutation = trpc.post.offer.useMutation();
  const toast = useToast();

  function handleSubmission() {
    const formValidation = formSchema.safeParse(fosterQuestionResponses);
    if (!formValidation.success) {
      toast({
        title: formValidation.error.issues[0].message,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top",
      });
    } else {
      const formData = formValidation.data;
      const questionAnswerData = Object.entries(formData).map(
        ([key, answer]) => ({
          key: KEY_QUESTION_MAP[key as keyof typeof KEY_QUESTION_MAP],
          answer,
        })
      );
      const offer = {
        email: userData?.email ?? "",
        postOid: postId,
        responses: questionAnswerData,
      };
      mutation.mutate(offer, {
        onSuccess: () => {
          refetchUserData!();
          toast.closeAll();
          onFormViewClose();
          toast({
            description:
              "Thank you for submitting a foster application with Angels Among Us! You will hear back from us soon!",
            status: "info",
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
      size={{ base: "full", lg: "2xl" }}
    >
      <ModalOverlay />
      <ModalContent
        padding={{ lg: 8 }}
        height={{ lg: 650 }}
        width={{ lg: 650 }}
      >
        <ModalHeader display={["none", "block"]} mt={4}>
          <Text size={"xl"}> Foster Questionnaire</Text>
        </ModalHeader>
        <Flex display={["none", "block"]} overflowY={"scroll"}>
          <ModalCloseButton display={["none", "block"]} mt={6} mr={6} />
          <Flex alignItems={"center"}>
            <Flex paddingX={6} flexDir="column" gap={[5, 7]}>
              {data[fosterType].map(({ key, title }) => {
                return (
                  <Flex key={key} flexDir="column" gap={2}>
                    <FormControl isRequired>
                      <FormLabel>{title}</FormLabel>
                      <Input
                        bgColor={"#FAFBFC"}
                        value={fosterQuestionResponses[key]}
                        onChange={(event) => {
                          setFosterQuestionResponses({
                            ...fosterQuestionResponses,
                            [key]: event.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Flex>
                );
              })}
            </Flex>
          </Flex>
          <ModalFooter display={["none", "block"]} mt={6}>
            <Flex alignItems={"center"} justifyContent={"center"}>
              <Button
                variant="solid-primary"
                width={"200px"}
                onClick={handleSubmission}
              >
                Submit
              </Button>
            </Flex>
          </ModalFooter>
        </Flex>
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
          <Flex direction={"column"} overflowY={"scroll"}>
            <Flex paddingX={6} flexDir="column" gap={[5, 7]}>
              {data[fosterType].map(({ key, title }) => {
                return (
                  <Flex key={key} flexDir="column" gap={2}>
                    <FormControl isRequired>
                      <FormLabel>{title}</FormLabel>
                      <Input
                        bgColor={"#FAFBFC"}
                        value={fosterQuestionResponses[key]}
                        onChange={(event) => {
                          setFosterQuestionResponses({
                            ...fosterQuestionResponses,
                            [key]: event.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Flex>
                );
              })}
            </Flex>{" "}
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
        </Flex>
      </ModalContent>
    </Modal>
  );
};

import {
  fosterTypeLabels,
  behavioralLabels,
  spayNeuterStatusLabels,
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
import { Role } from "../../utils/types/account";
import DeletePostModal from "./DeletePostModal";
import { trpc } from "../../utils/trpc";
import MarkCoveredModal from "./MarkCoveredModal";

const PetPostModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  postId: Types.ObjectId;
  appliedTo: boolean;
}> = ({ isOpen, onClose, postId, appliedTo }) => {
  const {
    isOpen: isFormViewOpen,
    onOpen: onFormViewOpen,
    onClose: onFormViewClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteConfirmationOpen,
    onOpen: onDeleteConfirmationOpen,
    onClose: onDeleteConfirmationClose,
  } = useDisclosure();

  const {
    isOpen: isCoveredConfirmationOpen,
    onOpen: onCoveredConfirmationOpen,
    onClose: onCoveredConfirmationClose,
  } = useDisclosure();

  const { data: postData, isLoading } = trpc.post.get.useQuery({ _id: postId });
  const { userData } = useAuth();
  const role = userData?.role;

  if (isLoading) {
    return (
      <Modal
        isOpen={isOpen}
        size={"full"}
        onClose={onClose}
        scrollBehavior={"inside"}
      >
        <ModalContent w="100%" h="100%">
          <ModalCloseButton />
          <Center w="100%" h="100%">
            <Spinner size="xl" />
          </Center>
        </ModalContent>
      </Modal>
    );
  }

  if (!postData || (role === Role.Volunteer && postData.covered)) {
    return (
      <Modal
        isOpen={isOpen}
        size={"full"}
        onClose={onClose}
        scrollBehavior={"inside"}
      >
        <ModalContent w="100%" h="100%">
          <ModalCloseButton />
          <Center w="100%" h="100%">
            <Flex direction="column">
              <Heading size="sm">
                Sorry, we are unable to find the post you are looking for.
              </Heading>
            </Flex>
          </Center>
        </ModalContent>
      </Modal>
    );
  }

  const coveredButtonColor = postData.covered
    ? "text-primary"
    : "text-secondary";

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
          <Stack direction="row" justifyContent="space-between">
            <Button
              h={8}
              w="fit-content"
              bgColor="tag-primary-bg"
              color="text-primary"
              marginLeft={10}
              _hover={{ bgColor: "tag-primary-bg" }}
              leftIcon={<ArrowBackIcon />}
              onClick={onClose}
              id="backToFeedButton"
            >
              Back to feed
            </Button>
            <Flex>
              {(role === Role.Admin || role === Role.ContentCreator) && (
                <Button
                  h={8}
                  backgroundColor="white"
                  onClick={onCoveredConfirmationOpen}
                  _hover={{}}
                  leftIcon={
                    postData.covered ? (
                      <ViewIcon color={coveredButtonColor} />
                    ) : (
                      <ViewOffIcon color={coveredButtonColor} />
                    )
                  }
                >
                  <Text textDecoration="underline" color={coveredButtonColor}>
                    {postData.covered ? "Uncover Post" : "Mark as Covered"}
                  </Text>
                  <MarkCoveredModal
                    isCoveredConfirmationOpen={isCoveredConfirmationOpen}
                    onCoveredConfirmationClose={onCoveredConfirmationClose}
                    postId={postId}
                    isCovered={postData.covered}
                  />
                </Button>
              )}
              {(role === Role.Admin || role === Role.ContentCreator) && (
                <Flex>
                  <Button
                    h={8}
                    backgroundColor="white"
                    onClick={onDeleteConfirmationOpen}
                    _hover={{}}
                    leftIcon={
                      <DeleteIcon marginRight="5px" color="text-secondary" />
                    }
                  >
                    <Text textDecoration="underline" color="text-secondary">
                      Delete
                    </Text>
                  </Button>
                  <DeletePostModal
                    isDeleteConfirmationOpen={isDeleteConfirmationOpen}
                    onDeleteConfirmationClose={onDeleteConfirmationClose}
                    onClose={onClose}
                    postId={postId}
                  />
                </Flex>
              )}
            </Flex>
          </Stack>
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
              isDisabled={appliedTo}
              variant={appliedTo ? "solid-secondary" : "solid-primary"}
              width={60}
              borderRadius={"20px"}
              onClick={onFormViewOpen}
              _hover={
                appliedTo
                  ? {}
                  : {
                      borderColor: "btn-outline-primary-border",
                      color: "text-primary",
                      backgroundColor: "white",
                    }
              }
            >
              {appliedTo ? "Applied" : "Foster Me!"}
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
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text fontWeight="bold" fontSize="4xl" fontFamily="sans-serif">
                  {name}
                </Text>
                {(role === Role.Admin || role === Role.ContentCreator) && (
                  <Flex>
                    <Button
                      h={8}
                      backgroundColor="white"
                      onClick={onDeleteConfirmationOpen}
                      _hover={{}}
                      leftIcon={
                        <DeleteIcon marginRight="5px" color="text-secondary" />
                      }
                    >
                      <Text textDecoration="underline" color="text-secondary">
                        Delete
                      </Text>
                    </Button>
                    <DeletePostModal
                      isDeleteConfirmationOpen={isDeleteConfirmationOpen}
                      onDeleteConfirmationClose={onDeleteConfirmationClose}
                      onClose={onClose}
                      postId={postId}
                    />
                  </Flex>
                )}
              </Stack>
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
              isDisabled={appliedTo}
              variant="solid-primary"
              width={"100%"}
              borderRadius={"20px"}
              onClick={onFormViewOpen}
            >
              {appliedTo ? "Applied" : "Foster Me!"}
            </Button>
          </Flex>
        </ModalFooter>
        <FosterQuestionnaire
          fosterType={type}
          postId={postId}
          isFormViewOpen={isFormViewOpen}
          onFormViewClose={onFormViewClose}
        />
      </ModalContent>
    </Modal>
  );
};

export default PetPostModal;

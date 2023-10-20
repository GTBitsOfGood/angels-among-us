import { ArrowBackIcon, DeleteIcon } from "@chakra-ui/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  Button,
  Flex,
  FormControl,
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
import { trpc } from "../../utils/trpc";
import { useState } from "react";
import { z } from "zod";
import { Types } from "mongoose";

type FosterTypeData = {
  [key in FosterType]: Array<{
    key: string;
    title: string;
  }>;
};

type QuestionResponseData = {
  [key: string]: string;
};

const numOtherDogs = {
  key: "numOtherDogs",
  title: "How many other fosters and personal dogs do you have?",
};

const unexpectedMedical = {
  key: "unexpectedMedical",
  title:
    "If unexpected medical issues arise are you able to continue to foster?",
};

const travelPlans = {
  key: "travelPlans",
  title: "Do you have travel plans within the next month?",
};

const hasCat = {
  key: "hasCat",
  title: "Do you have a cat?",
};

const fencedYard = {
  key: "fencedYard",
  title: "Do you have a fenced yard? If so, what type of fence?",
};

const childAge = {
  key: "childAge",
  title:
    "How old are the children living in the home or that would regularly be interacting with the foster dog?",
};

const timeUnattended = {
  key: "timeUnattended",
  title: "How many hours a day would the pet be alone/unattended?",
};

const canQuarantine = {
  key: "canQuarantine",
  title: "Are you able to quarantine?",
};

const data: FosterTypeData = {
  [FosterType.Return]: [
    numOtherDogs,
    unexpectedMedical,
    travelPlans,
    hasCat,
    fencedYard,
    childAge,
    timeUnattended,
  ],
  [FosterType.Boarding]: [numOtherDogs, hasCat, fencedYard, childAge],
  [FosterType.Temporary]: [numOtherDogs, hasCat, fencedYard, childAge],
  [FosterType.Shelter]: [
    numOtherDogs,
    canQuarantine,
    unexpectedMedical,
    travelPlans,
    hasCat,
    timeUnattended,
  ],
  [FosterType.FosterMove]: [
    numOtherDogs,
    unexpectedMedical,
    travelPlans,
    hasCat,
    canQuarantine,
    fencedYard,
    childAge,
    timeUnattended,
  ],
  [FosterType.OwnerSurrender]: [
    numOtherDogs,
    canQuarantine,
    unexpectedMedical,
    travelPlans,
    hasCat,
    timeUnattended,
  ],
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

  const [fosterQuestionResponses, setfosterQuestionResponses] = useState(
    initialQuestionResponseData
  );

  const formSchema = z.record(
    z.string().min(1, { message: "All fields required." })
  );

  const { userData } = useAuth();
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
      const offer = {
        email: userData?.email ?? "",
        postOid: postId,
      };
      mutation.mutate(offer, {
        onSuccess: () => {
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
                          setfosterQuestionResponses({
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
                          setfosterQuestionResponses({
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
import { Role } from "../../utils/types/account";
import { useAuth } from "../../context/auth";
import DeletePostModal from "./DeletePostModal";

const PetPostModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  postData: IPost & { _id: Types.ObjectId };
}> = ({ isOpen, onClose, postData }) => {
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

  const { userData } = useAuth();
  const role = userData?.role;

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
                  postId={postData._id}
                />
              </Flex>
            )}
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
                      postId={postData._id}
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

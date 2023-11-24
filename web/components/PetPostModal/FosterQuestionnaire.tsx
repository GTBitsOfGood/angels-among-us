import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Types } from "mongoose";
import { useState } from "react";
import { z } from "zod";
import { useAuth } from "../../context/auth";
import { trpc } from "../../utils/trpc";
import { FosterType } from "../../utils/types/post";

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

const OTHER_KEY = "other";
const OTHER_QUESTION =
  "Are there any other details that Angels Among Us Pet Rescue should know when considering your foster offer?";

const KEY_QUESTION_MAP = {
  [NUM_OTHER_DOGS_KEY]: NUM_OTHER_DOGS_QUESTION,
  [UNEXPECTED_MEDICAL_KEY]: UNEXPECTED_MEDICAL_QUESTION,
  [HAS_CAT_KEY]: HAS_CAT_QUESTION,
  [TRAVEL_PLANS_KEY]: TRAVEL_PLANS_QUESTION,
  [FENCED_YARD_KEY]: FENCED_YARD_QUESTION,
  [CHILD_AGE_KEY]: CHILD_AGE_QUESTION,
  [TIME_UNATTENDED_KEY]: TIME_UNATTENDED_QUESTION,
  [CAN_QUARANTINE_KEY]: CAN_QUARANTINE_QUESTION,
  [OTHER_KEY]: OTHER_QUESTION,
};

const RETURN_KEYS: (keyof typeof KEY_QUESTION_MAP)[] = [
  NUM_OTHER_DOGS_KEY,
  UNEXPECTED_MEDICAL_KEY,
  TRAVEL_PLANS_KEY,
  HAS_CAT_KEY,
  FENCED_YARD_KEY,
  CHILD_AGE_KEY,
  TIME_UNATTENDED_KEY,
  OTHER_KEY,
];

const BOARDING_KEYS: (keyof typeof KEY_QUESTION_MAP)[] = [
  NUM_OTHER_DOGS_KEY,
  HAS_CAT_KEY,
  FENCED_YARD_KEY,
  CHILD_AGE_KEY,
  OTHER_KEY,
];

const TEMPORARY_KEYS: (keyof typeof KEY_QUESTION_MAP)[] = [
  NUM_OTHER_DOGS_KEY,
  HAS_CAT_KEY,
  FENCED_YARD_KEY,
  CHILD_AGE_KEY,
  OTHER_KEY,
];

const SHELTER_KEYS: (keyof typeof KEY_QUESTION_MAP)[] = [
  NUM_OTHER_DOGS_KEY,
  CAN_QUARANTINE_KEY,
  UNEXPECTED_MEDICAL_KEY,
  TRAVEL_PLANS_KEY,
  HAS_CAT_KEY,
  TIME_UNATTENDED_KEY,
  OTHER_KEY,
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
  OTHER_KEY,
];

const OWNER_SURRENDER_KEYS: (keyof typeof KEY_QUESTION_MAP)[] = [
  NUM_OTHER_DOGS_KEY,
  CAN_QUARANTINE_KEY,
  UNEXPECTED_MEDICAL_KEY,
  TRAVEL_PLANS_KEY,
  HAS_CAT_KEY,
  TIME_UNATTENDED_KEY,
  OTHER_KEY,
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

function FosterQuestionnaire(props: {
  fosterType: FosterType;
  postId: Types.ObjectId;
  isFormViewOpen: boolean;
  onFormViewClose: () => void;
}) {
  const { fosterType, postId, isFormViewOpen, onFormViewClose } = props;

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

  // Requires all paths to include `other` key.
  const formSchema = z
    .object({
      other: z.string(),
    })
    .catchall(
      z.string().min(1, { message: "Please fill out all required fields." })
    );

  const { userData } = useAuth();
  const mutation = trpc.post.offer.useMutation();
  const toast = useToast();
  const utils = trpc.useUtils();

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
          utils.post.invalidate();
          toast.closeAll();
          onFormViewClose();
          toast({
            description:
              "Thank you for submitting a foster offer with Angels Among Us! You will hear back from us soon!",
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
      scrollBehavior="inside"
      size={{ base: "full", md: "xl" }}
    >
      <ModalOverlay />
      <ModalContent p={{ md: 4 }}>
        <ModalHeader display="flex" flexDir="column" gap={2}>
          <Button
            h={8}
            w="fit-content"
            leftIcon={<ArrowBackIcon />}
            bgColor="tag-primary-bg"
            color="text-primary"
            borderRadius={9}
            _hover={{
              bgColor: "tag-primary-bg",
            }}
            onClick={onFormViewClose}
          >
            Back to post
          </Button>
          <Text size={"xl"}> Foster Questionnaire</Text>
        </ModalHeader>
        <Flex w="100%" paddingX={6} flexDir="column" gap={6} overflowY="auto">
          {data[fosterType].map(({ key, title }) => {
            return (
              <Flex key={key} flexDir="column" gap={2} w="100%">
                {/* TODO: Refactor to remove hard coded required for `other` key */}
                <FormControl isRequired={key !== OTHER_KEY}>
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
          <ModalFooter display="flex" w="100%" mb={2} justifyContent="center">
            <Button
              variant="solid-primary"
              w={{ base: "100%", md: 200 }}
              onClick={handleSubmission}
            >
              Submit
            </Button>
          </ModalFooter>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
export default FosterQuestionnaire;

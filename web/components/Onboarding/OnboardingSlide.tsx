import {
  Flex,
  Text,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
  useDisclosure,
  ModalCloseButton,
  Popover,
  PopoverTrigger,
  Button,
  PopoverArrow,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import OnboardingOptions from "./OnboardingOptions";
import { Dispatch, SetStateAction } from "react";
import {
  QType,
  IQuestion,
  Answers,
  StoredQuestion,
  PossibleTypes,
} from "../../pages/onboarding";

export type OptionType = {
  value: PossibleTypes;
  label: string;
};

function OnboardingSlide(props: {
  questionData: IQuestion[];
  answers: Answers<StoredQuestion<PossibleTypes>>;
  setAnswers: Dispatch<SetStateAction<Answers<StoredQuestion<PossibleTypes>>>>;
  qNum: number;
}) {
  const { questionData, answers, setAnswers, qNum } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const question = questionData[qNum];

  return (
    <Flex
      w="100%"
      h="100%"
      className="onboardingQuestion"
      direction="column"
      textAlign="center"
      align="center"
    >
      <Flex className="questionText" flexDir="column" w="100%">
        <Text
          className="questionTitle"
          fontSize={{ base: "3xl", md: "4xl" }}
          marginBottom={{ base: "24px", md: "30px", lg: "36px" }}
          lineHeight={{ base: "36px", md: "46px" }}
          fontWeight="bold"
          whiteSpace="pre-wrap"
        >
          {question.title}
        </Text>
        <Text
          className="questionDescription"
          fontSize={{ base: "xl", md: "2xl" }}
          marginBottom={{ base: "24px", md: "30px", lg: "30px" }}
          lineHeight={{ lg: "36px" }}
          color="#696969"
          whiteSpace="pre-wrap"
          textAlign={question.qtype == QType.Question ? "center" : "left"}
        >
          {question.description}
        </Text>
      </Flex>
      <OnboardingOptions
        options={
          ("options" in question ? question.options : []) as OptionType[]
        }
        singleAnswer={
          ("singleAnswer" in question
            ? question.singleAnswer
            : false) as boolean
        }
        dropdown={
          ("dropdown" in question ? question.dropdown : false) as boolean
        }
        answers={answers}
        setAnswers={setAnswers}
        qKey={("key" in question ? question.key : "") as string}
      />
      <Flex
        className="popover"
        display={
          "popover" in question && question.popover != "" ? "initial" : "none"
        }
      >
        <Stack
          direction="row"
          marginTop="30px"
          alignItems="center"
          display={{ base: "none", md: "none", lg: "flex" }}
        >
          <Popover trigger="hover" placement="top">
            <PopoverTrigger>
              <Button
                backgroundColor="#FFFFFF"
                paddingX="0px"
                _hover={{ background: "#FFFFFF" }}
              >
                <QuestionOutlineIcon color="btn-solid-primary-bg" />
              </Button>
            </PopoverTrigger>
            <PopoverContent backgroundColor="#FFFFFF">
              <PopoverArrow bgColor="#FFFFFF" />
              <PopoverBody>
                <Text
                  color="black"
                  maxHeight="400px"
                  overflowY="auto"
                  align="left"
                  padding="20px"
                  paddingRight="30px"
                  dangerouslySetInnerHTML={{
                    __html: ("popover" in question
                      ? question.popover
                      : "") as string,
                  }}
                ></Text>
              </PopoverBody>
            </PopoverContent>
            <Text color="text-primary" fontSize="md">
              What does this mean?
            </Text>
          </Popover>
        </Stack>
        <Stack
          className="mobilePopover"
          direction="row"
          display={{ base: "flex", md: "flex", lg: "none" }}
          marginTop={{ base: "16px", md: "30px" }}
          align="center"
        >
          <IconButton
            className="popoverIcon"
            bgColor="white"
            aria-label="info"
            icon={<QuestionOutlineIcon color="btn-solid-primary-bg" />}
            onClick={onOpen}
            marginRight="-8px"
          ></IconButton>
          <Text
            className="popoverIconText"
            color="text-primary"
            fontSize="md"
            align="left"
            lineHeight="16px"
          >
            What does this mean?
          </Text>
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            scrollBehavior="inside"
          >
            <ModalOverlay />
            <ModalContent width="80%" bgColor="#FFFFFF" maxHeight="60%">
              <ModalCloseButton />
              <ModalBody className="popoverDisplayText" padding="30px">
                <Text
                  fontSize={{ base: "15px", md: "22px" }}
                  dangerouslySetInnerHTML={{
                    __html: ("popover" in question
                      ? question.popover
                      : "") as string,
                  }}
                ></Text>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Stack>
      </Flex>
    </Flex>
  );
}

export default OnboardingSlide;

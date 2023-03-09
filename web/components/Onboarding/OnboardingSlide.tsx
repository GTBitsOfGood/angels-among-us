import {
  Flex,
  Text,
  Tooltip,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
  useDisclosure,
  ModalCloseButton,
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
      className="onboardingQuestion"
      direction="column"
      textAlign="center"
      align="center"
      marginX={{ base: "10px", md: "20px", lg: "80px" }}
    >
      <Flex className="questionText" flexDir="column">
        <Text
          className="questionTitle"
          fontSize={{ base: "22px", md: "32px", lg: "42px" }}
          marginX={{ base: "10px", md: "50px", lg: "150px" }}
          marginBottom={{ base: "24px", md: "30px", lg: "30px" }}
          lineHeight={{ base: "28px", md: "42px", lg: "52px" }}
          fontWeight="bold"
          whiteSpace="pre-wrap"
        >
          {question.title}
        </Text>
        <Text
          className="questionDescription"
          fontSize={{ base: "16px", md: "22px", lg: "25px" }}
          marginBottom={{ base: "24px", md: "30px", lg: "30px" }}
          lineHeight={{ lg: "32px" }}
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
      ></OnboardingOptions>
      <Flex
        className="tooltip"
        display={
          "tooltip" in question && question.tooltip != "" ? "initial" : "none"
        }
      >
        <Stack
          direction="row"
          marginTop="50px"
          alignItems="center"
          display={{ base: "none", md: "none", lg: "flex" }}
        >
          <Tooltip
            placement="top-start"
            bgColor="#CCCCCC"
            padding="16px"
            label={
              <Text
                color="#000000"
                dangerouslySetInnerHTML={{
                  __html: ("tooltip" in question
                    ? question.tooltip
                    : "") as string,
                }}
              ></Text>
            }
          >
            <QuestionOutlineIcon />
          </Tooltip>
          <Text color="#6D6D6D" fontSize="small" align="left" lineHeight="16px">
            what does this mean?
          </Text>
        </Stack>
        <Stack
          className="mobileTooltip"
          direction="row"
          display={{ base: "flex", md: "flex", lg: "none" }}
          marginTop={{ base: "16px", md: "30px" }}
          align="center"
        >
          <IconButton
            className="tooltipIcon"
            bgColor="white"
            aria-label="info"
            icon={<QuestionOutlineIcon />}
            onClick={onOpen}
            marginRight="-8px"
          ></IconButton>
          <Text
            className="tooltipIconText"
            color="#6D6D6D"
            fontSize="small"
            align="left"
            lineHeight="16px"
          >
            what does this mean?
          </Text>
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            scrollBehavior="inside"
          >
            <ModalOverlay />
            <ModalContent width="80%" bgColor="#EEEEEE" maxHeight="60%">
              <ModalCloseButton />
              <ModalBody className="tooltipDisplayText" padding="30px">
                <Text
                  fontSize={{ base: "15px", md: "22px" }}
                  dangerouslySetInnerHTML={{
                    __html: ("tooltip" in question
                      ? question.tooltip
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

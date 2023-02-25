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

enum QType {
  Intro,
  Question,
  Completion,
}

function OnboardingSlide(props: {
  questionData: {
    title: string;
    description: string;
    options: string[];
    qtype: QType;
    singleAnswer: boolean;
    dropdown: boolean;
    tooltip: string;
  }[];
  answers: boolean[][];
  setAnswers: (arg: boolean[][]) => void;
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
        options={question.options}
        singleAnswer={question.singleAnswer}
        dropdown={question.dropdown}
        answers={answers}
        setAnswers={setAnswers}
        qNum={qNum}
      ></OnboardingOptions>
      <Flex
        className="tooltip"
        display={question.tooltip != "" ? "initial" : "none"}
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
                  __html: question.tooltip,
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
                    __html: question.tooltip,
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

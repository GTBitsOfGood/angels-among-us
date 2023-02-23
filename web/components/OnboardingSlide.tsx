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

  return (
    <Flex
      className="onboardingQuestion"
      direction="column"
      textAlign="center"
      align="center"
    >
      <Flex className="questionText" flexDir="column">
        <Text
          className="questionTitle"
          marginX={{ base: "10px", md: "60px", lg: "100px" }}
          fontSize={{ base: "22px", md: "40px", lg: "44px" }}
          marginBottom={{ base: "36px", md: "20px", lg: "24px" }}
          lineHeight={{ base: "28px", md: "50px", lg: "52px" }}
          fontWeight="bold"
        >
          {questionData[qNum].title}
        </Text>
        <Text
          className="questionDescription"
          fontSize={{ base: "16px", md: "24px", lg: "28px" }}
          lineHeight={{ lg: "32px" }}
          color="#696969"
          textAlign={
            questionData[qNum].qtype == QType.Question ? "center" : "left"
          }
        >
          {questionData[qNum].description}
        </Text>
      </Flex>
      <OnboardingOptions
        options={questionData[qNum].options}
        singleAnswer={questionData[qNum].singleAnswer}
        dropdown={questionData[qNum].dropdown}
        answers={answers}
        setAnswers={setAnswers}
        qNum={qNum}
      ></OnboardingOptions>
      <Flex
        className="tooltip"
        display={questionData[qNum].tooltip != "" ? "initial" : "none"}
      >
        <Stack
          direction="row"
          width="48%"
          position="absolute"
          alignItems="center"
          justifyContent="flex-end"
          overflow="clip"
          bottom="30px"
          right="20px"
          display={["none", "flex"]}
        >
          <Text color="#6D6D6D" fontSize="small">
            what does this mean?
          </Text>
          <Tooltip
            placement="top-start"
            bgColor="#B5B5B5"
            label={<Text color="#000000">{questionData[qNum].tooltip}</Text>}
          >
            <QuestionOutlineIcon />
          </Tooltip>
        </Stack>
        <Stack
          className="mobileTooltip"
          direction="row"
          alignItems="center"
          display={["flex", "none"]}
          marginTop="16px"
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
            <ModalContent width="80%" bgColor="#EEEEEE" height="60%">
              <ModalCloseButton />
              <ModalBody className="tooltipDisplayText" padding="30px">
                {questionData[qNum].tooltip}
              </ModalBody>
            </ModalContent>
          </Modal>
        </Stack>
      </Flex>
    </Flex>
  );
}

export default OnboardingSlide;

import {
  Flex,
  Text,
  Tooltip,
  Stack,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
  useDisclosure,
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
      align="center"
      textAlign="center"
    >
      <Flex className="questionText" flexDir="column">
        <Text
          marginX={{ base: "24px", md: "60px", lg: "100px" }}
          fontSize={{ base: "24px", md: "40px", lg: "44px" }}
          marginBottom={{ base: "28px", md: "20px", lg: "24px" }}
          lineHeight={{ base: "30px", md: "50px", lg: "52px" }}
          as="b"
        >
          {questionData[qNum].title}
        </Text>
        <Text
          fontSize={{ base: "16px", md: "24px", lg: "28px" }}
          lineHeight={{ lg: "32px" }}
          color="#696969"
          textAlign={
            questionData[qNum].qtype == QType.Intro ? "left" : "center"
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
        display={questionData[qNum].tooltip != "" ? "initial" : "none"}
        marginTop="50px"
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
            closeDelay={2000}
            bgColor="#B5B5B5"
            label={<Text color="#000000">{questionData[qNum].tooltip}</Text>}
          >
            <QuestionOutlineIcon />
          </Tooltip>
        </Stack>
        <Stack
          direction="row"
          width="48%"
          position="absolute"
          alignItems="center"
          justifyContent="flex-end"
          overflow="clip"
          bottom="30px"
          right="20px"
          display={["flex", "none"]}
        >
          <Text color="#6D6D6D" fontSize="small">
            what does this mean?
          </Text>
          <IconButton
            bgColor="white"
            aria-label="info"
            cursor="default"
            icon={<QuestionOutlineIcon />}
            onClick={onOpen}
          ></IconButton>

          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent width="80%" bgColor="#D9D9D9">
              <ModalBody>{questionData[qNum].tooltip}</ModalBody>
            </ModalContent>
          </Modal>
        </Stack>
      </Flex>
    </Flex>
  );
}

export default OnboardingSlide;

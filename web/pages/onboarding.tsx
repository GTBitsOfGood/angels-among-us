import { useEffect, useState } from "react";
import OnboardingQuestion from "../components/OnboardingQuestion";
import { Flex, Progress, Text, Button } from "@chakra-ui/react";

export default function Onboarding() {
  const questionData = [
    {
      title: "What dog size can you manage?",
      description: "Select a dog size based on your situation",
      options: ["Small", "Medium", "Big"],
    },
    {
      title: "What age dog can you manage?",
      description: "Select a dog age based on your situation",
      options: ["0-2", "2-4", "4-6", "6-8", "8-10", "10-12", "12-14", "14-16"],
    },
    {
      title: "What color dog do you want",
      description: "Choose a color idk man",
      options: ["white", "brown", "black"],
    },
    {
      title: "What breed dog",
      description: "Breed",
      options: ["collie", "retriever", "terrier"],
    },
    {
      title: "What dog volume",
      description: "how loud can ur dog be",
      options: ["silent", "quiet", "loud", "very loud"],
    },
  ];

  const [qNum, setQNum] = useState(0);

  function prevQ() {
    if (qNum != 0) {
      setQNum(qNum - 1);
    }
  }

  function nextQ() {
    if (qNum != questionData.length - 1) {
      setQNum(qNum + 1);
    }
  }

  return (
    <div>
      <Flex flexDir="row" marginX="200px" marginY="50px" alignItems="center">
        <Progress
          width="90%"
          value={(100 * qNum) / (questionData.length - 1)}
          borderRadius="10px"
          height="20px"
          colorScheme="blackAlpha"
          backgroundColor="#D9D9D9"
          marginRight="20px"
        ></Progress>{" "}
        <Text fontWeight="semibold" textColor="#3D3D3D">
          {qNum + 1 + " of " + questionData.length}
        </Text>
      </Flex>
      <OnboardingQuestion
        title={questionData[qNum].title}
        description={questionData[qNum].description}
        options={questionData[qNum].options}
      />
      <Flex justifyContent="flex-end" marginRight="150px" marginY="50px">
        <Button
          className="leftButton"
          onClick={() => prevQ()}
          borderWidth="1px"
          borderColor="#000000"
          marginRight="20px"
          fontSize="2xl"
          fontWeight="semibold"
          borderRadius="10px"
          backgroundColor="#FFFFFF"
          paddingY="25px"
          _hover={{ backgroundColor: "#000000", textColor: "#FFFFFF" }}
        >
          &lt; Back
        </Button>
        <Button
          className="rightButton"
          onClick={() => nextQ()}
          borderWidth="1px"
          borderColor="#000000"
          fontSize="2xl"
          fontWeight="semibold"
          borderRadius="10px"
          backgroundColor="#FFFFFF"
          paddingY="25px"
          _hover={{ backgroundColor: "#000000", textColor: "#FFFFFF" }}
        >
          Next &gt;
        </Button>
      </Flex>
    </div>
  );
}

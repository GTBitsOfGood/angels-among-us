import { useEffect, useState } from "react";
import OnboardingQuestion from "../components/OnboardingQuestion";
import { Flex, Progress, Text, Button } from "@chakra-ui/react";
import OnboardingBackNextBtn from "../components/OnboardingBackNextBtn";

export default function Onboarding() {
  const questionData = [
    {
      title: "What dog size do you think that your house can manage?",
      description: "Select a dog size based on your situation",
      options: ["Small", "Medium", "Big"],
    },
    {
      title: "What age dog can you manage?",
      description: "Select a dog age based on your situation",
      options: ["0-2", "2-4", "4-6", "6-8", "8-10", "10-12"],
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
      options: ["silent", "quiet", "loud"],
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
      <Flex
        className="page"
        flexDir="column"
        alignItems="center"
        marginX={{ base: "36px", md: "100px", lg: "200px" }}
        marginY={{ base: "64px", md: "80px", lg: "50px" }}
      >
        <Flex
          className="progress"
          flexDir="row"
          alignItems="center"
          justifyContent="center"
          width="100%"
          marginBottom={{ base: "50px", md: "60px", lg: "40px" }}
        >
          <Progress
            width={{ base: "80%", md: "80%", lg: "90%" }}
            value={(100 * qNum) / (questionData.length - 1)}
            borderRadius="10px"
            height={{ base: "10px", md: "20px", lg: "20px" }}
            colorScheme="blackAlpha"
            backgroundColor="#D9D9D9"
            marginRight={{ base: "16px", md: "20px", lg: "25px" }}
          ></Progress>{" "}
          <Text
            fontWeight="semibold"
            textColor="#3D3D3D"
            fontSize={{ base: "10px", md: "16px", lg: "20px" }}
          >
            {qNum + 1 + " of " + questionData.length}
          </Text>
        </Flex>
        <OnboardingQuestion
          title={questionData[qNum].title}
          description={questionData[qNum].description}
          options={questionData[qNum].options}
        />
      </Flex>
      <Flex
        className="buttons"
        justifyContent="flex-end"
        marginBottom="50px"
        marginRight={{ base: "50px", md: "120px", lg: "150px" }}
      >
        <OnboardingBackNextBtn
          onClickFunc={prevQ}
          isBack={true}
          qNum={qNum}
          numQs={questionData.length}
        ></OnboardingBackNextBtn>
        <OnboardingBackNextBtn
          onClickFunc={nextQ}
          isBack={false}
          qNum={qNum}
          numQs={questionData.length}
        ></OnboardingBackNextBtn>
      </Flex>
    </div>
  );
}

/*<Button
          className="leftButton"
          onClick={() => prevQ()}
          borderWidth="1px"
          borderColor="#000000"
          fontSize={{ base: "12px", md: "20px", lg: "24px" }}
          fontWeight="semibold"
          borderRadius="10px"
          backgroundColor="#FFFFFF"
          paddingY={{ base: "12px", md: "25px", lg: "25px" }}
          marginRight={{ base: "12px", md: "20px", lg: "25px" }}
          _hover={{ backgroundColor: "#000000", textColor: "#FFFFFF" }}
        >
          &lt; Back
        </Button>*/

import { useState } from "react";
import OnboardingQuestion from "../components/OnboardingQuestion";
import { Flex, Progress, Text } from "@chakra-ui/react";
import OnboardingBackNextBtn from "../components/OnboardingBackNextBtn";

export default function Onboarding() {
  const questionData = [
    {
      title: "Question 1",
      description: "Question 1 description",
      options: ["Option 1", "Option 2", "Option 3"],
    },
    {
      title: "Question 2: adding some filler text here for question 2",
      description:
        "Question 2 description: adding some more filler description text here for the question 2 description",
      options: [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4",
        "Option 5",
        "Option 6",
      ],
    },
    {
      title: "Question 3",
      description: "Question 3 description",
      options: ["Option 1", "Option 2", "Option 3"],
    },
    {
      title: "Question 4",
      description: "Question 4 description",
      options: ["Option 1", "Option 2", "Option 3"],
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
        marginTop={{ base: "64px", md: "80px", lg: "50px" }}
        marginBottom={{ base: "120px", md: "180px", lg: "180px" }}
      >
        <Flex
          className="progress"
          flexDir="row"
          alignItems="center"
          justifyContent="center"
          width="100%"
          marginBottom={{ base: "50px", md: "60px", lg: "60px" }}
        >
          <Progress
            width={{ base: "75%", md: "80%", lg: "85%" }}
            value={(100 * qNum) / (questionData.length - 1)}
            borderRadius="10px"
            height={{ base: "10px", md: "20px", lg: "20px" }}
            colorScheme="blackAlpha"
            backgroundColor="#D9D9D9"
            marginRight={{ base: "16px", md: "20px", lg: "25px" }}
          ></Progress>
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
        className="backnextbuttons"
        position="fixed"
        right={{ base: "50%", md: "200px", lg: "300px" }}
        transform={{ base: "translateX(50%)" }}
        bottom={{ base: "30px", md: "70px", lg: "70px" }}
        gap={{ base: "8px", md: "20px", lg: "25px" }}
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

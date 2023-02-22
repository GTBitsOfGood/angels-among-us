import { useState } from "react";
import OnboardingQuestion from "../components/OnboardingQuestion";
import { Flex, Progress, Text } from "@chakra-ui/react";
import OnboardingBackNextBtn from "../components/OnboardingBackNextBtn";
import OnboardingIntro from "../components/OnboardingIntro";

export default function Onboarding() {
  const questionData = [
    {
      title: "",
      description: "",
      options: [],
    },
    {
      title: "Are you able to help with all these types of fosters?",
      description: "",
      options: [
        "Return",
        "Boarding",
        "Temporary",
        "Shelter",
        "Owner Surrender",
        "Foster Move",
      ],
    },
    {
      title: "What sizes of dogs are you able to foster?",
      description: "",
      options: ["Extra Small", "Small", "Medium", "Large", "Extra Large"],
    },
    {
      title: "Are there any breeds that you are not comfortable fostering?",
      description: "",
      options: [
        "American Eskimo",
        "Australian Shepherd",
        "...",
        "Whippet",
        "Other",
      ],
    },
    {
      title:
        "Are you okay with both male and female dogs? How about a litter of puppies?",
      description: "",
      options: ["Male", "Female", "Litter"],
    },
    {
      title: "What age of dogs are you willing to foster?",
      description: "",
      options: ["Puppy", "Young", "Adult", "Senior", "Mom & Puppies"],
    },
    {
      title: "What temperament can you foster?",
      description: "",
      options: ["Friendly", "Scared", "Active", "Calm"],
    },
    {
      title: "Are you able to foster dogs that are not good with:",
      description: "",
      options: [
        "Men",
        "Women",
        "Older Children",
        "Young Children",
        "Large Dogs",
        "Small Dogs",
        "Cats",
      ],
    },
    {
      title: "Are you able to foster dogs that have or are:",
      description: "",
      options: [
        "Illness",
        "Injury",
        "Heartworms",
        "Pregnant",
        "Nursing",
        "Bottle Feeding",
        "Chronic Condition",
        "Parvo",
        "Hospice",
      ],
    },
    {
      title: "Are you able to foster dogs that have or are:",
      description: "",
      options: [
        "Separation Anxiety",
        "Barking",
        "Jumping",
        "Bite Risk",
        "Pulls on Leash",
        "Flight Risk",
      ],
    },
    {
      title: "Are you able to foster a dog who isn't house trained?",
      description: "",
      options: ["Yes", "No"],
    },
    {
      title: "Are you able to foster a dog who isn't crate trained?",
      description: "",
      options: ["Yes", "No"],
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

  let onboardingDisplay = <OnboardingIntro></OnboardingIntro>;
  if (qNum != 0) {
    onboardingDisplay = (
      <OnboardingQuestion
        title={questionData[qNum].title}
        description={questionData[qNum].description}
        options={questionData[qNum].options}
      />
    );
  }

  return (
    <div>
      <Flex
        className="page"
        flexDir="column"
        alignItems="center"
        marginX={{ base: "50px", md: "100px", lg: "200px" }}
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
            {qNum + " of " + (questionData.length - 1)}
          </Text>
        </Flex>
        {onboardingDisplay}
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

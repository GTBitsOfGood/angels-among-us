import { useState } from "react";
import OnboardingSlide from "../components/OnboardingSlide";
import { Flex, Progress, Text, Button } from "@chakra-ui/react";
import OnboardingButton from "../components/OnboardingButton";

enum QType {
  Intro,
  Question,
  Completion,
}

enum ButtonType {
  Back,
  Next,
  Singular,
}

export default function Onboarding() {
  const questionData = [
    {
      title: "Hello, new foster!",
      description:
        "Let's start by walking through building your foster profile! This will help us connect you with the best pet for your situation to ensure a positive experience for everyone involved. \n\n Answer the following questions with all possible animals you would be willing to foster in mind. Keep in mind that once your profile is complete, you will still be able to edit these answers in the future.",
      options: [],
      qtype: QType.Intro,
      singleAnswer: false,
      dropdown: false,
      tooltip: "",
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
      qtype: QType.Question,
      singleAnswer: false,
      dropdown: false,
      tooltip:
        "Return Foster \n A dog that was adopted but then returned to AAU by the adopter. \n Boarding \n A foster parent or other dogs’ owner goes on vacation or other hiatus and needs someone to take their dog for a little \n Temporary \n During holidays, vacations, and emergencies until permanent fosters can be found or return. \n Shelter \n Lorem ipsum dolor sit amet consectetur. \n Owner Surrender \n Lorem ipsum dolor sit amet consectetur. \n Foster Move \n A dog whose previous foster parents can't care for the foster dog any more.",
    },
    {
      title: "What sizes of dogs are you able to foster?",
      description: "",
      options: ["Extra Small", "Small", "Medium", "Large", "Extra Large"],
      qtype: QType.Question,
      singleAnswer: false,
      dropdown: false,
      tooltip: "",
    },
    {
      title: "Are there any breeds that you are not comfortable fostering?",
      description: "",
      options: [
        "None",
        "American Eskimo",
        "Australian Shepherd",
        "...",
        "Whippet",
        "Other",
      ],
      qtype: QType.Question,
      singleAnswer: false,
      dropdown: true,
      tooltip: "",
    },
    {
      title:
        "Are you okay with both male and female dogs? How about a litter of puppies?",
      description: "",
      options: ["Male", "Female", "Litter"],
      qtype: QType.Question,
      singleAnswer: false,
      dropdown: false,
      tooltip: "",
    },
    {
      title: "What age of dogs are you willing to foster?",
      description: "",
      options: ["Puppy", "Young", "Adult", "Senior", "Mom & Puppies"],
      qtype: QType.Question,
      singleAnswer: false,
      dropdown: false,
      tooltip: "",
    },
    {
      title: "What temperament can you foster?",
      description: "",
      options: ["Friendly", "Scared", "Active", "Calm"],
      qtype: QType.Question,
      singleAnswer: false,
      dropdown: false,
      tooltip: "",
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
      qtype: QType.Question,
      singleAnswer: false,
      dropdown: false,
      tooltip: "",
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
      qtype: QType.Question,
      singleAnswer: false,
      dropdown: false,
      tooltip: "",
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
      qtype: QType.Question,
      singleAnswer: false,
      dropdown: false,
      tooltip: "",
    },
    {
      title: "Are you able to foster a dog who isn't house trained?",
      description: "",
      options: ["Yes", "No"],
      qtype: QType.Question,
      singleAnswer: true,
      dropdown: false,
      tooltip: "",
    },
    {
      title: "Are you able to foster a dog who isn't crate trained?",
      description: "",
      options: ["Yes", "No"],
      qtype: QType.Question,
      singleAnswer: true,
      dropdown: false,
      tooltip: "",
    },
    {
      title: "Are you able to foster a dog who isn't spayed/neutered?",
      description: "",
      options: ["Yes", "No"],
      qtype: QType.Question,
      singleAnswer: true,
      dropdown: false,
      tooltip: "",
    },
    {
      title: "🎉 Thanks for completing your profile!",
      description:
        "We're super excited that you're interested in helping our dogs in need by providing them with a kind home!",
      options: [],
      qtype: QType.Completion,
      singleAnswer: false,
      dropdown: false,
      tooltip: "",
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

  let answersState = [];
  for (let i = 0; i < questionData.length; i++) {
    if (questionData[i].dropdown) {
      let ddAns = Array(questionData[i].options.length).fill(false);
      ddAns[0] = true;
      answersState.push(ddAns);
    } else {
      answersState.push(Array(questionData[i].options.length).fill(false));
    }
  }

  const [answers, setAnswers] = useState(answersState);

  let btnDisplay;
  if (questionData[qNum].qtype == QType.Question) {
    btnDisplay = (
      <Flex gap={{ base: "8px", md: "20px", lg: "25px" }}>
        <OnboardingButton
          onClickFunc={prevQ}
          btnType={ButtonType.Back}
          qNum={qNum}
          questionData={questionData}
        ></OnboardingButton>
        <OnboardingButton
          onClickFunc={nextQ}
          btnType={ButtonType.Next}
          qNum={qNum}
          questionData={questionData}
        ></OnboardingButton>
      </Flex>
    );
  } else {
    btnDisplay = (
      <OnboardingButton
        onClickFunc={nextQ}
        btnType={ButtonType.Singular}
        qNum={qNum}
        questionData={questionData}
      ></OnboardingButton>
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
          visibility={
            questionData[qNum].qtype == QType.Completion ? "hidden" : "visible"
          }
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
        <OnboardingSlide
          questionData={questionData}
          answers={answers}
          setAnswers={setAnswers}
          qNum={qNum}
        />
      </Flex>

      <Flex
        className="backnextbuttons"
        position="fixed"
        right={{ base: "50%", md: "200px", lg: "300px" }}
        transform={{ base: "translateX(50%)" }}
        bottom={{ base: "30px", md: "70px", lg: "70px" }}
      >
        {btnDisplay}
      </Flex>
    </div>
  );
}

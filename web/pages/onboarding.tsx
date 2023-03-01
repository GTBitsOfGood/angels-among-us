import { useState } from "react";
import OnboardingSlide from "../components/OnboardingSlide";
import { Flex, Progress, Text } from "@chakra-ui/react";
import OnboardingButton from "../components/OnboardingButton";
import {
  FosterType,
  Size,
  Gender,
  Age,
  Temperament,
  GoodWith,
  Medical,
  Behavioral,
  Trained,
} from "../utils/types/post";

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

type PossibleTypes =
  | typeof FosterType
  | typeof Size
  | typeof Gender
  | typeof Age
  | typeof Temperament
  | typeof GoodWith
  | typeof Medical
  | typeof Behavioral
  | typeof Trained;

interface Question {
  title: string;
  description: string;
  options: string[];
  qtype: QType;
  singleAnswer: boolean;
  dropdown: boolean;
  tooltip: string;
}

interface StoredQuestion extends Question {
  key: string;
  type: PossibleTypes;
}

type Answers<T extends StoredQuestion> = {
  [key in T["key"]]: PossibleTypes;
};

export default function Onboarding() {
  const questionData: Question[] = [
    {
      title: "Hello, new foster!",
      description: `Let's start by walking through building your foster profile! This will help us connect you with the best pet for your situation to ensure a positive experience for everyone involved.\n\nAnswer the following questions with all possible animals you would be willing to foster in mind. Keep in mind that once your profile is complete, you will still be able to edit these answers in the future.`,
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
        "<b>Return Foster</b> <br> A dog that was adopted but then returned to AAU by the adopter. <br><br> <b> Boarding </b> <br> A foster parent or other dogs' owner goes on vacation or other hiatus and needs someone to take their dog for a little <br><br> <b> Temporary </b> <br> During holidays, vacations, and emergencies until permanent fosters can be found or return. <br><br> <b> Shelter </b> <br> Lorem ipsum dolor sit amet consectetur. <br><br> <b> Owner Surrender </b> <br> Lorem ipsum dolor sit amet consectetur. <br><br> <b> Foster Move </b> <br> A dog whose previous foster parents can't care for the foster dog any more.",
      key: "fosterType",
      type: FosterType,
    } as StoredQuestion,
    // {
    //   title: "What sizes of dogs are you able to foster?",
    //   description: "",
    //   options: ["Extra Small", "Small", "Medium", "Large", "Extra Large"],
    //   qtype: QType.Question,
    //   singleAnswer: false,
    //   dropdown: false,
    //   tooltip: "",
    // } as StoredQuestion,
    // {
    //   title: "Are there any breeds that you are not comfortable fostering?",
    //   description: "Leave blank if none",
    //   options: [
    //     "American Eskimo",
    //     "Australian Shepherd",
    //     "Beagle",
    //     "Bichon Frise",
    //     "Border Collie",
    //     "Boxer",
    //     "Brussels Griffon",
    //     "Bulldog",
    //     "Cane Corso/Mastiff",
    //     "Cattle Dog/Heeler",
    //     "Chihuahua",
    //     "Chow Chow",
    //     "Collie",
    //     "Corgi",
    //     "Dachshund",
    //     "Dalmatian",
    //     "Doberman Pinscher",
    //     "German Shepherd",
    //     "Golden Retriever",
    //     "Great Dane",
    //     "Great Pyrenees",
    //     "Greyhound",
    //     "Hound",
    //     "Husky",
    //     "Labrador Retriever",
    //     "Malamute",
    //     "Maltese",
    //     "Min Pin",
    //     "Mix",
    //     "Newfoundland",
    //     "Pekingese",
    //     "Pitbull",
    //     "Pointer",
    //     "Pomeranian",
    //     "Poodle",
    //     "Pug",
    //     "Rottweiler",
    //     "Schnauzer",
    //     "Scottie",
    //     "Setter",
    //     "Sharpei",
    //     "Sheepdog",
    //     "Shepherd",
    //     "Shih Tzu",
    //     "Spaniel",
    //     "St. Bernard",
    //     "Terrier (Med-Large)",
    //     "Terrier (Small)",
    //     "Weimaraner",
    //     "Whippet",
    //   ],
    //   qtype: QType.Question,
    //   singleAnswer: false,
    //   dropdown: true,
    //   tooltip: "",
    // } as StoredQuestion,
    // {
    //   title:
    //     "Are you okay with both male and female dogs? How about a litter of puppies?",
    //   description: "",
    //   options: ["Male", "Female", "Litter"],
    //   qtype: QType.Question,
    //   singleAnswer: false,
    //   dropdown: false,
    //   tooltip: "",
    // } as StoredQuestion,
    // {
    //   title: "What age of dogs are you willing to foster?",
    //   description: "",
    //   options: ["Puppy", "Young", "Adult", "Senior", "Mom & Puppies"],
    //   qtype: QType.Question,
    //   singleAnswer: false,
    //   dropdown: false,
    //   tooltip: "",
    // } as StoredQuestion,
    // {
    //   title: "What temperament can you foster?",
    //   description: "",
    //   options: ["Friendly", "Scared", "Active", "Calm"],
    //   qtype: QType.Question,
    //   singleAnswer: false,
    //   dropdown: false,
    //   tooltip: "",
    // } as StoredQuestion,
    // {
    //   title: "Are you able to foster dogs that are not good with:",
    //   description: "",
    //   options: [
    //     "Men",
    //     "Women",
    //     "Older Children",
    //     "Young Children",
    //     "Large Dogs",
    //     "Small Dogs",
    //     "Cats",
    //   ],
    //   qtype: QType.Question,
    //   singleAnswer: false,
    //   dropdown: false,
    //   tooltip: "",
    // } as StoredQuestion,
    // {
    //   title: "Are you able to foster dogs that have or are:",
    //   description: "",
    //   options: [
    //     "Illness",
    //     "Injury",
    //     "Heartworms",
    //     "Pregnant",
    //     "Nursing",
    //     "Bottle Feeding",
    //     "Chronic Condition",
    //     "Parvo",
    //     "Hospice",
    //   ],
    //   qtype: QType.Question,
    //   singleAnswer: false,
    //   dropdown: false,
    //   tooltip: "",
    // } as StoredQuestion,
    // {
    //   title: "Are you able to foster dogs that have or are:",
    //   description: "",
    //   options: [
    //     "Separation Anxiety",
    //     "Barking",
    //     "Jumping",
    //     "Bite Risk",
    //     "Pulls on Leash",
    //     "Flight Risk",
    //   ],
    //   qtype: QType.Question,
    //   singleAnswer: false,
    //   dropdown: false,
    //   tooltip: "",
    // } as StoredQuestion,
    // {
    //   title: "Are you able to foster a dog who isn't house trained?",
    //   description: "",
    //   options: ["Yes", "No"],
    //   qtype: QType.Question,
    //   singleAnswer: true,
    //   dropdown: false,
    //   tooltip: "",
    // } as StoredQuestion,
    // {
    //   title: "Are you able to foster a dog who isn't crate trained?",
    //   description: "",
    //   options: ["Yes", "No"],
    //   qtype: QType.Question,
    //   singleAnswer: true,
    //   dropdown: false,
    //   tooltip: "",
    // } as StoredQuestion,
    // {
    //   title: "Are you able to foster a dog who isn't spayed/neutered?",
    //   description: "",
    //   options: ["Yes", "No"],
    //   qtype: QType.Question,
    //   singleAnswer: true,
    //   dropdown: false,
    //   tooltip: "",
    // } as StoredQuestion,
    // {
    //   title: "🎉\nThanks for completing your profile!",
    //   description: `We're super excited that you're interested in helping our dogs in need by providing them with a kind home!\n\nLorem ipsum dolor sit amet consectetur. Purus vehicula eget pharetra vitae. Varius id libero id aliquam in.`,
    //   options: [],
    //   qtype: QType.Completion,
    //   singleAnswer: false,
    //   dropdown: false,
    //   tooltip: "",
    // },
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

  const initialAnswers: Answers<StoredQuestion> = questionData.reduce(
    (acc, cur) => {
      if (cur.qtype !== QType.Question) return acc;
      return {
        ...acc,
        [(cur as StoredQuestion).key]: [],
      } as Answers<StoredQuestion>;
    },
    {} as Answers<StoredQuestion>
  );

  const [answers, setAnswers] = useState(initialAnswers);
  console.log(answers);

  // let btnDisplay;
  // if (questionData[qNum].qtype == QType.Question) {
  //   btnDisplay = (
  //     <Flex gap={{ base: "8px", md: "20px", lg: "25px" }}>
  //       <OnboardingButton
  //         onClickFunc={prevQ}
  //         btnType={ButtonType.Back}
  //         qNum={qNum}
  //         questionData={questionData}
  //         answers={answers}
  //       ></OnboardingButton>
  //       <OnboardingButton
  //         onClickFunc={nextQ}
  //         btnType={ButtonType.Next}
  //         qNum={qNum}
  //         questionData={questionData}
  //         answers={answers}
  //       ></OnboardingButton>
  //     </Flex>
  //   );
  // } else {
  //   btnDisplay = (
  //     <OnboardingButton
  //       onClickFunc={nextQ}
  //       btnType={ButtonType.Singular}
  //       qNum={qNum}
  //       questionData={questionData}
  //       answers={answers}
  //     ></OnboardingButton>
  //   );
  // }

  // return (
  //   <div>
  //     <Flex
  //       className="page"
  //       flexDir="column"
  //       alignItems="center"
  //       marginX={{ base: "50px", md: "100px", lg: "200px" }}
  //       marginTop={{ base: "64px", md: "80px", lg: "50px" }}
  //       marginBottom={{ base: "120px", md: "180px", lg: "180px" }}
  //     >
  //       <Flex
  //         className="progress"
  //         flexDir="row"
  //         alignItems="center"
  //         justifyContent="center"
  //         width="100%"
  //         marginBottom={{ base: "50px", md: "70px", lg: "84px" }}
  //         visibility={
  //           questionData[qNum].qtype == QType.Completion ? "hidden" : "visible"
  //         }
  //       >
  //         <Progress
  //           className="progressBar"
  //           width={{ base: "75%", md: "80%", lg: "85%" }}
  //           value={(100 * qNum) / (questionData.length - 1)}
  //           borderRadius="10px"
  //           height={{ base: "10px", md: "20px", lg: "20px" }}
  //           colorScheme="blackAlpha"
  //           backgroundColor="#D9D9D9"
  //           marginRight={{ base: "16px", md: "20px", lg: "25px" }}
  //         ></Progress>
  //         <Text
  //           className="progressBarText"
  //           fontWeight="semibold"
  //           textColor="#3D3D3D"
  //           fontSize={{ base: "10px", md: "16px", lg: "20px" }}
  //         >
  //           {qNum + " of " + (questionData.length - 1)}
  //         </Text>
  //       </Flex>
  //       <OnboardingSlide
  //         questionData={questionData}
  //         answers={answers}
  //         setAnswers={setAnswers}
  //         qNum={qNum}
  //       />
  //     </Flex>

  //     <Flex
  //       className="buttonDisplay"
  //       position="fixed"
  //       right={{ base: "50%", md: "200px", lg: "300px" }}
  //       transform={{ base: "translateX(50%)" }}
  //       bottom={{ base: "30px", md: "70px", lg: "70px" }}
  //     >
  //       {btnDisplay}
  //     </Flex>
  //   </div>
  // );
  return <div></div>;
}

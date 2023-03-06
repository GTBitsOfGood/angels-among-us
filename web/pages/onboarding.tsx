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
  Status,
  Breed,
} from "../utils/types/post";

export enum QType {
  Intro,
  Question,
  Completion,
}

export enum ButtonType {
  Back,
  Next,
  Singular,
}

export type PossibleTypes =
  | FosterType
  | Size
  | Breed
  | Gender
  | Age
  | Temperament
  | GoodWith
  | Medical
  | Behavioral
  | Trained
  | Status;

export interface IQuestion {
  title: string;
  description: string;
  qtype: QType;
}

export interface StoredQuestion<T extends PossibleTypes> extends IQuestion {
  key: string;
  options: { value: T; label: string }[];
  singleAnswer: boolean;
  dropdown: boolean;
  tooltip: string;
}

export type Answers<T extends StoredQuestion<PossibleTypes>> = {
  [key in T["key"]]: PossibleTypes[];
};

export default function Onboarding() {
  const questionData: IQuestion[] = [
    {
      title: "Hello, new foster!",
      description: `Let's start by walking through building your foster profile! This will help us connect you with the best pet for your situation to ensure a positive experience for everyone involved.\n\nAnswer the following questions with all possible animals you would be willing to foster in mind. Keep in mind that once your profile is complete, you will still be able to edit these answers in the future.`,
      qtype: QType.Intro,
    },
    {
      key: "type",
      title: "Are you able to help with all these types of fosters?",
      description: "",
      options: [
        { value: FosterType.Return, label: "Return" },
        { value: FosterType.Boarding, label: "Boarding" },
        { value: FosterType.Temporary, label: "Temporary" },
        { value: FosterType.FosterMove, label: "Foster Move" },
        { value: FosterType.OwnerSurrender, label: "Owner Surrender" },
        { value: FosterType.Shelter, label: "Shelter" },
      ],
      qtype: QType.Question,
      singleAnswer: false,
      dropdown: false,
      tooltip:
        "<b>Return Foster</b> <br> A dog that was adopted but then returned to AAU by the adopter. <br><br> <b> Boarding </b> <br> A foster parent or other dogs' owner goes on vacation or other hiatus and needs someone to take their dog for a little <br><br> <b> Temporary </b> <br> During holidays, vacations, and emergencies until permanent fosters can be found or return. <br><br> <b> Shelter </b> <br> Lorem ipsum dolor sit amet consectetur. <br><br> <b> Owner Surrender </b> <br> Lorem ipsum dolor sit amet consectetur. <br><br> <b> Foster Move </b> <br> A dog whose previous foster parents can't care for the foster dog any more.",
    } as StoredQuestion<FosterType>,
    {
      key: "size",
      title: "What sizes of dogs are you able to foster?",
      description: "",
      options: [
        { value: Size.XS, label: "Extra Small" },
        { value: Size.S, label: "Small" },
        { value: Size.M, label: "Medium" },
        { value: Size.L, label: "Large" },
        { value: Size.XL, label: "Extra Large" },
      ],
      qtype: QType.Question,
      singleAnswer: false,
      dropdown: false,
      tooltip: "",
    } as StoredQuestion<Size>,

    {
      key: "breed",
      title: "Are there any breeds that you are not comfortable fostering?",
      description: "Leave blank if none",
      options: [
        { value: Breed.AmericanEskimo, label: "American Eskimo" },
        { value: Breed.AustralianShepherd, label: "Australian Shepherd" },
        { value: Breed.Beagle, label: "Beagle" },
        { value: Breed.BichonFrise, label: "Bichon Frise" },
        { value: Breed.BorderCollie, label: "Border Collie" },
        { value: Breed.Boxer, label: "Boxer" },
        { value: Breed.BrusselsGriffon, label: "Brussels Griffon" },
        { value: Breed.Bulldog, label: "Bulldog" },
        { value: Breed.CaneCorsoMastiff, label: "Cane Corso/Mastiff" },
        { value: Breed.CattleDogHeeler, label: "Cattle Dog/Heeler" },
        { value: Breed.Chihuahua, label: "Chihuahua" },
        { value: Breed.ChowChow, label: "Chow Chow" },
        { value: Breed.Collie, label: "Collie" },
        { value: Breed.Corgi, label: "Corgi" },
        { value: Breed.Dachshund, label: "Dachshund" },
        { value: Breed.Dalmatian, label: "Dalmatian" },
        { value: Breed.DobermanPinscher, label: "Doberman Pinscher" },
        { value: Breed.GermanShepherd, label: "German Shepherd" },
        { value: Breed.GoldenRetriever, label: "Golden Retriever" },
        { value: Breed.GreatDane, label: "Great Dane" },
        { value: Breed.GreatPyrenees, label: "Great Pyrenees" },
        { value: Breed.Greyhound, label: "Greyhound" },
        { value: Breed.Hound, label: "Hound" },
        { value: Breed.Husky, label: "Husky" },
        { value: Breed.LabradorRetriever, label: "Labrador Retriever" },
        { value: Breed.Malamute, label: "Malamute" },
        { value: Breed.Maltese, label: "Maltese" },
        { value: Breed.MinPin, label: "Min Pin" },
        { value: Breed.Mix, label: "Mix" },
        { value: Breed.Newfoundland, label: "Newfoundland" },
        { value: Breed.Pekingese, label: "Pekingese" },
        { value: Breed.Pitbull, label: "Pitbull" },
        { value: Breed.Pointer, label: "Pointer" },
        { value: Breed.Pomeranian, label: "Pomeranian" },
        { value: Breed.Poodle, label: "Poodle" },
        { value: Breed.Pug, label: "Pug" },
        { value: Breed.Rottweiler, label: "Rottweiler" },
        { value: Breed.Schnauzer, label: "Schnauzer" },
        { value: Breed.Scottie, label: "Scottie" },
        { value: Breed.Setter, label: "Setter" },
        { value: Breed.Sharpei, label: "Sharpei" },
        { value: Breed.Sheepdog, label: "Sheepdog" },
        { value: Breed.Shepherd, label: "Shepherd" },
        { value: Breed.ShihTzu, label: "Shih Tzu" },
        { value: Breed.Spaniel, label: "Spaniel" },
        { value: Breed.StBernard, label: "St. Bernard" },
        { value: Breed.TerrierMedLarge, label: "Terrier (Med-Large)" },
        { value: Breed.TerrierSmall, label: "Terrier (Small)" },
        { value: Breed.Weimaraner, label: "Weimaraner" },
        { value: Breed.Whippet, label: "Whippet" },
      ],
      qtype: QType.Question,
      singleAnswer: false,
      dropdown: true,
      tooltip: "",
    } as StoredQuestion<Breed>,
    {
      key: "gender",
      title:
        "Are you okay with both male and female dogs? How about a litter of puppies?",
      description: "",
      options: [
        { value: Gender.Male, label: "Male" },
        { value: Gender.Female, label: "Female" },
        { value: Gender.Litter, label: "Litter" },
      ],
      qtype: QType.Question,
      singleAnswer: false,
      dropdown: false,
      tooltip: "",
    } as StoredQuestion<Gender>,
    {
      key: "age",
      title: "What age of dogs are you willing to foster?",
      description: "",
      options: [
        { value: Age.Puppy, label: "Puppy" },
        { value: Age.Young, label: "Young" },
        { value: Age.Adult, label: "Adult" },
        { value: Age.Senior, label: "Senior" },
        { value: Age.MomAndPuppies, label: "Mom & Puppies" },
      ],
      qtype: QType.Question,
      singleAnswer: false,
      dropdown: false,
      tooltip: "",
    } as StoredQuestion<Age>,
    {
      key: "temperament",
      title: "What temperament can you foster?",
      description: "",
      options: [
        { value: Temperament.Friendly, label: "Friendly" },
        { value: Temperament.Scared, label: "Scared" },
        { value: Temperament.Active, label: "Active" },
        { value: Temperament.Calm, label: "Calm" },
      ],
      qtype: QType.Question,
      singleAnswer: false,
      dropdown: false,
      tooltip: "",
    } as StoredQuestion<Temperament>,
    {
      key: "goodWith",
      title: "Are you able to foster dogs that are not good with:",
      description: "",
      options: [
        { value: GoodWith.Men, label: "Men" },
        { value: GoodWith.Women, label: "Women" },
        { value: GoodWith.OlderChildren, label: "Older Children" },
        { value: GoodWith.YoungChildren, label: "Young Children" },
        { value: GoodWith.LargeDogs, label: "Large Dogs" },
        { value: GoodWith.SmallDogs, label: "Small Dogs" },
        { value: GoodWith.Cats, label: "Cats" },
      ],
      qtype: QType.Question,
      singleAnswer: false,
      dropdown: false,
      tooltip: "",
    } as StoredQuestion<GoodWith>,
    {
      key: "medical",
      title: "Are you able to foster dogs that have or are:",
      description: "",
      options: [
        { value: Medical.Illness, label: "Illness" },
        { value: Medical.Injury, label: "Injury" },
        { value: Medical.Heartworms, label: "Heartworms" },
        { value: Medical.Pregnant, label: "Pregnant" },
        { value: Medical.Nursing, label: "Nursing" },
        { value: Medical.BottleFeeding, label: "Bottle Feeding" },
        { value: Medical.ChronicCondition, label: "Chronic Condition" },
        { value: Medical.Parvo, label: "Parvo" },
        { value: Medical.Hospice, label: "Hospice" },
      ],
      qtype: QType.Question,
      singleAnswer: false,
      dropdown: false,
      tooltip: "",
    } as StoredQuestion<Medical>,
    {
      key: "behavioral",
      title: "Are you able to foster dogs that have or are:",
      description: "",
      options: [
        { value: Behavioral.SeparationAnxiety, label: "Separation Anxiety" },
        { value: Behavioral.Barking, label: "Barking" },
        { value: Behavioral.Jumping, label: "Jumping" },
        { value: Behavioral.BiteRisk, label: "Bite Risk" },
        { value: Behavioral.PullsOnLeash, label: "Pulls on Leash" },
        { value: Behavioral.FlightRisk, label: "Flight Risk" },
      ],
      qtype: QType.Question,
      singleAnswer: false,
      dropdown: false,
      tooltip: "",
    } as StoredQuestion<Behavioral>,
    {
      key: "houseTrained",
      title: "Are you able to foster a dog who isn't house trained?",
      description: "",
      options: [
        { value: Trained.Yes, label: "Yes" },
        { value: Trained.No, label: "No" },
      ],
      qtype: QType.Question,
      singleAnswer: true,
      dropdown: false,
      tooltip: "",
    } as StoredQuestion<Trained>,
    {
      key: "crateTrained",
      title: "Are you able to foster a dog who isn't crate trained?",
      description: "",
      options: [
        { value: Trained.Yes, label: "Yes" },
        { value: Trained.No, label: "No" },
      ],
      qtype: QType.Question,
      singleAnswer: true,
      dropdown: false,
      tooltip: "",
    } as StoredQuestion<Trained>,
    {
      key: "spayNeuterStatus",
      title: "Are you able to foster a dog who isn't spayed/neutered?",
      description: "",
      options: [
        { value: Status.Yes, label: "Yes" },
        { value: Status.No, label: "No" },
      ],
      qtype: QType.Question,
      singleAnswer: true,
      dropdown: false,
      tooltip: "",
    } as StoredQuestion<Status>,
    {
      title: "🎉\nThanks for completing your profile!",
      description: `We're super excited that you're interested in helping our dogs in need by providing them with a kind home!\n\nLorem ipsum dolor sit amet consectetur. Purus vehicula eget pharetra vitae. Varius id libero id aliquam in.`,
      qtype: QType.Completion,
    },
  ];

  const [qNum, setQNum] = useState<number>(0);

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

  const initialAnswers: Answers<StoredQuestion<PossibleTypes>> =
    questionData.reduce((acc, curr) => {
      if (curr.qtype !== QType.Question) return acc;
      return {
        ...acc,
        [(curr as StoredQuestion<PossibleTypes>).key]: [],
      } as Answers<StoredQuestion<PossibleTypes>>;
    }, {} as Answers<StoredQuestion<PossibleTypes>>);

  const [answers, setAnswers] = useState(initialAnswers);

  let btnDisplay;
  if (questionData[qNum].qtype == QType.Question) {
    btnDisplay = (
      <Flex gap={{ base: "8px", md: "20px", lg: "25px" }}>
        <OnboardingButton
          onClickFunc={prevQ}
          btnType={ButtonType.Back}
          qNum={qNum}
          questionData={questionData}
          answers={answers}
        ></OnboardingButton>
        <OnboardingButton
          onClickFunc={nextQ}
          btnType={ButtonType.Next}
          qNum={qNum}
          questionData={questionData}
          answers={answers}
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
        answers={answers}
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
          marginBottom={{ base: "50px", md: "70px", lg: "84px" }}
          visibility={
            questionData[qNum].qtype == QType.Completion ? "hidden" : "visible"
          }
        >
          <Progress
            className="progressBar"
            width={{ base: "75%", md: "80%", lg: "85%" }}
            value={(100 * qNum) / (questionData.length - 1)}
            borderRadius="10px"
            height={{ base: "10px", md: "20px", lg: "20px" }}
            colorScheme="blackAlpha"
            backgroundColor="#D9D9D9"
            marginRight={{ base: "16px", md: "20px", lg: "25px" }}
          ></Progress>
          <Text
            className="progressBarText"
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
        className="buttonDisplay"
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

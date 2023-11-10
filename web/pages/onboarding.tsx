import { useState } from "react";
import OnboardingSlide from "../components/Onboarding/OnboardingSlide";
import {
  Flex,
  Grid,
  GridItem,
  Progress,
  Text,
  useToast,
} from "@chakra-ui/react";
import OnboardingButton from "../components/Onboarding/OnboardingButton";
import {
  FosterType,
  Size,
  Gender,
  Age,
  GoodWith,
  Medical,
  Behavioral,
  Breed,
} from "../utils/types/post";
import { useAuth } from "../context/auth";
import pageAccessHOC from "../components/HOC/PageAccess";

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
  | GoodWith
  | Medical
  | Behavioral;

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
  popover: string;
  allSelected: boolean;
  required: boolean;
}

export type Answers<T extends StoredQuestion<PossibleTypes>> = {
  [key in T["key"]]: PossibleTypes[];
};

function Onboarding() {
  const { user } = useAuth();
  const toast = useToast();

  const questionData: IQuestion[] = [
    {
      title:
        "Hello, " +
        (user?.displayName == undefined ? "new foster" : user?.displayName) +
        "!",
      description: `Let's start by walking through building your foster profile! This will allow you to choose which dogs you would like to see.  You may have specific requirements for your home or you may be open to any dog in need.\n\nPlease answer the following questions based on which dogs you could potentially foster. Keep in mind that once your profile is complete, you will still be able to edit these answers in the future.`,
      qtype: QType.Intro,
    },
    {
      key: "type",
      title: "Are you able to foster the following types of foster dogs?",
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
      popover:
        "<b>Return Foster</b> <br> A dog that was adopted from AAUPR and is being returned <br><br> <b> Boarding </b> <br> Dogs that are in a boarding facility until a foster or adopter is found <br><br> <b> Temporary </b> <br> Short term placement while the primary foster is on vacation or other emergency placement <br><br> <b> Shelter </b> <br> A dog that is coming into the rescue from a shelter or animal control facility <br><br> <b> Owner Surrender </b> <br> A dog that is being surrendered by their current owner <br><br> <b> Foster Move </b> <br> A current Angel dog that needs a new placement",
      allSelected: true,
      required: false,
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
      popover: "",
      allSelected: true,
      required: false,
    } as StoredQuestion<Size>,
    {
      key: "restrictedBreeds",
      title:
        "Are there any breeds that you are restricted from having in your home?",
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
      popover: "",
      allSelected: false,
      required: false,
    } as StoredQuestion<Breed>,
    {
      key: "preferredBreeds",
      title: "Are there breeds that you especially enjoy fostering?",
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
      popover: "",
      allSelected: false,
      required: false,
    } as StoredQuestion<Breed>,
    {
      key: "gender",
      title:
        "Are you able to foster both male and female dogs? How about a litter of puppies?",
      description: "",
      options: [
        { value: Gender.Male, label: "Male" },
        { value: Gender.Female, label: "Female" },
        { value: Gender.Litter, label: "Litter" },
      ],
      qtype: QType.Question,
      singleAnswer: false,
      dropdown: false,
      popover: "",
      allSelected: true,
      required: false,
    } as StoredQuestion<Gender>,
    {
      key: "age",
      title: "What ages of dogs are you willing to foster?",
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
      popover: "",
      allSelected: true,
      required: false,
    } as StoredQuestion<Age>,
    {
      key: "dogsNotGoodWith",
      title: "Are you able to foster dogs that DO NOT do well with:",
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
      popover: "",
      allSelected: true,
      required: false,
    } as StoredQuestion<GoodWith>,
    {
      key: "medical",
      title:
        "Which of the following medical conditions are you able to take on?",
      description: "",
      options: [
        { value: Medical.Illness, label: "Illness" },
        { value: Medical.Injury, label: "Injury" },
        { value: Medical.Heartworms, label: "Heartworms" },
        { value: Medical.Pregnant, label: "Pregnant" },
        { value: Medical.Nursing, label: "Nursing" },
        { value: Medical.BottleFed, label: "Bottle Fed" },
        { value: Medical.ChronicCondition, label: "Chronic Condition" },
        { value: Medical.Parvo, label: "Parvo" },
        { value: Medical.Hospice, label: "Hospice" },
      ],
      qtype: QType.Question,
      singleAnswer: false,
      dropdown: false,
      popover:
        "<b>Illness</b> <br> A treatable illness.  May require additional vet appointments before cleared for adoption. <br><br> <b>Injury</b> <br> May require additional vet visits, bandage changes, and/or surgery. <br><br> <b> Pregnant </b> <br> Will have babies in your home. Puppies can be adopted or split into multiple fosters at 8 weeks. <br><br> <b> Nursing </b> <br> Puppies already born but will need monitoring and to stay with mom until 8 weeks of age. <br><br> <b> Bottle Fed </b> <br> Needs round the clock bottle feedings until able to eat solid food. <br><br> <b> Heartworms </b> <br> Dogs need to be kept calm during heartworm treatment.  In some cases, AAUPR will cover treatment after adoption. <br><br> <b> Chronic Condition </b> <br> May need ongoing medication or follow ups.  May be adopted once diagnosed and an adopter is fully informed. <br><br> <b> Parvo </b><br>A virus that affects puppies.  Since parvo stays in the home for a period of time, if a foster has parvo puppies, they cannot take healthy puppies for 6 months to a year. <br><br> <b> Hospice </b> <br> A dog that is not available for adoption but will be made comfortable for as long as possible in their foster home.",
      allSelected: true,
      required: false,
    } as StoredQuestion<Medical>,
    {
      key: "behavioral",
      title: "Are you able to manage these potential behavioral issues:",
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
      popover: "",
      allSelected: true,
      required: false,
    } as StoredQuestion<Behavioral>,
    {
      title: "🎉\nThanks for completing your profile!",
      description: `We're super excited that you're interested in helping our dogs in need by providing them with a kind home!\n\nYou may change any of these preferences on the profile page.`,
      qtype: QType.Completion,
    },
  ];

  const [qNum, setQNum] = useState<number>(0);

  function validateRequiredQuestionAndAlert() {
    const currentQuestion = questionData[qNum];
    if (
      (currentQuestion as any).required &&
      answers[(currentQuestion as StoredQuestion<PossibleTypes>).key].length ===
        0
    ) {
      toast({
        title: "Error",
        description: "An answer to this question is required.",
        status: "error",
        isClosable: true,
        position: "top",
      });
      return false;
    }
    return true;
  }

  function prevQ() {
    const enforced = validateRequiredQuestionAndAlert();
    if (enforced && qNum != 0) {
      toast.closeAll();
      setQNum(qNum - 1);
    }
  }

  function nextQ() {
    const enforced = validateRequiredQuestionAndAlert();
    if (enforced && qNum != questionData.length - 1) {
      toast.closeAll();
      setQNum(qNum + 1);
    }
  }

  const initialAnswers: Answers<StoredQuestion<PossibleTypes>> =
    questionData.reduce((acc, curr) => {
      if (curr.qtype !== QType.Question) return acc;
      const storedQCurr = curr as StoredQuestion<PossibleTypes>;
      return {
        ...acc,
        [storedQCurr.key]: storedQCurr.allSelected
          ? storedQCurr.options.map((val) => val.value)
          : [],
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

  const numQuestions = questionData.reduce((acc, curr) => {
    if (curr.qtype == QType.Question) acc += 1;
    return acc;
  }, 0);
  const numIntros = questionData.reduce((acc, curr) => {
    if (curr.qtype == QType.Intro) acc += 1;
    return acc;
  }, 0);

  return (
    <Grid
      className="page"
      templateRows="repeat(3)"
      maxWidth="100%"
      minHeight="100%"
      marginX={{ base: "50px", md: "100px", lg: "200px" }}
      marginTop={{ base: "64px", md: "80px", lg: "50px" }}
    >
      <GridItem
        className="progress"
        visibility={
          questionData[qNum].qtype == QType.Completion ? "hidden" : "visible"
        }
      >
        <Flex>
          <Progress
            className="progressBar"
            width={{ base: "75%", md: "80%", lg: "85%" }}
            value={(100 * Math.max(0, qNum - numIntros + 1)) / numQuestions}
            borderRadius="10px"
            height={{ base: "10px", md: "20px", lg: "20px" }}
            marginRight={{ base: "16px", md: "20px", lg: "25px" }}
          ></Progress>
          <Text
            className="progressBarText"
            fontWeight="semibold"
            textColor="text-primary"
            fontSize={{ base: "10px", md: "16px", lg: "20px" }}
          >
            {Math.max(0, qNum - numIntros + 1) + " of " + numQuestions}
          </Text>
        </Flex>
      </GridItem>
      <GridItem>
        <OnboardingSlide
          questionData={questionData}
          answers={answers}
          setAnswers={setAnswers}
          qNum={qNum}
        />
      </GridItem>
      <GridItem className="buttonDisplay">
        <Flex justifyContent="flex-end">{btnDisplay}</Flex>
      </GridItem>
    </Grid>
  );
}

export default pageAccessHOC(Onboarding);

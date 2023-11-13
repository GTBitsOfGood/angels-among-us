import { Flex, useBreakpointValue } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import Select from "react-select";
import OnboardingOptionColumn from "./OnboardingOptionColumn";
import { Answers, PossibleTypes, StoredQuestion } from "../../pages/onboarding";
import { OptionType } from "./OnboardingSlide";

const disjointOptionMap: Record<
  string,
  "preferredBreeds" | "restrictedBreeds"
> = {
  restrictedBreeds: "preferredBreeds",
  preferredBreeds: "restrictedBreeds",
};

function OnboardingOptions(props: {
  options: OptionType[];
  singleAnswer: boolean;
  dropdown: boolean;
  answers: Answers<StoredQuestion<PossibleTypes>>;
  setAnswers: Dispatch<SetStateAction<Answers<StoredQuestion<PossibleTypes>>>>;
  qKey: string;
}) {
  const { options, singleAnswer, dropdown, answers, setAnswers, qKey } = props;

  const numCols =
    useBreakpointValue(
      {
        base: 2,
        md: 2,
        lg: 3,
      },
      {
        fallback: "base",
      }
    ) || 2;

  const dropdownWidth =
    useBreakpointValue(
      {
        base: "260px",
        md: "400px",
        lg: "500px",
      },
      {
        fallback: "base",
      }
    ) || "260px";

  const selected = options.reduce((arr: OptionType[], val) => {
    if (answers[qKey].includes(val.value)) {
      arr.push(val);
    }
    return arr;
  }, []);

  if (dropdown) {
    const opposingKey:
      | typeof disjointOptionMap[keyof typeof disjointOptionMap]
      | undefined = disjointOptionMap[qKey];

    const parsedOptions = opposingKey
      ? options.filter((o) => !answers[opposingKey].includes(o.value))
      : options;

    return (
      <Select
        className="dropdown"
        placeholder="Type here..."
        styles={{
          control: (baseStyles: any) => ({
            ...baseStyles,
            width: dropdownWidth,
            fontSize: "18px",
            border: "1px solid gray",
            boxShadow: "none",
            "&:hover": {
              border: "1px solid gray",
            },
          }),
          multiValue: (styles) => ({
            ...styles,
            border: "2px solid #57A0D5",
            borderRadius: "8px",
            backgroundColor: "#FFFFFF",
            fontSize: "20px",
          }),
          multiValueLabel: (styles) => ({
            ...styles,
            color: "#57A0D5",
          }),
          multiValueRemove: (styles) => ({
            ...styles,
            color: "#57A0D5",
            ":hover": {
              backgroundColor: "#57A0D5",
              color: "white",
            },
          }),
        }}
        options={parsedOptions}
        isMulti
        value={selected}
        closeMenuOnSelect={false}
        onChange={(event: any) => {
          let tempState = { ...answers };
          tempState[qKey] = [];
          event.forEach((o: any) => {
            tempState[qKey].push(o.value);
          });
          setAnswers(tempState);
        }}
      />
    );
  }

  const opsByCol = options.reduce((arr: OptionType[][], val, ind) => {
    if (arr.length < numCols) {
      arr.push([]);
    }
    arr[ind % numCols].push(options[ind]);
    return arr;
  }, []);

  return (
    <Flex
      className="onboardingOptions"
      flexDirection="row"
      gap={{ base: "16px", md: "60px", lg: "90px" }}
    >
      {opsByCol.map((colVal, ind) => {
        return (
          <OnboardingOptionColumn
            key={ind}
            options={colVal}
            singleAnswer={singleAnswer}
            answers={answers}
            setAnswers={setAnswers}
            qKey={qKey}
          ></OnboardingOptionColumn>
        );
      })}
    </Flex>
  );
}

export default OnboardingOptions;

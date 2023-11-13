import { Checkbox, Grid, Text, GridItem, Flex, Box } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import Select from "react-select";
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

  function updateAnswers(ind: number) {
    let tempState = { ...answers };
    if (singleAnswer && tempState[qKey].length == 1) {
      tempState[qKey] = [];
    }
    if (tempState[qKey].includes(options[ind].value)) {
      tempState[qKey].splice(tempState[qKey].indexOf(options[ind].value), 1);
    } else {
      tempState[qKey].push(options[ind].value);
    }
    setAnswers(tempState);
  }
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
      <Flex w="100%" justifyContent="center">
        <Box w={{ base: "100%", md: "400px", lg: "500px" }}>
          <Select
            className="dropdown"
            placeholder="Type here..."
            styles={{
              control: (baseStyles: any) => ({
                ...baseStyles,
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
        </Box>
      </Flex>
    );
  }

  return (
    <Grid
      w="100%"
      templateColumns={{ base: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
      overflow="auto"
      gap={5}
    >
      {options.map((option, i) => (
        <GridItem key={option.value}>
          <Checkbox
            className="optionCheckbox"
            borderColor="border-color"
            borderWidth={2}
            h="100%"
            paddingX={{ base: 3, md: 8 }}
            paddingY={{ base: 6, md: 8 }}
            borderRadius={{ base: 5, md: 8 }}
            display="flex"
            iconColor="white"
            colorScheme="brand"
            textAlign="left"
            lineHeight="20px"
            isChecked={answers[qKey].includes(options[i].value)}
            onChange={() => {
              updateAnswers(i);
            }}
          >
            <Text
              className="optionText"
              lineHeight={{ base: "xl", md: "2xl" }}
              fontSize={{ base: "xl", md: "2xl" }}
              color="black"
            >
              {option.label}
            </Text>
          </Checkbox>
        </GridItem>
      ))}
    </Grid>
  );
}

export default OnboardingOptions;

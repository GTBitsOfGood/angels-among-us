import { Text, Checkbox, Stack, Box } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { Answers, PossibleTypes, StoredQuestion } from "../pages/onboarding";
import { OptionType } from "./OnboardingSlide";

function OnboardingOptionColumn(props: {
  options: OptionType[];
  singleAnswer: boolean;
  answers: Answers<StoredQuestion<PossibleTypes>>;
  setAnswers: Dispatch<SetStateAction<Answers<StoredQuestion<PossibleTypes>>>>;
  qKey: string;
}) {
  const { options, singleAnswer, answers, setAnswers, qKey } = props;

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

  return (
    <Stack
      className="onboardingOptionColumn"
      gap={{ base: "16px", md: "30px", lg: "40px" }}
    >
      {options.map((o, ind) => {
        return (
          <Box
            className="optionBox"
            key={o.value}
            width={{ base: "125px", md: "175px", lg: "175px" }}
            height={{ base: "60px", md: "70px", lg: "70px" }}
            display="flex"
            borderWidth={{ base: "2px", md: "2.5px", lg: "2.5px" }}
            borderColor={
              singleAnswer &&
              !answers[qKey].includes(options[ind].value) &&
              answers[qKey].length > 0
                ? "#BBBBBB"
                : "#000000"
            }
            textAlign="left"
            borderRadius={{ base: "5px", md: "8px", lg: "8px" }}
            backgroundColor="#EDEDED"
            paddingY={{ base: "10px", md: "15px", lg: "15px" }}
            paddingX={{ base: "10px", md: "15px", lg: "15px" }}
            cursor="pointer"
            onClick={() => {
              updateAnswers(ind);
            }}
          >
            <Checkbox
              className="optionCheckbox"
              colorScheme="none"
              iconColor="#000000"
              textAlign="left"
              lineHeight="20px"
              key={o.value}
              borderColor={
                singleAnswer &&
                !answers[qKey].includes(options[ind].value) &&
                answers[qKey].length > 0
                  ? "#BBBBBB"
                  : "#000000"
              }
              isChecked={answers[qKey].includes(options[ind].value)}
              onChange={() => {
                updateAnswers(ind);
              }}
            >
              <Text
                className="optionText"
                fontSize={{ base: "15px", md: "20px", lg: "20px" }}
                fontWeight={{ base: "normal", md: "normal", lg: "semibold" }}
                color={
                  singleAnswer &&
                  !answers[qKey].includes(options[ind].value) &&
                  answers[qKey].length > 0
                    ? "#BBBBBB"
                    : "#000000"
                }
              >
                {o.label}
              </Text>
            </Checkbox>
          </Box>
        );
      })}
    </Stack>
  );
}

export default OnboardingOptionColumn;

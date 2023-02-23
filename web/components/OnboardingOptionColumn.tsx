import { Text, Checkbox, Stack, Box } from "@chakra-ui/react";

function OnboardingOptionColumn(props: {
  options: string[];
  singleAnswer: boolean;
  answers: boolean[][];
  setAnswers: (arg: boolean[][]) => void;
  qNum: number;
  isLeft: boolean;
}) {
  const { options, singleAnswer, answers, setAnswers, qNum, isLeft } = props;

  return (
    <Stack className="onboardingOptionColumn" gap="16px">
      {options.map((o, ind) => {
        return (
          <Box
            className="optionBox"
            key={o}
            width="125px"
            borderWidth="2px"
            borderColor={
              singleAnswer &&
              !answers[qNum][ind * 2 + (isLeft ? 0 : 1)] &&
              answers[qNum][ind * 2 + (isLeft ? 1 : 0)]
                ? "#BBBBBB"
                : "#000000"
            }
            textAlign="left"
            borderRadius="5px"
            backgroundColor="#EDEDED"
            paddingY="10px"
            paddingX="10px"
          >
            <Checkbox
              className="optionCheckbox"
              colorScheme="none"
              iconColor="#000000"
              textAlign="left"
              lineHeight="20px"
              key={o}
              borderColor={
                singleAnswer &&
                !answers[qNum][ind * 2 + (isLeft ? 0 : 1)] &&
                answers[qNum][ind * 2 + (isLeft ? 1 : 0)]
                  ? "#BBBBBB"
                  : "#000000"
              }
              isChecked={answers[qNum][ind * 2 + (isLeft ? 0 : 1)]}
              onChange={() => {
                let tempState = [...answers];
                let prevCBState = tempState[qNum][ind * 2 + (isLeft ? 0 : 1)];
                tempState[qNum][ind * 2 + (isLeft ? 0 : 1)] = !prevCBState;
                if (singleAnswer && prevCBState == false) {
                  tempState[qNum][ind * 2 + (isLeft ? 1 : 0)] = false;
                }
                setAnswers(tempState);
              }}
            >
              <Text
                className="optionText"
                fontSize="14px"
                color={
                  singleAnswer &&
                  !answers[qNum][ind * 2 + (isLeft ? 0 : 1)] &&
                  answers[qNum][ind * 2 + (isLeft ? 1 : 0)]
                    ? "#BBBBBB"
                    : "#000000"
                }
              >
                {o}
              </Text>
            </Checkbox>
          </Box>
        );
      })}
    </Stack>
  );
}

export default OnboardingOptionColumn;

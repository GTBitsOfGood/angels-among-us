import { Text, Checkbox, Stack, Box } from "@chakra-ui/react";

function OnboardingOptionColumn(props: {
  options: string[];
  singleAnswer: boolean;
  answers: boolean[][];
  setAnswers: (arg: boolean[][]) => void;
  qNum: number;
  colNum: number;
  numCols: number;
}) {
  const { options, singleAnswer, answers, setAnswers, qNum, colNum, numCols } =
    props;

  console.log(answers[qNum]);

  return (
    <Stack
      className="onboardingOptionColumn"
      gap={{ base: "16px", md: "30px", lg: "40px" }}
    >
      {options.map((o, ind) => {
        return (
          <Box
            className="optionBox"
            key={o}
            width={{ base: "125px", md: "175px", lg: "175px" }}
            height={{ base: "60px", md: "70px", lg: "70px" }}
            display="flex"
            borderWidth={{ base: "2px", md: "2.5px", lg: "2.5px" }}
            borderColor={
              singleAnswer &&
              !answers[qNum][ind * numCols + colNum] &&
              answers[qNum].includes(true)
                ? "#BBBBBB"
                : "#000000"
            }
            textAlign="left"
            borderRadius={{ base: "5px", md: "8px", lg: "8px" }}
            backgroundColor="#EDEDED"
            paddingY={{ base: "10px", md: "15px", lg: "15px" }}
            paddingX={{ base: "10px", md: "15px", lg: "15px" }}
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
                !answers[qNum][ind * numCols + colNum] &&
                answers[qNum].includes(true)
                  ? "#BBBBBB"
                  : "#000000"
              }
              isChecked={answers[qNum][ind * numCols + colNum]}
              onChange={() => {
                let tempState = [...answers];
                const prevState = tempState[qNum][ind * numCols + colNum];
                if (singleAnswer && prevState == false) {
                  tempState[qNum] = Array(tempState[qNum].length).fill(false);
                }
                tempState[qNum][ind * numCols + colNum] = !prevState;
                setAnswers(tempState);
              }}
            >
              <Text
                className="optionText"
                fontSize={{ base: "15px", md: "20px", lg: "20px" }}
                fontWeight={{ base: "normal", md: "normal", lg: "semibold" }}
                color={
                  singleAnswer &&
                  !answers[qNum][ind * numCols + colNum] &&
                  answers[qNum].includes(true)
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

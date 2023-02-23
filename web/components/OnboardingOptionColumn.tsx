import { Text, Checkbox, Stack, Box, Flex } from "@chakra-ui/react";

function OnboardingOptionColumn(props: {
  options: string[];
  singleAnswer: boolean;
  checked: boolean[][];
  setChecked: (arg: boolean[][]) => void;
  qNum: number;
  isLeft: boolean;
}) {
  const { options, singleAnswer, checked, setChecked, qNum, isLeft } = props;

  return (
    <Stack marginRight="10px">
      {options.map((o, ind) => {
        return (
          <Box
            key={o}
            width="125px"
            borderWidth="2px"
            borderColor={
              singleAnswer &&
              !checked[qNum][ind * 2 + (isLeft ? 0 : 1)] &&
              checked[qNum][ind * 2 + (isLeft ? 1 : 0)]
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
              colorScheme="none"
              iconColor="#000000"
              textAlign="left"
              lineHeight="20px"
              key={o}
              borderColor={
                singleAnswer &&
                !checked[qNum][ind * 2 + (isLeft ? 0 : 1)] &&
                checked[qNum][ind * 2 + (isLeft ? 1 : 0)]
                  ? "#BBBBBB"
                  : "#000000"
              }
              isChecked={checked[qNum][ind * 2 + (isLeft ? 0 : 1)]}
              onChange={() => {
                let tempState = [...checked];
                let prevCBState = tempState[qNum][ind * 2 + (isLeft ? 0 : 1)];
                tempState[qNum][ind * 2 + (isLeft ? 0 : 1)] = !prevCBState;
                if (singleAnswer && prevCBState == false) {
                  tempState[qNum][ind * 2 + (isLeft ? 1 : 0)] = false;
                }
                setChecked(tempState);
                console.log(checked);
              }}
            >
              <Text
                fontSize="14px"
                color={
                  singleAnswer &&
                  !checked[qNum][ind * 2 + (isLeft ? 0 : 1)] &&
                  checked[qNum][ind * 2 + (isLeft ? 1 : 0)]
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

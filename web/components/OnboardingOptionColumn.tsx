import { Text, Checkbox, Stack, Box, Flex } from "@chakra-ui/react";

function OnboardingOptionColumn(props: {
  options: string[];
  checked: boolean[][];
  setChecked: (arg: boolean[][]) => void;
  qNum: number;
  isLeft: boolean;
}) {
  const { options, checked, setChecked, qNum, isLeft } = props;

  return (
    <Stack marginRight="10px">
      {options.map((o, ind) => {
        return (
          <Box
            key={o}
            width="125px"
            borderWidth="2px"
            borderColor="#000000"
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
              borderColor="#000000"
              outlineColor="#000000"
              isChecked={checked[qNum][ind * 2 + (isLeft ? 0 : 1)]}
              onChange={() => {
                let tempState = [...checked];
                tempState[qNum][ind * 2 + (isLeft ? 0 : 1)] =
                  !tempState[qNum][ind * 2 + (isLeft ? 0 : 1)];
                setChecked(tempState);
                console.log(checked);
              }}
            >
              <Text fontSize="14px">{o}</Text>
            </Checkbox>
          </Box>
        );
      })}
    </Stack>
  );
}

export default OnboardingOptionColumn;

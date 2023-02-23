import { Flex } from "@chakra-ui/react";
import OnboardingOptionColumn from "./OnboardingOptionColumn";

function OnboardingOptions(props: {
  options: string[];
  checked: boolean[][];
  setChecked: (arg: boolean[][]) => void;
  qNum: number;
}) {
  const { options, checked, setChecked, qNum } = props;

  let optionsLeft = [];
  let optionsRight = [];

  for (let i = 0; i < options.length; i++) {
    if (i % 2 == 0) optionsLeft.push(options[i]);
    else optionsRight.push(options[i]);
  }

  return (
    <Flex flexDirection="row">
      <OnboardingOptionColumn
        options={optionsLeft}
        checked={checked}
        setChecked={setChecked}
        qNum={qNum}
        isLeft={true}
      ></OnboardingOptionColumn>
      <OnboardingOptionColumn
        options={optionsRight}
        checked={checked}
        setChecked={setChecked}
        qNum={qNum}
        isLeft={false}
      ></OnboardingOptionColumn>
    </Flex>
  );
}

export default OnboardingOptions;

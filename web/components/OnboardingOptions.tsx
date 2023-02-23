import { Flex, Select } from "@chakra-ui/react";
import OnboardingOptionColumn from "./OnboardingOptionColumn";

function OnboardingOptions(props: {
  options: string[];
  singleAnswer: boolean;
  dropdown: boolean;
  checked: boolean[][];
  setChecked: (arg: boolean[][]) => void;
  qNum: number;
}) {
  const { options, singleAnswer, dropdown, checked, setChecked, qNum } = props;

  if (dropdown) {
    return (
      <Select placeholder="None" focusBorderColor="#000000">
        {options.map((o, ind) => {
          return <option value={ind}>{o}</option>;
        })}
      </Select>
    );
  }

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
        singleAnswer={singleAnswer}
        checked={checked}
        setChecked={setChecked}
        qNum={qNum}
        isLeft={true}
      ></OnboardingOptionColumn>
      <OnboardingOptionColumn
        options={optionsRight}
        singleAnswer={singleAnswer}
        checked={checked}
        setChecked={setChecked}
        qNum={qNum}
        isLeft={false}
      ></OnboardingOptionColumn>
    </Flex>
  );
}

export default OnboardingOptions;

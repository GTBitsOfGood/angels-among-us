import { Flex, Select } from "@chakra-ui/react";
import OnboardingOptionColumn from "./OnboardingOptionColumn";

function OnboardingOptions(props: {
  options: string[];
  singleAnswer: boolean;
  dropdown: boolean;
  answers: boolean[][];
  setAnswers: (arg: boolean[][]) => void;
  qNum: number;
}) {
  const { options, singleAnswer, dropdown, answers, setAnswers, qNum } = props;

  if (dropdown) {
    return (
      <Select
        className="onboardingDropdown"
        value={options[answers[qNum].indexOf(true)]}
        focusBorderColor="#000000"
        onChange={(event) => {
          let tempState = [...answers];
          tempState[qNum] = Array(options.length).fill(false);
          tempState[qNum][options.indexOf(event.target.value)] = true;
          setAnswers(tempState);
        }}
      >
        {options.map((o, ind) => {
          return <option key={ind}>{o}</option>;
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
    <Flex className="onboardingOptions" flexDirection="row" gap="16px">
      <OnboardingOptionColumn
        options={optionsLeft}
        singleAnswer={singleAnswer}
        answers={answers}
        setAnswers={setAnswers}
        qNum={qNum}
        isLeft={true}
      ></OnboardingOptionColumn>
      <OnboardingOptionColumn
        options={optionsRight}
        singleAnswer={singleAnswer}
        answers={answers}
        setAnswers={setAnswers}
        qNum={qNum}
        isLeft={false}
      ></OnboardingOptionColumn>
    </Flex>
  );
}

export default OnboardingOptions;

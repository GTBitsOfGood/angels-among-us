import { Flex } from "@chakra-ui/react";
import Select from "react-select";
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

  const dropdownOps = options.map((o) => {
    return { value: o, label: o };
  });

  const selected = answers[qNum].reduce(
    (arr: { value: string; label: string }[], val, ind) => {
      if (val) {
        arr.push(dropdownOps[ind]);
      }
      return arr;
    },
    []
  );

  if (dropdown) {
    return (
      <Select
        className="dropdown"
        placeholder="None"
        styles={{
          control: (baseStyles: any) => ({
            ...baseStyles,
            width: "260px",
            fontSize: "16px",
            border: "1px solid gray",
            boxShadow: "none",
            "&:hover": {
              border: "1px solid gray",
            },
          }),
        }}
        options={dropdownOps}
        isMulti
        value={selected}
        onChange={(event: any) => {
          let tempState = [...answers];
          tempState[qNum] = Array(options.length).fill(false);
          event.forEach((o: any) => {
            tempState[qNum][options.indexOf(o.value)] = true;
          });
          setAnswers(tempState);
        }}
      />
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

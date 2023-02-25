import { Flex, useBreakpointValue } from "@chakra-ui/react";
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

  const numCols =
    useBreakpointValue(
      {
        base: 2,
        md: 2,
        lg: 3,
      },
      {
        fallback: "base",
      }
    ) || 2;

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
        placeholder="Type here..."
        styles={{
          control: (baseStyles: any) => ({
            ...baseStyles,
            width: "260px",
            fontSize: "18px",
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

  let opsByCol: string[][] = [];
  let numColsArr: number[] = [];
  for (let i = 0; i < numCols; i++) {
    opsByCol.push([]);
    numColsArr.push(i);
  }
  for (let i = 0; i < options.length; i++) {
    opsByCol[i % numCols].push(options[i]);
  }

  return (
    <Flex
      className="onboardingOptions"
      flexDirection="row"
      gap={{ base: "16px", md: "60px", lg: "90px" }}
    >
      {numColsArr.map((val, ind) => {
        return (
          <OnboardingOptionColumn
            key={ind}
            options={opsByCol[ind]}
            singleAnswer={singleAnswer}
            answers={answers}
            setAnswers={setAnswers}
            qNum={qNum}
            colNum={ind}
            numCols={numCols}
          ></OnboardingOptionColumn>
        );
      })}
    </Flex>
  );
}

export default OnboardingOptions;

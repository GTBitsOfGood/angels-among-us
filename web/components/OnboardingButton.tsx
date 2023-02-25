import { Button } from "@chakra-ui/react";

enum QType {
  Intro,
  Question,
  Completion,
}

enum ButtonType {
  Back,
  Next,
  Singular,
}

function OnboardingButton(props: {
  onClickFunc: (arg: void) => void;
  btnType: ButtonType;
  qNum: number;
  questionData: {
    title: string;
    description: string;
    options: string[];
    qtype: QType;
  }[];
  answers: boolean[][];
}) {
  const { onClickFunc, btnType, qNum, questionData, answers } = props;

  let print = false;
  function printAnswers() {
    let ans = [];
    for (let i = 0; i < answers.length; i++) {
      if (questionData[i].qtype != QType.Question) {
        continue;
      }
      const selected = answers[i].reduce((arr: string[], val, ind) => {
        if (val) {
          arr.push(questionData[i].options[ind]);
        }
        return arr;
      }, []);
      ans.push(selected);
    }
    console.log(ans);
  }

  let text;
  if (btnType == ButtonType.Back) {
    text = " <Back";
  } else if (btnType == ButtonType.Next) {
    text = "Next >";
  } else if (btnType == ButtonType.Singular) {
    text = "Get Started >";
  }

  if (
    qNum != questionData.length - 1 &&
    btnType == ButtonType.Next &&
    questionData[qNum + 1].qtype == QType.Completion
  ) {
    text = "Finish >";
    print = true;
  }

  let buttonAppearance = {
    borderColor: "#000000",
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    cursor: "pointer",
  };

  if (btnType != ButtonType.Back) {
    buttonAppearance = {
      borderColor: "#000000",
      backgroundColor: "#000000",
      textColor: "#FFFFFF",
      cursor: "pointer",
    };
  }

  let hoverProperty = { backgroundColor: buttonAppearance.backgroundColor };

  let paddingX = { base: "50px", md: "18px", lg: "18px" };
  if (btnType == ButtonType.Singular) {
    paddingX = { base: "100px", md: "36px", lg: "36px" };
  }

  return (
    <Button
      className="onboardingButton"
      onClick={() => {
        onClickFunc();
        if (print) printAnswers();
      }}
      borderWidth="1px"
      borderColor={buttonAppearance.borderColor}
      backgroundColor={buttonAppearance.backgroundColor}
      textColor={buttonAppearance.textColor}
      fontSize={{ base: "16px", md: "20px", lg: "24px" }}
      fontWeight="semibold"
      borderRadius="10px"
      paddingX={paddingX}
      paddingY={{ base: "22px", md: "25px", lg: "25px" }}
      _hover={hoverProperty}
    >
      {text}
    </Button>
  );
}

export default OnboardingButton;

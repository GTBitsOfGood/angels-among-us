import { Button } from "@chakra-ui/react";

enum QType {
  Intro,
  Question,
  Completion,
}

function OnboardingBackNextBtn(props: {
  onClickFunc: (arg: void) => void;
  isBack: boolean;
  qNum: number;
  questionData: {
    title: string;
    description: string;
    options: string[];
    qtype: QType;
  }[];
}) {
  const { onClickFunc, isBack, qNum, questionData } = props;
  let text = isBack ? "< Back" : "Next >";
  if (
    qNum != questionData.length - 1 &&
    !isBack &&
    questionData[qNum + 1].qtype == QType.Completion
  ) {
    text = "Finish >";
  }

  let buttonAppearance = {
    borderColor: "#000000",
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    cursor: "pointer",
  };

  if (!isBack) {
    buttonAppearance = {
      borderColor: "#000000",
      backgroundColor: "#000000",
      textColor: "#FFFFFF",
      cursor: "pointer",
    };
  }

  if (qNum == 0 && isBack) {
    buttonAppearance = {
      borderColor: "#8D8D8D",
      backgroundColor: "#FFFFFF",
      textColor: "#8D8D8D",
      cursor: "default",
    };
  }

  let hoverProperty = { backgroundColor: buttonAppearance.backgroundColor };

  return (
    <Button
      cursor={buttonAppearance.cursor}
      className="leftButton"
      onClick={() => onClickFunc()}
      borderWidth="1px"
      borderColor={buttonAppearance.borderColor}
      backgroundColor={buttonAppearance.backgroundColor}
      textColor={buttonAppearance.textColor}
      fontSize={{ base: "16px", md: "20px", lg: "24px" }}
      fontWeight="semibold"
      borderRadius="10px"
      paddingX={{ base: "50px", md: "18px", lg: "18px" }}
      paddingY={{ base: "22px", md: "25px", lg: "25px" }}
      _hover={hoverProperty}
    >
      {text}
    </Button>
  );
}

export default OnboardingBackNextBtn;

import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { JSXElementConstructor, ReactElement } from "react";
import { useAuth } from "../../context/auth";
import {
  QType,
  ButtonType,
  IQuestion,
  Answers,
  StoredQuestion,
  PossibleTypes,
} from "../../pages/onboarding";
import { Pages } from "../../utils/consts";
import { trpc } from "../../utils/trpc";

function OnboardingButton(props: {
  onClickFunc: (arg: void) => void;
  btnType: ButtonType;
  qNum: number;
  questionData: IQuestion[];
  answers: Answers<StoredQuestion<PossibleTypes>>;
}) {
  const { onClickFunc, btnType, qNum, questionData, answers } = props;

  const { refetchUserData } = useAuth();
  const router = useRouter();

  let print = false;
  function printAnswers() {
    console.log(answers);
  }

  let text;
  let icon: ReactElement<any, string | JSXElementConstructor<any>> | undefined;
  if (btnType === ButtonType.Back) {
    text = "Back";
    icon = <ArrowBackIcon />;
  } else if (btnType === ButtonType.Next) {
    text = "Next";
    icon = <ArrowForwardIcon />;
  } else if (btnType === ButtonType.Singular) {
    text = "Get Started";
  }

  if (
    qNum != questionData.length - 1 &&
    btnType === ButtonType.Next &&
    questionData[qNum + 1].qtype === QType.Completion
  ) {
    text = "Finish";
    print = true;
  }

  const mutation = trpc.user.updateUserPreferences.useMutation();
  const { user } = useAuth();

  const buttonVariantMap = {
    [ButtonType.Back]: "outline-secondary",
    [ButtonType.Next]: "solid-primary",
    [ButtonType.Singular]: "solid-primary",
  } as const;

  function processSingleAnswerQuestions(
    answers: Answers<StoredQuestion<PossibleTypes>>
  ) {
    const clonedAnswers = { ...answers };
    const singleAnswerQuestions = questionData.filter(
      (question: any) => question.singleAnswer
    );
    singleAnswerQuestions.forEach((question: any) => {
      clonedAnswers[question.key] = answers[question.key][0] as any;
    });
    return clonedAnswers;
  }

  return (
    <Button
      variant={buttonVariantMap[btnType]}
      size="lg"
      className="onboardingButton"
      onClick={() => {
        onClickFunc();
        if (print) printAnswers();
        if (qNum == questionData.length - 1) {
          mutation.mutate(
            {
              uid: user!.uid,
              updateFields: processSingleAnswerQuestions(answers),
            },
            {
              onSuccess: async () => {
                await refetchUserData!();
                router.push(Pages.FEED);
              },
            }
          );
        }
      }}
      leftIcon={btnType === ButtonType.Back ? icon : undefined}
      rightIcon={btnType === ButtonType.Next ? icon : undefined}
    >
      {text}
    </Button>
  );
}

export default OnboardingButton;

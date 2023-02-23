import { Flex, Text } from "@chakra-ui/react";
import OnboardingOptions from "./OnboardingOptions";

function OnboardingQuestion(props: {
  title: string;
  description: string;
  options: string[];
  checked: boolean[][];
  setChecked: (arg: boolean[][]) => void;
  qNum: number;
}) {
  const { title, description, options, checked, setChecked, qNum } = props;

  return (
    <Flex
      className="onboardingQuestion"
      direction="column"
      align="center"
      textAlign="center"
    >
      <>
        <Flex className="questionText" flexDir="column">
          <Text
            marginX={{ base: "24px", md: "60px", lg: "100px" }}
            fontSize={{ base: "24px", md: "40px", lg: "44px" }}
            marginBottom={{ base: "12px", md: "20px", lg: "24px" }}
            lineHeight={{ base: "30px", md: "50px", lg: "52px" }}
            as="b"
          >
            {title}
          </Text>
          <Text
            fontSize={{ base: "16px", md: "24px", lg: "28px" }}
            lineHeight={{ lg: "32px" }}
            color="#696969"
          >
            {description}
          </Text>
        </Flex>
        <OnboardingOptions
          options={options}
          checked={checked}
          setChecked={setChecked}
          qNum={qNum}
        ></OnboardingOptions>
      </>
    </Flex>
  );
}

export default OnboardingQuestion;

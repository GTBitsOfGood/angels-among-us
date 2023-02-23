import { Flex, Text } from "@chakra-ui/react";

function OnboardingIntro(props: {
  questionData: { title: string; description: string; options: string[] }[];
  qNum: number;
}) {
  const { questionData, qNum } = props;

  return (
    <Flex className="onboardingIntro" direction="column">
      <>
        <Flex className="questionText" flexDir="column">
          <Text
            marginX={{ base: "24px", md: "60px", lg: "100px" }}
            fontSize={{ base: "24px", md: "40px", lg: "44px" }}
            marginBottom={{ base: "30px", md: "20px", lg: "24px" }}
            lineHeight={{ base: "30px", md: "50px", lg: "52px" }}
            as="b"
          >
            {questionData[qNum].title}
          </Text>
          <Text
            fontSize={{ base: "16px", md: "24px", lg: "28px" }}
            lineHeight={{ lg: "32px" }}
            color="#696969"
            textAlign="left"
          >
            {questionData[qNum].description}
          </Text>
        </Flex>
      </>
    </Flex>
  );
}

export default OnboardingIntro;

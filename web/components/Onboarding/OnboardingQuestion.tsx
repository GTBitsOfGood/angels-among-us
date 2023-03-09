import { Flex, Text, useRadioGroup, HStack, ScaleFade } from "@chakra-ui/react";
import OnboardingOptionCard from "./OnboardingOptionCard";

function OnboardingQuestion(props: {
  title: string;
  description: string;
  options: string[];
}) {
  const { title, description, options } = props;

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "onboardingQOptions",
  });

  const group = getRootProps();

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
        <HStack {...group} flexWrap="wrap" justifyContent="space-between">
          {options.map((value) => {
            const radio = getRadioProps({ value });
            return (
              <OnboardingOptionCard key={value} {...radio}>
                {value}
              </OnboardingOptionCard>
            );
          })}
        </HStack>
      </>
    </Flex>
  );
}

export default OnboardingQuestion;

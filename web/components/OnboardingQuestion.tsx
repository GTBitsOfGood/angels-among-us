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
    onChange: console.log,
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
            marginX={{ base: "36px", md: "60px", lg: "100px" }}
            fontSize={{ base: "24px", md: "40px", lg: "48px" }}
            marginBottom={{ base: "12px", md: "20px", lg: "10px" }}
            lineHeight={{ base: "30px", md: "50px", lg: "60px" }}
            as="b"
          >
            {title}
          </Text>
          <Text
            fontSize={{ base: "16px", md: "24px", lg: "32px" }}
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

/*<Flex className="options">
          {options.map((option) => {
            return (
              <Text
                fontSize="3xl"
                fontWeight="semibold"
                backgroundColor="#EDEDED"
                margin="20px"
                padding="50px"
              >
                {option}
              </Text>
            );
          })}
        </Flex>*/

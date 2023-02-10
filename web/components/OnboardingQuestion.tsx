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
      marginX="200px"
    >
      <>
        <Text fontSize="5xl" as="b">
          {title}
        </Text>
        <Text fontSize="4xl" color="#696969" marginBottom="75px">
          {description}
        </Text>
        <HStack {...group} flexWrap="wrap" justifyContent="center">
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

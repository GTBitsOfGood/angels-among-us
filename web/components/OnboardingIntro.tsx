import { Flex, Text, useRadioGroup, HStack } from "@chakra-ui/react";

function OnboardingIntro() {
  return (
    <Flex
      className="onboardingIntro"
      direction="column"
      align="center"
      textAlign="center"
    >
      <>
        <Flex className="questionText" flexDir="column">
          <Text
            marginX={{ base: "24px", md: "60px", lg: "100px" }}
            fontSize={{ base: "24px", md: "40px", lg: "44px" }}
            marginBottom={{ base: "30px", md: "20px", lg: "24px" }}
            lineHeight={{ base: "30px", md: "50px", lg: "52px" }}
            as="b"
          >
            Hello, new foster!
          </Text>
          <Text
            fontSize={{ base: "16px", md: "24px", lg: "28px" }}
            lineHeight={{ lg: "32px" }}
            color="#696969"
            textAlign="left"
          >
            Let&apos;s start by walking through building your foster profile!
            This will help us connect you with the best pet for your situation
            to ensure a positive experience for everyone involved.
            <br></br> <br></br>
            Answer the following questions with all possible animals you would
            be willing to foster in mind. Keep in mind that once your profile is
            complete, you will still be able to edit these answers in the
            future.
          </Text>
        </Flex>
      </>
    </Flex>
  );
}

export default OnboardingIntro;

import { useRadio, Box } from "@chakra-ui/react";

function OnboardingOptionCard(props: any) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  console.log({ ...input });
  const checkbox = getCheckboxProps();
  console.log({ ...checkbox });

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderRadius="10px"
        backgroundColor="#EDEDED"
        width={{ base: "120px", md: "150px", lg: "200px" }}
        lineHeight={{ base: "120px", md: "150px", lg: "200px" }}
        textAlign="center"
        fontSize={{ base: "14px", md: "20px", lg: "26px" }}
        fontWeight="semibold"
        marginX={{ base: "10px", md: "60px", lg: "60px" }}
        marginTop={{ base: "36px", md: "60px", lg: "50px" }}
        borderWidth={{ base: "2px", md: "3px", lg: "3px" }}
        borderColor="#EDEDED"
        _checked={{
          borderColor: "#000000",
        }}
        _focus={{}}
      >
        {props.children}
      </Box>
    </Box>
  );
}

export default OnboardingOptionCard;
